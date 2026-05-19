import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer style={{ background: '#070c19', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 0 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'linear-gradient(135deg, #00d9a6, #0ab8ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 14, color: '#0a0f1e',
              }}>IS</div>
              <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>
                InSite Health
              </span>
            </Link>
            <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.7, maxWidth: 240 }}>
              Real-time hospital equipment visibility that saves hours of staff time every shift.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Solutions</h4>
            {[
              { label: 'Asset Tracking', to: '/services/asset-tracking' },
              { label: 'Mobile Security', to: '/services/mobile-security' },
              { label: 'Capital Planning', to: '/services/capital-planning' },
              { label: 'Site Monitoring', to: '/services/site-monitoring' },
            ].map(item => (
              <Link key={item.label} to={item.to} style={{ display: 'block', color: '#8898b4', textDecoration: 'none', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#00d9a6'}
                onMouseLeave={e => e.target.style.color = '#8898b4'}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Company</h4>
            {[
              { label: 'About Us', to: '/about' },
              { label: 'Our Team', to: '/team' },
              { label: 'Blog', to: '/blog' },
              { label: 'Contact', to: '/contact' },
            ].map(item => (
              <Link key={item.label} to={item.to} style={{ display: 'block', color: '#8898b4', textDecoration: 'none', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#00d9a6'}
                onMouseLeave={e => e.target.style.color = '#8898b4'}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Contact</h4>
            <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.7 }}>
              7710 Hazard Center Dr #E<br />
              San Diego, CA 92108
            </p>
            <a href="tel:+18583663838" style={{ display: 'block', color: '#8898b4', textDecoration: 'none', fontSize: 14, marginTop: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#00d9a6'}
              onMouseLeave={e => e.target.style.color = '#8898b4'}>
              (858) 366-3838
            </a>
            <a href="mailto:hello@insitehealthsystems.com" style={{ display: 'block', color: '#00d9a6', textDecoration: 'none', fontSize: 14, marginTop: 6, transition: 'color 0.2s' }}>
              hello@insitehealthsystems.com
            </a>
            <Link to="/contact" style={{
              display: 'inline-block', marginTop: 14, color: '#0a0f1e',
              background: '#00d9a6', textDecoration: 'none', fontSize: 13,
              fontWeight: 700, padding: '8px 18px', borderRadius: 6,
            }}>Book a Demo</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#8898b4', fontSize: 13 }}>
            &copy; {new Date().getFullYear()} InSite Health Systems. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'HIPAA Compliance'].map(label => (
              <a key={label} href="#" style={{ color: '#8898b4', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#8898b4'}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
