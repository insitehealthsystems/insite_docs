import ServicesSection from '../components/ServicesSection'
import CTASection from '../components/CTASection'

const details = [
  {
    icon: '📡',
    title: 'Asset Tracking',
    subtitle: 'Real-Time Location Intelligence',
    color: '#00d9a6',
    border: 'rgba(0,217,166,0.2)',
    bg: 'rgba(0,217,166,0.05)',
    description: "InSite's asset tracking module provides sub-room precision for every critical piece of equipment across your entire facility - all floors, all departments, in real time.",
    features: [
      'BLE + passive RFID hybrid architecture',
      'Sub-room location precision',
      'Mobile app for instant search from any device',
      'Automated check-in/check-out via proximity',
      'Historical location trails and dwell-time analytics',
      'Low-battery alerts and maintenance triggers',
    ],
  },
  {
    icon: '🔒',
    title: 'Mobile Security',
    subtitle: 'HIPAA-Compliant Device Management',
    color: '#0ab8ff',
    border: 'rgba(10,184,255,0.2)',
    bg: 'rgba(10,184,255,0.05)',
    description: 'Protect every connected device across your facility. From laptops to medical carts, InSite Mobile Security ensures your endpoints never become a liability.',
    features: [
      'End-to-end AES-256 encryption',
      'Remote lock, wipe, and geo-fence alerts',
      'Device policy management and enforcement',
      'Real-time threat monitoring and alerting',
      'SOC 2 Type II certified infrastructure',
      'Annual third-party security audits',
    ],
  },
  {
    icon: '📊',
    title: 'Capital Planning',
    subtitle: 'Data-Driven Fleet Decisions',
    color: '#f7c94b',
    border: 'rgba(247,201,75,0.2)',
    bg: 'rgba(247,201,75,0.05)',
    description: 'Stop guessing how many IV pumps you need. InSite Capital Planning turns utilization data into actionable procurement intelligence.',
    features: [
      'Equipment utilization heatmaps by department',
      'Over/under-purchased asset identification',
      'Lease vs. buy analysis with real usage data',
      'Vendor comparison reports',
      'Budget forecasting dashboards',
      'One-click export for procurement teams',
    ],
  },
  {
    icon: '🏥',
    title: 'Site Monitoring',
    subtitle: 'Environmental & Operational Oversight',
    color: '#ff5e3a',
    border: 'rgba(255,94,58,0.2)',
    bg: 'rgba(255,94,58,0.05)',
    description: 'Monitor environmental conditions and access events across your entire campus - ensuring sensitive equipment and spaces stay within compliance parameters.',
    features: [
      'Temperature and humidity monitoring',
      'Controlled access event logging',
      'Cold chain compliance for medications and biologics',
      'Environmental alert escalation workflows',
      'Regulatory reporting automation',
      'Multi-campus dashboard view',
    ],
  },
]

export default function Services() {
  return (
    <>
      {/* Page header */}
      <section style={{ paddingTop: 140, paddingBottom: 80, background: '#070c19', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
            padding: '5px 14px', borderRadius: 100, marginBottom: 20,
          }}>
            <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700 }}>OUR SOLUTIONS</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Four Modules. One Platform.
          </h1>
          <p style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.7 }}>
            InSite integrates asset tracking, device security, capital planning, and environmental monitoring into a single, unified platform built for modern hospitals.
          </p>
        </div>
      </section>

      {/* Detail cards */}
      <section style={{ padding: '80px 0', background: '#0a0f1e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {details.map((item, i) => (
              <div key={item.title} style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: 20,
                padding: '40px 40px',
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr',
                gap: 48,
                alignItems: 'center',
              }} className="service-detail-grid">
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: `rgba(${item.color === '#00d9a6' ? '0,217,166' : item.color === '#0ab8ff' ? '10,184,255' : item.color === '#f7c94b' ? '247,201,75' : '255,94,58'},0.12)`,
                    border: `1px solid ${item.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, marginBottom: 20,
                  }}>{item.icon}</div>
                  <div style={{ color: item.color, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    {item.subtitle}
                  </div>
                  <h2 style={{ color: '#fff', fontSize: 32, marginBottom: 16 }}>{item.title}</h2>
                  <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.7 }}>{item.description}</p>
                </div>
                <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                  <div style={{
                    background: 'rgba(10,15,30,0.6)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16, padding: '28px',
                  }}>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Key Features</div>
                    {item.features.map(feat => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: '50%', marginTop: 1, flexShrink: 0,
                          background: `rgba(${item.color === '#00d9a6' ? '0,217,166' : item.color === '#0ab8ff' ? '10,184,255' : item.color === '#f7c94b' ? '247,201,75' : '255,94,58'},0.12)`,
                          border: `1px solid ${item.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: item.color, fontSize: 10,
                        }}>✓</span>
                        <span style={{ color: '#c8d5e8', fontSize: 14, lineHeight: 1.55 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

      <style>{`
        .service-detail-grid { grid-template-columns: 1fr !important; }
        @media (min-width: 760px) {
          .service-detail-grid:nth-child(odd) { grid-template-columns: 1fr 1.2fr !important; }
          .service-detail-grid:nth-child(even) { grid-template-columns: 1.2fr 1fr !important; }
        }
      `}</style>
    </>
  )
}
