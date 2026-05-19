'use client'
import Link from 'next/link'
import { useScrollReveal } from '../hooks/useScrollReveal'

const perks = [
  'Free 90-day hardware pilot — zero financial risk',
  'White-glove deployment completed in 5 days',
  'Founding partner pricing locked in for life',
  'Direct access to product team and roadmap',
  'No contracts, no upfront cost, walk away anytime',
]

const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
    <path d="M1 4L3.5 6.5L9 1" stroke="#00d9a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Solutions = () => {
  const [leftRef, leftVisible] = useScrollReveal(0.1)
  const [rightRef, rightVisible] = useScrollReveal(0.1)

  return (
    <section style={{
      background: 'linear-gradient(135deg, rgba(0,217,166,0.06) 0%, rgba(10,184,255,0.04) 100%)',
      borderTop: '1px solid rgba(0,217,166,0.12)', borderBottom: '1px solid rgba(0,217,166,0.12)',
      padding: '90px 0', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 900, height: 500, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,217,166,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="solutions-grid">

          {/* Left */}
          <div
            ref={leftRef}
            style={{
              opacity: leftVisible ? 1 : 0, transform: leftVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(247,201,75,0.08)', border: '1px solid rgba(247,201,75,0.25)',
              padding: '5px 14px', borderRadius: 100, marginBottom: 20,
            }}>
              <span style={{ color: '#f7c94b', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>FOUNDING PROGRAM</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, lineHeight: 1.15,
              color: '#fff', marginBottom: 16,
              fontFamily: 'Bricolage Grotesque, sans-serif', letterSpacing: '-0.03em',
            }}>
              Founding Hospital<br />Partner Program
            </h2>
            <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.75, marginBottom: 32, maxWidth: 460 }}>
              We are partnering with a select group of forward-thinking hospitals for a fully supported pilot — zero financial commitment required.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 36 }}>
              {perks.map(perk => (
                <li key={perk} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 13 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', marginTop: 1, flexShrink: 0,
                    background: 'rgba(0,217,166,0.12)', border: '1px solid rgba(0,217,166,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckIcon />
                  </span>
                  <span style={{ color: '#c8d5e8', fontSize: 15, lineHeight: 1.5 }}>{perk}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" style={{
              display: 'inline-block', background: '#00d9a6', color: '#0a0f1e',
              textDecoration: 'none', fontWeight: 700, fontSize: 15,
              padding: '14px 28px', borderRadius: 10, transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(0,217,166,0.25)' }}
              onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}>
              Apply Now — It is Free
            </Link>
          </div>

          {/* Right: counter card */}
          <div
            ref={rightRef}
            style={{
              opacity: rightVisible ? 1 : 0, transform: rightVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s',
            }}
          >
            <div style={{
              background: 'rgba(28,36,56,0.65)', border: '1px solid rgba(0,217,166,0.2)',
              borderRadius: 24, padding: '48px 36px', backdropFilter: 'blur(20px)',
              textAlign: 'center',
            }}>
              <div style={{ color: '#8898b4', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Spots Remaining</div>
              <div style={{
                fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800,
                fontSize: 'clamp(72px, 10vw, 112px)', color: '#00d9a6', lineHeight: 1, marginBottom: 10,
              }}>2–3</div>
              <div style={{ color: '#fff', fontSize: 19, fontWeight: 600, marginBottom: 28 }}>founding hospital partners</div>
              <div style={{
                background: 'rgba(255,94,58,0.08)', border: '1px solid rgba(255,94,58,0.22)',
                borderRadius: 10, padding: '12px 20px',
              }}>
                <span style={{ color: '#ff5e3a', fontWeight: 700, fontSize: 13 }}>Limited availability — applications reviewed weekly</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <style>{`@media(max-width:900px){.solutions-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  )
}

export default Solutions
