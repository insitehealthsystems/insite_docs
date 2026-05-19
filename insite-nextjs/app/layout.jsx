// All pages render on request — avoids context-during-SSR issues
export const dynamic = 'force-dynamic'

import './globals.css'
import { Toaster } from 'sonner'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'InSite Health Systems',
  description: 'Real-time asset tracking and site monitoring for medical facilities.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="noise-overlay" aria-hidden="true" />
          <Toaster
            position="top-right"
            toastOptions={{ duration: 4000, style: { fontFamily: 'inherit' } }}
            richColors
          />
          {children}
        </Providers>
      </body>
    </html>
  )
}
