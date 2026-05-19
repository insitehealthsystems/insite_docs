'use client'
import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const perks = [
  'Free 90-day hardware pilot — zero upfront cost',
  'White-glove deployment completed in 5 days',
  'No contracts, no financial commitment',
  'Founding partner pricing locked in for life',
  'Direct access to our product team',
]

const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
    <path d="M1 4L3.5 6.5L9 1" stroke="#00d9a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const inputBase = {
  width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box', fontFamily: 'DM Sans, Outfit, sans-serif',
}

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [leftRef, leftVisible] = useScrollReveal()
  const [rightRef, rightVisible] = useScrollReveal()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch (_) {}
    setSubmitted(true)
  }

  return (
    <section id="contact" style={{
      padding: '100px 0',
      background: 'linear-gradient(180deg, #070c19 0%, #0a0f1e 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 1000, height: 600, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,217,166,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }} className="contact-main-grid">

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
              background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.22)',
              padding: '5px 16px', borderRadius: 100, marginBottom: 20,
            }}>
              <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>GET STARTED</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#fff', marginBottom: 16,
              lineHeight: 1.15, fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 800, letterSpacing: '-0.03em',
            }}>
              Ready to Transform Your<br />
              <span style={{ background: 'linear-gradient(95deg, #00d9a6 0%, #0ab8ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hospital Operations?
              </span>
            </h2>
            <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.75, marginBottom: 32, maxWidth: 440 }}>
              Apply for one of our founding hospital partner spots. No contracts, no upfront cost, and full white-glove support from day one.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {perks.map(perk => (
                <li key={perk} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', marginTop: 1, flexShrink: 0,
                    background: 'rgba(0,217,166,0.12)', border: '1px solid rgba(0,217,166,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckIcon />
                  </span>
                  <span style={{ color: '#d0d9e8', fontSize: 15, lineHeight: 1.5 }}>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div
            ref={rightRef}
            style={{
              opacity: rightVisible ? 1 : 0, transform: rightVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s',
            }}
          >
            <div style={{
              background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: '36px 32px', backdropFilter: 'blur(20px)',
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                    background: 'rgba(0,217,166,0.12)', border: '2px solid rgba(0,217,166,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden="true">
                      <path d="M2 10L9.5 17L24 3" stroke="#00d9a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700 }}>Message Received!</h3>
                  <p style={{ color: '#8898b4', fontSize: 15 }}>
                    We will reach out to <strong style={{ color: '#00d9a6' }}>{form.email}</strong> within 2 business days.
                  </p>
                </div>
              ) : (
                <>
                  <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 6, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Book a Demo</h3>
                  <p style={{ color: '#8898b4', fontSize: 14, marginBottom: 28 }}>Fill out the form and we will be in touch within 2 business days.</p>
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }} className="contact-form-row">
                      {[
                        { key: 'name',  label: 'Full Name',   placeholder: 'Dr. Jane Smith',     type: 'text'  },
                        { key: 'email', label: 'Work Email',  placeholder: 'jane@hospital.org',  type: 'email' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label} *</label>
                          <input
                            type={f.type} required value={form[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            placeholder={f.placeholder}
                            style={inputBase}
                            onFocus={e => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.1)' }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Tell us about your facility</label>
                      <textarea
                        rows={4} value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Hospital name, number of beds, biggest equipment pain point..."
                        style={{ ...inputBase, resize: 'vertical', minHeight: 100, lineHeight: 1.65 }}
                        onFocus={e => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        width: '100%', background: '#00d9a6', color: '#0a0f1e', border: 'none',
                        borderRadius: 10, padding: '14px', fontFamily: 'DM Sans, Outfit, sans-serif',
                        fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(0,217,166,0.25)' }}
                      onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}
                    >
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){
          .contact-main-grid{grid-template-columns:1fr!important;}
          .contact-form-row{grid-template-columns:1fr!important;}
        }
        input::placeholder,textarea::placeholder{color:#4a5a72;}
      `}</style>
    </section>
  )
}

export default Contact
