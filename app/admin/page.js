'use client'
import { useState, useEffect } from 'react'
import styles from './admin.module.css'

export default function AdminPage() {
  const [pw, setPw] = useState('')
  const [authed, setAuthed] = useState(false)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('')
  const [source, setSource] = useState('local') // 'supabase' | 'local'

  // Normalize field names — Supabase uses snake_case
  const normalize = (c) => ({
    ...c,
    submittedAt: c.submittedAt || c.submitted_at || '',
  })

  const login = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/contact?pw=${encodeURIComponent(pw)}`)
      if (!res.ok) { setError('Wrong password'); setLoading(false); return }
      const data = await res.json()
      setContacts((data.contacts || []).map(normalize))
      setSource(data.source || 'local')
      setAuthed(true)
    } catch {
      setError('Could not connect')
    }
    setLoading(false)
  }

  const refresh = async () => {
    const res = await fetch(`/api/contact?pw=${encodeURIComponent(pw)}`)
    const data = await res.json()
    setContacts((data.contacts || []).map(normalize))
    setSource(data.source || 'local')
  }

  const filtered = contacts.filter(c =>
    !filter || [c.name, c.email, c.company, c.subject]
      .some(v => v?.toLowerCase().includes(filter.toLowerCase()))
  )

  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Admin<span>.</span></h1>
          <p className={styles.loginSub}>Enter your admin password to view contact submissions</p>
          <form onSubmit={login} className={styles.loginForm}>
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
            />
            {error && <p className={styles.err}>{error}</p>}
            <button type="submit" className={`btn btn-primary ${styles.loginBtn}`} disabled={loading}>
              {loading ? 'Checking…' : 'Access dashboard →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Contact Submissions</h1>
        <div className={styles.headerRight}>
          <span className={`${styles.sourceBadge} ${source === 'supabase' ? styles.sourceSupabase : styles.sourceLocal}`}>
            {source === 'supabase' ? '🟢 Supabase' : '🟡 Local file'}
          </span>
          <span className={styles.count}>{contacts.length} total</span>
          <button onClick={refresh} className="btn btn-outline">↻ Refresh</button>
          <a href="/" className="btn btn-outline">← Back to site</a>
        </div>
      </header>

      <div className={styles.body}>
        {/* Sidebar list */}
        <div className={styles.sidebar}>
          <input
            type="text"
            className={styles.search}
            placeholder="Search by name, email…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />

          {filtered.length === 0 && (
            <p className={styles.empty}>No submissions yet.</p>
          )}

          {filtered.map(c => (
            <button
              key={c.id}
              className={`${styles.item} ${selected?.id === c.id ? styles.itemActive : ''}`}
              onClick={() => setSelected(c)}
            >
              <div className={styles.itemTop}>
                <span className={styles.itemName}>{c.name}</span>
                <span className={styles.itemTime}>{formatDate(c.submittedAt)}</span>
              </div>
              <p className={styles.itemEmail}>{c.email}</p>
              <p className={styles.itemSubject}>{c.subject}</p>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className={styles.detail}>
          {selected ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.detailName}>{selected.name}</h2>
                  <p className={styles.detailTime}>{new Date(selected.submittedAt).toLocaleString()}</p>
                </div>
                <a href={`mailto:${selected.email}`} className="btn btn-primary">Reply →</a>
              </div>

              <div className={styles.fields}>
                <Field label="Email" value={selected.email} />
                {selected.phone && <Field label="Phone" value={selected.phone} />}
                {selected.company && <Field label="Company" value={selected.company} />}
                <Field label="Subject" value={selected.subject} />
              </div>

              <div className={styles.messageBox}>
                <p className={styles.msgLabel}>Message</p>
                <p className={styles.msgBody}>{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className={styles.noSelect}>
              <span>← Select a submission to view details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value}</span>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString()
}
