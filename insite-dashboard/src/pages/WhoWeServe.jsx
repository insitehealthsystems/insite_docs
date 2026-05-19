import WhoWeServeSection from '../components/WhoWeServeSection'
import CTASection from '../components/CTASection'

const useCases = [
  {
    icon: '👩‍⚕️',
    role: 'Nurses & Clinical Staff',
    color: '#0ab8ff',
    border: 'rgba(10,184,255,0.2)',
    bg: 'rgba(10,184,255,0.04)',
    problem: 'The Problem',
    problemText: 'Nurses spend up to 2 hours per shift walking floors searching for IV pumps, wheelchairs, and monitoring equipment. This directly reduces patient care time.',
    solution: 'The InSite Solution',
    solutionText: 'Open the InSite mobile app, type the equipment name, and get the exact room location in under 3 seconds. No calls to central supply, no wasted walking.',
    stats: ['2h recovered per shift', '3-second locate time', 'Available on any mobile device'],
  },
  {
    icon: '🏗️',
    role: 'Facilities & Operations',
    color: '#00d9a6',
    border: 'rgba(0,217,166,0.2)',
    bg: 'rgba(0,217,166,0.04)',
    problem: 'The Problem',
    problemText: 'Operations teams have no visibility into equipment movement across departments. Equipment goes missing, maintenance is missed, and budgets grow without accountability.',
    solution: 'The InSite Solution',
    solutionText: 'Live dashboard showing every asset, its location, status, and maintenance history. Automated alerts fire when equipment goes overdue for service or leaves a designated zone.',
    stats: ['Zero blind spots', 'Automated maintenance alerts', 'Loss prevention built-in'],
  },
  {
    icon: '📈',
    role: 'Hospital Executives & CFOs',
    color: '#f7c94b',
    border: 'rgba(247,201,75,0.2)',
    bg: 'rgba(247,201,75,0.04)',
    problem: 'The Problem',
    problemText: "Capital equipment spend lacks data. Hospitals over-purchase because they can't prove existing equipment is being used - and boards demand accountability.",
    solution: 'The InSite Solution',
    solutionText: 'Executive dashboards with utilization rates, department-level benchmarks, and procurement ROI analysis. Export board-ready reports in one click.',
    stats: ['ROI visible in 5 days', 'Audit-ready reports', 'Eliminate phantom purchases'],
  },
]

export default function WhoWeServe() {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 80, background: '#070c19', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(10,184,255,0.1)', border: '1px solid rgba(10,184,255,0.2)',
            padding: '5px 14px', borderRadius: 100, marginBottom: 20,
          }}>
            <span style={{ color: '#0ab8ff', fontSize: 12, fontWeight: 700 }}>WHO WE SERVE</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Built for Every Hospital Role
          </h1>
          <p style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.7 }}>
            From floor nurses to the C-suite, InSite delivers the right insight to the right person at the right moment.
          </p>
        </div>
      </section>

      {/* Deep dive cards */}
      <section style={{ padding: '80px 0', background: '#0a0f1e' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {useCases.map(uc => (
              <div key={uc.role} style={{
                background: uc.bg,
                border: `1px solid ${uc.border}`,
                borderRadius: 20, padding: '40px',
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40,
                alignItems: 'start',
              }} className="usecase-grid">
                {/* Identity */}
                <div>
                  <div style={{ fontSize: 44, marginBottom: 16 }}>{uc.icon}</div>
                  <div style={{ color: uc.color, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    {uc.role}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
                    {uc.stats.map(s => (
                      <div key={s} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: `rgba(${uc.color === '#0ab8ff' ? '10,184,255' : uc.color === '#00d9a6' ? '0,217,166' : '247,201,75'},0.08)`,
                        border: `1px solid ${uc.border}`,
                        padding: '8px 14px', borderRadius: 8,
                      }}>
                        <span style={{ color: uc.color, fontSize: 14 }}>✓</span>
                        <span style={{ color: '#d0d9e8', fontSize: 13, fontWeight: 600 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Problem */}
                <div>
                  <div style={{ color: '#ff5e3a', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    {uc.problem}
                  </div>
                  <p style={{ color: '#8898b4', fontSize: 15, lineHeight: 1.7 }}>{uc.problemText}</p>
                </div>
                {/* Solution */}
                <div>
                  <div style={{ color: uc.color, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    {uc.solution}
                  </div>
                  <p style={{ color: '#d0d9e8', fontSize: 15, lineHeight: 1.7 }}>{uc.solutionText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhoWeServeSection />
      <CTASection />

      <style>{`
        @media (max-width: 900px) {
          .usecase-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
