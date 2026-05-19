import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Save, Eye, ArrowLeft, Hash, AlignLeft, Tag,
  Image, Globe, Clock, CheckCircle, AlertCircle, Wand2,
  Bold, Italic, List, Link2, Heading2, Quote, Code
} from 'lucide-react'
import { getPost, savePost, getCategories, generateSlug } from '../blogStore'

const inp = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14,
  fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
}
const fo = (e) => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.1)' }
const bl = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

const EMPTY = {
  id: null, title: '', slug: '', excerpt: '', content: '',
  category: '', tags: [], status: 'draft',
  featuredImage: '', author: 'InSite Team',
  seoTitle: '', seoDescription: '',
}

/* ── Toolbar button ─────────────────────────────────────── */
function ToolBtn({ icon: Icon, label, onClick, active }) {
  return (
    <button type="button" title={label} onClick={onClick}
      style={{ width: 32, height: 32, borderRadius: 7, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(0,217,166,0.15)' : 'transparent', color: active ? '#00d9a6' : '#8898b4', transition: 'all 0.15s', flexShrink: 0 }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
      onMouseLeave={e => { e.currentTarget.style.background = active ? 'rgba(0,217,166,0.15)' : 'transparent'; e.currentTarget.style.color = active ? '#00d9a6' : '#8898b4' }}>
      <Icon size={14} />
    </button>
  )
}

/* ── Section wrapper ────────────────────────────────────── */
function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
      <button type="button" onClick={() => setOpen(p => !p)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none', color: '#fff' }}>
        {Icon && <Icon size={15} color="#00d9a6" />}
        <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
        <svg style={{ marginLeft: 'auto', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 5l5 5 5-5" stroke="#8898b4" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
      {open && <div style={{ padding: '16px 18px' }}>{children}</div>}
    </div>
  )
}

export default function BlogEditor() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isNew      = !id

  const [post, setPost]       = useState({ ...EMPTY })
  const [cats, setCats]       = useState([])
  const [tagInput, setTagInput] = useState('')
  const [preview, setPreview]  = useState(false)
  const [saving, setSaving]    = useState(false)
  const [saved, setSaved]      = useState(false)
  const [saveErr, setSaveErr]  = useState('')
  const [dirty, setDirty]      = useState(false)
  const textareaRef            = useRef(null)
  const autoSaveRef            = useRef(null)

  useEffect(() => {
    setCats(getCategories())
    if (!isNew) {
      const p = getPost(id)
      if (p) setPost(p)
      else navigate('/admin/dashboard/blog', { replace: true })
    }
  }, [id, isNew, navigate])

  // Auto-save drafts
  useEffect(() => {
    if (!dirty) return
    clearTimeout(autoSaveRef.current)
    autoSaveRef.current = setTimeout(() => {
      if (post.status === 'draft' && post.title) doSave(false)
    }, 3000)
    return () => clearTimeout(autoSaveRef.current)
  }, [post, dirty])

  const set = useCallback((key, val) => {
    setPost(p => ({ ...p, [key]: val }))
    setDirty(true)
  }, [])

  const handleTitle = (val) => {
    setPost(p => ({ ...p, title: val, slug: p.slug || generateSlug(val) }))
    setDirty(true)
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !post.tags.includes(t)) { set('tags', [...post.tags, t]) }
    setTagInput('')
  }

  const removeTag = (t) => set('tags', post.tags.filter(x => x !== t))

  const doSave = async (redirect = true) => {
    if (!post.title.trim()) { setSaveErr('Please enter a post title.'); return }
    setSaving(true); setSaveErr('')
    try {
      await new Promise(r => setTimeout(r, 300))
      const saved_post = { ...post, slug: post.slug || generateSlug(post.title) }
      savePost(saved_post)
      setSaved(true)
      setDirty(false)
      setTimeout(() => setSaved(false), 2500)
      if (redirect && isNew) navigate('/admin/dashboard/blog', { replace: true })
    } catch (e) {
      setSaveErr(e.message || 'Save failed.')
    } finally { setSaving(false) }
  }

  // Toolbar insert helpers
  const wrapSelection = (before, after = before) => {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e, value } = ta
    const selected = value.slice(s, e)
    const newVal = value.slice(0, s) + before + (selected || 'text') + after + value.slice(e)
    set('content', newVal)
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + (selected || 'text').length) }, 10)
  }

  const insertBlock = (text) => {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart: s, value } = ta
    const pre = value.slice(0, s).endsWith('\n') || s === 0 ? '' : '\n'
    const newVal = value.slice(0, s) + pre + text + '\n' + value.slice(s)
    set('content', newVal)
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + pre.length + text.length + 1, s + pre.length + text.length + 1) }, 10)
  }

  const toolbarActions = [
    { icon: Bold,     label: 'Bold',        fn: () => wrapSelection('**')         },
    { icon: Italic,   label: 'Italic',      fn: () => wrapSelection('*')          },
    { icon: Heading2, label: 'Heading 2',   fn: () => insertBlock('## Heading')   },
    { icon: List,     label: 'List',        fn: () => insertBlock('- List item')  },
    { icon: Quote,    label: 'Blockquote',  fn: () => insertBlock('> Quote')      },
    { icon: Code,     label: 'Code',        fn: () => wrapSelection('`')          },
    { icon: Link2,    label: 'Link',        fn: () => wrapSelection('[', '](url)') },
  ]

  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length
  const readTime  = Math.max(1, Math.round(wordCount / 200))

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <Link to="/admin/dashboard/blog" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8898b4', textDecoration: 'none', fontSize: 14, transition: 'color 0.15s', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#8898b4'}>
          <ArrowLeft size={15} /> All Posts
        </Link>
        <span style={{ color: '#4a5568' }}>·</span>
        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0, flex: 1, letterSpacing: '-0.02em' }}>
          {isNew ? 'New Post' : (post.title || 'Edit Post')}
        </h1>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
          {dirty && !saved && <span style={{ color: '#f7c94b', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12} /> Unsaved changes</span>}
          {saved && <span style={{ color: '#00d9a6', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}><CheckCircle size={12} /> Saved</span>}

          <button type="button" onClick={() => setPreview(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, border: `1px solid ${preview ? '#00d9a6' : 'rgba(255,255,255,0.12)'}`, background: preview ? 'rgba(0,217,166,0.1)' : 'transparent', color: preview ? '#00d9a6' : '#8898b4', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            <Eye size={14} /> {preview ? 'Edit' : 'Preview'}
          </button>

          <select value={post.status} onChange={e => set('status', e.target.value)}
            style={{ background: post.status === 'published' ? 'rgba(0,217,166,0.1)' : 'rgba(247,201,75,0.1)', border: `1px solid ${post.status === 'published' ? 'rgba(0,217,166,0.3)' : 'rgba(247,201,75,0.3)'}`, borderRadius: 9, padding: '9px 14px', color: post.status === 'published' ? '#00d9a6' : '#f7c94b', fontSize: 13, fontWeight: 700, cursor: 'pointer', outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <button onClick={() => doSave(false)} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 9, background: saving ? 'rgba(0,217,166,0.5)' : '#00d9a6', border: 'none', color: '#0a0f1e', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: saving ? 'none' : '0 4px 14px rgba(0,217,166,0.25)' }}
            onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = '#00c49a'; e.currentTarget.style.transform = 'translateY(-1px)' }}}
            onMouseLeave={e => { e.currentTarget.style.background = saving ? 'rgba(0,217,166,0.5)' : '#00d9a6'; e.currentTarget.style.transform = 'translateY(0)' }}>
            {saving ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" /><path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Saving…</>
            ) : <><Save size={14} /> Save</>}
          </button>
        </div>
      </div>

      {saveErr && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,94,58,0.1)', border: '1px solid rgba(255,94,58,0.25)', borderRadius: 10, padding: '11px 14px', marginBottom: 16 }}>
          <AlertCircle size={15} color="#ff5e3a" />
          <span style={{ color: '#ff5e3a', fontSize: 13 }}>{saveErr}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }} className="editor-grid">

        {/* ── Left: main content ─────────────────────────── */}
        <div>
          {!preview ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Title */}
              <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
                <input
                  type="text" value={post.title} onChange={e => handleTitle(e.target.value)}
                  placeholder="Post title…"
                  style={{ ...inp, background: 'transparent', border: 'none', padding: '0', fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', boxShadow: 'none' }}
                  onFocus={e => { e.target.style.outline = 'none' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  <span style={{ color: '#4a5568', fontSize: 12 }}>Slug:</span>
                  <input type="text" value={post.slug} onChange={e => set('slug', e.target.value)} placeholder="post-slug"
                    style={{ flex: 1, minWidth: 160, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '4px 10px', color: '#8898b4', fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#00d9a6'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                  />
                  <button type="button" onClick={() => set('slug', generateSlug(post.title))} title="Regenerate slug"
                    style={{ background: 'rgba(0,217,166,0.1)', border: 'none', borderRadius: 7, padding: '4px 8px', cursor: 'pointer', color: '#00d9a6', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}>
                    <Wand2 size={11} /> Auto
                  </button>
                  <span style={{ color: '#4a5568', fontSize: 11 }}>{wordCount} words · {readTime} min read</span>
                </div>
              </div>

              {/* Excerpt */}
              <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 18px' }}>
                <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                  <AlignLeft size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Excerpt (shown in post cards)
                </label>
                <textarea value={post.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} placeholder="Brief summary of this post…"
                  style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} onFocus={fo} onBlur={bl} />
              </div>

              {/* Content editor */}
              <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ color: '#4a5568', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 6 }}>Content</span>
                  {toolbarActions.map(({ icon, label, fn }) => (
                    <ToolBtn key={label} icon={icon} label={label} onClick={fn} />
                  ))}
                  <span style={{ color: '#4a5568', fontSize: 11, marginLeft: 'auto' }}>Markdown supported</span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={post.content} onChange={e => set('content', e.target.value)}
                  rows={22} placeholder="Write your post content here…&#10;&#10;## Heading&#10;**Bold text**, *italic text*&#10;- List item&#10;> Blockquote&#10;`code`"
                  style={{ ...inp, background: 'transparent', border: 'none', borderRadius: 0, padding: '18px 20px', resize: 'vertical', lineHeight: 1.75, fontFamily: 'JetBrains Mono, Consolas, monospace', fontSize: 14, boxShadow: 'none', minHeight: 380 }}
                  onFocus={fo} onBlur={bl}
                />
              </div>
            </div>
          ) : (
            /* Preview */
            <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '32px 36px' }}>
              {post.category && (
                <span style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, display: 'inline-block', marginBottom: 16 }}>{post.category}</span>
              )}
              <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.03em', margin: '0 0 12px' }}>{post.title || 'Untitled Post'}</h1>
              {post.excerpt && <p style={{ color: '#8898b4', fontSize: 17, lineHeight: 1.7, margin: '0 0 28px', borderLeft: '3px solid rgba(0,217,166,0.4)', paddingLeft: 16 }}>{post.excerpt}</p>}
              <div style={{ display: 'flex', gap: 16, marginBottom: 32, color: '#8898b4', fontSize: 13 }}>
                <span>By {post.author}</span>·<span>{wordCount} words · {readTime} min read</span>
                <span style={{ marginLeft: 'auto', background: post.status === 'published' ? 'rgba(0,217,166,0.12)' : 'rgba(247,201,75,0.12)', color: post.status === 'published' ? '#00d9a6' : '#f7c94b', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 100 }}>{post.status}</span>
              </div>
              <div style={{ color: '#d0d9e8', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap' }}>
                {post.content || <span style={{ color: '#4a5568' }}>No content yet…</span>}
              </div>
              {post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
                  {post.tags.map(t => (
                    <span key={t} style={{ background: 'rgba(255,255,255,0.06)', color: '#8898b4', fontSize: 12, padding: '4px 12px', borderRadius: 100 }}>#{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: meta sidebar ───────────────────────── */}
        <div>
          {/* Publish section */}
          <Section title="Publish" icon={Globe}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600 }}>Status</label>
                <select value={post.status} onChange={e => set('status', e.target.value)}
                  style={{ ...inp, padding: '9px 12px', cursor: 'pointer', colorScheme: 'dark' }}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600 }}>Author</label>
                <input type="text" value={post.author} onChange={e => set('author', e.target.value)} placeholder="Author name"
                  style={inp} onFocus={fo} onBlur={bl} />
              </div>
              <button onClick={() => doSave(false)}
                style={{ background: '#00d9a6', border: 'none', borderRadius: 9, padding: '11px', color: '#0a0f1e', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 14px rgba(0,217,166,0.2)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#00c49a' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#00d9a6' }}>
                <Save size={14} /> Save Post
              </button>
            </div>
          </Section>

          {/* Category */}
          <Section title="Category" icon={Tag}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <select value={post.category} onChange={e => set('category', e.target.value)}
                style={{ ...inp, cursor: 'pointer', colorScheme: 'dark' }} onFocus={fo} onBlur={bl}>
                <option value="">— Select category —</option>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Or type a new category…" onKeyDown={e => { if (e.key === 'Enter') { const v = e.target.value.trim(); if (v) { set('category', v); e.target.value = '' } }}}
                style={{ ...inp, fontSize: 13 }} onFocus={fo} onBlur={bl} />
            </div>
          </Section>

          {/* Tags */}
          <Section title="Tags" icon={Hash}>
            <div style={{ display: 'flex', gap: 7, marginBottom: 10 }}>
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
                placeholder="Add tag…"
                style={{ ...inp, flex: 1, fontSize: 13 }} onFocus={fo} onBlur={bl} />
              <button type="button" onClick={addTag}
                style={{ background: 'rgba(0,217,166,0.12)', border: '1px solid rgba(0,217,166,0.2)', borderRadius: 9, padding: '0 14px', color: '#00d9a6', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,217,166,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,217,166,0.12)'}>
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {post.tags.map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.07)', color: '#d0d9e8', fontSize: 12, padding: '4px 10px', borderRadius: 100 }}>
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8898b4', padding: 1, display: 'flex', lineHeight: 1 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff5e3a'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8898b4'}>×</button>
                </span>
              ))}
              {post.tags.length === 0 && <span style={{ color: '#4a5568', fontSize: 12 }}>No tags yet</span>}
            </div>
          </Section>

          {/* Featured Image */}
          <Section title="Featured Image" icon={Image} defaultOpen={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="url" value={post.featuredImage} onChange={e => set('featuredImage', e.target.value)} placeholder="https://… (image URL)"
                style={{ ...inp, fontSize: 13 }} onFocus={fo} onBlur={bl} />
              {post.featuredImage && (
                <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <img src={post.featuredImage} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                    onError={e => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
          </Section>

          {/* SEO */}
          <Section title="SEO" icon={Globe} defaultOpen={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600 }}>SEO Title <span style={{ color: '#4a5568' }}>(60 chars max)</span></label>
                <input type="text" value={post.seoTitle} onChange={e => set('seoTitle', e.target.value)} placeholder={post.title || 'SEO title…'}
                  maxLength={60} style={inp} onFocus={fo} onBlur={bl} />
                <span style={{ color: post.seoTitle.length > 55 ? '#ff5e3a' : '#4a5568', fontSize: 11 }}>{post.seoTitle.length}/60</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600 }}>Meta Description <span style={{ color: '#4a5568' }}>(160 chars max)</span></label>
                <textarea value={post.seoDescription} onChange={e => set('seoDescription', e.target.value)} rows={3} placeholder={post.excerpt || 'Meta description…'}
                  maxLength={160} style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} onFocus={fo} onBlur={bl} />
                <span style={{ color: post.seoDescription.length > 150 ? '#ff5e3a' : '#4a5568', fontSize: 11 }}>{post.seoDescription.length}/160</span>
              </div>
              {/* SERP preview */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ color: '#4a5568', fontSize: 10, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>SERP Preview</div>
                <div style={{ color: '#6db4f8', fontSize: 14, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.seoTitle || post.title || 'Post Title'}</div>
                <div style={{ color: '#4a5568', fontSize: 11, marginBottom: 3 }}>insitehealthsystems.com › blog › {post.slug || 'post-slug'}</div>
                <div style={{ color: '#8898b4', fontSize: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.seoDescription || post.excerpt || 'Meta description will appear here.'}</div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:860px){ .editor-grid { grid-template-columns: 1fr !important; } }
        select option { background: #1c2438; color: #fff; }
      `}</style>
    </div>
  )
}
