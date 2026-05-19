'use client'
import Link from 'next/link'

const assets = [
  { name: 'IV Pump',       location: 'Ward 3B — Room 12',      status: 'Available', type: 'available' },
  { name: 'Wheelchair',    location: 'Radiology — Bay 2',      status: 'In Use',    type: 'inuse'     },
  { name: 'Portable X-Ray', location: 'ICU — Dock Station',   status: 'Charging',  type: 'charging'  },
  { name: 'Defibrillator', location: 'ER — Nurse Station',     status: 'Available', type: 'available' },
]

const statusColors = {
  available: { bg: 'rgba(0,217,166,0.12)',  color: '#00d9a6', border: 'rgba(0,217,166,0.3)'  },
  inuse:     { bg: 'rgba(10,184,255,0.12)', color: '#0ab8ff', border: 'rgba(10,184,255,0.3)' },
  charging:  { bg: 'rgba(247,201,75,0.12)', color: '#f7c94b', border: 'rgba(247,201,75,0.3)' },
}

const assetIcon = { available: '📡', inuse: '🦽', charging: '⚡' }

const Hero = () => (
  <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 68 }}>

    {/* Grid background */}
    <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

    {/* Ambient glows */}
    <div className="animate-glow-pulse" style={{
      position: 'absolute', top: '5%', left: '-10%',
      width: 700, height: 700, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(0,217,166,0.13) 0%, transparent 70%)',
      zIndex: 0, pointerEvents: 'none',
    }} />
    <div className="animate-glow-pulse" style={{
      position: 'absolute', top: '20%', right: '-8%',
      width: 560, height: 560, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(10,184,255,0.10) 0%, transparent 70%)',
      zIndex: 0, pointerEvents: 'none', animationDelay: '1.5s',
    }} />

    <div style={{
      maxWidth: 1200, margin: '0 auto', padding: '80px 24px',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
      alignItems: 'center', position: 'relative', zIndex: 1, width: '100%',
    }} className="hero-main-grid">

      {/* ── Left column ─────────────────────────────────── */}
      <div>

        {/* Eyebrow badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.25)',
          padding: '6px 16px', borderRadius: 100, marginBottom: 28,
          animation: 'heroFadeUp 0.6s ease 0.1s both',
        }}>
          <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d9a6', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ color: '#00d9a6', fontSize: 13, fontWeight: 600 }}>Real-Time Equipment Visibility</span>
        </div>

        {/* H1 */}
        <h1 style={{
          fontSize: 'clamp(40px, 5vw, 70px)', fontWeight: 800, lineHeight: 1.08,
          marginBottom: 24, fontFamily: 'Bricolage Grotesque, sans-serif',
          letterSpacing: '-0.03em', color: '#fff',
          animation: 'heroFadeUp 0.6s ease 0.2s both',
        }}>
          Stop Searching.{' '}
          <span style={{ background: 'linear-gradient(95deg, #00d9a6 0%, #0ab8ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            Start Delivering
          </span>{' '}Care.
        </h1>

        <p style={{
          color: '#8898b4', fontSize: 18, lineHeight: 1.72, marginBottom: 36, maxWidth: 500,
          animation: 'heroFadeUp 0.6s ease 0.3s both',
        }}>
          Nurses spend up to 2 hours per shift searching for misplaced equipment. InSite gives every staff member instant visibility from any device, anywhere in the facility.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52,
          animation: 'heroFadeUp 0.6s ease 0.4s both',
        }}>
          <Link href="/contact" style={{
            background: '#00d9a6', color: '#0a0f1e', textDecoration: 'none',
            fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10,
            transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 0 0 rgba(0,217,166,0)',
          }}
            onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(0,217,166,0.3)' }}
            onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 0 0 rgba(0,217,166,0)' }}>
            Book a Demo
          </Link>
          <Link href="/services" style={{
            color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15,
            padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
            onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.transform = 'translateY(0)' }}>
            See Our Solutions
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 32, flexWrap: 'wrap',
          animation: 'heroFadeUp 0.6s ease 0.5s both',
        }}>
          {[
            { value: '30–50%', label: 'Less search time' },
            { value: '2–4h',   label: 'Saved per staff/day' },
            { value: '25+',    label: 'Years experience' },
          ].map(stat => (
            <div key={stat.label} style={{ borderLeft: '2px solid rgba(0,217,166,0.4)', paddingLeft: 16 }}>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ color: '#8898b4', fontSize: 13, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right column: dashboard mockup ──────────────── */}
      <div style={{ position: 'relative', animation: 'heroFadeUp 0.7s ease 0.35s both' }} className="hero-dashboard-col">

        {/* Main card */}
        <div className="glass animate-float" style={{
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07)',
          maxWidth: 480,
        }}>
          {/* Card header */}
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>Equipment Dashboard</div>
              <div style={{ color: '#8898b4', fontSize: 12, marginTop: 2 }}>Live tracking — San Diego Medical</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.2)', padding: '4px 10px', borderRadius: 100 }}>
              <span className="animate-blink" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d9a6', display: 'block', flexShrink: 0 }} />
              <span style={{ color: '#00d9a6', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>LIVE</span>
            </div>
          </div>

          {/* Asset rows */}
          <div style={{ padding: '6px 0' }}>
            {assets.map((asset, i) => {
              const sc = statusColors[asset.type]
              return (
                <div key={asset.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 22px',
                  borderBottom: i < assets.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: sc.bg, border: `1px solid ${sc.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
                    }}>
                      {assetIcon[asset.type]}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{asset.name}</div>
                      <div style={{ color: '#8898b4', fontSize: 12, marginTop: 2 }}>{asset.location}</div>
                    </div>
                  </div>
                  <span style={{
                    background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, whiteSpace: 'nowrap',
                  }}>{asset.status}</span>
                </div>
              )
            })}
          </div>

          {/* Footer metrics */}
          <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
            {[{ value: '94%', label: 'Utilization' }, { value: '128', label: 'Assets Live' }, { value: '2.1s', label: 'Avg Locate' }].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#00d9a6', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 18 }}>{m.value}</div>
                <div style={{ color: '#8898b4', fontSize: 11, marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating badges */}
        <div style={{
          position: 'absolute', top: -18, right: -18,
          background: 'rgba(10,184,255,0.12)', border: '1px solid rgba(10,184,255,0.3)',
          borderRadius: 12, padding: '8px 14px', color: '#0ab8ff', fontSize: 12, fontWeight: 600,
          animation: 'float 5s ease-in-out infinite',
          backdropFilter: 'blur(8px)',
        }}>
          HIPAA Compliant
        </div>
        <div style={{
          position: 'absolute', bottom: 24, left: -24,
          background: 'rgba(0,217,166,0.12)', border: '1px solid rgba(0,217,166,0.3)',
          borderRadius: 12, padding: '8px 14px', color: '#00d9a6', fontSize: 12, fontWeight: 600,
          animation: 'float 6s ease-in-out infinite 1.2s',
          backdropFilter: 'blur(8px)',
        }}>
          5-day deploy
        </div>
      </div>
    </div>

    <style>{`
      @keyframes heroFadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @media (max-width: 900px) {
        .hero-main-grid { grid-template-columns: 1fr !important; }
        .hero-dashboard-col { display: none !important; }
      }
    `}</style>
  </section>
)

export default Hero
