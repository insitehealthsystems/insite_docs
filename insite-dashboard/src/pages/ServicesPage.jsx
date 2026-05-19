import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

/* ─── Data ──────────────────────────────────────────────── */
const services = [
  {
    icon: '📡', title: 'Intelligent Asset Tracking',
    tagline: 'Sub-room precision',
    desc: 'Find any piece of equipment in under 3 seconds — no more floor-by-floor searches. Hybrid BLE + RFID delivers pinpoint accuracy across every zone.',
    color: '#00d9a6', border: 'rgba(0,217,166,0.22)', bg: 'rgba(0,217,166,0.05)',
    features: ['Sub-room BLE + RFID precision', 'Mobile-first search from any device', 'Live availability per floor and zone'],
    link: '/services/asset-tracking',
  },
  {
    icon: '🔒', title: 'Mobile-First Secure Environment',
    tagline: 'HIPAA-compliant by design',
    desc: 'End-to-end AES-256 encryption on every device. Remote lock, wipe, and geo-fence alerts ensure patient data stays protected at all times.',
    color: '#0ab8ff', border: 'rgba(10,184,255,0.22)', bg: 'rgba(10,184,255,0.05)',
    features: ['End-to-end AES-256 encryption', 'Remote lock, wipe, and geo-fence', 'Annual third-party security audits'],
    link: '/services/mobile-security',
  },
  {
    icon: '📊', title: 'Data-Driven Capital Planning',
    tagline: 'Stop buying what you own',
    desc: 'Real utilization data proves when you actually need more equipment. Right-size your fleet and reduce unnecessary capital spend by up to 20%.',
    color: '#f7c94b', border: 'rgba(247,201,75,0.22)', bg: 'rgba(247,201,75,0.05)',
    features: ['Real utilization vs. purchased capacity', 'Executive ROI dashboard', 'Fleet right-sizing recommendations'],
    link: '/services/capital-planning',
  },
  {
    icon: '🏥', title: 'Site Monitoring & Reliability',
    tagline: 'Campus-wide operational visibility',
    desc: 'Temperature, humidity, access control, and maintenance triggers across every zone — all in one operational view.',
    color: '#ff5e3a', border: 'rgba(255,94,58,0.22)', bg: 'rgba(255,94,58,0.05)',
    features: ['Temperature and humidity monitoring', 'Access control integration', 'Automated maintenance triggers'],
    link: '/services/site-monitoring',
  },
]

const steps = [
  { num: '01', title: 'Apply Online',      desc: 'Complete our streamlined pilot application. No commitment required — just tell us about your facility.' },
  { num: '02', title: 'Plan Your Pilot',   desc: 'Our team designs a custom scope — the right zones, assets, and success metrics for your hospital.' },
  { num: '03', title: 'Deploy in 5 Days',  desc: 'White-glove hardware installation and staff training. We handle everything with minimal IT involvement.' },
  { num: '04', title: 'See ROI in Days',   desc: 'Most facilities measure meaningful search-time reduction within the first week. Review data with our team.' },
]

