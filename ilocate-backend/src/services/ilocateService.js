import { eq, desc, sql, and, isNotNull } from 'drizzle-orm'
import { db } from '../db/index.js'
import {
  assets, assetTypes, departments, zones, alerts,
  roiHistory, metrics, workflowMetrics, laborCalcParams, pilotPhases,
  equipmentSearchAudit, assetStatusCurrent,
  siteConfigurationFacilityLayout, assetTagSignalEvents,
  assetManualStatusHistory, assetSearchHistory,
} from '../db/schema.js'

// ── Range → window in hours ───────────────────────────────────
const RANGE_HOURS = { daily: 24, weekly: 168, monthly: 720, quarterly: 2160 }

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const WORKFLOW_COLORS = ['#00d9a6', '#0ab8ff', '#a78bfa', '#00d9a6', '#f7c94b', '#0ab8ff']

function deriveAssetStatus(utilization) {
  if (utilization >= 85) return 'high'
  if (utilization >= 65) return 'normal'
  if (utilization >= 40) return 'low'
  return 'idle'
}

// Build ROI chart appropriate to the selected time range.
// Monthly data is the source of truth — daily/weekly are scaled estimates.
function buildRoiHistory(rawRows, range) {
  if (!rawRows.length) return []
  const monthly = rawRows.map(r => ({
    month:     r.month,
    savings:   parseFloat(r.savings),
    purchases: parseFloat(r.purchases),
  }))

  if (range === 'monthly' || range === 'quarterly') return monthly

  const latest = monthly[monthly.length - 1]

  if (range === 'daily') {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today  = new Date().getDay()
    return Array.from({ length: 7 }, (_, i) => {
      const day    = (today - 6 + i + 7) % 7
      const factor = 0.82 + (i % 4) * 0.06   // slight deterministic variance
      return {
        month:     labels[day],
        savings:   Math.round(latest.savings   / 30 * factor),
        purchases: Math.round(latest.purchases / 30 * factor),
      }
    })
  }

  // weekly
  return Array.from({ length: 6 }, (_, i) => {
    const weeksAgo = 5 - i
    const factor   = 0.80 + i * 0.04
    return {
      month:     weeksAgo === 0 ? 'This Wk' : `${weeksAgo}w ago`,
      savings:   Math.round(latest.savings   / 4.3 * factor),
      purchases: Math.round(latest.purchases / 4.3 * factor),
    }
  })
}

