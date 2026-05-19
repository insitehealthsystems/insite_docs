'use client'
import { useScrollReveal } from '../hooks/useScrollReveal'

const personas = [
  {
    emoji: '👩‍⚕️',
    role: 'For Nurses',
    title: 'Find Equipment Instantly',
    color: '#0ab8ff',
    border: 'rgba(10,184,255,0.2)',
    bg: 'rgba(10,184,255,0.05)',
    rgb: '10,184,255',
    points: [
      'Instant nearest-equipment lookup from any device',
      'Real-time availability status per floor and zone',
      'Mobile-first app — search from the bedside',
      'Reduce documentation burden by up to 40%',
    ],
  },
  {
    emoji: '🏗️',
    role: 'For Facilities & Ops',
    title: 'Total Facility Visibility',
    color: '#00d9a6',
    border: 'rgba(0,217,166,0.2)',
    bg: 'rgba(0,217,166,0.05)',
    rgb: '0,217,166',
    points: [
      '24/7 live visibility across all departments',
      'Automated maintenance trigger alerts',
      'Loss prevention and theft detection',
      'Right-size your entire equipment fleet',
    ],
  },
  {
    emoji: '📈',
    role: 'For Executives',
    title: 'ROI in Days, Not Quarters',
    color: '#f7c94b',
    border: 'rgba(247,201,75,0.2)',
    bg: 'rgba(247,201,75,0.05)',
    rgb: '247,201,75',
    points: [
      'Executive ROI dashboards and board-ready reports',
      'One-click exports for compliance and audits',
      'Industry benchmarks and peer comparisons',
      'Full audit trail for regulatory requirements',
    ],
  },
]

const CheckMark = ({ rgb }) => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
    <path d="M1 4L3.5 6.5L9 1" stroke={`rgb(${rgb})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PersonaCard = ({ p, delay }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        background: p.bg, border: `1px solid ${p.border}`, borderRadius: 20, padding: '32px 28px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms, box-shadow 0.25s ease, transform 0.25s ease`,
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 56px rgba(0,0,0,0.3)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ fontSize: 38, marginBottom: 18 }}>{p.emoji}</div>
      <div style={{ color: p.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{p.role}</div>
      <h3 style={{
        color: '#fff', fontSize: 21, fontWeight: 700, marginBottom: 20,
        fontFamily: 'Bricolage Grotesque, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2,
      }}>{p.title}</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {p.points.map(pt => (
          <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%', marginTop: 2, flexShrink: 0,
              background: `rgba(${p.rgb},0.12)`, border: `1px solid ${p.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckMark rgb={p.rgb} />
            </span>
            <span style={{ color: '#c8d5e8', fontSize: 14, lineHeight: 1.6 }}>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const WhyChoose = () => {
  const [headerRef, headerVisible] = useScrollReveal()
  return (
    <section style={{ padding: '100px 0', background: '#070c19' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div
          ref={headerRef}
          style={{
            textAlign: 'center', marginBottom: 64,
            opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(10,184,255,0.08)', border: '1px solid rgba(10,184,255,0.22)',
            padding: '5px 16px', borderRadius: 100, marginBottom: 18,
          }}>
            <span style={{ color: '#0ab8ff', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>WHO WE SERVE</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#fff', marginBottom: 16,
            lineHeight: 1.15, fontFamily: 'Bricolage Grotesque, sans-serif',
            fontWeight: 800, letterSpacing: '-0.03em',
          }}>
            Built for Every Role
          </h2>
          <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            InSite delivers the right information to the right person — whether on the floor or in the boardroom.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
          {personas.map((p, idx) => (
            <PersonaCard key={p.role} p={p} delay={idx * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChoose
