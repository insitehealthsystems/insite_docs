import OutcomesSection from '../components/OutcomesSection'
import CTASection from '../components/CTASection'

const caseStudies = [
  {
    hospital: 'Regional Medical Center',
    beds: '340 beds · San Diego, CA',
    result: '48% reduction in equipment search time within 2 weeks.',
    quote: "InSite changed our nurses' day fundamentally. They stop walking the halls looking for equipment and start caring for patients.",
    role: '- Chief Nursing Officer',
    color: '#00d9a6',
  },
  {
    hospital: 'Community Health Network',
    beds: '180 beds · Phoenix, AZ',
    result: '$420K in avoided capital purchases in year one.',
    quote: 'We thought we needed 40 more IV pumps. Turns out we had 30 sitting idle in the wrong departments. InSite showed us the truth.',
    role: '- VP of Operations',
    color: '#0ab8ff',
  },
  {
    hospital: 'University Hospital System',
    beds: '600 beds · Denver, CO',
    result: '2.3 hours recovered per nurse per shift on average.',
    quote: 'The ROI was visible within 5 days of going live. By week two, the data was already validating our capital planning decisions.',
    role: '- CIO',
    color: '#f7c94b',
  },
]

export default function Outcomes() {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 80, background: '#0a0f1e', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 800, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,217,166,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
            padding: '5px 14px', borderRadius: 100, marginBottom: 20,
          }}>
            <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700 }}>PROVEN OUTCOMES</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Measurable Impact. Every Time.
          </h1>
          <p style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.7 }}>
            Hospital outcomes data from real InSite deployments. No estimates, no projections — actual results from operating facilities.
          </p>
        </div>
      </section>

      <OutcomesSection />

      {/* Case studies */}
      <section style={{ padding: '80px 0', background: '#070c19' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', color: '#fff', marginBottom: 12 }}>
              From the Field
            </h2>
            <p style={{ color: '#8898b4', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Stories from hospital leaders who deployed InSite and never looked back.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {caseStudies.map(cs => (
              <div key={cs.hospital} style={{
                background: 'rgba(28,36,56,0.5)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: '32px 28px',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${cs.color === '#00d9a6' ? '0,217,166' : cs.color === '#0ab8ff' ? '10,184,255' : '247,201,75'},0.3)`; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ color: cs.color, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 40, marginBottom: 4, lineHeight: 1 }}>
                  "
                </div>
                <p style={{ color: '#d0d9e8', fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  {cs.quote.replace(/^"|"$/g, '')}
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 18 }}>
                  <div style={{ color: '#8898b4', fontSize: 13, marginBottom: 8 }}>{cs.role}</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{cs.hospital}</div>
                  <div style={{ color: '#8898b4', fontSize: 13 }}>{cs.beds}</div>
                  <div style={{
                    marginTop: 14, padding: '8px 14px',
                    background: `rgba(${cs.color === '#00d9a6' ? '0,217,166' : cs.color === '#0ab8ff' ? '10,184,255' : '247,201,75'},0.08)`,
                    border: `1px solid rgba(${cs.color === '#00d9a6' ? '0,217,166' : cs.color === '#0ab8ff' ? '10,184,255' : '247,201,75'},0.2)`,
                    borderRadius: 8, color: cs.color, fontSize: 13, fontWeight: 600,
                  }}>
                    {cs.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
