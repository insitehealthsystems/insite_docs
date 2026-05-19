import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, PlusSquare, Edit2, Trash2, Eye, EyeOff, Filter, ChevronUp, ChevronDown, Clock, Tag } from 'lucide-react'
import { getPosts, deletePost, savePost, getCategories } from '../blogStore'

const STATUS_OPTS = ['All', 'published', 'draft']

export default function BlogList() {
  const [posts, setPosts]     = useState([])
  const [cats, setCats]       = useState([])
  const [search, setSearch]   = useState('')
  const [statusF, setStatusF] = useState('All')
  const [catF, setCatF]       = useState('All')
  const [sortKey, setSortKey] = useState('updatedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [confirm, setConfirm] = useState(null) // id to confirm delete

  const load = useCallback(() => { setPosts(getPosts()); setCats(['All', ...getCategories()]) }, [])
  useEffect(load, [load])

  const handleDelete = (id) => {
    setPosts(deletePost(id))
    setConfirm(null)
  }

  const toggleStatus = (post) => {
    const updated = { ...post, status: post.status === 'published' ? 'draft' : 'published' }
    savePost(updated)
    load()
  }

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = posts
    .filter(p => statusF === 'All' || p.status === statusF)
    .filter(p => catF === 'All' || p.category === catF)
    .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let va = a[sortKey] || '', vb = b[sortKey] || ''
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronUp size={12} style={{ opacity: 0.3 }} />
    return sortDir === 'asc' ? <ChevronUp size={12} color="#00d9a6" /> : <ChevronDown size={12} color="#00d9a6" />
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.03em' }}>Blog Posts</h1>
          <p style={{ color: '#8898b4', fontSize: 14, margin: 0 }}>{posts.length} post{posts.length !== 1 ? 's' : ''} total · {posts.filter(p => p.status === 'published').length} published</p>
        </div>
        <Link to="/admin/dashboard/blog/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#00d9a6', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 10, transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(0,217,166,0.25)', whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#00c49a'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#00d9a6'; e.currentTarget.style.transform = 'translateY(0)' }}>
          <PlusSquare size={16} /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={15} color="#8898b4" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(28,36,56,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px 10px 36px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#00d9a6'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>
        {/* Status filter */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {STATUS_OPTS.map(s => (
            <button key={s} onClick={() => setStatusF(s)}
              style={{ padding: '9px 16px', borderRadius: 9, border: `1px solid ${statusF === s ? '#00d9a6' : 'rgba(255,255,255,0.08)'}`, background: statusF === s ? 'rgba(0,217,166,0.1)' : 'transparent', color: statusF === s ? '#00d9a6' : '#8898b4', fontSize: 13, fontWeight: statusF === s ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
        {/* Category filter */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Filter size={13} color="#8898b4" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <select value={catF} onChange={e => setCatF(e.target.value)}
            style={{ background: 'rgba(28,36,56,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px 10px 32px', color: '#8898b4', fontSize: 13, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', minWidth: 160 }}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <p style={{ color: '#8898b4', fontSize: 15, margin: '0 0 16px' }}>No posts found.</p>
            <Link to="/admin/dashboard/blog/new" style={{ color: '#00d9a6', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>Create your first post →</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                {[
                  { label: 'Title',    key: 'title'     },
                  { label: 'Category', key: 'category'  },
                  { label: 'Status',   key: 'status'    },
                  { label: 'Author',   key: 'author'    },
                  { label: 'Updated',  key: 'updatedAt' },
                  { label: 'Actions',  key: null        },
                ].map(({ label, key }) => (
                  <th key={label} onClick={() => key && toggleSort(key)}
                    style={{ textAlign: 'left', padding: '11px 16px', color: '#4a5568', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: key ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: sortKey === key ? '#fff' : '#4a5568', transition: 'color 0.15s' }}>
                      {label} {key && <SortIcon k={key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  <td style={{ padding: '13px 16px', maxWidth: 320 }}>
                    <Link to={`/admin/dashboard/blog/edit/${post.id}`}
                      style={{ color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      onMouseEnter={e => e.target.style.color = '#00d9a6'}
                      onMouseLeave={e => e.target.style.color = '#fff'}>
                      {post.title || <span style={{ color: '#4a5568' }}>Untitled</span>}
                    </Link>
                    {post.excerpt && <p style={{ color: '#8898b4', fontSize: 12, margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 280 }}>{post.excerpt}</p>}
                  </td>

                  <td style={{ padding: '13px 16px' }}>
                    {post.category ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>
                        <Tag size={10} /> {post.category}
                      </span>
                    ) : <span style={{ color: '#4a5568', fontSize: 12 }}>—</span>}
                  </td>

                  <td style={{ padding: '13px 16px' }}>
                    <button onClick={() => toggleStatus(post)}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 100, cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all 0.15s',
                        background: post.status === 'published' ? 'rgba(0,217,166,0.12)' : 'rgba(247,201,75,0.12)',
                        color: post.status === 'published' ? '#00d9a6' : '#f7c94b',
                      }}
                      title={`Click to ${post.status === 'published' ? 'unpublish' : 'publish'}`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td style={{ padding: '13px 16px', color: '#8898b4', fontSize: 13 }}>{post.author || '—'}</td>

                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8898b4', fontSize: 12 }}>
                      <Clock size={11} /> {fmt(post.updatedAt)}
                    </span>
                  </td>

                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Link to={`/admin/dashboard/blog/edit/${post.id}`}
                        style={{ display: 'flex', width: 30, height: 30, borderRadius: 8, background: 'rgba(0,217,166,0.1)', color: '#00d9a6', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.15s' }}
                        title="Edit"
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,217,166,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,217,166,0.1)'}>
                        <Edit2 size={13} />
                      </Link>
                      <button
                        onClick={() => toggleStatus(post)}
                        style={{ display: 'flex', width: 30, height: 30, borderRadius: 8, background: 'rgba(10,184,255,0.08)', color: '#0ab8ff', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                        title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,184,255,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,184,255,0.08)'}>
                        {post.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        onClick={() => setConfirm(post.id)}
                        style={{ display: 'flex', width: 30, height: 30, borderRadius: 8, background: 'rgba(255,94,58,0.08)', color: '#ff5e3a', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                        title="Delete"
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,94,58,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,94,58,0.08)'}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirm && (
        <div onClick={() => setConfirm(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(6px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'rgba(28,36,56,0.95)', border: '1px solid rgba(255,94,58,0.25)', borderRadius: 16, padding: '28px 28px', maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,94,58,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={20} color="#ff5e3a" />
            </div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 0 8px' }}>Delete Post?</h3>
            <p style={{ color: '#8898b4', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>This action cannot be undone. The post will be permanently removed.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setConfirm(null)} style={{ padding: '10px 24px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#8898b4', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#8898b4' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(confirm)} style={{ padding: '10px 24px', borderRadius: 9, background: '#ff5e3a', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(255,94,58,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e54d2e'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ff5e3a'; e.currentTarget.style.transform = 'translateY(0)' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
