'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, logout } from '../AdminAuth'
import {
  LayoutDashboard, FileText, PlusSquare, Tag, Settings,
  LogOut, Menu, X, ChevronRight, Bell, Globe, MapPin,
} from 'lucide-react'

const NAV = [
  {
    section: 'Content',
    items: [
      { label: 'Dashboard',   to: '/admin/dashboard',            icon: LayoutDashboard },
      { label: 'All Posts',   to: '/admin/dashboard/blog',       icon: FileText        },
      { label: 'New Post',    to: '/admin/dashboard/blog/new',   icon: PlusSquare      },
      { label: 'Categories',  to: '/admin/dashboard/categories', icon: Tag             },
    ],
  },
  {
    section: 'iLocate',
    items: [
      { label: 'Asset Dashboard', to: '/admin/dashboard/ilocate', icon: MapPin },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Settings',    to: '/admin/dashboard/settings',   icon: Settings        },
    ],
  },
]

export default function AdminLayout({ children }) {
  const router     = useRouter()
  const pathname   = usePathname()
  const [sideOpen, setSideOpen] = useState(true)
  const [mobile, setMobile]     = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/admin/dashboard/login') }
  }, [router])

  useEffect(() => {
    const check = () => { const m = window.innerWidth < 900; setMobile(m); if (m) setSideOpen(false) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close sidebar on mobile nav
  useEffect(() => { if (mobile) setSideOpen(false) }, [pathname, mobile])

  const handleLogout = () => { logout(); router.push('/admin/dashboard/login') }

  const isActive = (to) => {
    if (to === '/admin/dashboard') return pathname === to
    return pathname.startsWith(to)
  }

  const SIDEBAR_W = 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070c19', fontFamily: 'system-ui, -apple-system, DM Sans, sans-serif' }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {mobile && sideOpen && (
        <div onClick={() => setSideOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }} />
      )}

      <aside style={{
        width: SIDEBAR_W, flexShrink: 0,
        background: 'rgba(10,15,30,0.95)', borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        position: mobile ? 'fixed' : 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        zIndex: 50,
        transform: !sideOpen && mobile ? `translateX(-${SIDEBAR_W}px)` : 'translateX(0)',
        transition: 'transform 0.28s ease',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#00d9a6,#0ab8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#0a0f1e', flexShrink: 0 }}>IS</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>InSite Health</div>
              <div style={{ color: '#8898b4', fontSize: 11 }}>Admin Portal</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {NAV.map(group => (
            <div key={group.section} style={{ marginBottom: 24 }}>
              <div style={{ color: '#4a5568', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 6 }}>
                {group.section}
              </div>
              {group.items.map(item => {
                const active = isActive(item.to)
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 9, marginBottom: 2,
                      textDecoration: 'none',
                      background: active ? 'rgba(0,217,166,0.12)' : 'transparent',
                      color: active ? '#00d9a6' : '#8898b4',
                      fontWeight: active ? 600 : 400, fontSize: 14,
                      transition: 'all 0.15s',
                      borderLeft: active ? '2px solid #00d9a6' : '2px solid transparent',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff' }}}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8898b4' }}}
                  >
                    <item.icon size={16} />
                    {item.label}
                    {active && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* View site + logout */}
        <div style={{ padding: '12px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="/" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9, color: '#8898b4', fontSize: 14, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8898b4'; e.currentTarget.style.background = 'transparent' }}>
            <Globe size={16} /> View Site
          </a>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9, background: 'none', border: 'none', color: '#8898b4', fontSize: 14, cursor: 'pointer', width: '100%', transition: 'all 0.15s', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ff5e3a'; e.currentTarget.style.background = 'rgba(255,94,58,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8898b4'; e.currentTarget.style.background = 'transparent' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>

        {/* Top bar */}
        <header style={{ height: 60, background: 'rgba(10,15,30,0.9)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 30, backdropFilter: 'blur(12px)', flexShrink: 0 }}>
          <button onClick={() => setSideOpen(p => !p)}
            style={{ background: 'none', border: 'none', color: '#8898b4', cursor: 'pointer', padding: 4, display: 'flex', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#8898b4'}>
            {sideOpen && !mobile ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumb */}
          <Breadcrumb />

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'none', border: 'none', color: '#8898b4', cursor: 'pointer', padding: 4, display: 'flex', position: 'relative' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6, borderRadius: '50%', background: '#ff5e3a' }} />
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00d9a6,#0ab8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#0a0f1e' }}>A</div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

function Breadcrumb() {
  const pathname = usePathname()
  const parts = pathname.replace('/admin/dashboard', '').split('/').filter(Boolean)
  const labels = { blog: 'Blog', new: 'New Post', edit: 'Edit Post', categories: 'Categories', settings: 'Settings' }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8898b4', fontSize: 13 }}>
      <span style={{ color: '#8898b4' }}>Dashboard</span>
      {parts.map((p, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronRight size={12} />
          <span style={{ color: i === parts.length - 1 ? '#fff' : '#8898b4' }}>{labels[p] || p}</span>
        </span>
      ))}
    </div>
  )
}
