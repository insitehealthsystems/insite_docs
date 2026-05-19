'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { ChevronDown } from 'lucide-react'

const serviceLinks = [
  { label: '📡 Asset Tracking',   to: '/services/asset-tracking',  desc: 'Sub-room BLE + RFID precision',        color: '#00d9a6' },
  { label: '🔒 Mobile Security',  to: '/services/mobile-security', desc: 'HIPAA-compliant by design',            color: '#0ab8ff' },
  { label: '📊 Capital Planning', to: '/services/capital-planning',desc: 'Stop buying what you own',            color: '#f7c94b' },
  { label: '🏥 Site Monitoring',  to: '/services/site-monitoring', desc: 'Campus-wide operational visibility',   color: '#ff5e3a' },
]

const Header = () => {
  const [scrolled, setScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setServicesOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isServicesActive = pathname.startsWith('/services')

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
      background: scrolled ? 'rgba(10,15,30,0.95)' : 'rgba(10,15,30,0.65)',
      backdropFilter: scrolled ? 'blur(24px)' : 'blur(12px)',
      WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(12px)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', height: 68, gap: 32,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
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

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }} className="desktop-nav">

          {/* Services dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setServicesOpen(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: isServicesActive ? '#00d9a6' : '#8898b4',
                fontSize: 14, fontWeight: 500,
                padding: '6px 14px', borderRadius: 8, transition: 'color 0.2s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
              onMouseEnter={e => { if (!isServicesActive) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if (!isServicesActive) e.currentTarget.style.color = '#8898b4' }}
            >
              Services
              <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {servicesOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(10,15,30,0.97)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: 8, minWidth: 280,
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)', zIndex: 100,
              }}>
                {/* Overview link */}
                <Link href="/services" style={{ display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', marginBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>All Services</div>
                  <div style={{ color: '#8898b4', fontSize: 12 }}>Four modules. One platform.</div>
                </Link>
                {/* Sub-links */}
                {serviceLinks.map(s => (
                  <Link key={s.to} href={s.to} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0, marginTop: 6 }} />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{s.label}</div>
                      <div style={{ color: '#8898b4', fontSize: 11 }}>{s.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other links */}
          {[
            { label: 'About',   to: '/about'   },
            { label: 'Team',    to: '/team'    },
            { label: 'Blog',    to: '/blog'    },
            { label: 'Contact', to: '/contact' },
          ].map(link => (
            <Link key={link.to} href={link.to} style={{
              color: pathname === link.to ? '#00d9a6' : '#8898b4',
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              padding: '6px 14px', borderRadius: 8, transition: 'color 0.2s',
            }}
              onMouseEnter={e => { if (pathname !== link.to) e.target.style.color = '#fff' }}
              onMouseLeave={e => { if (pathname !== link.to) e.target.style.color = '#8898b4' }}
            >{link.label}</Link>
          ))}

          {isAuthenticated && (
            <Link href="/blog/manage" style={{
              color: '#8898b4', textDecoration: 'none', fontSize: 14, fontWeight: 500,
              padding: '6px 14px', borderRadius: 8, transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#8898b4'}
            >CMS</Link>
          )}
        </nav>

        {/* CTA */}
        <Link href="/contact" className="header-cta" style={{
          background: '#00d9a6', color: '#0a0f1e', textDecoration: 'none',
          fontSize: 13, fontWeight: 700, padding: '10px 22px', borderRadius: 8,
          whiteSpace: 'nowrap', transition: 'background 0.2s, transform 0.2s', flexShrink: 0,
        }}
          onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)' }}
        >Book a Demo</Link>

        {/* Hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="hamburger-btn" style={{
          display: 'none', background: 'none', border: 'none',
          color: '#fff', cursor: 'pointer', padding: 4,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(10,15,30,0.98)', borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '16px 24px 24px',
        }}>
          {/* Services accordion */}
          <button onClick={() => setMobileServicesOpen(v => !v)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            color: isServicesActive ? '#00d9a6' : '#fff', fontSize: 16, padding: '12px 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            Services
            <ChevronDown size={15} style={{ transition: 'transform 0.2s', transform: mobileServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
          {mobileServicesOpen && (
            <div style={{ padding: '4px 0 8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Link href="/services" style={{ display: 'block', color: '#8898b4', textDecoration: 'none', fontSize: 14, padding: '8px 0' }}>Overview — All Services</Link>
              {serviceLinks.map(s => (
                <Link key={s.to} href={s.to} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8898b4', textDecoration: 'none', fontSize: 14, padding: '8px 0' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  {s.label}
                </Link>
              ))}
            </div>
          )}

          {[
            { label: 'About',   to: '/about'   },
            { label: 'Team',    to: '/team'    },
            { label: 'Blog',    to: '/blog'    },
            { label: 'Contact', to: '/contact' },
          ].map(link => (
            <Link key={link.to} href={link.to} style={{
              display: 'block', color: '#fff', textDecoration: 'none',
              fontSize: 16, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>{link.label}</Link>
          ))}

          {isAuthenticated && (
            <Link href="/blog/manage" style={{
              display: 'block', color: '#fff', textDecoration: 'none',
              fontSize: 16, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>CMS</Link>
          )}
          <Link href="/contact" style={{
            display: 'block', marginTop: 16, background: '#00d9a6', color: '#0a0f1e',
            textDecoration: 'none', textAlign: 'center', padding: '12px',
            borderRadius: 8, fontWeight: 700, fontSize: 14,
          }}>Book a Demo</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .header-cta { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </header>
  )
}

export default Header
