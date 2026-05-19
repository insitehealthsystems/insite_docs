import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Check, X, Tag } from 'lucide-react'
import { getCategories, saveCategories, getPosts } from '../blogStore'

export default function Categories() {
  const [cats, setCats]     = useState([])
  const [posts, setPosts]   = useState([])
  const [input, setInput]   = useState('')
  const [editing, setEditing] = useState(null) // { idx, val }
  const [error, setError]   = useState('')

  useEffect(() => { setCats(getCategories()); setPosts(getPosts()) }, [])

  const countFor = (cat) => posts.filter(p => p.category === cat).length

  const add = () => {
    const v = input.trim()
    if (!v) return
    if (cats.includes(v)) { setError('Category already exists.'); return }
    const next = [...cats, v]
    setCats(next); saveCategories(next); setInput(''); setError('')
  }

  const remove = (idx) => {
    const next = cats.filter((_, i) => i !== idx)
    setCats(next); saveCategories(next)
  }

  const startEdit = (idx) => setEditing({ idx, val: cats[idx] })

  const commitEdit = () => {
    if (!editing) return
    const v = editing.val.trim()
    if (!v) { setEditing(null); return }
    if (cats.includes(v) && cats[editing.idx] !== v) { setError('Category already exists.'); return }
    const next = cats.map((c, i) => i === editing.idx ? v : c)
    setCats(next); saveCategories(next); setEditing(null); setError('')
  }

  const inp = {
    background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14,
    fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  }
  const fo = (e) => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.1)' }
  const bl = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.03em' }}>Categories</h1>
        <p style={{ color: '#8898b4', fontSize: 14, margin: 0 }}>Organize your posts into categories for easy navigation.</p>
      </div>

      {/* Add */}
      <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 20px', marginBottom: 20 }}>
        <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 14px' }}>Add New Category</h2>
        {error && <div style={{ color: '#ff5e3a', fontSize: 13, marginBottom: 10, background: 'rgba(255,94,58,0.1)', border: '1px solid rgba(255,94,58,0.2)', borderRadius: 8, padding: '8px 12px' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="text" value={input} onChange={e => { setInput(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="e.g. Product Updates"
            style={{ ...inp, flex: 1 }} onFocus={fo} onBlur={bl} />
          <button onClick={add}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: '#00d9a6', border: 'none', color: '#0a0f1e', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#00c49a'}
            onMouseLeave={e => e.currentTarget.style.background = '#00d9a6'}>
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>All Categories</span>
          <span style={{ color: '#8898b4', fontSize: 13 }}>{cats.length} total</span>
        </div>
        {cats.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#8898b4', fontSize: 14 }}>No categories yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cats.map((cat, idx) => (
              <li key={cat + idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Tag size={14} color="#a78bfa" />
                </div>

                {editing?.idx === idx ? (
                  <input autoFocus type="text" value={editing.val} onChange={e => setEditing(p => ({ ...p, val: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(null) }}
                    style={{ ...inp, flex: 1, padding: '6px 10px', fontSize: 14 }} onFocus={fo} onBlur={bl} />
                ) : (
                  <span style={{ flex: 1, color: '#fff', fontSize: 14, fontWeight: 500 }}>{cat}</span>
                )}

                <span style={{ background: 'rgba(255,255,255,0.06)', color: '#8898b4', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, flexShrink: 0 }}>
                  {countFor(cat)} post{countFor(cat) !== 1 ? 's' : ''}
                </span>

                {editing?.idx === idx ? (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={commitEdit} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(0,217,166,0.12)', border: 'none', color: '#00d9a6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={13} /></button>
                    <button onClick={() => setEditing(null)} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.06)', border: 'none', color: '#8898b4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={13} /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => startEdit(idx)} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(0,217,166,0.08)', border: 'none', color: '#00d9a6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,217,166,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,217,166,0.08)'}><Edit2 size={12} /></button>
                    <button onClick={() => remove(idx)} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,94,58,0.08)', border: 'none', color: '#ff5e3a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,94,58,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,94,58,0.08)'}><Trash2 size={12} /></button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
