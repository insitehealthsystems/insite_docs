'use client'
import { useState, useEffect } from 'react'
import {
  Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, BarChart2,
  Bell, Box, CheckCircle, Clock, Download,
  MapPin, Package, RefreshCw, Search,
  Shield, TrendingUp, Users, Zap,
  AlertCircle, Battery, Building2, History,
} from 'lucide-react'

// ─── Design tokens ───────────────────────────────────────────
const C = {
  bg:     '#0a0f1e',
  slate:  '#1c2438',
  card:   'rgba(28,36,56,0.6)',
  border: 'rgba(255,255,255,0.07)',
  teal:   '#00d9a6',
  cyan:   '#0ab8ff',
  gold:   '#f7c94b',
  alert:  '#ff5e3a',
  purple: '#a78bfa',
  mist:   '#8898b4',
  white:  '#ffffff',
  green:  '#22c55e',
}

// ─── Empty state shown when API is unavailable ───────────────
const emptyData = () => ({
  kpi: {
    totalAssets: 0, activeAssets: 0, inactiveAssets: 0, lostAssets: 0,
    highUtilization: 0, lowIdle: 0, redistributableUnits: 0, overPurchasedTypes: 0,
    searchTimeReduction: 'N/A', laborSavingsMonthly: 'N/A', laborSavingsAnnual: 'N/A',
    avoidedPurchases: 'N/A', availabilityScore: 0, avgRetrievalTime: 'N/A',
    distributionEff: 'N/A', utilizationRate: 'N/A',
  },
  healthScores: { availability: 0, distribution: 0, utilization: 0, highUtilPct: 0, lowUtilPct: 0 },
  departments:      [],
  topAssets:        [],
  alerts:           [],
  zones:            [],
  roiHistory:       [],
  searchEfficiency: { avgDuration: 'N/A', successRate: 'N/A', accuracyScore: 'N/A', timeToAsset: 'N/A', confidence: 'N/A' },
  pilotMetrics:     { coverageZones: 0, assetCount: 0, movementEvents: '0', recoveryExamples: 0, searchReduction: 'N/A', nursingEfficiency: 'N/A' },
  workflowMetrics:  [],
  laborCalcParams:  { searchTimeBefore: 'N/A', searchTimeAfter: 'N/A', searchesPerDay: 'N/A', nursingHourlyRate: 'N/A' },
  pilotPhases:      [],
  manualStatusHistory: {
    totalChanges: 0, distinctAssets: 0, distinctStaff: 0,
    statusDist: [], transitions: [], topStaff: [], dailyTrend: [], recentActivity: [],
  },
  searchHistory: {
    totalSearches: 0, successful: 0, noResults: 0, distinctUsers: 0,
    successRate: 0, noResultsRate: 0,
    topSearchedTypes: [], sourceBreakdown: [], dailyTrend: [], recentSearches: [],
  },
})

// ─── Mini sparkline ───────────────────────────────────────────
const Sparkline = ({ values, color = C.teal, height = 36 }) => {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 80
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ─── Bar fill ─────────────────────────────────────────────────
const BarFill = ({ pct, color = C.teal, height = 6 }) => (
  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height, overflow: 'hidden' }}>
    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 1s ease' }} />
  </div>
)

