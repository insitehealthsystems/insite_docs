import { Link } from 'react-router-dom'

const perks = [
  'Free pilot hardware for 90 days',
  'White-glove deployment & training',
  'Locked-in founding partner pricing',
  'Priority roadmap influence',
  'Zero commitment - exit anytime',
]

export default function FoundingPartnerBanner() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, rgba(0,217,166,0.08) 0%, rgba(10,184,255,0.06) 100%)',
      border: '1px solid rgba(0,217,166,0.15)',
      margin: '0',
      padding: '72px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 800, height: 400, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,217,166,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="founding-grid">
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(247,201,75,0.1)', border: '1px solid rgba(247,201,75,0.25)',
              padding: '5px 12px', borderRadius: 100, marginBottom: 20,
            }}>
              <span style={{ color: '#f7c94b', fontSize: 12, fontWeight: 700 }}>⭐ FOUNDING PROGRAM</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, lineHeight: 1.15, color: '#fff', marginBottom: 16 }}>
              Founding Hospital Partner Program
            </h2>
            <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.7, marginBottom: 28, maxWidth: 460 }}>
              We're partnering with a select group of forward-thinking hospitals for a fully supported pilot. You get every InSite feature, hands-on support, and zero financial commitment during the pilot.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32 }}>
              {perks.map(perk => (
                <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(0,217,166,0.15)', border: '1px solid rgba(0,217,166,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: 11, color: '#00d9a6',
                  }}>✓</span>
                  <span style={{ color: '#d0d9e8', fontSize: 15 }}>{perk}</span>
                </li>
              ))}
            </ul>
            <Link to="/book-demo" style={{
              display: 'inline-block', background: '#00d9a6', color: '#0a0f1e',
              textDecoration: 'none', fontWeight: 700, fontSize: 15,
              padding: '14px 28px', borderRadius: 10, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)' }}>
              Apply Now — It's Free →
            </Link>
          </div>

          {/* Right */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(28,36,56,0.7)',
              border: '1px solid rgba(0,217,166,0.2)',
              borderRadius: 20,
              padding: '40px 32px',
              backdropFilter: 'blur(20px)',
            }}>
              <div style={{ color: '#8898b4', fontSize: 14, marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Spots Remaining
              </div>
              <div style={{
                fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800,
                fontSize: 'clamp(56px, 8vw, 96px)', color: '#00d9a6',
                lineHeight: 1, marginBottom: 8,
              }}>
                2–3
              </div>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
                founding hospital partners
              </div>
              <div style={{
                background: 'rgba(255,94,58,0.1)', border: '1px solid rgba(255,94,58,0.25)',
                borderRadius: 10, padding: '12px 20px',
              }}>
                <span style={{ color: '#ff5e3a', fontWeight: 700, fontSize: 14 }}>
                  ⚠ Limited availability — applications reviewed weekly
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .founding-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