/* ─── Shared icons ──────────────────────────────────────── */
const CheckIcon = ({ color }) => (
  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
    <path d="M1 3.5L3.2 5.7L8 1" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ─── Service card ──────────────────────────────────────── */
const ServiceCard = ({ s, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      className="card-gradient-border"
      style={{
        background: s.bg, border: `1px solid ${s.border}`, borderRadius: 18, padding: '32px 28px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.65s ease ${idx * 100}ms, transform 0.65s ease ${idx * 100}ms, box-shadow 0.25s ease`,
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.35)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ fontSize: 36, marginBottom: 18 }}>{s.icon}</div>
      <div style={{ color: s.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>{s.tagline}</div>
      <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 12, fontFamily: 'Bricolage Grotesque, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{s.title}</h3>
      <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.75, marginBottom: 20, flex: 1 }}>{s.desc}</p>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
        {s.features.map(feat => (
          <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 9 }}>
            <span style={{
              width: 16, height: 16, borderRadius: '50%', marginTop: 1, flexShrink: 0,
              background: s.bg, border: `1px solid ${s.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckIcon color={s.color} />
            </span>
            <span style={{ color: '#c8d5e8', fontSize: 13, lineHeight: 1.5 }}>{feat}</span>
          </li>
        ))}
      </ul>
      <Link
        to={s.link}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: s.color, textDecoration: 'none', fontSize: 13, fontWeight: 600, transition: 'gap 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.gap = '10px' }}
        onMouseLeave={e => { e.currentTarget.style.gap = '6px' }}
      >
        Learn more <ArrowIcon />
      </Link>
    </div>
  )
}

/* ─── Step card ─────────────────────────────────────────── */
const StepCard = ({ step, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '28px 24px', textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.65s ease ${idx * 100}ms, transform 0.65s ease ${idx * 100}ms`,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14, margin: '0 auto 16px',
        background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 14, color: '#00d9a6',
      }}>{step.num}</div>
      <h4 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 10, fontFamily: 'Bricolage Grotesque, sans-serif' }}>{step.title}</h4>
      <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────── */
const ServicesPage = () => {
  const [heroRef, heroVisible] = useScrollReveal(0.05)
  const [stepsHeaderRef, stepsHeaderVisible] = useScrollReveal()
  const [ctaRef, ctaVisible] = useScrollReveal()

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-55%)',
          width: 800, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,217,166,0.09) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div
          ref={heroRef}
          style={{
            position: 'relative', zIndex: 1, maxWidth: 740, margin: '0 auto', padding: '0 24px',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.25)',
            padding: '6px 16px', borderRadius: 100, marginBottom: 22,
          }}>
            <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d9a6', display: 'inline-block' }} />
            <span style={{ color: '#00d9a6', fontSize: 13, fontWeight: 600 }}>Our Solutions</span>
          </div>
          <h1 style={{
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 62px)', color: '#fff', letterSpacing: '-0.03em',
            lineHeight: 1.1, marginBottom: 20,
          }}>
            Four Modules.{' '}
            <span style={{ background: 'linear-gradient(95deg, #00d9a6, #0ab8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              One Platform.
            </span>
          </h1>
          <p style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.75, maxWidth: 560, margin: '0 auto 38px' }}>
            InSite integrates asset tracking, mobile security, capital planning, and site monitoring into a single hospital-grade platform.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{
              background: '#00d9a6', color: '#0a0f1e', textDecoration: 'none',
              fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(0,217,166,0.25)' }}
              onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}>
              Book a Demo
            </Link>
            <Link to="/pilot-setup" style={{
              color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15,
              padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.transform = 'translateY(0)' }}>
              Apply for Pilot
            </Link>
          </div>
        </div>
      </section>

      {/* ── Service cards ─────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#070c19' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
            {services.map((s, idx) => <ServiceCard key={s.title} s={s} idx={idx} />)}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#0a0f1e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            ref={stepsHeaderRef}
            style={{
              textAlign: 'center', marginBottom: 64,
              opacity: stepsHeaderVisible ? 1 : 0, transform: stepsHeaderVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(10,184,255,0.08)', border: '1px solid rgba(10,184,255,0.22)',
              padding: '5px 16px', borderRadius: 100, marginBottom: 18,
            }}>
              <span style={{ color: '#0ab8ff', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>HOW IT WORKS</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#fff', marginBottom: 16,
              lineHeight: 1.15, fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 800, letterSpacing: '-0.03em',
            }}>From Application to ROI in Weeks</h2>
            <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Our white-glove process gets you live fast with zero disruption to daily operations.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {steps.map((step, idx) => <StepCard key={step.num} step={step} idx={idx} />)}
          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────── */}
      <section style={{
        padding: '90px 0',
        background: 'linear-gradient(135deg, rgba(0,217,166,0.07) 0%, rgba(10,184,255,0.05) 100%)',
        borderTop: '1px solid rgba(0,217,166,0.12)', borderBottom: '1px solid rgba(0,217,166,0.12)',
      }}>
        <div
          ref={ctaRef}
          style={{
            maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center',
            opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          <h2 style={{
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 50px)', color: '#fff', letterSpacing: '-0.03em',
            marginBottom: 16, lineHeight: 1.15,
          }}>
            Ready to Transform Your Facility?
          </h2>
          <p style={{ color: '#8898b4', fontSize: 17, lineHeight: 1.75, marginBottom: 36 }}>
            Join our founding hospital partner program — zero financial commitment, full white-glove support, and measurable results in days.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{
              background: '#00d9a6', color: '#0a0f1e', textDecoration: 'none',
              fontWeight: 700, fontSize: 15, padding: '14px 32px', borderRadius: 10, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(0,217,166,0.25)' }}
              onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}>
              Book a Demo
            </Link>
            <Link to="/about" style={{
              color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15,
              padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.transform = 'translateY(0)' }}>
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default ServicesPage
