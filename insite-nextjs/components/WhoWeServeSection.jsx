'use client'
const personas = [
  {
    emoji: '👩‍⚕️',
    role: 'For Nurses',
    title: 'Find Equipment Instantly',
    color: '#0ab8ff',
    bg: 'rgba(10,184,255,0.06)',
    border: 'rgba(10,184,255,0.2)',
    points: [
      'Instant equipment lookup by type or name',
      'Mobile app - search from any device',
      'Real-time availability status per floor',
      'Reduce documentation burden by 40%',
    ],
  },
  {
    emoji: '🏗️',
    role: 'For Facilities & Ops',
    title: 'Total Facility Visibility',
    color: '#00d9a6',
    bg: 'rgba(0,217,166,0.06)',
    border: 'rgba(0,217,166,0.2)',
    points: [
      '24/7 visibility across all departments',
      'Automated maintenance trigger alerts',
      'Loss prevention & theft detection',
      'Right-size your equipment fleet',
    ],
  },
  {
    emoji: '📈',
    role: 'For Executives',
    title: 'ROI in Days, Not Quarters',
    color: '#f7c94b',
    bg: 'rgba(247,201,75,0.06)',
    border: 'rgba(247,201,75,0.2)',
    points: [
      'Executive ROI dashboards & reports',
      'One-click data exports for board decks',
      'Industry benchmarks & comparisons',
      'Full audit trails for compliance',
    ],
  },
]

export default function WhoWeServeSection() {
  return (
    <section style={{ padding: '100px 0', background: '#070c19' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(10,184,255,0.1)', border: '1px solid rgba(10,184,255,0.2)',
            padding: '5px 14px', borderRadius: 100, marginBottom: 16,
          }}>
            <span style={{ color: '#0ab8ff', fontSize: 12, fontWeight: 700 }}>WHO WE SERVE</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
            Built for Every Role
          </h2>
          <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
            InSite delivers the right information to the right person — whether they're on the floor or in the boardroom.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {personas.map(p => (
            <div key={p.role} style={{
              background: p.bg,
              border: `1px solid ${p.border}`,
              borderRadius: 20, padding: '32px 28px',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{p.emoji}</div>
              <div style={{
                color: p.color, fontSize: 12, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
              }}>
                {p.role}
              </div>
              <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.02em' }}>
                {p.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {p.points.map(pt => (
                  <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: '50%', marginTop: 1,
                      background: `rgba(${p.color === '#0ab8ff' ? '10,184,255' : p.color === '#00d9a6' ? '0,217,166' : '247,201,75'},0.15)`,
                      border: `1px solid ${p.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: p.color, fontSize: 10,
                    }}>✓</span>
                    <span style={{ color: '#c8d5e8', fontSize: 14, lineHeight: 1.55 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
