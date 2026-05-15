/**
 * Randomized seed for the iLocate PostgreSQL database.
 * Every run produces a fresh, realistic-but-different dataset.
 * Run: node seed.js
 */
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// ── Random helpers ────────────────────────────────────────────
const rInt   = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const rFloat = (min, max, dp = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(dp))
const rPick  = arr => arr[Math.floor(Math.random() * arr.length)]
const rBool  = (pTrue = 0.5) => Math.random() < pTrue

// Gaussian approximation — centers randomness around a mean
const rGauss = (mean, stddev) => {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return mean + stddev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, Math.round(v)))

async function seed() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // ── 0. Clear all tables ───────────────────────────────────
    await client.query(`
      TRUNCATE TABLE
        equipment_search_audit, asset_tag_signal_events, asset_status_current,
        pilot_phases, labor_calc_params, workflow_metrics,
        alerts, assets, asset_types, departments, zones,
        roi_history, metrics, users
      RESTART IDENTITY CASCADE
    `)
    // site_configuration_facility_layout uses a named sequence — truncate separately
    await client.query(`TRUNCATE TABLE site_configuration_facility_layout RESTART IDENTITY CASCADE`)
    console.log('✓ Tables cleared')

    // ── 1. Departments (fixed names, randomised color pool) ───
    const COLORS = ['#00d9a6', '#0ab8ff', '#ff5e3a', '#f7c94b', '#a78bfa', '#8898b4', '#22c55e', '#ec4899']
    const deptDefs = [
      { name: 'ICU',          targetUtil: rInt(88, 99), color: '#00d9a6' },
      { name: 'ER',           targetUtil: rInt(90, 99), color: '#0ab8ff' },
      { name: 'Radiology',    targetUtil: rInt(55, 78), color: rPick(COLORS) },
      { name: 'Surgery',      targetUtil: rInt(80, 96), color: rPick(COLORS) },
      { name: 'Orthopedics',  targetUtil: rInt(48, 72), color: rPick(COLORS) },
      { name: 'Cardiology',   targetUtil: rInt(70, 92), color: rPick(COLORS) },
      { name: 'Pediatrics',   targetUtil: rInt(65, 88), color: rPick(COLORS) },
      { name: 'General',      targetUtil: rInt(48, 70), color: '#8898b4'  },
    ]
    const deptIds = {}
    for (const d of deptDefs) {
      const r = await client.query(
        `INSERT INTO departments (name, color) VALUES ($1, $2) RETURNING id`,
        [d.name, d.color]
      )
      deptIds[d.name] = { id: r.rows[0].id, targetUtil: d.targetUtil }
    }
    console.log('✓ Departments')

    // ── 2. Zones (randomised efficiency + dwell) ──────────────
    const zoneDefs = [
      { name: 'ICU',               traffic: 'High',   dwellRange: [0.8, 2.5],  effRange: [88, 99] },
      { name: 'Emergency Room',    traffic: 'High',   dwellRange: [0.6, 1.8],  effRange: [90, 99] },
      { name: 'Surgery Suite',     traffic: 'Medium', dwellRange: [3.0, 7.0],  effRange: [72, 92] },
      { name: 'General Wards',     traffic: 'Medium', dwellRange: [6.0, 12.0], effRange: [58, 82] },
      { name: 'Radiology',         traffic: 'Low',    dwellRange: [8.0, 18.0], effRange: [38, 65] },
      { name: 'Storage / Closets', traffic: 'Low',    dwellRange: [18.0, 40.0],effRange: [18, 45] },
    ]
    const zoneIds = {}
    for (const z of zoneDefs) {
      const eff   = rInt(...z.effRange)
      const dwell = rFloat(...z.dwellRange, 1) + 'h'
      const r = await client.query(
        `INSERT INTO zones (name, traffic_volume, avg_dwell_time, efficiency_score)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [z.name, z.traffic, dwell, eff]
      )
      zoneIds[z.name] = r.rows[0].id
    }
    console.log('✓ Zones')

    // ── 3. Asset types (fixed names, randomised base util) ────
    const typeDefs = [
      { name: 'IV Pumps',        icon: 'activity',      baseUtil: rInt(85, 99) },
      { name: 'Ventilators',     icon: 'wind',          baseUtil: rInt(78, 95) },
      { name: 'Wheelchairs',     icon: 'accessibility', baseUtil: rInt(60, 82) },
      { name: 'ECG Monitors',    icon: 'heart',         baseUtil: rInt(58, 80) },
      { name: 'Infusion Pumps',  icon: 'droplet',       baseUtil: rInt(82, 96) },
      { name: 'Portable X-Ray',  icon: 'zap',           baseUtil: rInt(28, 55) },
      { name: 'Crash Carts',     icon: 'truck',         baseUtil: rInt(38, 65) },
      { name: 'Patient Lifts',   icon: 'arrow-up',      baseUtil: rInt(18, 45) },
      { name: 'Other Equipment', icon: 'box',           baseUtil: rInt(48, 78) },
    ]
    const typeIds = {}
    for (const t of typeDefs) {
      const r = await client.query(
        `INSERT INTO asset_types (name, icon) VALUES ($1, $2) RETURNING id`,
        [t.name, t.icon]
      )
      typeIds[t.name] = { id: r.rows[0].id, baseUtil: t.baseUtil }
    }
    console.log('✓ Asset types')

    // ── 4. Assets (random count per dept, Gaussian utilization) ─
    const typeList  = Object.entries(typeIds)
    const deptList  = Object.entries(deptIds)
    let totalAssets = 0
    let typeIndex   = 0

    for (const [deptName, { id: deptId, targetUtil }] of deptList) {
      const count = rInt(22, 72)
      totalAssets += count

      const values = []
      const params = []
      let p = 1

      for (let i = 0; i < count; i++) {
        const [, typeInfo] = typeList[typeIndex % typeList.length]
        typeIndex++

        // Blend department target with type base, then add gaussian noise
        const blended = (targetUtil + typeInfo.baseUtil) / 2
        const util    = clamp(rGauss(blended, 12), 0, 100)

        const status =
          util >= 85 ? 'high'   :
          util >= 65 ? 'normal' :
          util >= 40 ? 'low'    : 'idle'

        const hoursBack = status === 'high'   ? rFloat(0.1, 3, 1)
                        : status === 'normal' ? rFloat(1,   12, 1)
                        : status === 'low'    ? rFloat(12,  48, 1)
                        :                       rFloat(40,  96, 1)

        const lastSeen = new Date(Date.now() - hoursBack * 3600 * 1000)
        const name     = `${deptName.slice(0,3).toUpperCase()}-${typeInfo.id.toString().padStart(2,'0')}-${String(i+1).padStart(3,'0')}`

        values.push(`($${p},$${p+1},$${p+2},$${p+3},$${p+4},$${p+5})`)
        params.push(name, typeInfo.id, deptId, util, status, lastSeen)
        p += 6
      }

      await client.query(
        `INSERT INTO assets (name,asset_type_id,department_id,utilization_percentage,status,last_seen) VALUES ${values.join(',')}`,
        params
      )
    }
    console.log(`✓ Assets (${totalAssets} rows)`)

    // ── 5. Alerts (random messages + random asset IDs) ────────
    const ASSET_PREFIXES = ['IVP','VNT','WCH','ECG','INF','XRY','CCT','PLT']
    const alertTemplates = [
      (id, zone)   => ({ type: 'lost',       msg: `${rPick(['IV Pump','Ventilator','ECG Monitor'])} #${id} not seen > ${rInt(48,96)}h`,   zone, sev: 'high'   }),
      (_id, zone)  => ({ type: 'hoard',      msg: `${zone} hoarding ${rInt(4,14)} ${rPick(['wheelchairs','IV pumps','patient monitors'])}`, zone, sev: 'medium' }),
      (_id, _zone) => ({ type: 'hoard',      msg: `Excess ${rPick(['infusion pump','ventilator','ECG monitor'])} retention detected`,      zone: null, sev: 'medium' }),
      (_id, zone)  => ({ type: 'offline',    msg: `Receiver R-${String(rInt(1,20)).padStart(2,'0')} offline`,                             zone, sev: 'low'    }),
      (_id, _zone) => ({ type: 'congestion', msg: `High equipment concentration in ${rPick(['Corridor A','Corridor B','Bay 3','Ward 5'])}`,zone: null, sev: 'low'    }),
      (id, zone)   => ({ type: 'lost',       msg: `${rPick(['Crash Cart','Patient Lift'])} #${id} missing from ${zone}`,                  zone, sev: 'high'   }),
    ]
    const zoneNameList = Object.keys(zoneIds)
    const alertCount   = rInt(4, 9)
    let lastHoursAgo   = rFloat(0.5, 2, 1)

    for (let i = 0; i < alertCount; i++) {
      const zoneName  = rPick(zoneNameList)
      const assetId   = `${rPick(ASSET_PREFIXES)}-${String(rInt(1,999)).padStart(4,'0')}`
      const template  = alertTemplates[i % alertTemplates.length]
      const { type, msg, zone: zName, sev } = template(assetId, zoneName)
      const zoneId    = zName ? (zoneIds[zName] ?? null) : null
      const createdAt = new Date(Date.now() - lastHoursAgo * 3600 * 1000)
      lastHoursAgo   += rFloat(1.5, 5, 1)

      await client.query(
        `INSERT INTO alerts (type, message, zone_id, severity, resolved, created_at)
         VALUES ($1, $2, $3, $4, false, $5)`,
        [type, msg, zoneId, sev, createdAt]
      )
    }
    console.log(`✓ Alerts (${alertCount} rows)`)

    // ── 6. ROI History (upward trend + noise) ─────────────────
    const months    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const startIdx  = rInt(0, 5)
    const startYear = rBool(0.5) ? 2025 : 2026
    let savings     = rInt(12000, 22000)
    let purchases   = rInt(4000,  9000)

    for (let i = 0; i < 6; i++) {
      const mIdx  = (startIdx + i) % 12
      const year  = startIdx + i >= 12 ? startYear + 1 : startYear
      savings    += rInt(800, 2200)
      purchases  += rInt(400, 1800)
      // add random monthly noise ±5%
      const noisedSavings   = Math.round(savings   * rFloat(0.95, 1.05, 3))
      const noisedPurchases = Math.round(purchases * rFloat(0.95, 1.05, 3))

      await client.query(
        `INSERT INTO roi_history (month_name, savings, purchases, year) VALUES ($1, $2, $3, $4)`,
        [months[mIdx], noisedSavings, noisedPurchases, year]
      )
    }
    console.log('✓ ROI history')

    // ── 7. Labor calc params (randomised, internally consistent) ─
    const tBefore     = rFloat(14, 25, 1)
    const tAfter      = rFloat(3,  Math.min(tBefore - 4, 9), 1)
    const searchesDay = rInt(60, 130)
    const hourlyRate  = rFloat(42, 62, 2)

    const minSaved      = tBefore - tAfter
    const annualSavings = Math.round((minSaved / 60) * searchesDay * hourlyRate * 365)
    const monthlySavings= Math.round(annualSavings / 12)
    const searchReductPct = Math.round((minSaved / tBefore) * 100)
    const avgRetrieval  = rFloat(tAfter, tAfter + 2, 1)

    const laborData = [
      { key: 'search_time_before',  value: tBefore,     label: 'Search Time Before iLocate', unit: 'minutes'       },
      { key: 'search_time_after',   value: tAfter,      label: 'Search Time After iLocate',  unit: 'minutes'       },
      { key: 'searches_per_day',    value: searchesDay, label: 'Equipment Searches per Day',  unit: 'count_per_day' },
      { key: 'nursing_hourly_rate', value: hourlyRate,  label: 'Nursing Hourly Rate',         unit: 'usd_per_hour'  },
    ]
    for (const l of laborData) {
      await client.query(
        `INSERT INTO labor_calc_params (param_key, param_value, param_label, unit)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (param_key) DO UPDATE SET param_value = EXCLUDED.param_value, updated_at = CURRENT_TIMESTAMP`,
        [l.key, l.value, l.label, l.unit]
      )
    }
    console.log('✓ Labor calc params')

    // ── 8. Metrics (derived from randomised params above) ──────
    const avoidedPurchases    = rInt(60000, 180000)
    const availabilityScore   = rInt(84, 99)
    const distributionEff     = rInt(74, 96)
    const utilizationRate     = rInt(70, 92)
    const searchSuccessRate   = rInt(90, 99)
    const proximityAccuracy   = rInt(84, 97)
    const availabilityConf    = rInt(87, 98)
    const coverageZones       = rInt(8, 18)
    const movementEvents      = rInt(28000, 80000).toLocaleString()
    const recoveryExamples    = rInt(12, 50)
    const nursingEfficiency   = rInt(22, 52)

    const fmt$ = n => `$${n.toLocaleString()}`

    const metricsData = [
      { key: 'kpi_search_time_reduction', value: `${searchReductPct}%`,      label: 'Search Time Reduction',          category: 'kpi'    },
      { key: 'kpi_labor_savings_monthly', value: fmt$(monthlySavings),        label: 'Monthly Labor Savings',          category: 'kpi'    },
      { key: 'kpi_labor_savings_annual',  value: fmt$(annualSavings),         label: 'Annual Labor Savings',           category: 'kpi'    },
      { key: 'kpi_avoided_purchases',     value: fmt$(avoidedPurchases),      label: 'Avoided Equipment Purchases',    category: 'kpi'    },
      { key: 'kpi_availability_score',    value: String(availabilityScore),   label: 'Availability Score',             category: 'kpi'    },
      { key: 'kpi_avg_retrieval_time',    value: `${avgRetrieval} min`,       label: 'Avg Asset Retrieval Time',       category: 'kpi'    },
      { key: 'kpi_distribution_eff',      value: `${distributionEff}%`,      label: 'Distribution Efficiency',        category: 'kpi'    },
      { key: 'kpi_utilization_rate',      value: `${utilizationRate}%`,      label: 'Utilization Rate',               category: 'kpi'    },
      { key: 'search_avg_duration',       value: `${tAfter} min`,            label: 'Avg Search Duration',            category: 'search' },
      { key: 'search_success_rate',       value: `${searchSuccessRate}%`,    label: 'Successful Search Rate',         category: 'search' },
      { key: 'search_accuracy_score',     value: `${proximityAccuracy}%`,    label: 'Proximity Accuracy',             category: 'search' },
      { key: 'search_time_to_asset',      value: `${avgRetrieval} min`,      label: 'Time-to-Asset',                  category: 'search' },
      { key: 'search_confidence',         value: `${availabilityConf}%`,     label: 'Availability Confidence',        category: 'search' },
      { key: 'pilot_coverage_zones',      value: String(coverageZones),      label: 'Coverage Zones',                 category: 'pilot'  },
      { key: 'pilot_asset_count',         value: String(totalAssets),        label: 'Assets in Pilot',               category: 'pilot'  },
      { key: 'pilot_movement_events',     value: movementEvents,             label: 'Movement Events Captured',       category: 'pilot'  },
      { key: 'pilot_recovery_examples',   value: String(recoveryExamples),   label: 'Asset Recovery Examples',       category: 'pilot'  },
      { key: 'pilot_search_reduction',    value: `${searchReductPct}%`,      label: 'Search Time Reduction',          category: 'pilot'  },
      { key: 'pilot_nursing_efficiency',  value: `${nursingEfficiency}%`,    label: 'Nursing Efficiency Gain',        category: 'pilot'  },
      { key: 'health_availability',       value: String(availabilityScore),  label: 'System Availability Score',      category: 'health' },
      { key: 'health_distribution',       value: String(distributionEff),    label: 'Distribution Efficiency Score',  category: 'health' },
      { key: 'health_utilization',        value: String(utilizationRate),    label: 'Utilization Score',              category: 'health' },
    ]
    for (const m of metricsData) {
      await client.query(
        `INSERT INTO metrics (metric_key, metric_value, metric_label, category)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (metric_key) DO UPDATE
           SET metric_value = EXCLUDED.metric_value, metric_label = EXCLUDED.metric_label, updated_at = CURRENT_TIMESTAMP`,
        [m.key, m.value, m.label, m.category]
      )
    }
    console.log('✓ Metrics (derived from randomised inputs)')

    // ── 9. Workflow metrics (randomised before/after) ──────────
    const wfRaw = [
      { name: 'Reduced Nursing Interruptions',    bv: rFloat(4.0, 8.5, 1), av: rFloat(1.0, 3.0, 1), unit: 'per_shift', fmt: (b,a) => [`Avg ${b}/shift`,`Avg ${a}/shift`] },
      { name: 'Time Away from Patients (search)', bv: tBefore,              av: tAfter,               unit: 'minutes',   fmt: (b,a) => [`${b} min/shift`,`${a} min/shift`] },
      { name: 'Equipment Escalation Calls',       bv: rFloat(3.0, 7.0, 1), av: rFloat(0.4, 1.6, 1), unit: 'per_day',   fmt: (b,a) => [`${b}/day`,`${a}/day`]             },
      { name: 'Shift Efficiency Score',           bv: rInt(52, 72),         av: rInt(82, 97),         unit: 'percent',   fmt: (b,a) => [`${b}%`,`${a}%`]                   },
      { name: 'Equipment Turnaround Time',        bv: rInt(28, 52),         av: rInt(8, 18),          unit: 'minutes',   fmt: (b,a) => [`${b} min avg`,`${a} min avg`]      },
      { name: 'Failed Equipment Searches',        bv: rFloat(7.0, 15.0, 1),av: rFloat(0.6, 2.2, 1), unit: 'per_day',   fmt: (b,a) => [`${b}/day`,`${a}/day`]             },
    ]
    for (let i = 0; i < wfRaw.length; i++) {
      const { name, bv, av, unit, fmt } = wfRaw[i]
      const [before, after] = fmt(bv, av)
      const pct = clamp(((bv - av) / bv) * 100, 10, 95)
      await client.query(
        `INSERT INTO workflow_metrics (metric_name, before_value, after_value, improvement_pct, unit, display_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, before, after, pct, unit, i + 1]
      )
    }
    console.log('✓ Workflow metrics')

    // ── 10. Pilot phases (status randomised except Phase 1) ────
    const STATUSES = ['Planned', 'Backlog', 'Future']
    const phaseImpacts = ['High', 'High', 'Medium', 'Medium', 'High']
    const phaseDefs = [
      'Expand to all remaining floors and wings',
      'Add real-time department-level redistribution alerts',
      'Integrate with EHR for equipment demand forecasting',
      'Deploy predictive maintenance triggers via motion patterns',
      'Extend to off-site clinics and satellite campuses',
    ]
    for (let i = 0; i < 5; i++) {
      const status = i === 0 ? 'Ready' : rPick(STATUSES)
      await client.query(
        `INSERT INTO pilot_phases (phase_number, phase_label, description, impact, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [i + 1, `Phase ${i + 1}`, phaseDefs[i], phaseImpacts[i], status]
      )
    }
    console.log('✓ Pilot phases')

    // ── 11. Admin user ─────────────────────────────────────────
    await client.query(`
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES ('admin@insitehealth.com', '$2b$10$placeholder_replace_before_prod', 'System Administrator', 'admin')
      ON CONFLICT (email) DO NOTHING
    `)
    console.log('✓ Admin user')

    // ── 12. Equipment search audit ─────────────────────────────
    const SEARCH_TERMS = [
      'IV Pump', 'Ventilator', 'Wheelchair', 'ECG Monitor', 'Infusion Pump',
      'Portable X-Ray', 'Crash Cart', 'Patient Lift', 'Pulse Oximeter',
      'Blood Pressure Cuff', 'Defibrillator', 'Suction Machine',
    ]
    const SEARCH_SOURCES = ['mobile', 'mobile', 'mobile', 'web', 'kiosk']
    const searchAuditCount = rInt(280, 500)
    const siteUuid = '00000000-0000-0000-0000-000000000001'

    for (let i = 0; i < searchAuditCount; i++) {
      const term        = rPick(SEARCH_TERMS)
      const success     = rBool(0.78)
      const noResults   = !success && rBool(0.35)
      const hoursAgo    = rFloat(0, 720, 1)
      const ts          = new Date(Date.now() - hoursAgo * 3600 * 1000)

      await client.query(
        `INSERT INTO equipment_search_audit
           (site_id, search_timestamp, search_text, search_source,
            search_success_flag, no_results_flag, exclude_patient_rooms, only_reliable_results)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [siteUuid, ts, term, rPick(SEARCH_SOURCES), success, noResults, rBool(0.8), rBool(0.7)]
      )
    }
    console.log(`✓ Equipment search audit (${searchAuditCount} rows)`)

    // ── 13. Asset status current ───────────────────────────────
    const ASSET_STATUSES = [
      'PROBABLY_AVAILABLE','PROBABLY_AVAILABLE','PROBABLY_AVAILABLE',
      'PROBABLY_IN_USE','PROBABLY_IN_USE',
      'MOVING','RECENTLY_MOVED','STATIONARY',
      'MAINTENANCE_HOLD','LOW_BATTERY','NEEDS_CLEANING',
      'LOST_SIGNAL','MARKED_MISSING','OUT_OF_SERVICE','RESERVED','UNKNOWN',
    ]
    const ASSET_TYPE_NAMES = [
      'IV Pump','Ventilator','Wheelchair','ECG Monitor','Infusion Pump',
      'Portable X-Ray','Crash Cart','Patient Lift',
    ]
    const LOCATION_NAMES = ['ICU Bay 3','ER Trauma 1','Surgery Suite A','General Ward 2','Radiology Hall','Storage Closet B']
    const assetStatusCount = rInt(60, 120)

    for (let i = 0; i < assetStatusCount; i++) {
      const status     = rPick(ASSET_STATUSES)
      const battery    = status === 'LOW_BATTERY' ? rInt(3, 18) : rInt(40, 100)
      const lastSeenH  = status === 'LOST_SIGNAL' || status === 'MARKED_MISSING'
                          ? rFloat(48, 120, 1)
                          : rFloat(0.1, 24, 1)
      const lastSeen   = new Date(Date.now() - lastSeenH * 3600 * 1000)
      const assetName  = `${rPick(ASSET_TYPE_NAMES).slice(0,3).toUpperCase()}-${String(i+1).padStart(4,'0')}`

      await client.query(
        `INSERT INTO asset_status_current
           (asset_id, site_id, tag_id, status, last_seen_at, battery_pct,
            confidence_score, updated_at, is_active, asset_name, location_name, motion_detected)
         VALUES (uuid_generate_v4(), $1, uuid_generate_v4(), $2, $3, $4, $5, now(), true, $6, $7, $8)
         ON CONFLICT (asset_id) DO NOTHING`,
        [siteUuid, status, lastSeen, battery, rInt(60, 99), assetName, rPick(LOCATION_NAMES), rBool(0.3)]
      )
    }
    console.log(`✓ Asset status current (${assetStatusCount} rows)`)

    // ── 14. Asset tag signal events ────────────────────────────
    const signalEventCount = rInt(800, 1500)
    for (let i = 0; i < signalEventCount; i++) {
      const hoursAgo  = rFloat(0, 24, 2)
      const receivedAt = new Date(Date.now() - hoursAgo * 3600 * 1000)
      const battery   = rInt(10, 100)
      const rssi      = rInt(-90, -30)
      const motion    = rBool(0.25)

      await client.query(
        `INSERT INTO asset_tag_signal_events
           (site_id, tag_id, asset_gateway_id, rssi, motion_detected,
            motion_score, battery_level, received_at)
         VALUES ($1, uuid_generate_v4(), uuid_generate_v4(), $2, $3, $4, $5, $6)`,
        [siteUuid, rssi, motion, motion ? rInt(40, 100) : rInt(0, 30), battery, receivedAt]
      )
    }
    console.log(`✓ Asset tag signal events (${signalEventCount} rows)`)

    // ── 15. Facility layout ────────────────────────────────────
    const BUILDINGS  = ['Main', 'East Wing', 'West Wing', 'Tower A']
    const ZONES_LIST = ['ICU', 'ER', 'Surgery', 'General', 'Radiology', 'Admin']
    let facilityCount = 0
    for (const building of BUILDINGS) {
      for (let floor = 1; floor <= rInt(3, 5); floor++) {
        for (const zone of ZONES_LIST.slice(0, rInt(2, 5))) {
          await client.query(
            `INSERT INTO site_configuration_facility_layout
               (hospital_id, site_id, building, floor_sort, is_active, zone, site_name)
             VALUES ($1, $2, $3, $4, B'1', $5, $6)`,
            [1, 1, building, floor, zone, `${building} Floor ${floor}`]
          )
          facilityCount++
        }
      }
    }
    console.log(`✓ Facility layout (${facilityCount} rows)`)

    await client.query('COMMIT')

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Seed complete
  Assets:          ${totalAssets}
  Alerts:          ${alertCount}
  Labor savings:   ${fmt$(annualSavings)}/yr  (${fmt$(monthlySavings)}/mo)
  Search reduction:${searchReductPct}%  (${tBefore}min → ${tAfter}min)
  Availability:    ${availabilityScore}%
  Distribution eff:${distributionEff}%
  Coverage zones:  ${coverageZones}
  Search audits:   ${searchAuditCount}
  Tracked assets:  ${assetStatusCount}
  Signal events:   ${signalEventCount}
  Facility locs:   ${facilityCount}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Seed failed:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
