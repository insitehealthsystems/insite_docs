'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole = 'author' }) => {
  const { isAuthenticated, hasPermission, isLoading } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/admin/dashboard/login?from=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, isAuthenticated, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#00d9a6' }} />
          <p style={{ color: '#8898b4' }}>Checking authentication…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (!hasPermission(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
        <div className="text-center">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🚫</div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Access Denied</h1>
          <p style={{ color: '#8898b4', marginBottom: 16 }}>Required role: {requiredRole}</p>
          <button onClick={() => window.history.back()}
            style={{ background: '#00d9a6', color: '#0a0f1e', padding: '8px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700 }}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
