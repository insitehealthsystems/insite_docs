import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const features = [
  {
    icon: '📡', title: 'Asset Tracking',
    tagline: 'Find anything in under 3 seconds',
    desc: 'Sub-room BLE + RFID precision for every critical asset. Know exactly where every piece of equipment is in real time.',
    color: '#00d9a6', border: 'rgba(0,217,166,0.22)', bg: 'rgba(0,217,166,0.05)',
    link: '/services/asset-tracking',
  },
  {
    icon: '🔒', title: 'Mobile Security',
    tagline: 'HIPAA-compliant end-to-end',
    desc: 'AES-256 encryption on every device. Remote lock, wipe, and geo-fence alerts keep patient data protected at all times.',
    color: '#0ab8ff', border: 'rgba(10,184,255,0.22)', bg: 'rgba(10,184,255,0.05)',
    link: '/services/mobile-security',
  },
  {
    icon: '📊', title: 'Capital Planning',
    tagline: 'Stop buying what you already own',
    desc: 'Real utilization data proves when you actually need more equipment. Right-size your fleet and reduce capital spend by up to 20%.',
    color: '#f7c94b', border: 'rgba(247,201,75,0.22)', bg: 'rgba(247,201,75,0.05)',
    link: '/services/capital-planning',
  },
  {
    icon: '🏥', title: 'Site Monitoring',
    tagline: 'Full campus operational oversight',
    desc: 'Environmental monitoring, access control, and maintenance triggers across every zone — temperature, humidity, and beyond.',
    color: '#ff5e3a', border: 'rgba(255,94,58,0.22)', bg: 'rgba(255,94,58,0.05)',
    link: '/services/site-monitoring',
  },
]

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const FeatureCard = ({ f, delay }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      className="card-gradient-border"
      style={{
        background: f.bg, border: `1px solid ${f.border}`, borderRadius: 16, padding: '30px 26px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms, box-shadow 0.25s ease, border-color 0.25s ease`,
        display: 'flex', flexDirection: 'column', cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.35)`
        e.currentTarget.style.borderColor = f.color.replace(')', ', 0.4)').replace('rgb', 'rgba') || f.border
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = f.border
      }}
    >
      {/* Icon wrapper */}
      <div style={{
        width: 54, height: 54, borderRadius: 14,
        background: f.bg, border: `1px solid ${f.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 20,
      }}>
        {f.icon}
      </div>

      {/* Tagline */}
      <div style={{ color: f.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {f.tagline}
      </div>

      {/* Title */}
      <h3 style={{
        color: '#fff', fontSize: 19, fontWeight: 700, marginBottom: 12,
        fontFamily: 'Bricolage Grotesque, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.25,
      }}>{f.title}</h3>

      {/* Description */}
      <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.75, flex: 1 }}>{f.desc}</p>

      {/* Learn more link */}
      <Link
        to={f.link}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 22,
          color: f.color, textDecoration: 'none', fontSize: 13, fontWeight: 600,
          transition: 'gap 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.gap = '10px' }}
        onMouseLeave={e => { e.currentTarget.style.gap = '6px' }}
      >
        Learn more <ArrowIcon />
      </Link>
    </div>
  )
}

const Features = () => {
  const [headerRef, headerVisible] = useScrollReveal()

  return (
    <section style={{ padding: '100px 0', background: '#070c19' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <div
          ref={headerRef}
          style={{
            textAlign: 'center', marginBottom: 64,
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.2)',
            padding: '5px 16px', borderRadius: 100, marginBottom: 18,
          }}>
            <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>OUR SOLUTIONS</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#fff', marginBottom: 16,
            lineHeight: 1.15, fontFamily: 'Bricolage Grotesque, sans-serif',
            fontWeight: 800, letterSpacing: '-0.03em',
          }}>
            Everything Your Facility Needs
          </h2>
          <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Four integrated modules that work together to eliminate equipment chaos and deliver complete operational visibility.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 22 }}>
          {features.map((f, idx) => (
            <FeatureCard key={f.title} f={f} delay={idx * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
