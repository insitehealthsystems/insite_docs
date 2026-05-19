'use client'
const metrics = [
  { value: '30–50%', label: 'Reduction in search time', color: '#00d9a6' },
  { value: '15–25%', label: 'Equipment utilization improvement', color: '#0ab8ff' },
  { value: '2–4h', label: 'Staff hours recovered per day', color: '#f7c94b' },
]

const benefits = [
  {
    num: '01',
    title: 'Faster Patient Care',
    desc: 'Staff spend less time searching and more time at the bedside. Faster response times translate directly to better patient outcomes.',
  },
  {
    num: '02',
    title: 'Reduced Equipment Loss',
    desc: 'Know exactly where every asset is at all times. Reduce misplacement, theft, and idle equipment sitting in the wrong department.',
  },
  {
    num: '03',
    title: 'Lower Capital Spend',
    desc: "Stop buying equipment you already have. Utilization data proves when you need more - and when you don't.",
  },
  {
    num: '04',
    title: 'Staff Satisfaction',
    desc: "Remove one of nursing's most common frustrations. Happier staff means better retention and fewer errors from fatigue.",
  },
  {
    num: '05',
    title: 'Compliance Ready',
    desc: 'Automated audit trails and maintenance triggers help your facility stay ahead of regulatory requirements.',
  },
]

export default function OutcomesSection() {
  return (
    <section style={{ padding: '100px 0', background: '#0a0f1e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
            padding: '5px 14px', borderRadius: 100, marginBottom: 16,
          }}>
            <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700 }}>PROVEN OUTCOMES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
            Real Results. Real Hospitals.
          </h2>
          <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 540, margin: '0 auto' }}>
            Our customers see measurable improvements within the first week of deployment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="outcomes-grid">
          {/* Left: Metric cards */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {metrics.map(m => (
                <div key={m.label} style={{
                  background: 'rgba(28,36,56,0.6)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16, padding: '24px 20px',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,217,166,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                  <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 46px)', color: m.color, lineHeight: 1 }}>
                    {m.value}
                  </div>
                  <div style={{ color: '#8898b4', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* ROI signal card — full width */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,217,166,0.1), rgba(10,184,255,0.08))',
              border: '1px solid rgba(0,217,166,0.25)',
              borderRadius: 16, padding: '24px 28px',
              display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 48, color: '#00d9a6', lineHeight: 1 }}>
                5
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Days to First ROI Signal</div>
                <div style={{ color: '#8898b4', fontSize: 13, marginTop: 4 }}>
                  Most hospitals see measurable search-time reduction within the first 5 business days.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Benefit list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {benefits.map(b => (
              <div key={b.num} style={{
                padding: '20px 20px',
                borderRadius: 12,
                border: '1px solid transparent',
                transition: 'all 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(28,36,56,0.5)'
                  e.currentTarget.style.borderColor = 'rgba(0,217,166,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
                    borderRadius: 8, padding: '4px 10px', flexShrink: 0,
                    color: '#00d9a6', fontSize: 12, fontWeight: 700, fontFamily: 'Bricolage Grotesque, sans-serif',
                  }}>{b.num}</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{b.title}</div>
                    <div style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.6 }}>{b.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .outcomes-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
