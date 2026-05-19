import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Services', to: '/services' },
  { label: 'Outcomes', to: '/outcomes' },
  { label: 'Who We Serve', to: '/who-we-serve' },
  { label: 'FAQ', to: '/faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
  }, [location])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
        background: scrolled ? 'rgba(10,15,30,0.92)' : 'rgba(10,15,30,0.6)',
        backdropFilter: scrolled ? 'blur(24px)' : 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 68, gap: 32 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #00d9a6, #0ab8ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 14, color: '#0a0f1e',
          }}>IS</div>
          <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>
            InSite Health
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color: location.pathname === link.to ? '#00d9a6' : '#8898b4',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                padding: '6px 14px',
                borderRadius: 8,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { if (location.pathname !== link.to) e.target.style.color = '#fff' }}
              onMouseLeave={e => { if (location.pathname !== link.to) e.target.style.color = '#8898b4' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          to="/book-demo"
          style={{
            background: '#00d9a6',
            color: '#0a0f1e',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 700,
            padding: '10px 22px',
            borderRadius: 8,
            whiteSpace: 'nowrap',
            transition: 'background 0.2s, transform 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)' }}
        >
          Apply as Founding Partner
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 4,
          }}
          className="mobile-menu-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(10,15,30,0.98)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '16px 24px 24px',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'block',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 16,
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/book-demo"
            style={{
              display: 'block',
              marginTop: 16,
              background: '#00d9a6',
              color: '#0a0f1e',
              textDecoration: 'none',
              textAlign: 'center',
              padding: '12px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Apply as Founding Partner
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .mobile-menu-btn { display: block !important; }
          nav { display: none !important; }
          header a[href="/book-demo"] { display: none; }
        }
      `}</style>
    </header>
  )
}
