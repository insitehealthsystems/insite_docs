'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, isAuthenticated } from '../AdminAuth'
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) router.replace('/admin/dashboard')
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter your username and password.')
      return
    }
    setLoading(true)
    // Simulate brief network delay
    await new Promise(r => setTimeout(r, 600))
    const ok = login(form.username.trim(), form.password)
    setLoading(false)
    if (ok) {
      router.replace('/admin/dashboard')
    } else {
      setError('Invalid username or password.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0f1e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '52px 52px',
      }} />
      {/* Glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,217,166,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg,#00d9a6,#0ab8ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: 18, color: '#0a0f1e',
          }}>IS</div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.03em' }}>
            InSite Admin
          </h1>
          <p style={{ color: '#8898b4', fontSize: 14, margin: 0 }}>Sign in to manage your content</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(28,36,56,0.7)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '32px 28px',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,94,58,0.1)', border: '1px solid rgba(255,94,58,0.25)',
              borderRadius: 10, padding: '11px 14px', marginBottom: 20,
            }}>
              <AlertCircle size={15} color="#ff5e3a" />
              <span style={{ color: '#ff5e3a', fontSize: 13 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ color: '#8898b4', fontSize: 13, fontWeight: 600 }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#8898b4" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  placeholder="admin"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, padding: '12px 14px 12px 38px',
                    color: '#fff', fontSize: 14, outline: 'none',
                    fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ color: '#8898b4', fontSize: 13, fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#8898b4" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, padding: '12px 42px 12px 38px',
                    color: '#fff', fontSize: 14, outline: 'none',
                    fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8898b4', padding: 2, display: 'flex' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                background: loading ? 'rgba(0,217,166,0.5)' : '#00d9a6',
                color: '#0a0f1e', border: 'none', borderRadius: 10,
                padding: '13px', fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading ? 'none' : '0 4px 20px rgba(0,217,166,0.25)',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#00c49a'; e.currentTarget.style.transform = 'translateY(-1px)' }}}
              onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(0,217,166,0.5)' : '#00d9a6'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#4a5568', fontSize: 12, marginTop: 20 }}>
          InSite Health Systems · Admin Portal
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
