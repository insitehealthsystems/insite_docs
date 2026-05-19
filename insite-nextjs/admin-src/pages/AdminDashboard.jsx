'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Eye, TrendingUp, Users, PlusSquare, ArrowUpRight, Clock, Tag } from 'lucide-react'
import { getPosts } from '../blogStore'

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div style={{
      background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 600, color: trend >= 0 ? '#00d9a6' : '#ff5e3a' }}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <div style={{ color: '#fff', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{value}</div>
        <div style={{ color: '#8898b4', fontSize: 13, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ color: '#4a5568', fontSize: 11, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState([])

  useEffect(() => { setPosts(getPosts()) }, [])

  const published = posts.filter(p => p.status === 'published').length
  const drafts    = posts.filter(p => p.status === 'draft').length
  const recent    = [...posts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)

  const fmt = (d) => {
    const date = new Date(d)
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.03em' }}>Dashboard</h1>
          <p style={{ color: '#8898b4', fontSize: 14, margin: 0 }}>Welcome back — here's what's happening with your blog.</p>
        </div>
        <Link href="/admin/dashboard/blog/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#00d9a6', color: '#0a0f1e', textDecoration: 'none',
          fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 10,
          transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(0,217,166,0.25)',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#00c49a'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#00d9a6'; e.currentTarget.style.transform = 'translateY(0)' }}>
          <PlusSquare size={16} /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={FileText}   label="Total Posts"      value={posts.length}  sub={`${drafts} draft${drafts !== 1 ? 's' : ''}`} color="#00d9a6" trend={12} />
        <StatCard icon={Eye}        label="Published"         value={published}     sub="Live on site"   color="#0ab8ff" trend={8}  />
        <StatCard icon={Tag}        label="Drafts"            value={drafts}        sub="In progress"    color="#f7c94b" />
        <StatCard icon={TrendingUp} label="Categories"        value={getCategories(posts).length} sub="Topics covered" color="#a78bfa" />
      </div>

      {/* Recent Posts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* Table */}
        <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0 }}>Recent Posts</h2>
            <Link href="/admin/dashboard/blog" style={{ color: '#00d9a6', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8898b4', fontSize: 14 }}>
              No posts yet. <Link href="/admin/dashboard/blog/new" style={{ color: '#00d9a6' }}>Create your first post →</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                  {['Title', 'Category', 'Status', 'Updated'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', color: '#4a5568', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((post, i) => (
                  <tr key={post.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <Link href={`/admin/dashboard/blog/edit/${post.id}`}
                        style={{ color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'block', maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        onMouseEnter={e => e.target.style.color = '#00d9a6'}
                        onMouseLeave={e => e.target.style.color = '#fff'}>
                        {post.title || 'Untitled'}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100 }}>
                        {post.category || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                        background: post.status === 'published' ? 'rgba(0,217,166,0.12)' : 'rgba(247,201,75,0.12)',
                        color: post.status === 'published' ? '#00d9a6' : '#f7c94b',
                      }}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#8898b4', fontSize: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{fmt(post.updatedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 18px' }}>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 14px' }}>Quick Actions</h3>
            {[
              { label: 'Write New Post',    to: '/admin/dashboard/blog/new',    icon: PlusSquare, color: '#00d9a6' },
              { label: 'Manage All Posts',  to: '/admin/dashboard/blog',        icon: FileText,   color: '#0ab8ff' },
              { label: 'Edit Categories',   to: '/admin/dashboard/categories',  icon: Tag,        color: '#f7c94b' },
              { label: 'Site Settings',     to: '/admin/dashboard/settings',    icon: Users,      color: '#a78bfa' },
            ].map(({ label, to, icon: Icon, color }) => (
              <Link key={to} href={to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none', color: '#8898b4', fontSize: 14, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = color}
                onMouseLeave={e => e.currentTarget.style.color = '#8898b4'}>
                <Icon size={15} color={color} /> {label}
              </Link>
            ))}
          </div>

          {/* Tips */}
          <div style={{ background: 'rgba(0,217,166,0.07)', border: '1px solid rgba(0,217,166,0.15)', borderRadius: 14, padding: '16px 18px' }}>
            <h3 style={{ color: '#00d9a6', fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>💡 Content Tips</h3>
            {['Use keywords in your titles for SEO', 'Add a featured image to every post', 'Publish consistently — aim for 2×/month', 'Use categories to organize your content'].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6, color: '#8898b4', fontSize: 12, lineHeight: 1.5 }}>
                <span style={{ color: '#00d9a6', fontWeight: 700, flexShrink: 0 }}>→</span> {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:800px){ .dash-grid{grid-template-columns:1fr!important;} }`}</style>
    </div>
  )
}

function getCategories(posts) {
  return [...new Set(posts.map(p => p.category).filter(Boolean))]
}
