import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useBlogContent } from '../contexts/BlogContentContext'
import { submitNewsletter } from '../utils/api'
import { Calendar, User, MessageCircle, Search, ChevronRight, Tag, Clock, Loader2 } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

/* ── Shared input style ───────────────────────────────────── */
const inputStyle = {
  width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none',
  fontFamily: 'DM Sans, Outfit, sans-serif', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

/* ── Blog post card ───────────────────────────────────────── */
const BlogPostCard = ({ rawPost, getTranslatedPost, currentLanguage, formatDate, t }) => {
  const [post, setPost] = useState(() => {
    const en = rawPost.content?.en || {}
    return { ...rawPost, title: en.title || rawPost.title || '', excerpt: en.excerpt || rawPost.excerpt || '', tags: en.tags || rawPost.tags || [] }
  })

  useEffect(() => {
    let cancelled = false
    getTranslatedPost(rawPost, currentLanguage).then((translated) => {
      if (!cancelled && translated) setPost(translated)
    })
    return () => { cancelled = true }
  }, [currentLanguage]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <article style={{
      background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, overflow: 'hidden',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor = 'rgba(0,217,166,0.2)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
    >
      {/* Featured image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <img
          src={post.featuredImage?.url || post.featuredImage}
          alt={post.featuredImage?.altText || post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {/* Category badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(post.categories || []).map((cat, i) => (
            <span key={i} style={{
              background: 'rgba(0,217,166,0.9)', color: '#0a0f1e',
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
            }}>{cat}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
          {[
            { Icon: User,     text: post.author?.name },
            { Icon: Calendar, text: formatDate(post.publishedAt || post.publishDate) },
            { Icon: Clock,    text: post.readTime },
          ].filter(m => m.text).map(({ Icon, text }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8898b4', fontSize: 12 }}>
              <Icon size={13} />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <h3 style={{ marginBottom: 10, lineHeight: 1.4 }}>
          <Link to={`/blog/${post.slug}`} style={{
            color: '#fff', textDecoration: 'none', fontFamily: 'Bricolage Grotesque, sans-serif',
            fontWeight: 700, fontSize: 17, transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#00d9a6'}
            onMouseLeave={e => e.target.style.color = '#fff'}
          >{post.title}</Link>
        </h3>

        <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>{post.excerpt}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to={`/blog/${post.slug}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: '#00d9a6', textDecoration: 'none', fontSize: 13, fontWeight: 600,
            transition: 'gap 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.gap = '8px'}
            onMouseLeave={e => e.currentTarget.style.gap = '4px'}
          >
            {t('blog.readMore')} <ChevronRight size={14} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8898b4', fontSize: 12 }}>
            <MessageCircle size={13} />
            <span>{post.commentCount || 0} {t('blog.comments')}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

/* ── Sidebar widget wrapper ──────────────────────────────── */
const SideWidget = ({ title, children }) => (
  <div style={{
    background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, padding: '22px 20px', marginBottom: 20,
  }}>
    <h3 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>{title}</h3>
    {children}
  </div>
)

/* ── Page ────────────────────────────────────────────────── */
const BlogPage = () => {
  const { t, i18n } = useTranslation()
  const { getTranslatedPost, currentLanguage } = useBlogContent()

  const [posts, setPosts]               = useState([])
  const [totalPages, setTotalPages]     = useState(1)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [recentPosts, setRecentPosts]   = useState([])
  const [searchQuery, setSearchQuery]   = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [currentPage, setCurrentPage]   = useState(1)
  const [newsletterEmail, setNewsletterEmail]   = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState(null)
  const [tags, setTags]           = useState([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const postsPerPage = 6

  const categories = [
    { name: t('blog.categories.healthcareTech'),  count: 15 },
    { name: t('blog.categories.digitalHealth'),   count: 12 },
    { name: t('blog.categories.compliance'),      count: 8  },
    { name: t('blog.categories.assetManagement'), count: 6  },
    { name: t('blog.categories.telemedicine'),    count: 10 },
    { name: t('blog.categories.mobileHealth'),    count: 9  },
    { name: t('blog.categories.dataAnalytics'),   count: 7  },
  ]

  const formatDate = (date) => {
    if (!date) return ''
    const d = date instanceof Date ? date : new Date(date)
    return d.toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const fetchPosts = useCallback(async (page, search) => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({ page, limit: postsPerPage, status: 'published' })
      if (search) params.set('search', search)
      const res = await fetch(`${API_BASE_URL}/api/blog/posts?${params}`)
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const json = await res.json()
      setPosts(json.data || json.posts || [])
      const total = json.pagination?.total ?? json.totalPages ?? json.total ?? 0
      setTotalPages(Math.ceil(total / postsPerPage) || 1)
    } catch (err) {
      setError(err.message); setPosts([])
    } finally { setLoading(false) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blog/posts?page=1&limit=3&status=published`)
      .then(r => r.ok ? r.json() : null)
      .then(json => { if (json) setRecentPosts(json.data || json.posts || []) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setTagsLoading(true)
    fetch(`${API_BASE_URL}/api/blog/tags`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.tags) setTags(data.tags) })
      .catch(() => {})
      .finally(() => setTagsLoading(false))
  }, [])

  useEffect(() => { fetchPosts(currentPage, activeSearch) }, [currentPage, activeSearch, fetchPosts])

  const handleSearch = (e) => { e.preventDefault(); setActiveSearch(searchQuery.trim()); setCurrentPage(1) }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setNewsletterStatus('loading')
    try {
      await submitNewsletter({ email: newsletterEmail })
      setNewsletterStatus('success'); setNewsletterEmail('')
      setTimeout(() => setNewsletterStatus(null), 5000)
    } catch {
      setNewsletterStatus('error')
      setTimeout(() => setNewsletterStatus(null), 5000)
    }
  }

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 130, paddingBottom: 72, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(10,184,255,0.09) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20, color: '#8898b4', fontSize: 13 }}>
            <Link to="/" style={{ color: '#8898b4', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#8898b4'}>{t('nav.home', 'Home')}</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>{t('nav.blog', 'Blog')}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(10,184,255,0.08)', border: '1px solid rgba(10,184,255,0.25)', padding: '6px 16px', borderRadius: 100, marginBottom: 20 }}>
            <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#0ab8ff', display: 'inline-block' }} />
            <span style={{ color: '#0ab8ff', fontSize: 13, fontWeight: 600 }}>Insights & Updates</span>
          </div>
          <h1 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(34px, 5vw, 58px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
            {t('blog.title', 'The ')}{' '}
            <span style={{ background: 'linear-gradient(95deg, #0ab8ff, #00d9a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              InSite Blog
            </span>
          </h1>
          <p style={{ color: '#8898b4', fontSize: 17, lineHeight: 1.75 }}>
            {t('blog.subtitle', 'Healthcare technology insights, operational best practices, and updates from our team.')}
          </p>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }} className="blog-main-grid">

        {/* ── Posts column ──────────────────────────────── */}
        <div>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
              <Loader2 size={36} color="#00d9a6" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ color: '#ff5e3a', marginBottom: 16 }}>{t('blog.failedToLoad', 'Failed to load posts.')}</p>
              <button onClick={() => fetchPosts(currentPage, activeSearch)} style={{ color: '#00d9a6', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, textDecoration: 'underline' }}>
                {t('blog.tryAgain', 'Try again')}
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ color: '#8898b4', fontSize: 16 }}>
                {t('blog.noPostsFound', 'No posts found')}{activeSearch ? ` for "${activeSearch}"` : ''}.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gap: 22, marginBottom: 40 }}>
                {posts.map((rawPost) => (
                  <BlogPostCard
                    key={rawPost._id || rawPost.id}
                    rawPost={rawPost}
                    getTranslatedPost={getTranslatedPost}
                    currentLanguage={currentLanguage}
                    formatDate={formatDate}
                    t={t}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} style={{
                      width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                      background: currentPage === i + 1 ? '#00d9a6' : 'rgba(28,36,56,0.6)',
                      color: currentPage === i + 1 ? '#0a0f1e' : '#8898b4',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                      onMouseEnter={e => { if (currentPage !== i + 1) { e.target.style.background = 'rgba(0,217,166,0.15)'; e.target.style.color = '#00d9a6' } }}
                      onMouseLeave={e => { if (currentPage !== i + 1) { e.target.style.background = 'rgba(28,36,56,0.6)'; e.target.style.color = '#8898b4' } }}
                    >{i + 1}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Sidebar ────────────────────────────────────── */}
        <div>
          {/* Search */}
          <SideWidget title={t('common.search', 'Search')}>
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input
                type="text" placeholder={t('blog.searchPlaceholder', 'Search articles...')}
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
              <button type="submit" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8898b4', display: 'flex' }}>
                <Search size={16} />
              </button>
            </form>
          </SideWidget>

          {/* Recent posts */}
          {recentPosts.length > 0 && (
            <SideWidget title={t('blog.recentPosts', 'Recent Posts')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {recentPosts.map(rp => {
                  const title = rp.content?.en?.title || rp.title || ''
                  return (
                    <div key={rp._id || rp.id} style={{ display: 'flex', gap: 12 }}>
                      <img
                        src={rp.featuredImage?.url || rp.featuredImage} alt={title}
                        style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div>
                        <Link to={`/blog/${rp.slug}`} style={{ color: '#c8d5e8', textDecoration: 'none', fontSize: 13, fontWeight: 600, lineHeight: 1.4, display: 'block', marginBottom: 4, transition: 'color 0.2s' }}
                          onMouseEnter={e => e.target.style.color = '#00d9a6'}
                          onMouseLeave={e => e.target.style.color = '#c8d5e8'}
                        >
                          {title.substring(0, 58)}{title.length > 58 ? '…' : ''}
                        </Link>
                        <span style={{ color: '#8898b4', fontSize: 11 }}>{formatDate(rp.publishedAt || rp.publishDate)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </SideWidget>
          )}

          {/* Categories */}
          <SideWidget title={t('blog.categoriesLabel', 'Categories')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {categories.map((cat, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < categories.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <Link to={`/blog/category/${cat.name.toLowerCase().replace(/ /g, '-')}`} style={{ color: '#8898b4', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#00d9a6'}
                    onMouseLeave={e => e.target.style.color = '#8898b4'}
                  >{cat.name}</Link>
                  <span style={{ background: 'rgba(0,217,166,0.1)', color: '#00d9a6', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>{cat.count}</span>
                </div>
              ))}
            </div>
          </SideWidget>

          {/* Tags */}
          <SideWidget title={t('blog.tags', 'Tags')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tagsLoading ? (
                <span style={{ color: '#8898b4', fontSize: 13 }}>{t('blog.loadingTags', 'Loading...')}</span>
              ) : tags.map((tag, i) => (
                <Link key={i} to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#8898b4', textDecoration: 'none', fontSize: 12, padding: '4px 10px', borderRadius: 100,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,166,0.12)'; e.currentTarget.style.borderColor = 'rgba(0,217,166,0.3)'; e.currentTarget.style.color = '#00d9a6' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#8898b4' }}
                >
                  <Tag size={10} />{tag}
                </Link>
              ))}
            </div>
          </SideWidget>
        </div>
      </div>

      {/* ── Newsletter ──────────────────────────────────── */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, rgba(10,184,255,0.08) 0%, rgba(0,217,166,0.06) 100%)',
        borderTop: '1px solid rgba(10,184,255,0.12)',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 38px)', color: '#fff', letterSpacing: '-0.03em', marginBottom: 12 }}>
            {t('blog.newsletter.title', 'Stay in the Loop')}
          </h2>
          <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
            {t('blog.newsletter.description', 'Get the latest healthcare technology insights delivered to your inbox.')}
          </p>
          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email" required value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              placeholder={t('blog.newsletter.placeholder', 'your@hospital.org')}
              style={{ ...inputStyle, flex: '1 1 240px', maxWidth: 320 }}
              onFocus={e => { e.target.style.borderColor = '#0ab8ff'; e.target.style.boxShadow = '0 0 0 3px rgba(10,184,255,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
            />
            <button type="submit" disabled={newsletterStatus === 'loading'} style={{
              background: '#00d9a6', color: '#0a0f1e', border: 'none', borderRadius: 9,
              padding: '11px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'background 0.2s', opacity: newsletterStatus === 'loading' ? 0.6 : 1,
            }}
              onMouseEnter={e => { if (newsletterStatus !== 'loading') e.target.style.background = '#00c49a' }}
              onMouseLeave={e => e.target.style.background = '#00d9a6'}
            >
              {newsletterStatus === 'loading' ? t('blog.subscribing', 'Subscribing…') : t('blog.newsletter.subscribe', 'Subscribe')}
            </button>
          </form>
          {newsletterStatus === 'success' && <p style={{ color: '#00d9a6', fontSize: 13, marginTop: 12 }}>{t('blog.subscribeSuccess', 'You are subscribed!')}</p>}
          {newsletterStatus === 'error'   && <p style={{ color: '#ff5e3a', fontSize: 13, marginTop: 12 }}>{t('blog.subscribeError', 'Something went wrong. Please try again.')}</p>}
          <p style={{ color: '#8898b4', fontSize: 12, marginTop: 10 }}>{t('blog.newsletter.privacy', 'No spam, ever. Unsubscribe any time.')}</p>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){.blog-main-grid{grid-template-columns:1fr!important;}}
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default BlogPage
