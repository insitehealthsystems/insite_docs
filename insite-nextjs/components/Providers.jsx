'use client'

import '@/i18n'   // initialise i18n synchronously — safe for SSR (no LanguageDetector)
import AuthProvider from '@/contexts/AuthContext'
import { BlogContentProvider } from '@/contexts/BlogContentContext'

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <BlogContentProvider>
        {children}
      </BlogContentProvider>
    </AuthProvider>
  )
}
