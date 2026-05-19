'use client'
import { useState } from 'react'

const perks = [
  'Free 90-day hardware pilot',
  'White-glove deployment in 5 days',
  'No contracts or financial commitment',
  'Founding partner pricing locked for life',
  'Direct access to product team',
]

export default function CTASection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section style={{
      padding: '100px 0',
      background: 'linear-gradient(180deg, #070c19 0%, #0a0f1e 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 900, height: 500, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,217,166,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="cta-grid">
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
              padding: '5px 14px', borderRadius: 100, marginBottom: 20,
            }}>
              <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700 }}>GET STARTED</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#fff', marginBottom: 16, lineHeight: 1.15 }}>
              Ready to Stop the{' '}
              <span style={{
                background: 'linear-gradient(90deg, #00d9a6, #0ab8ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Equipment Hunt?</span>
            </h2>
            <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Apply for one of our 2–3 founding hospital partner spots. No contracts, no upfront cost, and full white-glove support from day one.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {perks.map(perk => (
                <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(0,217,166,0.15)', border: '1px solid rgba(0,217,166,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#00d9a6', fontSize: 11, flexShrink: 0,
                  }}>✓</span>
                  <span style={{ color: '#d0d9e8', fontSize: 15 }}>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div style={{
            background: 'rgba(28,36,56,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '36px 32px',
            backdropFilter: 'blur(20px)',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>Application Received!</h3>
                <p style={{ color: '#8898b4', fontSize: 15 }}>
                  We'll reach out to <strong style={{ color: '#00d9a6' }}>{form.email}</strong> within 2 business days to schedule your intro call.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                  Apply as a Founding Partner
                </h3>
                <p style={{ color: '#8898b4', fontSize: 14, marginBottom: 28 }}>
                  Fill out the form below and we'll be in touch within 2 business days.
                </p>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name *</label>
                      <input
                        type="text" required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Dr. Jane Smith"
                        style={{
                          width: '100%', background: 'rgba(10,15,30,0.8)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14,
                          outline: 'none', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#00d9a6'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Work Email *</label>
                      <input
                        type="email" required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@hospital.org"
                        style={{
                          width: '100%', background: 'rgba(10,15,30,0.8)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14,
                          outline: 'none', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#00d9a6'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Tell us about your facility
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Hospital name, number of beds, biggest equipment pain point..."
                      style={{
                        width: '100%', background: 'rgba(10,15,30,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14,
                        outline: 'none', resize: 'vertical', fontFamily: 'DM Sans, sans-serif',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#00d9a6'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <button type="submit" style={{
                    width: '100%', background: '#00d9a6', color: '#0a0f1e',
                    border: 'none', borderRadius: 10, padding: '14px',
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 15,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)' }}>
                    Submit Application →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cta-grid { grid-template-columns: 1fr !important; }
        }
        input::placeholder, textarea::placeholder { color: #4a5568; }
      `}</style>
    </section>
  )
}
