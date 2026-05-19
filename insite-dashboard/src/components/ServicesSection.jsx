import { Link } from 'react-router-dom'

const services = [
  {
    icon: '📡',
    title: 'Asset Tracking',
    description: 'Real-time location of every critical piece of equipment across all floors and departments. Bluetooth + RFID hybrid technology with sub-room precision.',
    color: '#00d9a6',
    bg: 'rgba(0,217,166,0.1)',
    border: 'rgba(0,217,166,0.2)',
  },
  {
    icon: '🔒',
    title: 'Mobile Security',
    description: 'HIPAA-compliant end-to-end encryption on every device. Remote lock, wipe, and geo-fence alerts for laptops, tablets, and medical carts.',
    color: '#0ab8ff',
    bg: 'rgba(10,184,255,0.1)',
    border: 'rgba(10,184,255,0.2)',
  },
  {
    icon: '📊',
    title: 'Capital Planning',
    description: 'Data-driven insights to right-size your equipment fleet. Stop over-purchasing by understanding true utilization patterns across your facility.',
    color: '#f7c94b',
    bg: 'rgba(247,201,75,0.1)',
    border: 'rgba(247,201,75,0.2)',
  },
  {
    icon: '🏥',
    title: 'Site Monitoring',
    description: 'Environmental and operational oversight across your entire campus. Temperature, humidity, and access monitoring for sensitive equipment rooms.',
    color: '#ff5e3a',
    bg: 'rgba(255,94,58,0.1)',
    border: 'rgba(255,94,58,0.2)',
  },
]

export default function ServicesSection({ minimal = false }) {
  return (
    <section style={{ padding: '100px 0', background: '#070c19' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
            padding: '5px 14px', borderRadius: 100, marginBottom: 16,
          }}>
            <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700 }}>OUR SOLUTIONS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
            Everything Your Facility Needs
          </h2>
          <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 560, margin: '0 auto' }}>
            Four integrated modules that work together to eliminate equipment chaos and give you complete operational visibility.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          {services.map(service => (
            <div
              key={service.title}
              style={{
                background: 'rgba(28,36,56,0.5)',
                border: `1px solid ${service.border}`,
                borderRadius: 16,
                padding: '28px 24px',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px ${service.border}`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: service.bg, border: `1px solid ${service.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 18,
              }}>
                {service.icon}
              </div>
              <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>
                {service.title}
              </h3>
              <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
                {service.description}
              </p>
              <Link to="/services" style={{
                color: service.color, textDecoration: 'none', fontSize: 13, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'gap 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.gap = '8px' }}
                onMouseLeave={e => { e.currentTarget.style.gap = '4px' }}>
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
