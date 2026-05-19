'use client'
import { useState } from 'react'

const faqs = [
  {
    q: 'Does InSite track patients?',
    a: 'Absolutely not. InSite tracks equipment only - never patients or staff. Our system is designed specifically around asset visibility, and we have no patient-tracking functionality whatsoever. Your HIPAA compliance is protected by design.',
  },
  {
    q: 'How long does deployment take?',
    a: 'Most hospitals are fully live within 5 business days. This includes hardware installation, software configuration, staff training, and integration with your existing systems. Our white-glove team handles everything - your IT team involvement is minimal.',
  },
  {
    q: 'Is InSite HIPAA compliant?',
    a: 'Yes. InSite uses end-to-end AES-256 encryption for all data in transit and at rest. We sign BAAs with all hospital partners, and our infrastructure is hosted on SOC 2 Type II certified cloud infrastructure. We undergo annual third-party security audits.',
  },
  {
    q: 'What hardware does InSite use?',
    a: 'We use a hybrid Bluetooth Low Energy (BLE) + passive RFID architecture. Small adhesive tags (the size of a quarter) attach to each asset. Fixed reader nodes are installed at room entrances and elevators. No Wi-Fi or proprietary network required.',
  },
  {
    q: 'Do you guarantee ROI?',
    a: "We don't offer financial guarantees, but our founding partner program includes a 90-day free pilot with full access to all features. If you don't see measurable search-time reduction, you walk away - no contracts, no fees. Our average customer sees ROI signals within 5 days.",
  },
  {
    q: 'What does the founding partner program include?',
    a: "Founding partners receive: free pilot hardware for 90 days, white-glove deployment and training, locked-in founding pricing for life, priority access to new features, and direct input on our product roadmap. There's zero financial commitment during the pilot phase.",
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState(null)

  return (
    <section style={{ padding: '100px 0', background: '#0a0f1e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 64, alignItems: 'start' }} className="faq-grid">
          {/* Left */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(247,201,75,0.1)', border: '1px solid rgba(247,201,75,0.2)',
              padding: '5px 14px', borderRadius: 100, marginBottom: 16,
            }}>
              <span style={{ color: '#f7c94b', fontSize: 12, fontWeight: 700 }}>FAQ</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
              Questions We Hear Often
            </h2>
            <p style={{ color: '#8898b4', fontSize: 15, lineHeight: 1.7 }}>
              Can't find your answer? Email us at{' '}
              <a href="mailto:hello@insitehealthsystems.com" style={{ color: '#00d9a6', textDecoration: 'none' }}>
                hello@insitehealthsystems.com
              </a>
            </p>
          </div>

          {/* Right: accordion */}
          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '22px 0',
                    textAlign: 'left', gap: 16,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{
                    color: '#00d9a6', fontSize: 20, flexShrink: 0,
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 0.25s ease',
                    display: 'block',
                  }}>+</span>
                </button>
                <div style={{
                  maxHeight: open === i ? '400px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.35s ease',
                }}>
                  <div style={{
                    color: '#8898b4', fontSize: 15, lineHeight: 1.75,
                    paddingBottom: 22,
                    background: open === i ? 'rgba(0,217,166,0.03)' : 'transparent',
                    padding: open === i ? '12px 16px 22px' : '0 16px',
                    borderRadius: 8,
                    marginBottom: 4,
                  }}>
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .faq-grid { grid-template-columns: 1fr !important; }
          .faq-grid > div:first-child { position: static !important; }
        }
      `}</style>
    </section>
  )
}
