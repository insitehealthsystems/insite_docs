import { useState } from 'react'
import { Save, CheckCircle, Globe, FileText, Mail, Shield } from 'lucide-react'

const inp = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14,
  fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
}
const fo = (e) => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.1)' }
const bl = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

function SettingGroup({ icon: Icon, title, desc, children }) {
  return (
    <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(0,217,166,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color="#00d9a6" />
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{title}</div>
          {desc && <div style={{ color: '#8898b4', fontSize: 12 }}>{desc}</div>}
        </div>
      </div>
      <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ color: '#8898b4', fontSize: 13, fontWeight: 600 }}>{label}</label>
      {children}
      {hint && <span style={{ color: '#4a5568', fontSize: 11 }}>{hint}</span>}
    </div>
  )
}

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    siteName: 'InSite Health Systems',
    siteTagline: 'Real-Time Equipment Visibility for Modern Hospitals',
    siteUrl: 'https://insitehealthsystems.com',
    blogPrefix: '/blog',
    contactEmail: 'hello@insitehealthsystems.com',
    adminEmail: 'admin@insitehealthsystems.com',
    postsPerPage: '10',
    defaultStatus: 'draft',
    showExcerpt: true,
    enableComments: false,
    metaTitle: 'InSite Health Systems',
    metaDesc: 'Intelligent, Low-Impact Equipment Tracking Built for Hospitals.',
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.03em' }}>Settings</h1>
          <p style={{ color: '#8898b4', fontSize: 14, margin: 0 }}>Configure your blog and site preferences.</p>
        </div>
        <button onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#00d9a6', border: 'none', borderRadius: 10, padding: '10px 22px', color: '#0a0f1e', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(0,217,166,0.25)', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#00c49a'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#00d9a6'; e.currentTarget.style.transform = 'translateY(0)' }}>
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
        </button>
      </div>

      <SettingGroup icon={Globe} title="Site" desc="General site information">
        <Field label="Site Name"><input type="text" value={form.siteName} onChange={e => set('siteName', e.target.value)} style={inp} onFocus={fo} onBlur={bl} /></Field>
        <Field label="Tagline"><input type="text" value={form.siteTagline} onChange={e => set('siteTagline', e.target.value)} style={inp} onFocus={fo} onBlur={bl} /></Field>
        <Field label="Site URL"><input type="url" value={form.siteUrl} onChange={e => set('siteUrl', e.target.value)} style={inp} onFocus={fo} onBlur={bl} /></Field>
      </SettingGroup>

      <SettingGroup icon={FileText} title="Blog" desc="Blog display and defaults">
        <Field label="Blog URL Prefix" hint="e.g. /blog → insitehealthsystems.com/blog/post-slug">
          <input type="text" value={form.blogPrefix} onChange={e => set('blogPrefix', e.target.value)} style={inp} onFocus={fo} onBlur={bl} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Posts Per Page">
            <input type="number" min={1} max={100} value={form.postsPerPage} onChange={e => set('postsPerPage', e.target.value)} style={inp} onFocus={fo} onBlur={bl} />
          </Field>
          <Field label="Default Post Status">
            <select value={form.defaultStatus} onChange={e => set('defaultStatus', e.target.value)} style={{ ...inp, cursor: 'pointer', colorScheme: 'dark' }} onFocus={fo} onBlur={bl}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'showExcerpt', label: 'Show excerpt in post listings', desc: 'Display a summary card below the post title' },
            { key: 'enableComments', label: 'Enable comments', desc: 'Allow readers to leave comments on blog posts' },
          ].map(({ key, label, desc }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
              <div onClick={() => set(key, !form[key])} style={{ width: 42, height: 24, borderRadius: 100, background: form[key] ? '#00d9a6' : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0, transition: 'background 0.2s', cursor: 'pointer', marginTop: 2 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form[key] ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{label}</div>
                <div style={{ color: '#8898b4', fontSize: 12 }}>{desc}</div>
              </div>
            </label>
          ))}
        </div>
      </SettingGroup>

      <SettingGroup icon={Mail} title="Email" desc="Notification email addresses">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Contact Email"><input type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} style={inp} onFocus={fo} onBlur={bl} /></Field>
          <Field label="Admin Email"><input type="email" value={form.adminEmail} onChange={e => set('adminEmail', e.target.value)} style={inp} onFocus={fo} onBlur={bl} /></Field>
        </div>
      </SettingGroup>

      <SettingGroup icon={Shield} title="Default SEO" desc="Fallback meta tags for all pages">
        <Field label="Default Meta Title" hint="Used when a page has no custom SEO title">
          <input type="text" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} maxLength={60} style={inp} onFocus={fo} onBlur={bl} />
        </Field>
        <Field label="Default Meta Description" hint="Used when a page has no custom SEO description">
          <textarea value={form.metaDesc} onChange={e => set('metaDesc', e.target.value)} rows={2} maxLength={160} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} onFocus={fo} onBlur={bl} />
        </Field>
      </SettingGroup>

      {/* Danger zone */}
      <div style={{ background: 'rgba(255,94,58,0.06)', border: '1px solid rgba(255,94,58,0.18)', borderRadius: 16, padding: '18px 20px' }}>
        <h3 style={{ color: '#ff5e3a', fontSize: 15, fontWeight: 700, margin: '0 0 8px' }}>Danger Zone</h3>
        <p style={{ color: '#8898b4', fontSize: 13, margin: '0 0 14px', lineHeight: 1.6 }}>Irreversible actions. Be careful.</p>
        <button onClick={() => { if (window.confirm('Clear ALL blog posts? This cannot be undone.')) { localStorage.removeItem('ihs_blog_posts'); window.location.href = '/admin/dashboard' } }}
          style={{ background: 'rgba(255,94,58,0.1)', border: '1px solid rgba(255,94,58,0.25)', borderRadius: 9, padding: '9px 18px', color: '#ff5e3a', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,94,58,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,94,58,0.1)'}>
          Clear All Blog Posts
        </button>
      </div>
    </div>
  )
}
