import './i18n' // ensure i18n is initialized before any component renders
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import AuthProvider from './contexts/AuthContext'
import { BlogContentProvider } from './contexts/BlogContentContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ServicesPage from './pages/ServicesPage'
import TeamPage from './pages/TeamPage'
import BlogPage from './pages/BlogPage'
import BlogSingle from './pages/BlogSingle'
import AssetTracking from './pages/services/AssetTracking'
import MobileSecurity from './pages/services/MobileSecurity'
import CapitalPlanning from './pages/services/CapitalPlanning'
import SiteMonitoring from './pages/services/SiteMonitoring'
import PilotSetup from './pages/PilotSetup'
import BlogCategory from './pages/BlogCategory'
import BlogTag from './pages/BlogTag'

// New Admin CMS
import AdminLogin from './admin/pages/AdminLogin'
import AdminLayout from './admin/components/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import BlogList from './admin/pages/BlogList'
import AdminBlogEditor from './admin/pages/BlogEditor'
import Categories from './admin/pages/Categories'
import AdminSettings from './admin/pages/AdminSettings'
import ILocateDashboard from './admin/pages/ILocateDashboard'

function App() {
  const { i18n } = useTranslation()

  // Just Testing
  useEffect(() => {
    if (!i18n || typeof i18n.on !== 'function') return
    // Set document direction based on language
    const isRTL = i18n.language === 'ar'
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language || 'en'

    // Listen for language changes
    const handleLanguageChange = (lng) => {
      const isRTL = lng === 'ar'
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
      document.documentElement.lang = lng
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])
  
  return (
    <AuthProvider>
      <BlogContentProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { fontFamily: 'inherit' },
            }}
            richColors
          />
          <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
            {/* Noise texture overlay for depth */}
            <div className="noise-overlay" aria-hidden="true" />
            <Routes>
            {/* Public Routes with Header/Footer */}
            <Route path="/" element={
              <>
                <Header />
                <HomePage />
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Header />
                <AboutPage />
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <ContactPage />
                <Footer />
              </>
            } />
            {/* fixing the deployment issue */}
            <Route path="/services" element={
              <>
                <Header />
                <ServicesPage />
                <Footer />
              </>
            } />
            <Route path="/team" element={
              <>
                <Header />
                <TeamPage />
                <Footer />
              </>
            } />
            <Route path="/blog" element={
              <>
                <Header />
                <BlogPage />
                <Footer />
              </>
            } />
            <Route path="/blog/category/:name" element={
              <>
                <Header />
                <BlogCategory />
                <Footer />
              </>
            } />
            <Route path="/blog/tag/:tag" element={
              <>
                <Header />
                <BlogTag />
                <Footer />
              </>
            } />
            <Route path="/blog/:slug" element={
              <>
                <Header />
                <BlogSingle />
                <Footer />
              </>
            } />
            <Route path="/services/asset-tracking" element={
              <>
                <Header />
                <AssetTracking />
                <Footer />
              </>
            } />
            <Route path="/services/mobile-security" element={
              <>
                <Header />
                <MobileSecurity />
                <Footer />
              </>
            } />
            <Route path="/services/capital-planning" element={
              <>
                <Header />
                <CapitalPlanning />
                <Footer />
              </>
            } />
            <Route path="/services/site-monitoring" element={
              <>
                <Header />
                <SiteMonitoring />
                <Footer />
              </>
            } />
            <Route path="/pilot-setup" element={
              <>
                <Header />
                <PilotSetup />
                <Footer />
              </>
            } />
            
            {/* Legacy blog/manage redirects → new admin */}
            <Route path="/blog/manage" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/blog/manage/*" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Admin CMS — no Header/Footer */}
            <Route path="/admin/dashboard/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/new" element={<AdminBlogEditor />} />
              <Route path="blog/edit/:id" element={<AdminBlogEditor />} />
              <Route path="categories" element={<Categories />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="ilocate" element={<ILocateDashboard />} />
            </Route>
          </Routes>
        </div>
      </Router>
      </BlogContentProvider>
    </AuthProvider>
  )
}

export default App
