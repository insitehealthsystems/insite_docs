'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const assets = [
  { name: 'IV Pump', location: 'Ward 3B · Room 12', status: 'Available', statusClass: 'available' },
  { name: 'Wheelchair', location: 'Radiology · Bay 2', status: 'In Use', statusClass: 'inuse' },
  { name: 'X-Ray Machine', location: 'ICU · Dock Station', status: 'Charging', statusClass: 'charging' },
  { name: 'Defibrillator', location: 'ER · Nurse Station', status: 'Available', statusClass: 'available' },
]

const statusColors = {
  available: { bg: 'rgba(0,217,166,0.12)', color: '#00d9a6', border: 'rgba(0,217,166,0.3)' },
  inuse: { bg: 'rgba(10,184,255,0.12)', color: '#0ab8ff', border: 'rgba(10,184,255,0.3)' },
  charging: { bg: 'rgba(247,201,75,0.12)', color: '#f7c94b', border: 'rgba(247,201,75,0.3)' },
}

export default function HeroSection() {
  const heroRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('fade-in-up') }),
      { threshold: 0.1 }
    )
    heroRef.current?.querySelectorAll('[data-animate]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 68,
      }}
    >
      {/* Grid background */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '10%', left: '-5%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,217,166,0.12) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} className="animate-glow" />
      <div style={{
        position: 'absolute', top: '20%', right: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(10,184,255,0.10) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} className="animate-glow" />

      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '80px 24px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60,
        alignItems: 'center', position: 'relative', zIndex: 1, width: '100%',
      }} className="hero-grid">

        {/* Left content */}
        <div>
          {/* Eyebrow */}
          <div data-animate style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.25)',
            padding: '6px 14px', borderRadius: 100, marginBottom: 28,
            animationDelay: '0.1s',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#00d9a6',
              display: 'inline-block',
            }} className="animate-pulse-dot" />
            <span style={{ color: '#00d9a6', fontSize: 13, fontWeight: 600 }}>
              Real-Time Equipment Visibility
            </span>
          </div>

          {/* H1 */}
          <h1 data-animate style={{
            fontSize: 'clamp(42px, 5vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
            animationDelay: '0.2s',
          }}>
            Stop Searching.{' '}
            <span style={{
              background: 'linear-gradient(90deg, #00d9a6, #0ab8ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Start Delivering</span>{' '}
            Care.
          </h1>

          {/* Subtitle */}
          <p data-animate style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.7, marginBottom: 36, maxWidth: 500, animationDelay: '0.3s' }}>
            Nurses spend up to 2 hours per shift searching for misplaced equipment. InSite gives every staff member instant visibility — from any device, anywhere in the facility.
          </p>

          {/* CTAs */}
          <div data-animate style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48, animationDelay: '0.4s' }}>
            <Link href="/book-demo" style={{
              background: '#00d9a6', color: '#0a0f1e', textDecoration: 'none',
              fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10,
              transition: 'all 0.2s', display: 'inline-block',
            }}
              onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)' }}>
              Apply as Founding Partner →
            </Link>
            <Link href="/outcomes" style={{
              color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15,
              padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
              transition: 'all 0.2s', display: 'inline-block',
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.35)'; e.target.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.transform = 'translateY(0)' }}>
              See Outcomes
            </Link>
          </div>

          {/* Stats */}
          <div data-animate style={{ display: 'flex', gap: 32, flexWrap: 'wrap', animationDelay: '0.5s' }}>
            {[
              { value: '30–50%', label: 'Less search time' },
              { value: '2–4h', label: 'Saved per staff/day' },
              { value: '25+', label: 'Years experience' },
            ].map(stat => (
              <div key={stat.label} style={{ borderLeft: '2px solid rgba(0,217,166,0.4)', paddingLeft: 16 }}>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 22, color: '#fff' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#8898b4', fontSize: 13 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dashboard card */}
        <div data-animate style={{ animationDelay: '0.3s' }} className="hero-dashboard">
          <div className="glass animate-float" style={{
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.07)',
            maxWidth: 480,
          }}>
            {/* Card header */}
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                  Equipment Dashboard
                </div>
                <div style={{ color: '#8898b4', fontSize: 12, marginTop: 2 }}>Live tracking — San Diego Medical</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#00d9a6', display: 'block',
                }} className="animate-blink" />
                <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 600 }}>LIVE</span>
              </div>
            </div>

            {/* Asset rows */}
            <div style={{ padding: '8px 0' }}>
              {assets.map((asset, i) => {
                const sc = statusColors[asset.statusClass]
                return (
                  <div key={asset.name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: i < assets.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    transition: 'background 0.2s',
                    cursor: 'default',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: sc.bg, border: `1px solid ${sc.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16,
                      }}>
                        {asset.statusClass === 'available' ? '📡' : asset.statusClass === 'inuse' ? '🦽' : '⚡'}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{asset.name}</div>
                        <div style={{ color: '#8898b4', fontSize: 12, marginTop: 2 }}>{asset.location}</div>
                      </div>
                    </div>
                    <span style={{
                      background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100,
                    }}>
                      {asset.status}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Card footer metrics */}
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              {[
                { value: '94%', label: 'Utilization' },
                { value: '128', label: 'Assets Live' },
                { value: '2.1s', label: 'Avg Locate' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00d9a6', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 18 }}>
                    {m.value}
                  </div>
                  <div style={{ color: '#8898b4', fontSize: 11 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating badges */}
          <div style={{
            position: 'absolute', top: -16, right: -24,
            background: 'rgba(10,184,255,0.12)', border: '1px solid rgba(10,184,255,0.3)',
            borderRadius: 12, padding: '8px 14px',
            color: '#0ab8ff', fontSize: 12, fontWeight: 600,
            animation: 'float 5s ease-in-out infinite',
          }}>
            🔒 HIPAA Compliant
          </div>
          <div style={{
            position: 'absolute', bottom: 20, left: -28,
            background: 'rgba(0,217,166,0.12)', border: '1px solid rgba(0,217,166,0.3)',
            borderRadius: 12, padding: '8px 14px',
            color: '#00d9a6', fontSize: 12, fontWeight: 600,
            animation: 'float 6s ease-in-out infinite 1s',
          }}>
            ⚡ 5-day deploy
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid { position: relative; }
        .hero-dashboard { position: relative; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-dashboard { display: none; }
        }
      `}</style>
    </section>
  )
}
