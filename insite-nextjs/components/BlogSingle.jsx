'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useBlogContent } from '../contexts/BlogContentContext'
import {
  Calendar, User, MessageCircle, Search, Tag, Clock,
  Share2, Users, ExternalLink, Heart, Bookmark, Loader2,
} from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

const normalisePost = (raw) => {
  if (!raw) return null
  const patched = { ...raw }
  if (patched.content?.en) {
    patched.content = {
      ...patched.content,
      en: { ...patched.content.en, content: patched.content.en.content ?? patched.content.en.body ?? '' },
    }
  }
  patched.id = raw._id || raw.id
  patched.publishDate = raw.publishedAt || raw.publishDate
  return patched
}

/* ── Shared input style ──────────────────────────────────── */
const inputStyle = {
  width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none',
  fontFamily: 'DM Sans, Outfit, sans-serif', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const focusOn  = (e) => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.1)' }
const focusOff = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

/* ── Sidebar widget ──────────────────────────────────────── */
const SideWidget = ({ title, children }) => (
  <div style={{ background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '22px 20px', marginBottom: 20 }}>
    <h3 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>{title}</h3>
    {children}
  </div>
)

/* ── Page ────────────────────────────────────────────────── */
const BlogSingle = () => {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const { getTranslatedPost, currentLanguage } = useBlogContent()

  const [post, setPost]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [notFound, setNotFound]       = useState(false)
  const [recentPosts, setRecentPosts] = useState([])
  const [comments, setComments]       = useState([])
  const [sidebarTags, setSidebarTags] = useState([])
  const [newComment, setNewComment]   = useState({ name: '', email: '', website: '', comment: '' })
  const [commentStatus, setCommentStatus] = useState(null)
  const [isLiked, setIsLiked]         = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [sideSearch, setSideSearch]   = useState('')

  const categories = [
    { name: t('blog.categories.healthcareTech'),  count: 15 },
    { name: t('blog.categories.digitalHealth'),   count: 12 },
    { name: t('blog.categories.compliance'),      count: 8  },
    { name: t('blog.categories.assetManagement'), count: 6  },
    { name: t('blog.categories.telemedicine'),    count: 10 },
  ]

  useEffect(() => {
    let cancelled = false
    setLoading(true); setNotFound(false); setPost(null)
    fetch(`${API_BASE_URL}/api/blog/posts/${slug}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(async data => {
        if (cancelled) return
        const raw = data.data || data.post || data
        const translated = await getTranslatedPost(normalisePost(raw), currentLanguage)
        if (!cancelled) { setPost(translated); setLoading(false) }
      })
      .catch(() => { if (!cancelled) { setNotFound(true); setLoading(false) } })
    return () => { cancelled = true }
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!post) return
    let cancelled = false
    fetch(`${API_BASE_URL}/api/blog/posts/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(async data => {
        if (!data || cancelled) return
        const translated = await getTranslatedPost(normalisePost(data.data || data.post || data), currentLanguage)
        if (!cancelled) setPost(translated)
      })
    return () => { cancelled = true }
  }, [currentLanguage]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blog/posts?status=published&limit=4`)
      .then(r => r.ok ? r.json() : null)
      .then(async data => {
        if (!data) return
        const filtered = (data.data || data.posts || []).filter(p => p.slug !== slug).slice(0, 3)
        const translated = await Promise.all(filtered.map(p => getTranslatedPost(normalisePost(p), currentLanguage)))
        setRecentPosts(translated.filter(Boolean))
      })
      .catch(() => {})
  }, [slug, currentLanguage]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!slug) return
    fetch(`${API_BASE_URL}/api/blog/posts/${slug}/comments`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setComments(data.data) })
      .catch(() => {})
  }, [slug])

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blog/tags`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.tags) setSidebarTags(data.tags) })
      .catch(() => {})
  }, [])

  const formatDate = (date) => {
    if (!date) return ''
    const d = date instanceof Date ? date : new Date(date)
    return d.toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    setCommentStatus('loading')
    try {
      const res = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newComment),
      })
      if (!res.ok) throw new Error('Failed')
      setCommentStatus('success')
      setNewComment({ name: '', email: '', website: '', comment: '' })
      setTimeout(() => setCommentStatus(null), 6000)
    } catch {
      setCommentStatus('error')
      setTimeout(() => setCommentStatus(null), 5000)
    }
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const text = post?.title
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter:  `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  /* ── Loading ─────────────────────────────────────────── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <Loader2 size={40} color="#00d9a6" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#8898b4' }}>{t('common.loading', 'Loading...')}</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  /* ── Not found ───────────────────────────────────────── */
  if (notFound || !post) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, textAlign: 'center', padding: 24 }}>
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 64, fontWeight: 800, color: '#00d9a6', lineHeight: 1 }}>404</div>
      <p style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>{t('blog.notFound', 'Post not found')}</p>
      <p style={{ color: '#8898b4', fontSize: 15 }}>{t('blog.notFoundDesc', 'This article may have been moved or deleted.')}</p>
      <Link href="/blog" style={{ marginTop: 8, color: '#00d9a6', textDecoration: 'none', fontWeight: 600 }}>
        ← {t('nav.blog', 'Back to blog')}
      </Link>
    </div>
  )

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

      {/* ── Breadcrumb hero ────────────────────────────── */}
      <section style={{ paddingTop: 120, paddingBottom: 52, position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 900, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(10,184,255,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20, color: '#8898b4', fontSize: 13 }}>
            <Link href="/" style={{ color: '#8898b4', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#8898b4'}>{t('nav.home', 'Home')}</Link>
            <span>/</span>
            <Link href="/blog" style={{ color: '#8898b4', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#8898b4'}>{t('nav.blog', 'Blog')}</Link>
            <span>/</span>
            <span style={{ color: '#fff', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
          </div>
          <h1 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 4vw, 46px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            {post.title}
          </h1>
        </div>
      </section>

      {/* ── Content grid ──────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }} className="blogsingle-grid">

        {/* ── Article ──────────────────────────────────── */}
        <article>
          <div style={{ background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>

            {/* Featured image */}
            <div style={{ position: 'relative', height: 340, overflow: 'hidden' }}>
              <img
                src={post.featuredImage?.url || post.featuredImage}
                alt={post.featuredImage?.altText || post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.5) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 6 }}>
                {(post.categories || []).map((cat, i) => (
                  <span key={i} style={{ background: 'rgba(0,217,166,0.9)', color: '#0a0f1e', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>{cat}</span>
                ))}
              </div>
            </div>

            {/* Meta + actions */}
            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {[
                    { Icon: User,     text: `${t('blog.author', 'Author')}: ${post.author?.name}` },
                    { Icon: Calendar, text: formatDate(post.publishDate) },
                    post.readTime && { Icon: Clock, text: post.readTime },
                    { Icon: MessageCircle, text: `${post.commentCount || 0} ${t('blog.comments', 'comments')}` },
                  ].filter(Boolean).map(({ Icon, text }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8898b4', fontSize: 13 }}>
                      <Icon size={13} /><span>{text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => setIsLiked(!isLiked)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: isLiked ? 'rgba(255,94,58,0.15)' : 'rgba(255,255,255,0.06)', color: isLiked ? '#ff5e3a' : '#8898b4', transition: 'all 0.2s' }}>
                    <Heart size={14} fill={isLiked ? '#ff5e3a' : 'none'} color={isLiked ? '#ff5e3a' : '#8898b4'} />
                    {(post.likes || 0) + (isLiked ? 1 : 0)}
                  </button>
                  <button onClick={() => setIsBookmarked(!isBookmarked)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: isBookmarked ? 'rgba(10,184,255,0.15)' : 'rgba(255,255,255,0.06)', color: isBookmarked ? '#0ab8ff' : '#8898b4', transition: 'all 0.2s', display: 'flex' }}>
                    <Bookmark size={14} fill={isBookmarked ? '#0ab8ff' : 'none'} />
                  </button>
                  <span style={{ color: '#8898b4', fontSize: 12 }}>{t('blog.shareLabel', 'Share')}:</span>
                  {[
                    { label: 'facebook', Icon: Users,       color: '#3b5998' },
                    { label: 'twitter',  Icon: Share2,      color: '#1da1f2' },
                    { label: 'linkedin', Icon: ExternalLink, color: '#0a66c2' },
                  ].map(s => (
                    <button key={s.label} onClick={() => handleShare(s.label)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: `${s.color}22`, color: s.color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <s.Icon size={13} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Article body */}
              <div
                className="blog-prose"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {(post.tags || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }}>
                  <span style={{ color: '#8898b4', fontSize: 13, marginRight: 4 }}>{t('blog.tags', 'Tags')}:</span>
                  {post.tags.map((tag, i) => (
                    <Link key={i} to={`/blog/tag/${tag.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8898b4', textDecoration: 'none', fontSize: 12, padding: '4px 10px', borderRadius: 100, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,166,0.12)'; e.currentTarget.style.borderColor = 'rgba(0,217,166,0.3)'; e.currentTarget.style.color = '#00d9a6' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#8898b4' }}
                    ><Tag size={10} />{tag}</Link>
                  ))}
                </div>
              )}

              {/* Author bio */}
              <div style={{ background: 'rgba(10,15,30,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '22px 24px', marginTop: 32 }}>
                <h3 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>{t('blog.aboutAuthor', 'About the Author')}</h3>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  {post.author?.avatar && <img src={post.author.avatar} alt={post.author.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,217,166,0.3)', flexShrink: 0 }} />}
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{post.author?.name}</div>
                    {post.author?.bio && <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.65, marginBottom: 8 }}>{post.author.bio}</p>}
                    {post.author?.slug && (
                      <Link href={`/blog/author/${post.author.slug}`} style={{ color: '#00d9a6', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                        {t('blog.viewAllPostsBy', { name: post.author?.name })}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Approved comments */}
              {comments.length > 0 && (
                <div style={{ marginTop: 48 }}>
                  <h3 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>
                    {t('blog.comments', 'Comments')} ({comments.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {comments.map(c => (
                      <div key={c.id || c._id} style={{ background: 'rgba(10,15,30,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #00d9a6, #0ab8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#0a0f1e', flexShrink: 0 }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                            <div style={{ color: '#8898b4', fontSize: 11 }}>
                              {new Date(c.createdAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <p style={{ color: '#c8d5e8', fontSize: 14, lineHeight: 1.7 }}>{c.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment form */}
              <div style={{ marginTop: 48 }}>
                <h3 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>{t('blog.leaveComment', 'Leave a Comment')}</h3>
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="comment-form-row">
                    {[
                      { key: 'name',  label: t('blog.commentName', 'Name'), type: 'text',  required: true  },
                      { key: 'email', label: t('blog.commentEmail', 'Email'), type: 'email', required: true  },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label} {f.required && '*'}</label>
                        <input type={f.type} required={f.required} value={newComment[f.key]} onChange={e => setNewComment({ ...newComment, [f.key]: e.target.value })} placeholder={f.label} style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('blog.commentWebsite', 'Website')}</label>
                    <input type="url" value={newComment.website} onChange={e => setNewComment({ ...newComment, website: e.target.value })} placeholder={t('blog.commentWebsite', 'https://…')} style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('blog.commentMessage', 'Message')} *</label>
                    <textarea required rows={5} value={newComment.comment} onChange={e => setNewComment({ ...newComment, comment: e.target.value })} placeholder={t('blog.commentMessage', 'Share your thoughts…')} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <button type="submit" disabled={commentStatus === 'loading'} style={{ background: '#00d9a6', color: '#0a0f1e', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', opacity: commentStatus === 'loading' ? 0.6 : 1 }}
                      onMouseEnter={e => { if (commentStatus !== 'loading') { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)' } }}
                      onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)' }}
                    >{commentStatus === 'loading' ? t('common.loading', 'Sending…') : t('blog.postComment', 'Post Comment')}</button>
                    {commentStatus === 'success' && <p style={{ color: '#00d9a6', fontSize: 13, marginTop: 10 }}>{t('blog.commentSubmitted', 'Thank you! Your comment is awaiting moderation.')}</p>}
                    {commentStatus === 'error'   && <p style={{ color: '#ff5e3a', fontSize: 13, marginTop: 10 }}>{t('blog.commentError', 'Could not submit comment. Please try again.')}</p>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </article>

        {/* ── Sidebar ──────────────────────────────────── */}
        <div>
          {/* Search */}
          <SideWidget title={t('common.search', 'Search')}>
            <form onSubmit={e => { e.preventDefault(); window.location.href = `/blog?search=${sideSearch}` }} style={{ position: 'relative' }}>
              <input type="text" placeholder={t('blog.searchPlaceholder', 'Search articles…')} value={sideSearch} onChange={e => setSideSearch(e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
              <button type="submit" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8898b4', display: 'flex' }}>
                <Search size={15} />
              </button>
            </form>
          </SideWidget>

          {/* Recent posts */}
          {recentPosts.length > 0 && (
            <SideWidget title={t('blog.recentPosts', 'Recent Posts')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {recentPosts.map(rp => (
                  <div key={rp.id || rp._id} style={{ display: 'flex', gap: 10 }}>
                    {(rp.featuredImage?.url || rp.featuredImage) && (
                      <img src={rp.featuredImage?.url || rp.featuredImage} alt={rp.title} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div>
                      <Link href={`/blog/${rp.slug}`} style={{ color: '#c8d5e8', textDecoration: 'none', fontSize: 13, fontWeight: 600, lineHeight: 1.4, display: 'block', marginBottom: 4, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#00d9a6'}
                        onMouseLeave={e => e.target.style.color = '#c8d5e8'}
                      >{(rp.title || '').substring(0, 55)}{(rp.title || '').length > 55 ? '…' : ''}</Link>
                      <span style={{ color: '#8898b4', fontSize: 11 }}>{formatDate(rp.publishDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SideWidget>
          )}

          {/* Categories */}
          <SideWidget title={t('blog.categoriesLabel', 'Categories')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {categories.map((cat, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < categories.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <Link href={`/blog/category/${cat.name.toLowerCase().replace(/ /g, '-')}`} style={{ color: '#8898b4', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#00d9a6'} onMouseLeave={e => e.target.style.color = '#8898b4'}
                  >{cat.name}</Link>
                  <span style={{ background: 'rgba(0,217,166,0.1)', color: '#00d9a6', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>{cat.count}</span>
                </div>
              ))}
            </div>
          </SideWidget>

          {/* Tags */}
          {sidebarTags.length > 0 && (
            <SideWidget title={t('blog.tags', 'Tags')}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {sidebarTags.map((tag, i) => (
                  <Link key={i} to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8898b4', textDecoration: 'none', fontSize: 12, padding: '4px 10px', borderRadius: 100, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,166,0.12)'; e.currentTarget.style.borderColor = 'rgba(0,217,166,0.3)'; e.currentTarget.style.color = '#00d9a6' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#8898b4' }}
                  ><Tag size={10} />{tag}</Link>
                ))}
              </div>
            </SideWidget>
          )}
        </div>
      </div>

      {/* ── You might also like ───────────────────────── */}
      {recentPosts.length > 0 && (
        <section style={{ padding: '60px 0 100px', background: '#070c19', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <h3 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 32, textAlign: 'center' }}>
              {t('blog.youMightAlsoLike', 'You Might Also Like')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 22 }}>
              {recentPosts.map(rp => (
                <Link key={rp.id || rp._id} to={`/blog/${rp.slug}`} style={{ textDecoration: 'none', background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', display: 'block', transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = 'rgba(0,217,166,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                >
                  {(rp.featuredImage?.url || rp.featuredImage) && (
                    <div style={{ height: 160, overflow: 'hidden' }}>
                      <img src={rp.featuredImage?.url || rp.featuredImage} alt={rp.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                    </div>
                  )}
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, lineHeight: 1.4, marginBottom: 6 }}>{rp.title}</div>
                    <div style={{ color: '#8898b4', fontSize: 12 }}>{formatDate(rp.publishDate)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media(max-width:900px){
          .blogsingle-grid{grid-template-columns:1fr!important;}
          .comment-form-row{grid-template-columns:1fr!important;}
        }
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        /* Article prose styles */
        .blog-prose { color: #c8d5e8; font-size: 16px; line-height: 1.85; }
        .blog-prose h1,.blog-prose h2,.blog-prose h3,.blog-prose h4 {
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700;
          color: #fff; margin: 1.75em 0 0.65em; letter-spacing: -0.02em;
        }
        .blog-prose h2 { font-size: 1.55em; }
        .blog-prose h3 { font-size: 1.25em; }
        .blog-prose p  { margin-bottom: 1.2em; }
        .blog-prose a  { color: #00d9a6; text-decoration: underline; text-underline-offset: 3px; }
        .blog-prose a:hover { color: #0ab8ff; }
        .blog-prose ul,.blog-prose ol { padding-left: 1.5em; margin-bottom: 1.2em; }
        .blog-prose li { margin-bottom: 0.4em; }
        .blog-prose blockquote { border-left: 3px solid rgba(0,217,166,0.5); padding-left: 1.2em; color: #8898b4; font-style: italic; margin: 1.5em 0; }
        .blog-prose code { background: rgba(0,217,166,0.1); color: #00d9a6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        .blog-prose pre  { background: rgba(10,15,30,0.9); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 18px; overflow-x: auto; margin-bottom: 1.4em; }
        .blog-prose pre code { background: none; color: #c8d5e8; padding: 0; }
        .blog-prose img  { border-radius: 10px; max-width: 100%; margin: 1.5em 0; }
        .blog-prose hr   { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 2em 0; }
        .blog-prose strong { color: #fff; font-weight: 700; }
        input::placeholder,textarea::placeholder{color:#4a5a72;}
      `}</style>
    </div>
  )
}

export default BlogSingle
