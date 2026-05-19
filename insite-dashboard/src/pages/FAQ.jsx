import FAQSection from '../components/FAQSection'
import CTASection from '../components/CTASection'

export default function FAQ() {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 80, background: '#070c19', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(247,201,75,0.1)', border: '1px solid rgba(247,201,75,0.2)',
            padding: '5px 14px', borderRadius: 100, marginBottom: 20,
          }}>
            <span style={{ color: '#f7c94b', fontSize: 12, fontWeight: 700 }}>FREQUENTLY ASKED</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Questions & Answers
          </h1>
          <p style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.7 }}>
            Everything hospital leaders, IT teams, and clinical staff ask before deploying InSite. Can't find yours? Reach out directly.
          </p>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </>
  )
}
