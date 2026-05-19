'use client'
import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const faqs = [
  {
    q: 'Does InSite track patients or staff?',
    a: 'Absolutely not. InSite tracks equipment only — never patients or staff. Our system is designed to be fully HIPAA-compliant by default, and patient privacy is protected at every layer of the architecture.',
  },
  {
    q: 'How long does deployment take?',
    a: 'Most hospitals are fully live within 5 business days. Our white-glove team handles everything from hardware installation to staff training, and your IT team involvement is minimal.',
  },
  {
    q: 'Is InSite HIPAA compliant?',
    a: 'Yes. InSite uses end-to-end AES-256 encryption for all data in transit and at rest. We sign Business Associate Agreements (BAAs) with all hospital partners and undergo annual third-party security audits.',
  },
  {
    q: 'What hardware does InSite use?',
    a: 'We use a hybrid Bluetooth Low Energy (BLE) and passive RFID architecture. Small adhesive tags attach to each asset. Fixed reader nodes install at room entrances and elevator banks with no structural modification required.',
  },
  {
    q: 'Do you guarantee ROI?',
    a: "We don't offer financial guarantees, but our founding partner program includes a free 90-day pilot. If you don't see measurable search-time reduction, you walk away with no contracts and no fees — zero obligation.",
  },
  {
    q: 'What does the founding partner program include?',
    a: 'Founding partners receive free pilot hardware for 90 days, white-glove deployment and staff training, locked-in founding pricing for life, direct access to our product team, and priority access to all new features. There is zero financial commitment during the pilot phase.',
  },
]

const FAQ = () => {
  const [open, setOpen] = useState(null)
  const [ref, visible] = useScrollReveal(0.08)

  return (
    <section style={{ padding: '100px 0', background: '#0a0f1e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div
          ref={ref}
          style={{
            display: 'grid', gridTemplateColumns: '320px 1fr', gap: 72, alignItems: 'start',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
          className="faq-main-grid"
        >
          {/* Sticky sidebar */}
          <div style={{ position: 'sticky', top: 100 }} className="faq-sidebar">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(247,201,75,0.08)', border: '1px solid rgba(247,201,75,0.22)',
              padding: '5px 14px', borderRadius: 100, marginBottom: 18,
            }}>
              <span style={{ color: '#f7c94b', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>FAQ</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(26px, 3vw, 40px)', color: '#fff', marginBottom: 16,
              lineHeight: 1.2, fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 800, letterSpacing: '-0.03em',
            }}>
              Questions We Hear Often
            </h2>
            <p style={{ color: '#8898b4', fontSize: 15, lineHeight: 1.75, marginBottom: 24 }}>
              Still have questions?{' '}
              <a href="mailto:hello@insitehealthsystems.com" style={{ color: '#00d9a6', textDecoration: 'none' }}>
                Email our team
              </a>
            </p>
          </div>

          {/* Accordion */}
          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '22px 4px 22px 0', textAlign: 'left', gap: 16,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 16, fontWeight: 600, lineHeight: 1.45 }}>{faq.q}</span>
                  <span style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: open === i ? 'rgba(0,217,166,0.15)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${open === i ? 'rgba(0,217,166,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: open === i ? '#00d9a6' : '#8898b4',
                    fontSize: 18, fontWeight: 300,
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease, background 0.2s, border-color 0.2s, color 0.2s',
                  }}>+</span>
                </button>
                <div style={{
                  maxHeight: open === i ? '500px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease',
                }}>
                  <p style={{ color: '#8898b4', fontSize: 15, lineHeight: 1.8, padding: '0 40px 22px 0' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){
          .faq-main-grid{grid-template-columns:1fr!important;}
          .faq-sidebar{position:static!important;}
        }
      `}</style>
    </section>
  )
}

export default FAQ
