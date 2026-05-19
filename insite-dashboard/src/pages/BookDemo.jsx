import CTASection from '../components/CTASection'

const steps = [
  { num: '01', title: 'Submit Your Application', desc: 'Fill out the short form below. We review every application personally.' },
  { num: '02', title: 'Intro Call (30 min)', desc: 'We\'ll learn about your facility, your challenges, and whether InSite is the right fit.' },
  { num: '03', title: 'Hardware Ships in 48h', desc: 'If selected as a founding partner, we ship your pilot hardware - free of charge.' },
  { num: '04', title: 'Live in 5 Business Days', desc: 'Our team handles full installation, configuration, and staff training on-site.' },
]

export default function BookDemo() {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 80, background: '#0a0f1e', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 700, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,217,166,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
            padding: '5px 14px', borderRadius: 100, marginBottom: 20,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#00d9a6',
              display: 'inline-block',
            }} className="animate-pulse-dot" />
            <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700 }}>2–3 Spots Remaining</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Apply as a Founding Hospital Partner
          </h1>
          <p style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.7 }}>
            Get full access to InSite with zero financial commitment. Free hardware, white-glove deployment, and founding partner pricing locked for life.
          </p>
        </div>
      </section>

      {/* Process steps */}
      <section style={{ padding: '80px 0', background: '#070c19' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 12 }}>How It Works</h2>
            <p style={{ color: '#8898b4', fontSize: 16 }}>From application to live system in under a week.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, position: 'relative' }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{
                background: 'rgba(28,36,56,0.5)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '28px 24px',
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800,
                  fontSize: 48, color: 'rgba(0,217,166,0.15)', lineHeight: 1,
                  position: 'absolute', top: 16, right: 20,
                }}>{step.num}</div>
                <div style={{
                  background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
                  borderRadius: 8, padding: '4px 10px', display: 'inline-block',
                  color: '#00d9a6', fontSize: 12, fontWeight: 700, marginBottom: 14,
                }}>{step.num}</div>
                <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.65 }}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
                    color: '#00d9a6', fontSize: 18, fontWeight: 700, zIndex: 10,
                  }} className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

      <style>{`
        @media (max-width: 760px) {
          .step-arrow { display: none; }
        }
      `}</style>
    </>
  )
}