// ─── Stat card ────────────────────────────────────────────────
const KPICard = ({ icon: Icon, label, value, sub, color = C.teal, trend, spark }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={17} color={color} />
      </div>
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: trend >= 0 ? C.teal : C.alert }}>
          {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(trend)}%
        </div>
      )}
      {spark && <Sparkline values={spark} color={color} />}
    </div>
    <div>
      <div style={{ color: C.white, fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ color: C.mist, fontSize: 12, marginTop: 3 }}>{label}</div>
      {sub && <div style={{ color: '#4a5568', fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
)

// ─── Section header ───────────────────────────────────────────
const SectionHeader = ({ title, sub, action }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
    <div>
      <h2 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p style={{ color: C.mist, fontSize: 12, margin: '3px 0 0' }}>{sub}</p>}
    </div>
    {action}
  </div>
)

// ─── Alert badge ─────────────────────────────────────────────
const sevColor = { high: C.alert, medium: C.gold, low: C.mist }
const sevBg    = { high: 'rgba(255,94,58,0.1)', medium: 'rgba(247,201,75,0.1)', low: 'rgba(136,152,180,0.08)' }

// ─── ROI bar chart ────────────────────────────────────────────
const ROIChart = ({ data }) => {
  if (!data.length) return (
    <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a5568', fontSize: 13 }}>
      No ROI data available
    </div>
  )
  const maxVal = Math.max(...data.map(d => d.savings + d.purchases))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 110, padding: '0 4px' }}>
      {data.map((d, i) => {
        const savH = (d.savings / maxVal) * 100
        const purH = (d.purchases / maxVal) * 100
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 88 }}>
              <div style={{ flex: 1, height: `${savH}%`, background: `linear-gradient(180deg, ${C.teal}, rgba(0,217,166,0.4))`, borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease' }} />
              <div style={{ flex: 1, height: `${purH}%`, background: `linear-gradient(180deg, ${C.cyan}, rgba(10,184,255,0.3))`, borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease' }} />
            </div>
            <span style={{ color: C.mist, fontSize: 10, fontWeight: 600 }}>{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Radial gauge ────────────────────────────────────────────
const Gauge = ({ value, max = 100, color = C.teal, size = 80 }) => {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const pct = value / max
  const startAngle = 135
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"
        strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round"
        transform={`rotate(${startAngle} ${size/2} ${size/2})`} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${circ * 0.75 * pct} ${circ}`} strokeLinecap="round"
        transform={`rotate(${startAngle} ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill={C.white} fontSize={size * 0.2} fontWeight="800">{value}%</text>
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────
const RANGES = ['Daily', 'Weekly', 'Monthly', 'Quarterly']

export default function ILocateDashboard() {
  const [data, setData]               = useState(emptyData)
  const [cache, setCache]             = useState({})          // { Daily: payload, … }
  const [loadingSet, setLoadingSet]   = useState(new Set(RANGES))
  const [apiSource, setApiSource]     = useState('connecting')
  const [timeRange, setTimeRange]     = useState('Monthly')
  const [filterStatus, setFilterStatus] = useState(null)

  // When cache updates or user switches range → swap displayed data instantly
  useEffect(() => {
    if (cache[timeRange]) {
      setData(cache[timeRange])
      setApiSource('live')
    }
  }, [cache, timeRange])

  // Preload all 4 ranges in parallel, refresh on interval
  useEffect(() => {
    // Empty string = same-origin (Next.js API route). Falls back to standalone Express for Vite.
    const API        = process.env.NEXT_PUBLIC_ILOCATE_API_URL ?? ''
    const INTERVAL_MS = Number(process.env.NEXT_PUBLIC_ILOCATE_REFRESH_MS) || 30000

    const fetchAll = () => {
      setLoadingSet(new Set(RANGES))
      let anySuccess = false

      const promises = RANGES.map(r =>
        fetch(`${API}/api/ilocate/dashboard?range=${r.toLowerCase()}`)
          .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() })
          .then(d => {
            setCache(prev => ({ ...prev, [r]: d }))
            setLoadingSet(prev => { const s = new Set(prev); s.delete(r); return s })
            anySuccess = true
          })
          .catch(err => {
            console.warn(`[iLocate API] ${r}:`, err.message)
            setLoadingSet(prev => { const s = new Set(prev); s.delete(r); return s })
          })
      )

      Promise.all(promises).then(() => {
        if (!anySuccess) { setData(emptyData()); setApiSource('unavailable') }
      })
    }

    fetchAll()
    const timer = setInterval(fetchAll, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])
  const [tab, setTab] = useState('executive')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const tabs = [
    { id: 'executive',  label: 'Executive',       icon: TrendingUp },
    { id: 'operations', label: 'Operations',      icon: Activity   },
    { id: 'assets',     label: 'Assets',          icon: Package    },
    { id: 'nursing',    label: 'Nursing',         icon: Users      },
    { id: 'pilot',      label: 'Pilot Report',    icon: BarChart2  },
    { id: 'activity',   label: 'Status Activity', icon: History    },
    { id: 'search',     label: 'Search Analytics',icon: Search     },
  ]

  const card = (children, style = {}) => (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', ...style }}>
      {children}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, Outfit, sans-serif', color: C.white }}>

      {/* ── Top Bar ──────────────────────────────────────────── */}
      <div style={{ background: 'rgba(10,15,30,0.95)', borderBottom: `1px solid ${C.border}`, padding: '0 32px', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.teal}, ${C.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={16} color="#0a0f1e" />
            </div>
            <div>
              <span style={{ color: C.white, fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>iLocate</span>
              <span style={{ color: C.mist, fontSize: 12, marginLeft: 8 }}>Asset Intelligence Platform</span>
            </div>
          </div>

          {/* Live indicator + time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {apiSource === 'live' && <>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.teal, boxShadow: `0 0 6px ${C.teal}`, animation: 'pulse 2s infinite' }} />
                <span style={{ color: C.teal, fontSize: 12, fontWeight: 600 }}>Live · DB</span>
              </>}
              {apiSource === 'unavailable' && <>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.alert }} />
                <span style={{ color: C.alert, fontSize: 12, fontWeight: 600 }}>API Unavailable</span>
              </>}
              {apiSource === 'connecting' && <>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.mist }} />
                <span style={{ color: C.mist, fontSize: 12, fontWeight: 600 }}>Connecting…</span>
              </>}
              <span style={{ color: C.mist, fontSize: 12 }}>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Time range */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3, gap: 2 }}>
              {RANGES.map(r => {
                const isActive  = timeRange === r
                const isLoading = loadingSet.has(r)
                return (
                  <button key={r} onClick={() => setTimeRange(r)} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    background: isActive ? C.teal : 'transparent',
                    color: isActive ? '#0a0f1e' : C.mist,
                    transition: 'all 0.2s',
                  }}>
                    {isLoading && (
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: isActive ? '#0a0f1e' : C.mist, opacity: 0.5, animation: 'pulse 1s infinite', display: 'inline-block' }} />
                    )}
                    {r}
                  </button>
                )
              })}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.mist }}>
                <Bell size={15} />
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: C.teal, color: '#0a0f1e', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                <Download size={13} /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Tab nav — scrollable so all 7 tabs stay accessible */}
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '10px 12px',
              background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              color: tab === id ? C.teal : C.mist,
              borderBottom: `2px solid ${tab === id ? C.teal : 'transparent'}`,
              transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 32px 60px' }}>

        {/* ── EXECUTIVE TAB ─────────────────────────────────── */}
        {tab === 'executive' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Hero KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              <KPICard icon={Package}    label="Total Tracked Assets"    value={data.kpi.totalAssets}     color={C.teal}   />
              <KPICard icon={Activity}   label="Active Assets (Moving)"  value={data.kpi.activeAssets}    color={C.cyan}   />
              <KPICard icon={Zap}        label="Utilization Rate"        value={data.kpi.utilizationRate} color={C.purple} />
              <KPICard icon={AlertCircle}label="Assets Potentially Lost" value={data.kpi.lostAssets}      color={C.alert}  />
            </div>

            {/* ROI cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              <KPICard icon={TrendingUp} label="Est. Monthly Labor Savings"  value={data.kpi.laborSavingsMonthly}  color={C.teal}   trend={6}  sub="Based on 68% search time reduction" />
              <KPICard icon={Shield}     label="Est. Annual Labor Savings"   value={data.kpi.laborSavingsAnnual}   color={C.cyan}   trend={6}  sub="vs. pre-iLocate baseline" />
              <KPICard icon={Box}        label="Avoided Equipment Purchases" value={data.kpi.avoidedPurchases}     color={C.gold}   trend={22} sub="Estimated this fiscal year" />
            </div>

            {/* Main content row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* ROI Chart */}
              {card(
                <>
                  <SectionHeader title="ROI Trend" sub="Labor savings + purchase avoidance (6 months)"
                    action={
                      <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.teal }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.teal }} />Labor Savings</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.cyan }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.cyan }} />Avoided Purchases</span>
                      </div>
                    }
                  />
                  <ROIChart data={data.roiHistory} />
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    {[
                      { label: 'Search Time Reduction', value: data.kpi.searchTimeReduction, color: C.teal },
                      { label: 'Availability Score',    value: `${data.kpi.availabilityScore}%`, color: C.cyan },
                      { label: 'Distribution Eff.',     value: data.kpi.distributionEff, color: C.purple },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ color, fontSize: 20, fontWeight: 800 }}>{value}</div>
                        <div style={{ color: C.mist, fontSize: 11, marginTop: 2 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Gauges + availability */}
              {card(
                <>
                  <SectionHeader title="System Health Scores" sub="Real-time performance indicators" />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
                    {[
                      { label: 'Availability', val: data.healthScores.availability, color: C.teal   },
                      { label: 'Distribution', val: data.healthScores.distribution, color: C.cyan   },
                      { label: 'Utilization',  val: data.healthScores.utilization,  color: C.purple },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <Gauge value={val} color={color} size={78} />
                        <span style={{ color: C.mist, fontSize: 11, fontWeight: 600 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Active Assets',    val: data.kpi.totalAssets ? (data.kpi.activeAssets   / data.kpi.totalAssets * 100).toFixed(0) : 0, color: C.teal   },
                      { label: 'High Utilization', val: data.healthScores.highUtilPct,                                                                              color: C.cyan   },
                      { label: 'Low Utilization',  val: data.healthScores.lowUtilPct,                                                                               color: C.gold   },
                      { label: 'Idle Assets',      val: data.kpi.totalAssets ? (data.kpi.inactiveAssets / data.kpi.totalAssets * 100).toFixed(0) : 0,               color: C.alert  },
                    ].map(({ label, val, color }) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: C.mist, fontSize: 12 }}>{label}</span>
                          <span style={{ color, fontSize: 12, fontWeight: 700 }}>{val}%</span>
                        </div>
                        <BarFill pct={Number(val)} color={color} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Alerts */}
            {card(
              <>
                <SectionHeader title="Active Alerts" sub={`${data.alerts.length} alerts require attention`}
                  action={<button style={{ color: C.teal, background: 'none', border: 'none', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>View All</button>} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {data.alerts.length === 0 && <p style={{ color: '#4a5568', fontSize: 13, margin: 0, textAlign: 'center', padding: '16px 0' }}>No alerts — API unavailable</p>}
                  {(data.alerts || []).map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: sevBg[a.sev], border: `1px solid ${sevColor[a.sev]}22` }}>
                      <AlertTriangle size={15} color={sevColor[a.sev]} style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{a.msg}</div>
                        <div style={{ color: C.mist, fontSize: 11, marginTop: 1 }}>{a.zone}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ background: `${sevColor[a.sev]}18`, color: sevColor[a.sev], fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase' }}>{a.sev}</span>
                        <span style={{ color: C.mist, fontSize: 11 }}>{a.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── OPERATIONS TAB ───────────────────────────────── */}
        {tab === 'operations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Zone activity table */}
            {card(
              <>
                <SectionHeader title="Zone Activity Dashboard" sub="Movement frequency, dwell time and efficiency by zone" />
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.25)' }}>
                      {['Zone', 'Traffic Volume', 'Avg Dwell Time', 'Efficiency Score', 'Status'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#4a5568', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.zones.map((z, i) => {
                      const effColor = z.efficiency >= 80 ? C.teal : z.efficiency >= 60 ? C.gold : C.alert
                      return (
                        <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '12px 14px', color: C.white, fontWeight: 600, fontSize: 13 }}>{z.name}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                              background: z.traffic === 'High' ? 'rgba(0,217,166,0.12)' : z.traffic === 'Medium' ? 'rgba(247,201,75,0.1)' : 'rgba(136,152,180,0.1)',
                              color: z.traffic === 'High' ? C.teal : z.traffic === 'Medium' ? C.gold : C.mist,
                            }}>{z.traffic}</span>
                          </td>
                          <td style={{ padding: '12px 14px', color: C.mist, fontSize: 13 }}>{z.dwell}</td>
                          <td style={{ padding: '12px 14px', width: 160 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <BarFill pct={z.efficiency} color={effColor} height={5} />
                              <span style={{ color: effColor, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{z.efficiency}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 11, color: effColor }}>{z.efficiency >= 80 ? '✓ Optimal' : z.efficiency >= 60 ? '⚠ Review' : '✗ Issue'}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </>
            )}

            {/* Department utilization */}
            {card(
              <>
                <SectionHeader title="Department Utilization & Hoarding Detection"
                  sub="Departments with excessive retention are flagged automatically" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                  {data.departments.map((d, i) => (
                    <div key={i} style={{
                      padding: '14px 16px', borderRadius: 10,
                      background: d.hoarding ? 'rgba(255,94,58,0.06)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${d.hoarding ? 'rgba(255,94,58,0.2)' : C.border}`,
                      display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: `${d.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Building2 size={16} color={d.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{d.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {d.hoarding && <span style={{ fontSize: 10, fontWeight: 700, color: C.alert, background: 'rgba(255,94,58,0.12)', padding: '2px 7px', borderRadius: 99 }}>HOARDING</span>}
                            <span style={{ color: d.color, fontWeight: 700, fontSize: 13 }}>{d.utilization}%</span>
                          </div>
                        </div>
                        <BarFill pct={d.utilization} color={d.hoarding ? C.alert : d.color} />
                        <div style={{ color: C.mist, fontSize: 11, marginTop: 4 }}>{d.assets} assets tracked</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ASSETS TAB ────────────────────────────────────── */}
        {tab === 'assets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              <KPICard icon={Package}     label="Total Assets"       value={data.kpi.totalAssets}         color={C.teal}   />
              <KPICard icon={Zap}         label="High Utilization"   value={data.kpi.highUtilization}     color={C.cyan}   sub="Frequent movement" />
              <KPICard icon={Battery}     label="Low / Idle"         value={data.kpi.lowIdle}             color={C.gold}   sub="Underused equipment" />
              <KPICard icon={AlertCircle} label="Potentially Lost"   value={data.kpi.lostAssets}          color={C.alert}  sub=">72h no movement" />
            </div>

            {card(
              <>
                <SectionHeader title="Asset Intelligence Table"
                  sub="Utilization classification based on motion-triggered telemetry"
                  action={
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {[
                        { key: null,     label: 'All',    color: C.mist  },
                        { key: 'high',   label: 'High',   color: C.teal  },
                        { key: 'normal', label: 'Normal', color: C.cyan  },
                        { key: 'low',    label: 'Low',    color: C.gold  },
                        { key: 'idle',   label: 'Idle',   color: C.alert },
                      ].map(({ key, label, color }) => {
                        const active = filterStatus === key
                        const cnt = key ? (data.topAssets || []).filter(a => a.status === key).length : (data.topAssets || []).length
                        return (
                          <button key={label} onClick={() => setFilterStatus(key)} style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '5px 11px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            border: `1px solid ${active ? color : C.border}`,
                            background: active ? `${color}18` : 'transparent',
                            color: active ? color : C.mist, transition: 'all 0.15s',
                          }}>
                            {label}
                            <span style={{ background: active ? `${color}30` : 'rgba(255,255,255,0.06)', borderRadius: 99, padding: '1px 6px', fontSize: 10 }}>{cnt}</span>
                          </button>
                        )
                      })}
                    </div>
                  }
                />
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.25)' }}>
                      {['Asset Type', 'Count', 'Utilization', 'Classification', 'Action'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#4a5568', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {((filterStatus ? (data.topAssets || []).filter(a => a.status === filterStatus) : (data.topAssets || []))).map((a, i) => {
                      const cls = { high: { label: 'High Utilization', color: C.teal }, normal: { label: 'Normal', color: C.cyan }, low: { label: 'Low Utilization', color: C.gold }, idle: { label: 'Idle', color: C.alert } }[a.status]
                      return (
                        <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '12px 14px', color: C.white, fontWeight: 600, fontSize: 13 }}>{a.name}</td>
                          <td style={{ padding: '12px 14px', color: C.mist, fontSize: 13 }}>{a.count}</td>
                          <td style={{ padding: '12px 14px', width: 140 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <BarFill pct={a.utilization} color={cls.color} height={5} />
                              <span style={{ color: cls.color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{a.utilization}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: `${cls.color}14`, color: cls.color }}>{cls.label}</span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {a.status === 'idle' && <span style={{ color: C.alert, fontSize: 11, cursor: 'pointer' }}>⚠ Redistribute</span>}
                            {a.status === 'low'  && <span style={{ color: C.gold,  fontSize: 11, cursor: 'pointer' }}>↩ Review</span>}
                            {a.status === 'high' && <span style={{ color: C.teal,  fontSize: 11 }}>✓ Optimal</span>}
                            {a.status === 'normal'&&<span style={{ color: C.cyan,  fontSize: 11 }}>✓ Normal</span>}
                          </td>
                        </tr>
                      )
                    })}
                    {(filterStatus ? (data.topAssets || []).filter(a => a.status === filterStatus) : (data.topAssets || [])).length === 0 && (
                      <tr><td colSpan={5} style={{ padding: '28px 14px', textAlign: 'center', color: '#4a5568', fontSize: 13 }}>
                        {data.topAssets.length === 0 ? 'No data — API unavailable' : 'No assets match the selected filter'}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </>
            )}

            {/* Purchase avoidance */}
            {card(
              <>
                <SectionHeader title="Equipment Purchase Avoidance Estimate"
                  sub="Assets identified as candidates for redistribution vs. new purchase" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                  {[
                    { label: 'Over-Purchased Asset Types',  value: `${data.kpi.overPurchasedTypes} types`,       desc: 'Asset types with avg utilization below 40%',  color: C.alert, icon: AlertTriangle },
                    { label: 'Redistributable Equipment',   value: `${data.kpi.redistributableUnits} units`,     desc: 'Can be moved from low- to high-demand areas', color: C.gold,  icon: RefreshCw    },
                    { label: 'Est. Avoided Purchase Value', value: data.kpi.avoidedPurchases,                    desc: 'Fiscal year to date',                         color: C.teal,  icon: TrendingUp   },
                  ].map(({ label, value, desc, color, icon: Icon }) => (
                    <div key={label} style={{ padding: '16px', borderRadius: 12, background: `${color}09`, border: `1px solid ${color}22` }}>
                      <Icon size={20} color={color} style={{ marginBottom: 10 }} />
                      <div style={{ color, fontSize: 22, fontWeight: 800 }}>{value}</div>
                      <div style={{ color: C.white, fontSize: 13, fontWeight: 600, margin: '4px 0 2px' }}>{label}</div>
                      <div style={{ color: C.mist, fontSize: 11 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── NURSING TAB ───────────────────────────────────── */}
        {tab === 'nursing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
              {[
                { icon: Clock,      label: 'Avg Search Duration', value: data.searchEfficiency.avgDuration,  color: C.teal   },
                { icon: CheckCircle,label: 'Successful Search Rate',value: data.searchEfficiency.successRate, color: C.cyan   },
                { icon: MapPin,     label: 'Proximity Accuracy',   value: data.searchEfficiency.accuracyScore,color: C.purple },
                { icon: Zap,        label: 'Time-to-Asset',        value: data.searchEfficiency.timeToAsset,  color: C.gold   },
                { icon: Shield,     label: 'Availability Conf.',   value: data.searchEfficiency.confidence,   color: C.teal   },
              ].map(p => <KPICard key={p.label} {...p} />)}
            </div>

            {card(
              <>
                <SectionHeader title="Workflow Impact" sub="Estimated improvements since iLocate deployment" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                  {(data.workflowMetrics || []).length === 0 && <p style={{ color: '#4a5568', fontSize: 13, margin: 0, gridColumn: '1/-1', textAlign: 'center', padding: '16px 0' }}>No data — API unavailable</p>}
                  {(data.workflowMetrics || []).map(({ metric, before, after, pct, color }) => (
                    <div key={metric} style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: C.white, fontWeight: 600, fontSize: 13 }}>{metric}</span>
                        <span style={{ color, fontWeight: 800, fontSize: 14 }}>↓{pct}%</span>
                      </div>
                      <BarFill pct={pct} color={color} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <span style={{ color: C.alert, fontSize: 11 }}>Before: {before}</span>
                        <span style={{ color: C.teal,  fontSize: 11 }}>After: {after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ROI labor calc */}
            {card(
              <>
                <SectionHeader title="Labor Savings Calculation" sub="ROI = (T_before − T_after) × Searches/Day × Hourly Rate × Days" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: C.border, borderRadius: 10, overflow: 'hidden' }}>
                  {[
                    { label: 'Search Time Before',  value: data.laborCalcParams.searchTimeBefore,  color: C.alert },
                    { label: 'Search Time After',   value: data.laborCalcParams.searchTimeAfter,   color: C.teal  },
                    { label: 'Searches / Day',      value: data.laborCalcParams.searchesPerDay,    color: C.cyan  },
                    { label: 'Nursing Hourly Rate', value: data.laborCalcParams.nursingHourlyRate, color: C.gold  },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: C.card, padding: '16px', textAlign: 'center' }}>
                      <div style={{ color, fontSize: 22, fontWeight: 800 }}>{value}</div>
                      <div style={{ color: C.mist, fontSize: 11, marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: '16px', borderRadius: 10, background: 'rgba(0,217,166,0.07)', border: `1px solid rgba(0,217,166,0.2)`, textAlign: 'center' }}>
                  <div style={{ color: C.mist, fontSize: 13, marginBottom: 6 }}>Estimated Annual Labor Savings</div>
                  <div style={{ color: C.teal, fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em' }}>{data.kpi.laborSavingsAnnual}</div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── PILOT TAB ─────────────────────────────────────── */}
        {tab === 'pilot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Pilot hero */}
            <div style={{ padding: '24px 28px', borderRadius: 16, background: `linear-gradient(135deg, rgba(0,217,166,0.1) 0%, rgba(10,184,255,0.08) 100%)`, border: `1px solid rgba(0,217,166,0.2)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.teal, boxShadow: `0 0 8px ${C.teal}` }} />
                <span style={{ color: C.teal, fontWeight: 700, fontSize: 13 }}>Pilot Program — Active</span>
              </div>
              <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 6px' }}>iLocate Pilot Success Report</h2>
              <p style={{ color: C.mist, fontSize: 14, margin: 0 }}>Motion-based accelerometer asset tracking — pilot-to-production justification metrics</p>
            </div>

            {/* Pilot KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { icon: MapPin,      label: 'Coverage Zones',         value: data.pilotMetrics.coverageZones,     color: C.teal   },
                { icon: Package,     label: 'Assets in Pilot',        value: data.pilotMetrics.assetCount,        color: C.cyan   },
                { icon: Activity,    label: 'Movement Events Captured',value: data.pilotMetrics.movementEvents,   color: C.purple },
                { icon: CheckCircle, label: 'Asset Recovery Examples', value: data.pilotMetrics.recoveryExamples, color: C.teal   },
                { icon: TrendingUp,  label: 'Search Time Reduction',   value: data.pilotMetrics.searchReduction,  color: C.gold   },
                { icon: Users,       label: 'Nursing Efficiency Gain', value: data.pilotMetrics.nursingEfficiency,color: C.cyan   },
              ].map(p => <KPICard key={p.label} {...p} />)}
            </div>

            {/* Expansion recommendations */}
            {card(
              <>
                <SectionHeader title="Expansion Recommendations" sub="Based on pilot data, the following are recommended for production rollout" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(data.pilotPhases || []).length === 0 && <p style={{ color: '#4a5568', fontSize: 13, margin: 0, textAlign: 'center', padding: '16px 0' }}>No data — API unavailable</p>}
                  {(data.pilotPhases || []).map(({ phase, desc, impact, status }) => {
                    const sc = { Ready: C.teal, Planned: C.cyan, Backlog: C.gold, Future: C.mist }[status]
                    const ic = { High: C.alert, Medium: C.gold, Low: C.teal }[impact]
                    return (
                      <div key={phase} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}` }}>
                        <span style={{ color: C.teal, fontWeight: 800, fontSize: 12, flexShrink: 0, minWidth: 56 }}>{phase}</span>
                        <span style={{ color: C.white, fontSize: 13, flex: 1 }}>{desc}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: `${ic}14`, color: ic, flexShrink: 0 }}>{impact} Impact</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: `${sc}14`, color: sc, flexShrink: 0 }}>{status}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* Export panel */}
            {card(
              <>
                <SectionHeader title="Executive Report Export" sub="Generate board-ready reports for pilot success justification" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {[
                    { label: 'Executive ROI Summary',    format: 'PDF',   icon: Download, color: C.alert  },
                    { label: 'Full Utilization Report',  format: 'Excel', icon: Download, color: C.green  },
                    { label: 'Raw Movement Data',        format: 'CSV',   icon: Download, color: C.cyan   },
                  ].map(({ label, format, icon: Icon, color }) => (
                    <button key={label} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                      borderRadius: 10, border: `1px solid ${color}28`, background: `${color}08`,
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color={color} />
                      </div>
                      <div>
                        <div style={{ color: C.white, fontWeight: 600, fontSize: 13 }}>{label}</div>
                        <div style={{ color, fontSize: 11, fontWeight: 700, marginTop: 2 }}>Export as {format}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ACTIVITY TAB ──────────────────────────────────── */}
        {tab === 'activity' && (() => {
          const msh = data.manualStatusHistory
          const STATUS_COLOR = {
            AVAILABLE:         C.teal,
            IN_USE:            C.cyan,
            NEEDS_CLEANING:    C.gold,
            UNDER_MAINTENANCE: C.purple,
            MARKED_MISSING:    C.alert,
          }
          const maxDaily = Math.max(...(msh.dailyTrend.map(d => d.count) || [1]), 1)

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* KPI row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <KPICard icon={History}      label="Status Changes"           value={msh.totalChanges}   color={C.teal}   sub={`in selected range`} />
                <KPICard icon={Package}      label="Assets Affected"          value={msh.distinctAssets} color={C.cyan}   />
                <KPICard icon={Users}        label="Staff Making Changes"     value={msh.distinctStaff}  color={C.purple} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Daily trend bar chart */}
                {card(<>
                  <SectionHeader title="Daily Change Volume" sub="Manual status updates over the last 14 days" />
                  {msh.dailyTrend.length === 0
                    ? <p style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', padding: '24px 0', margin: 0 }}>No data in range</p>
                    : <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, paddingTop: 8 }}>
                        {msh.dailyTrend.map((d, i) => (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{
                              width: '100%',
                              height: `${Math.max((d.count / maxDaily) * 88, 4)}px`,
                              background: `linear-gradient(180deg, ${C.teal}, rgba(0,217,166,0.35))`,
                              borderRadius: '4px 4px 0 0',
                              transition: 'height 0.6s ease',
                            }} />
                            <span style={{ color: C.mist, fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap' }}>{d.day}</span>
                          </div>
                        ))}
                      </div>
                  }
                </>)}

                {/* Status distribution */}
                {card(<>
                  <SectionHeader title="Status Distribution" sub="What statuses are being assigned" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {msh.statusDist.length === 0
                      ? <p style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', padding: '16px 0', margin: 0 }}>No data</p>
                      : msh.statusDist.map(({ status, count }) => {
                          const color = STATUS_COLOR[status] ?? C.mist
                          const total = msh.statusDist.reduce((s, r) => s + r.count, 0) || 1
                          return (
                            <div key={status}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>
                                  {status.replace(/_/g, ' ')}
                                </span>
                                <span style={{ color, fontSize: 12, fontWeight: 700 }}>
                                  {count} <span style={{ color: C.mist, fontWeight: 400 }}>({Math.round(count / total * 100)}%)</span>
                                </span>
                              </div>
                              <BarFill pct={count / total * 100} color={color} height={5} />
                            </div>
                          )
                        })
                    }
                  </div>
                </>)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Top transitions */}
                {card(<>
                  <SectionHeader title="Common Transitions" sub="Most frequent status changes (from → to)" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {msh.transitions.length === 0
                      ? <p style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', padding: '16px 0', margin: 0 }}>No data</p>
                      : msh.transitions.map(({ from, to, count }, i) => {
                          const fromColor = STATUS_COLOR[from] ?? C.mist
                          const toColor   = STATUS_COLOR[to]   ?? C.mist
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: `${fromColor}18`, color: fromColor, flexShrink: 0 }}>
                                {(from ?? '—').replace(/_/g, ' ')}
                              </span>
                              <span style={{ color: C.mist, fontSize: 12 }}>→</span>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: `${toColor}18`, color: toColor, flexShrink: 0 }}>
                                {to.replace(/_/g, ' ')}
                              </span>
                              <span style={{ color: C.mist, fontSize: 12, marginLeft: 'auto', fontWeight: 600 }}>{count}×</span>
                            </div>
                          )
                        })
                    }
                  </div>
                </>)}

                {/* Most active staff */}
                {card(<>
                  <SectionHeader title="Most Active Staff" sub="Who is logging the most status changes" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {msh.topStaff.length === 0
                      ? <p style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', padding: '16px 0', margin: 0 }}>No data</p>
                      : msh.topStaff.map(({ name, count }, i) => {
                          const maxCount = msh.topStaff[0]?.count || 1
                          const colors   = [C.teal, C.cyan, C.purple, C.gold, C.alert]
                          const color    = colors[i % colors.length]
                          return (
                            <div key={name}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{name}</span>
                                <span style={{ color, fontSize: 12, fontWeight: 700 }}>{count}</span>
                              </div>
                              <BarFill pct={count / maxCount * 100} color={color} height={5} />
                            </div>
                          )
                        })
                    }
                  </div>
                </>)}
              </div>

              {/* Recent activity feed */}
              {card(<>
                <SectionHeader title="Recent Activity" sub="Latest manual status changes across all assets" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {msh.recentActivity.length === 0
                    ? <p style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', padding: '16px 0', margin: 0 }}>No recent activity</p>
                    : msh.recentActivity.map(({ from, to, reason, who, time }, i) => {
                        const toColor = STATUS_COLOR[to] ?? C.mist
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.025)', borderLeft: `3px solid ${toColor}` }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ color: C.mist, fontSize: 11 }}>{(from ?? '—').replace(/_/g, ' ')}</span>
                                <span style={{ color: C.mist, fontSize: 11 }}>→</span>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 99, background: `${toColor}18`, color: toColor }}>
                                  {to.replace(/_/g, ' ')}
                                </span>
                              </div>
                              {reason && <div style={{ color: C.mist, fontSize: 11, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reason}</div>}
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ color: C.white, fontSize: 11, fontWeight: 600 }}>{who}</div>
                              <div style={{ color: C.mist, fontSize: 10, marginTop: 1 }}>{time}</div>
                            </div>
                          </div>
                        )
                      })
                  }
                </div>
              </>)}

            </div>
          )
        })()}

        {/* ── SEARCH ANALYTICS TAB ──────────────────────────── */}
        {tab === 'search' && (() => {
          const sh = data.searchHistory
          const totalSrc = sh.sourceBreakdown.reduce((s, r) => s + r.count, 0) || 1
          const maxDay   = Math.max(...sh.dailyTrend.map(d => d.count), 1)
          const maxType  = Math.max(...sh.topSearchedTypes.map(t => t.count), 1)

          const srcColor = { mobile: C.teal, web: C.cyan, kiosk: C.purple, api: C.gold, desktop: C.mist }

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* ── KPI row ─────────────────────────────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                <KPICard icon={Search}      label="Total Searches"   value={sh.totalSearches.toLocaleString()} color={C.teal}   />
                <KPICard icon={CheckCircle} label="Success Rate"     value={`${sh.successRate}%`}             color={C.cyan}   sub={`${sh.successful.toLocaleString()} found`} />
                <KPICard icon={AlertCircle} label="No-Results Rate"  value={`${sh.noResultsRate}%`}           color={sh.noResultsRate > 15 ? C.alert : C.gold} sub={`${sh.noResults} searches returned nothing`} />
                <KPICard icon={Users}       label="Top Source"       value={sh.sourceBreakdown[0]?.source ?? '—'} color={C.purple} sub={`${sh.sourceBreakdown[0]?.count ?? 0} searches`} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* ── Most searched assets ──────────────────── */}
                {card(<>
                  <SectionHeader title="Most Searched Assets" sub="Ranked by search volume within the selected period" />

                  {sh.topSearchedTypes.length === 0
                    ? <p style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', padding: '24px 0', margin: 0 }}>No search data available</p>
                    : sh.topSearchedTypes.map((t, i) => {
                      const successColor = t.successRate >= 80 ? C.teal : t.successRate >= 60 ? C.gold : C.alert
                      return (
                        <div key={t.name} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: C.mist, fontSize: 11, fontWeight: 700, width: 18 }}>{i + 1}</span>
                              <span style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ fontSize: 11, color: successColor, fontWeight: 700 }}>{t.successRate}% found</span>
                              <span style={{ fontSize: 12, color: C.mist, fontWeight: 600 }}>{t.count}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            {/* Volume bar */}
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                              <div style={{ width: `${(t.count / maxType) * 100}%`, height: '100%', background: C.teal, borderRadius: 99, transition: 'width 0.8s ease' }} />
                            </div>
                            {t.noResults > 0 && (
                              <span style={{ fontSize: 10, color: C.alert, marginLeft: 4 }}>{t.noResults} no-result</span>
                            )}
                          </div>
                        </div>
                      )
                    })
                  }
                </>)}

                {/* ── Source breakdown ─────────────────────── */}
                {card(<>
                  <SectionHeader title="Search Source Breakdown" sub="Where staff are initiating searches from" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {sh.sourceBreakdown.length === 0
                      ? <p style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', padding: '24px 0', margin: 0 }}>No data</p>
                      : sh.sourceBreakdown.map(s => {
                        const pct   = Math.round((s.count / totalSrc) * 100)
                        const color = srcColor[s.source] ?? C.mist
                        return (
                          <div key={s.source}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                                <span style={{ color: C.white, fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{s.source}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ color, fontSize: 12, fontWeight: 700 }}>{pct}%</span>
                                <span style={{ color: C.mist, fontSize: 12 }}>{s.count.toLocaleString()}</span>
                              </div>
                            </div>
                            <BarFill pct={pct} color={color} height={7} />
                          </div>
                        )
                      })
                    }

                    {/* Success / no-results summary */}
                    <div style={{ marginTop: 8, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      {[
                        { label: 'Successful',  value: sh.successful,  color: C.teal  },
                        { label: 'Failed',       value: sh.totalSearches - sh.successful - sh.noResults, color: C.gold  },
                        { label: 'No Results',   value: sh.noResults,   color: C.alert },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 10, background: `${color}09`, border: `1px solid ${color}22` }}>
                          <div style={{ color, fontSize: 20, fontWeight: 800 }}>{value.toLocaleString()}</div>
                          <div style={{ color: C.mist, fontSize: 11, marginTop: 3 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>)}
              </div>

              {/* ── Daily search volume trend ─────────────────── */}
              {card(<>
                <SectionHeader title="Daily Search Volume" sub="Search activity over the last 14 days" />
                {sh.dailyTrend.length === 0
                  ? <p style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', padding: '24px 0', margin: 0 }}>No trend data</p>
                  : <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90, paddingTop: 4 }}>
                      {sh.dailyTrend.map((d, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
                          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                            <div style={{
                              width: '100%',
                              height: `${Math.max((d.count / maxDay) * 100, 4)}%`,
                              background: `linear-gradient(180deg, ${C.teal}, rgba(0,217,166,0.35))`,
                              borderRadius: '4px 4px 0 0',
                              transition: 'height 0.8s ease',
                              position: 'relative',
                            }}>
                              <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', color: C.mist, fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {d.count}
                              </div>
                            </div>
                          </div>
                          <span style={{ color: C.mist, fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis' }}>
                            {d.day.split(' ')[1] /* show just the day number */}
                          </span>
                        </div>
                      ))}
                    </div>
                }
                {sh.dailyTrend.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: C.mist, fontSize: 11 }}>{sh.dailyTrend[0]?.day}</span>
                    <span style={{ color: C.mist, fontSize: 11 }}>{sh.dailyTrend[sh.dailyTrend.length - 1]?.day}</span>
                  </div>
                )}
              </>)}

              {/* ── Recent searches feed ─────────────────────── */}
              {card(<>
                <SectionHeader title="Recent Searches" sub="Last 25 search events — live from asset_search_history" />
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.25)' }}>
                      {['Asset Searched', 'Source', 'Result', 'Location', 'Last Seen Filter', 'When'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '9px 14px', color: '#4a5568', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sh.recentSearches.length === 0
                      ? <tr><td colSpan={6} style={{ padding: '28px', textAlign: 'center', color: '#4a5568', fontSize: 13 }}>No recent searches</td></tr>
                      : sh.recentSearches.map((s, i) => {
                        const resultColor  = s.success ? C.teal : s.noResults ? C.alert : C.gold
                        const resultLabel  = s.success ? 'Found' : s.noResults ? 'No Results' : 'Failed'
                        const sourceColor  = srcColor[s.source] ?? C.mist
                        return (
                          <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '10px 14px', color: C.white, fontSize: 13, fontWeight: 600 }}>{s.term}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: `${sourceColor}14`, color: sourceColor, textTransform: 'capitalize' }}>
                                {s.source}
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: `${resultColor}14`, color: resultColor }}>
                                {resultLabel}
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px', color: C.mist, fontSize: 12 }}>{s.location}</td>
                            <td style={{ padding: '10px 14px', color: C.mist, fontSize: 12 }}>{s.lastSeen}</td>
                            <td style={{ padding: '10px 14px', color: C.mist, fontSize: 12 }}>{s.time}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </>)}

            </div>
          )
        })()}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media(max-width:900px){
          .ilocate-grid-4{grid-template-columns:repeat(2,1fr)!important;}
          .ilocate-grid-3{grid-template-columns:1fr!important;}
        }
      `}</style>
    </div>
  )
}
