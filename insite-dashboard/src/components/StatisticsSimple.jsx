import { useScrollReveal } from '../hooks/useScrollReveal'

const metrics = [
  { value: '30–50%', label: 'Reduction in search time',       color: '#00d9a6' },
  { value: '15–25%', label: 'Equipment utilization gain',     color: '#0ab8ff' },
  { value: '2–4h',   label: 'Staff hours recovered per day',  color: '#f7c94b' },
]

const benefits = [
  { num: '01', title: 'Faster Patient Care',    desc: 'Staff spend less time searching and more time at the bedside where it matters.' },
  { num: '02', title: 'Reduced Equipment Loss', desc: 'Know exactly where every asset is. Eliminate misplacement and theft proactively.' },
  { num: '03', title: 'Lower Capital Spend',    desc: 'Stop buying equipment you already own. Utilization data proves when you need more.' },
  { num: '04', title: 'Staff Satisfaction',     desc: "Remove one of nursing's most common frustrations and improve retention rates." },
  { num: '05', title: 'Compliance Ready',       desc: 'Automated audit trails and maintenance triggers keep you ahead of every requirement.' },
]

const MetricCard = ({ m, delay }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '24px 20px',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.2s`,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,217,166,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 46px)', color: m.color, lineHeight: 1 }}>{m.value}</div>
      <div style={{ color: '#8898b4', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>{m.label}</div>
    </div>
  )
}

const StatisticsSimple = () => {
  const [headerRef, headerVisible] = useScrollReveal()
  const [roiRef, roiVisible] = useScrollReveal(0.1)
  const [listRef, listVisible] = useScrollReveal(0.1)

  return (
    <section style={{ padding: '100px 0', background: '#0a0f1e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div
          ref={headerRef}
          style={{
            textAlign: 'center', marginBottom: 68,
            opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.2)',
            padding: '5px 16px', borderRadius: 100, marginBottom: 18,
          }}>
            <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>PROVEN OUTCOMES</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#fff', marginBottom: 16,
            lineHeight: 1.15, fontFamily: 'Bricolage Grotesque, sans-serif',
            fontWeight: 800, letterSpacing: '-0.03em',
          }}>
            Real Results. Real Hospitals.
          </h2>
          <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            Our customers see measurable improvements within the first week of deployment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="stats-main-grid">

          {/* Left: metric cards */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {metrics.map((m, idx) => (
                <MetricCard key={m.label} m={m} delay={idx * 100} />
              ))}
            </div>

            {/* 5-day ROI banner */}
            <div
              ref={roiRef}
              style={{
                background: 'linear-gradient(135deg, rgba(0,217,166,0.1), rgba(10,184,255,0.07))',
                border: '1px solid rgba(0,217,166,0.22)', borderRadius: 16, padding: '26px 28px',
                display: 'flex', alignItems: 'center', gap: 22,
                opacity: roiVisible ? 1 : 0, transform: roiVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.65s ease 0.3s, transform 0.65s ease 0.3s',
              }}
            >
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 52, color: '#00d9a6', lineHeight: 1, flexShrink: 0 }}>5</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Days to First ROI Signal</div>
                <div style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.6 }}>Most hospitals see measurable search-time reduction within the first 5 business days of going live.</div>
              </div>
            </div>
          </div>

          {/* Right: benefits list */}
          <div
            ref={listRef}
            style={{
              display: 'flex', flexDirection: 'column', gap: 4,
              opacity: listVisible ? 1 : 0, transform: listVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s',
            }}
          >
            {benefits.map(b => (
              <div key={b.num} style={{ padding: '18px 16px', borderRadius: 12, border: '1px solid transparent', transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(28,36,56,0.5)'; e.currentTarget.style.borderColor = 'rgba(0,217,166,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
                    borderRadius: 8, padding: '4px 10px', flexShrink: 0,
                    color: '#00d9a6', fontSize: 12, fontWeight: 700,
                    fontFamily: 'Bricolage Grotesque, sans-serif',
                  }}>{b.num}</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 5 }}>{b.title}</div>
                    <div style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.65 }}>{b.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.stats-main-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  )
}

export default StatisticsSimple