export async function getDashboardData(range = 'monthly') {
  const hours = RANGE_HOURS[range.toLowerCase()] ?? 720

  const [
    [assetCounts],
    metricsRows,
    departmentRows,
    assetTypeRows,
    alertRows,
    zoneRows,
    roiRows,
    [overPurchasedRow],
    workflowRows,
    laborRows,
    phaseRows,
    searchTypeRows,
    searchSourceRows,
    [searchStatsRow],
    statusBreakdownRows,
    [statusSummaryRow],
    statusDetailRows,
    [signalStatsRow],
    [facilityStatsRow],
    [manualStatsRow],
    manualStatusDistRows,
    manualTransitionRows,
    manualTopStaffRows,
    manualDailyRows,
    manualRecentRows,
    [searchHistStatsRow],
    searchHistTopRows,
    searchHistSourceRows,
    searchHistDailyRows,
    searchHistRecentRows,
  ] = await Promise.all([

    // ── Asset counts — active window uses the selected range ──
    db.select({
      total:          sql`count(*)::int`,
      active:         sql`count(*) filter (where ${assets.lastSeen} >= now() - make_interval(hours => ${hours}))::int`,
      inactive:       sql`count(*) filter (where ${assets.lastSeen} < now() - make_interval(hours => ${hours}))::int`,
      lost:           sql`count(*) filter (where ${assets.lastSeen} < now() - interval '72 hours' and ${assets.status} not in ('high','normal'))::int`,
      highUtil:       sql`count(*) filter (where ${assets.status} = 'high' and ${assets.lastSeen} >= now() - make_interval(hours => ${hours}))::int`,
      lowIdle:        sql`count(*) filter (where ${assets.status} in ('low','idle') and ${assets.lastSeen} >= now() - make_interval(hours => ${hours}))::int`,
      redistributable:sql`count(*) filter (where ${assets.status} in ('low','idle'))::int`,
    }).from(assets),

    // ── All metrics ───────────────────────────────────────────
    db.select({ metricKey: metrics.metricKey, metricValue: metrics.metricValue }).from(metrics),

    // ── Department utilization ────────────────────────────────
    db.select({
      id:          departments.id,
      name:        departments.name,
      color:       departments.color,
      assets:      sql`count(${assets.id})::int`,
      utilization: sql`coalesce(round(avg(${assets.utilizationPercentage})),0)::int`,
    })
    .from(departments)
    .leftJoin(assets, eq(assets.departmentId, departments.id))
    .groupBy(departments.id, departments.name, departments.color)
    .orderBy(sql`count(${assets.id}) desc`),

    // ── Asset type intelligence table ─────────────────────────
    db.select({
      name:        assetTypes.name,
      count:       sql`count(${assets.id})::int`,
      utilization: sql`coalesce(round(avg(${assets.utilizationPercentage})),0)::int`,
    })
    .from(assetTypes)
    .leftJoin(assets, eq(assets.assetTypeId, assetTypes.id))
    .groupBy(assetTypes.id, assetTypes.name)
    .orderBy(sql`count(${assets.id}) desc`),

    // ── Alerts within the selected time window ────────────────
    db.select({
      type:      alerts.type,
      msg:       alerts.message,
      zone:      zones.name,
      sev:       alerts.severity,
      createdAt: alerts.createdAt,
    })
    .from(alerts)
    .leftJoin(zones, eq(zones.id, alerts.zoneId))
    .where(and(
      eq(alerts.resolved, false),
      sql`${alerts.createdAt} >= now() - make_interval(hours => ${hours})`,
    ))
    .orderBy(
      sql`case ${alerts.severity} when 'high' then 1 when 'medium' then 2 else 3 end`,
      desc(alerts.createdAt),
    )
    .limit(20),

    // ── Zone activity ─────────────────────────────────────────
    db.select({
      name:       zones.name,
      traffic:    zones.trafficVolume,
      dwell:      zones.avgDwellTime,
      efficiency: zones.efficiencyScore,
    })
    .from(zones)
    .orderBy(desc(zones.efficiencyScore)),

    // ── ROI history — all months (scaled in buildRoiHistory) ──
    db.select({ month: roiHistory.monthName, savings: roiHistory.savings, purchases: roiHistory.purchases })
    .from(roiHistory)
    .orderBy(
      roiHistory.year,
      sql`case ${roiHistory.monthName}
            when 'Jan' then 1  when 'Feb' then 2  when 'Mar' then 3
            when 'Apr' then 4  when 'May' then 5  when 'Jun' then 6
            when 'Jul' then 7  when 'Aug' then 8  when 'Sep' then 9
            when 'Oct' then 10 when 'Nov' then 11 when 'Dec' then 12 end`,
    )
    .limit(12),

    // ── Over-purchased types ──────────────────────────────────
    db.select({ count: sql`count(*)::int` }).from(
      db.select({ assetTypeId: assets.assetTypeId })
        .from(assets)
        .groupBy(assets.assetTypeId)
        .having(sql`avg(${assets.utilizationPercentage}) < 40`)
        .as('sub'),
    ),

    // ── Workflow metrics ──────────────────────────────────────
    db.select({ metric: workflowMetrics.metricName, before: workflowMetrics.beforeValue, after: workflowMetrics.afterValue, pct: workflowMetrics.improvementPct })
    .from(workflowMetrics)
    .orderBy(workflowMetrics.displayOrder),

    // ── Labor calc params ─────────────────────────────────────
    db.select({ paramKey: laborCalcParams.paramKey, paramValue: laborCalcParams.paramValue })
    .from(laborCalcParams)
    .orderBy(laborCalcParams.id),

    // ── Pilot phases ──────────────────────────────────────────
    db.select({ phase: pilotPhases.phaseLabel, desc: pilotPhases.description, impact: pilotPhases.impact, status: pilotPhases.status })
    .from(pilotPhases)
    .orderBy(pilotPhases.phaseNumber),

    // ── Top searched asset types (search audit) ───────────────
    db.select({
      name:           equipmentSearchAudit.searchText,
      count:          sql`count(*)::int`,
      successRate:    sql`round(avg(case when ${equipmentSearchAudit.searchSuccessFlag} then 1 else 0 end) * 100)::int`,
      noResultsCount: sql`sum(case when ${equipmentSearchAudit.noResultsFlag} then 1 else 0 end)::int`,
    })
    .from(equipmentSearchAudit)
    .where(and(
      isNotNull(equipmentSearchAudit.searchText),
      sql`${equipmentSearchAudit.searchTimestamp} >= now() - make_interval(hours => ${hours})`,
    ))
    .groupBy(equipmentSearchAudit.searchText)
    .orderBy(sql`count(*) desc`)
    .limit(10),

    // ── Search source breakdown ───────────────────────────────
    db.select({
      source: equipmentSearchAudit.searchSource,
      count:  sql`count(*)::int`,
    })
    .from(equipmentSearchAudit)
    .where(sql`${equipmentSearchAudit.searchTimestamp} >= now() - make_interval(hours => ${hours})`)
    .groupBy(equipmentSearchAudit.searchSource)
    .orderBy(sql`count(*) desc`),

    // ── Overall search stats ──────────────────────────────────
    db.select({
      total:      sql`count(*)::int`,
      successful: sql`count(*) filter (where ${equipmentSearchAudit.searchSuccessFlag})::int`,
      noResults:  sql`count(*) filter (where ${equipmentSearchAudit.noResultsFlag})::int`,
    })
    .from(equipmentSearchAudit)
    .where(sql`${equipmentSearchAudit.searchTimestamp} >= now() - make_interval(hours => ${hours})`),

    // ── Asset status distribution ─────────────────────────────
    db.select({
      status: assetStatusCurrent.status,
      count:  sql`count(*)::int`,
    })
    .from(assetStatusCurrent)
    .where(eq(assetStatusCurrent.isActive, true))
    .groupBy(assetStatusCurrent.status)
    .orderBy(sql`count(*) desc`),

    // ── Asset status summary counts ───────────────────────────
    db.select({
      available:     sql`count(*) filter (where ${assetStatusCurrent.status} in ('PROBABLY_AVAILABLE','STATIONARY'))::int`,
      inUse:         sql`count(*) filter (where ${assetStatusCurrent.status} in ('PROBABLY_IN_USE','MOVING','RECENTLY_MOVED','RESERVED'))::int`,
      needsAttention:sql`count(*) filter (where ${assetStatusCurrent.status} in ('MAINTENANCE_HOLD','OUT_OF_SERVICE','MARKED_MISSING','NEEDS_CLEANING','LOST_SIGNAL'))::int`,
      lowBattery:    sql`count(*) filter (where ${assetStatusCurrent.status} = 'LOW_BATTERY')::int`,
      avgBattery:    sql`round(avg(${assetStatusCurrent.batteryPct}) filter (where ${assetStatusCurrent.batteryPct} is not null))::int`,
      totalTracked:  sql`count(*)::int`,
    })
    .from(assetStatusCurrent)
    .where(eq(assetStatusCurrent.isActive, true)),

    // ── Individual asset status detail (sorted by urgency) ────
    db.select({
      assetName:       assetStatusCurrent.assetName,
      status:          assetStatusCurrent.status,
      batteryPct:      assetStatusCurrent.batteryPct,
      confidenceScore: assetStatusCurrent.confidenceScore,
      lastSeenAt:      assetStatusCurrent.lastSeenAt,
      locationName:    assetStatusCurrent.locationName,
      motionDetected:  assetStatusCurrent.motionDetected,
    })
    .from(assetStatusCurrent)
    .where(eq(assetStatusCurrent.isActive, true))
    .orderBy(sql`case ${assetStatusCurrent.status}
      when 'MARKED_MISSING'    then 1
      when 'MAINTENANCE_HOLD'  then 2
      when 'OUT_OF_SERVICE'    then 3
      when 'LOST_SIGNAL'       then 4
      when 'LOW_BATTERY'       then 5
      when 'NEEDS_CLEANING'    then 6
      else 7 end`,
      desc(assetStatusCurrent.lastSeenAt),
    )
    .limit(50),

    // ── Signal event aggregates (IoT health) ──────────────────
    db.select({
      avgRssi:          sql`round(avg(${assetTagSignalEvents.rssi}))::int`,
      avgBattery:       sql`round(avg(${assetTagSignalEvents.batteryLevel}))::int`,
      totalEvents:      sql`count(*)::int`,
      motionEvents:     sql`count(*) filter (where ${assetTagSignalEvents.motionDetected})::int`,
      activeTags:       sql`count(distinct ${assetTagSignalEvents.tagId})::int`,
      lowBatteryEvents: sql`count(*) filter (where ${assetTagSignalEvents.batteryLevel} < 20)::int`,
    })
    .from(assetTagSignalEvents)
    .where(sql`${assetTagSignalEvents.receivedAt} >= now() - make_interval(hours => ${hours})`),

    // ── Facility layout summary ───────────────────────────────
    db.select({
      totalLocations: sql`count(*)::int`,
      buildings:      sql`count(distinct ${siteConfigurationFacilityLayout.building})::int`,
      floors:         sql`count(distinct ${siteConfigurationFacilityLayout.floorSort})::int`,
      zones:          sql`count(distinct ${siteConfigurationFacilityLayout.zone}) filter (where ${siteConfigurationFacilityLayout.zone} is not null)::int`,
    })
    .from(siteConfigurationFacilityLayout)
    .where(eq(siteConfigurationFacilityLayout.isActive, '1')),

    // ── Manual status history — overall stats ─────────────────
    db.select({
      total:          sql`count(*)::int`,
      distinctAssets: sql`count(distinct ${assetManualStatusHistory.assetId})::int`,
      distinctStaff:  sql`count(distinct ${assetManualStatusHistory.changedByName})::int`,
    })
    .from(assetManualStatusHistory)
    .where(sql`${assetManualStatusHistory.createdAt} >= now() - make_interval(hours => ${hours})`),

    // ── Status distribution (which codes are assigned most) ───
    db.select({
      status: assetManualStatusHistory.newStatusCode,
      count:  sql`count(*)::int`,
    })
    .from(assetManualStatusHistory)
    .where(sql`${assetManualStatusHistory.createdAt} >= now() - make_interval(hours => ${hours})`)
    .groupBy(assetManualStatusHistory.newStatusCode)
    .orderBy(sql`count(*) desc`),

    // ── Top transitions (from → to) ───────────────────────────
    db.select({
      from:  assetManualStatusHistory.previousStatusCode,
      to:    assetManualStatusHistory.newStatusCode,
      count: sql`count(*)::int`,
    })
    .from(assetManualStatusHistory)
    .where(and(
      isNotNull(assetManualStatusHistory.previousStatusCode),
      sql`${assetManualStatusHistory.createdAt} >= now() - make_interval(hours => ${hours})`,
    ))
    .groupBy(assetManualStatusHistory.previousStatusCode, assetManualStatusHistory.newStatusCode)
    .orderBy(sql`count(*) desc`)
    .limit(8),

    // ── Most active staff ─────────────────────────────────────
    db.select({
      name:  assetManualStatusHistory.changedByName,
      count: sql`count(*)::int`,
    })
    .from(assetManualStatusHistory)
    .where(and(
      isNotNull(assetManualStatusHistory.changedByName),
      sql`${assetManualStatusHistory.createdAt} >= now() - make_interval(hours => ${hours})`,
    ))
    .groupBy(assetManualStatusHistory.changedByName)
    .orderBy(sql`count(*) desc`)
    .limit(8),

    // ── Daily activity trend (last 14 days) ───────────────────
    db.select({
      day:   sql`date_trunc('day', ${assetManualStatusHistory.createdAt})::date`,
      count: sql`count(*)::int`,
    })
    .from(assetManualStatusHistory)
    .where(sql`${assetManualStatusHistory.createdAt} >= now() - interval '14 days'`)
    .groupBy(sql`date_trunc('day', ${assetManualStatusHistory.createdAt})`)
    .orderBy(sql`date_trunc('day', ${assetManualStatusHistory.createdAt})`),

    // ── Recent activity feed (last 25) ────────────────────────
    db.select({
      from:      assetManualStatusHistory.previousStatusCode,
      to:        assetManualStatusHistory.newStatusCode,
      reason:    assetManualStatusHistory.statusReason,
      who:       assetManualStatusHistory.changedByName,
      createdAt: assetManualStatusHistory.createdAt,
    })
    .from(assetManualStatusHistory)
    .orderBy(desc(assetManualStatusHistory.createdAt))
    .limit(25),

    // ── Asset search history — overall stats ──────────────────
    db.select({
      total:      sql`count(*)::int`,
      successful: sql`count(*) filter (where ${assetSearchHistory.searchSuccessFlag})::int`,
      noResults:  sql`count(*) filter (where ${assetSearchHistory.noResultsFlag})::int`,
      distinct:   sql`count(distinct ${assetSearchHistory.userId})::int`,
    })
    .from(assetSearchHistory)
    .where(sql`${assetSearchHistory.searchTimestamp} >= now() - make_interval(hours => ${hours})`),

    // ── Top searched types ────────────────────────────────────
    db.select({
      name:        assetSearchHistory.searchText,
      count:       sql`count(*)::int`,
      successRate: sql`round(avg(case when ${assetSearchHistory.searchSuccessFlag} then 1 else 0 end)*100)::int`,
      noResults:   sql`count(*) filter (where ${assetSearchHistory.noResultsFlag})::int`,
    })
    .from(assetSearchHistory)
    .where(and(
      isNotNull(assetSearchHistory.searchText),
      sql`${assetSearchHistory.searchTimestamp} >= now() - make_interval(hours => ${hours})`,
    ))
    .groupBy(assetSearchHistory.searchText)
    .orderBy(sql`count(*) desc`)
    .limit(10),

    // ── Source breakdown ──────────────────────────────────────
    db.select({
      source: assetSearchHistory.searchSource,
      count:  sql`count(*)::int`,
    })
    .from(assetSearchHistory)
    .where(sql`${assetSearchHistory.searchTimestamp} >= now() - make_interval(hours => ${hours})`)
    .groupBy(assetSearchHistory.searchSource)
    .orderBy(sql`count(*) desc`),

    // ── Daily search volume (14 days) ─────────────────────────
    db.select({
      day:   sql`date_trunc('day', ${assetSearchHistory.searchTimestamp})::date`,
      count: sql`count(*)::int`,
    })
    .from(assetSearchHistory)
    .where(sql`${assetSearchHistory.searchTimestamp} >= now() - interval '14 days'`)
    .groupBy(sql`date_trunc('day', ${assetSearchHistory.searchTimestamp})`)
    .orderBy(sql`date_trunc('day', ${assetSearchHistory.searchTimestamp})`),

    // ── Recent searches (last 25) ─────────────────────────────
    db.select({
      searchText:  assetSearchHistory.searchText,
      source:      assetSearchHistory.searchSource,
      success:     assetSearchHistory.searchSuccessFlag,
      noResults:   assetSearchHistory.noResultsFlag,
      location:    assetSearchHistory.selectedCurrentLocation,
      lastSeen:    assetSearchHistory.lastSeenFilter,
      ts:          assetSearchHistory.searchTimestamp,
    })
    .from(assetSearchHistory)
    .orderBy(desc(assetSearchHistory.searchTimestamp))
    .limit(25),
  ])

  const m     = Object.fromEntries(metricsRows.map(r => [r.metricKey, r.metricValue]))
  const total = assetCounts.total || 1
  const labor = Object.fromEntries(laborRows.map(r => [r.paramKey, parseFloat(r.paramValue)]))

  return {
    range,
    kpi: {
      totalAssets:          assetCounts.total,
      activeAssets:         assetCounts.active,
      inactiveAssets:       assetCounts.inactive,
      lostAssets:           assetCounts.lost,
      highUtilization:      assetCounts.highUtil,
      lowIdle:              assetCounts.lowIdle,
      redistributableUnits: assetCounts.redistributable,
      overPurchasedTypes:   overPurchasedRow.count,
      searchTimeReduction:  m['kpi_search_time_reduction'] || '0%',
      laborSavingsMonthly:  m['kpi_labor_savings_monthly'] || '$0',
      laborSavingsAnnual:   m['kpi_labor_savings_annual']  || '$0',
      avoidedPurchases:     m['kpi_avoided_purchases']     || '$0',
      availabilityScore:    parseInt(m['kpi_availability_score'] || 0),
      avgRetrievalTime:     m['kpi_avg_retrieval_time']    || '0 min',
      distributionEff:      m['kpi_distribution_eff']      || '0%',
      utilizationRate:      m['kpi_utilization_rate']      || '0%',
    },
    healthScores: {
      availability: parseInt(m['health_availability'] || 0),
      distribution: parseInt(m['health_distribution'] || 0),
      utilization:  parseInt(m['health_utilization']  || 0),
      highUtilPct:  Math.round(assetCounts.highUtil * 100 / total),
      lowUtilPct:   Math.round(assetCounts.lowIdle  * 100 / total),
    },
    departments: departmentRows.map(d => ({
      name: d.name, color: d.color, assets: d.assets, utilization: d.utilization,
      hoarding: d.utilization < 75 && d.assets > 25,
    })),
    topAssets: assetTypeRows.map(a => ({
      name: a.name, count: a.count, utilization: a.utilization, status: deriveAssetStatus(a.utilization),
    })),
    alerts: alertRows.map(a => ({
      type: a.type, msg: a.msg, zone: a.zone || 'Unknown', sev: a.sev, time: timeAgo(a.createdAt),
    })),
    zones: zoneRows.map(z => ({
      name: z.name, traffic: z.traffic, dwell: z.dwell, efficiency: z.efficiency,
    })),
    roiHistory: buildRoiHistory(roiRows, range),
    searchEfficiency: {
      avgDuration:   m['search_avg_duration']   || '0 min',
      successRate:   m['search_success_rate']   || '0%',
      accuracyScore: m['search_accuracy_score'] || '0%',
      timeToAsset:   m['search_time_to_asset']  || '0 min',
      confidence:    m['search_confidence']     || '0%',
    },
    pilotMetrics: {
      coverageZones:     m['pilot_coverage_zones']    || '0',
      assetCount:        m['pilot_asset_count']       || '0',
      movementEvents:    m['pilot_movement_events']   || '0',
      recoveryExamples:  parseInt(m['pilot_recovery_examples'] || 0),
      searchReduction:   m['pilot_search_reduction']  || '0%',
      nursingEfficiency: m['pilot_nursing_efficiency']|| '0%',
    },
    workflowMetrics: workflowRows.map((r, i) => ({ ...r, color: WORKFLOW_COLORS[i] ?? '#00d9a6' })),
    laborCalcParams: {
      searchTimeBefore:  `${labor['search_time_before']  ?? 'N/A'} min`,
      searchTimeAfter:   `${labor['search_time_after']   ?? 'N/A'} min`,
      searchesPerDay:    `${labor['searches_per_day']    ?? 'N/A'}`,
      nursingHourlyRate: labor['nursing_hourly_rate'] ? `$${labor['nursing_hourly_rate'].toFixed(2)}` : 'N/A',
    },
    pilotPhases: phaseRows,
    manualStatusHistory: {
      totalChanges:   manualStatsRow?.total          ?? 0,
      distinctAssets: manualStatsRow?.distinctAssets ?? 0,
      distinctStaff:  manualStatsRow?.distinctStaff  ?? 0,
      statusDist:     manualStatusDistRows,
      transitions:    manualTransitionRows,
      topStaff:       manualTopStaffRows,
      dailyTrend:     manualDailyRows.map(r => ({
        day:   new Date(r.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: r.count,
      })),
      recentActivity: manualRecentRows.map(r => ({
        from:      r.from ?? '—',
        to:        r.to,
        reason:    r.reason ?? '',
        who:       r.who ?? 'Unknown',
        time:      timeAgo(r.createdAt),
      })),
    },
    searchHistory: {
      totalSearches:   searchHistStatsRow?.total      ?? 0,
      successful:      searchHistStatsRow?.successful ?? 0,
      noResults:       searchHistStatsRow?.noResults  ?? 0,
      distinctUsers:   searchHistStatsRow?.distinct   ?? 0,
      successRate:     searchHistStatsRow?.total
        ? Math.round((searchHistStatsRow.successful / searchHistStatsRow.total) * 100)
        : 0,
      noResultsRate:   searchHistStatsRow?.total
        ? Math.round((searchHistStatsRow.noResults  / searchHistStatsRow.total) * 100)
        : 0,
      topSearchedTypes: searchHistTopRows.map(r => ({
        name:        r.name,
        count:       r.count,
        successRate: r.successRate ?? 0,
        noResults:   r.noResults   ?? 0,
      })),
      sourceBreakdown: searchHistSourceRows,
      dailyTrend: searchHistDailyRows.map(r => ({
        day:   new Date(r.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: r.count,
      })),
      recentSearches: searchHistRecentRows.map(r => ({
        term:      r.searchText ?? '(no text)',
        source:    r.source,
        success:   r.success,
        noResults: r.noResults,
        location:  r.location ?? '—',
        lastSeen:  r.lastSeen ?? '—',
        time:      timeAgo(r.ts),
      })),
    },
    searchAudit: {
      topSearchedTypes: searchTypeRows.map(r => ({
        name:           r.name,
        count:          r.count,
        successRate:    r.successRate ?? 0,
        noResultsCount: r.noResultsCount ?? 0,
      })),
      sourceBreakdown:    searchSourceRows,
      totalSearches:      searchStatsRow?.total      ?? 0,
      successfulSearches: searchStatsRow?.successful ?? 0,
      noResultsSearches:  searchStatsRow?.noResults  ?? 0,
      overallSuccessRate: searchStatsRow?.total
        ? Math.round((searchStatsRow.successful / searchStatsRow.total) * 100)
        : 0,
    },
    assetStatusSummary: {
      available:      statusSummaryRow?.available      ?? 0,
      inUse:          statusSummaryRow?.inUse          ?? 0,
      needsAttention: statusSummaryRow?.needsAttention ?? 0,
      lowBattery:     statusSummaryRow?.lowBattery     ?? 0,
      avgBattery:     statusSummaryRow?.avgBattery     ?? null,
      totalTracked:   statusSummaryRow?.totalTracked   ?? 0,
      breakdown: statusBreakdownRows,
      assets: statusDetailRows.map(r => ({
        name:       r.assetName     ?? 'Unknown',
        status:     r.status,
        battery:    r.batteryPct,
        confidence: r.confidenceScore,
        lastSeen:   r.lastSeenAt ? timeAgo(r.lastSeenAt) : 'Never',
        location:   r.locationName  ?? '—',
        moving:     r.motionDetected ?? false,
      })),
    },
    signalHealth: {
      avgRssi:          signalStatsRow?.avgRssi      ?? null,
      avgBattery:       signalStatsRow?.avgBattery   ?? null,
      totalEvents:      signalStatsRow?.totalEvents  ?? 0,
      motionEvents:     signalStatsRow?.motionEvents ?? 0,
      activeTags:       signalStatsRow?.activeTags   ?? 0,
      lowBatteryEvents: signalStatsRow?.lowBatteryEvents ?? 0,
    },
    facilityLayout: {
      totalLocations: facilityStatsRow?.totalLocations ?? 0,
      buildings:      facilityStatsRow?.buildings      ?? 0,
      floors:         facilityStatsRow?.floors         ?? 0,
      zones:          facilityStatsRow?.zones          ?? 0,
    },
  }
}
