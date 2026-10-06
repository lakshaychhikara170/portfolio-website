'use client'
import { useState, useEffect } from 'react'
import styles from './admin.module.css'

// ─── Utility ──────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = (Date.now() - d) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString()
}

function normalize(c) {
  return { ...c, submittedAt: c.submittedAt || c.submitted_at || '' }
}

// ─── Field display ────────────────────────────────────────────
function Field({ label, value }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value}</span>
    </div>
  )
}

// ─── CMS helpers ─────────────────────────────────────────────
function TextInput({ label, value, onChange, type = 'text', mono = false }) {
  return (
    <div className={styles.cmsField}>
      <label className={styles.cmsLabel}>{label}</label>
      <input
        type={type}
        className={`${styles.cmsInput} ${mono ? styles.mono : ''}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div className={styles.cmsField}>
      <label className={styles.cmsLabel}>{label}</label>
      <textarea
        className={styles.cmsTextarea}
        rows={rows}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function Toggle({ label, value, onChange }) {
  return (
    <div className={styles.cmsToggleRow}>
      <span className={styles.cmsLabel}>{label}</span>
      <button
        type="button"
        className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
        onClick={() => onChange(!value)}
      >
        {value ? 'Yes' : 'No'}
      </button>
    </div>
  )
}

function SectionCard({ title, children, onDelete }) {
  const [open, setOpen] = useState(true)
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionCardHead}>
        <button type="button" className={styles.sectionCardToggle} onClick={() => setOpen(o => !o)}>
          {open ? '▾' : '▸'} {title}
        </button>
        {onDelete && (
          <button type="button" className={styles.deleteBtn} onClick={onDelete}>✕ Remove</button>
        )}
      </div>
      {open && <div className={styles.sectionCardBody}>{children}</div>}
    </div>
  )
}

// ─── CMS Sections ────────────────────────────────────────────

function GeneralSection({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className={styles.cmsGrid}>
      <TextInput label="Name" value={data.name} onChange={set('name')} />
      <TextInput label="Role / Title" value={data.role} onChange={set('role')} />
      <TextInput label="Location" value={data.location} onChange={set('location')} />
      <TextInput label="Avatar URL" value={data.avatar} onChange={set('avatar')} mono />
      <TextInput label="Resume URL" value={data.resumeUrl} onChange={set('resumeUrl')} mono />
      <Toggle label="Open to work (green badge)" value={data.availableForWork} onChange={set('availableForWork')} />
      <div className={styles.fullWidth}>
        <TextArea label="Tagline (shown in hero)" value={data.tagline} onChange={set('tagline')} rows={2} />
      </div>
      <div className={styles.fullWidth}>
        <TextArea label="Bio (About section)" value={data.bio} onChange={set('bio')} rows={4} />
      </div>
    </div>
  )
}

function SkillsSection({ data, onChange }) {
  const categories = Object.entries(data || {})

  const setCategory = (idx, newName, newItems) => {
    const updated = [...categories]
    updated[idx] = [newName, newItems]
    onChange(Object.fromEntries(updated))
  }

  const addCategory = () => {
    onChange({ ...data, 'New Category': [] })
  }

  const removeCategory = (name) => {
    const updated = { ...data }
    delete updated[name]
    onChange(updated)
  }

  return (
    <div>
      {categories.map(([name, items], idx) => (
        <SectionCard
          key={name + idx}
          title={name}
          onDelete={() => removeCategory(name)}
        >
          <TextInput
            label="Category name"
            value={name}
            onChange={(newName) => setCategory(idx, newName, items)}
          />
          <TextArea
            label="Skills (one per line)"
            value={items.join('\n')}
            onChange={(val) => setCategory(idx, name, val.split('\n').map(s => s.trim()).filter(Boolean))}
            rows={4}
          />
        </SectionCard>
      ))}
      <button type="button" className={styles.addBtn} onClick={addCategory}>+ Add category</button>
    </div>
  )
}

function ProjectsSection({ data, onChange }) {
  const set = (idx, key) => (val) => {
    const updated = data.map((p, i) => i === idx ? { ...p, [key]: val } : p)
    onChange(updated)
  }

  const setTags = (idx) => (val) => {
    const tags = val.split(',').map(t => t.trim()).filter(Boolean)
    const updated = data.map((p, i) => i === idx ? { ...p, tags } : p)
    onChange(updated)
  }

  const remove = (idx) => onChange(data.filter((_, i) => i !== idx))

  const add = () => onChange([...data, {
    title: 'New Project',
    description: '',
    tags: [],
    liveUrl: '',
    githubUrl: '',
    image: '',
    featured: false,
  }])

  return (
    <div>
      {data.map((p, idx) => (
        <SectionCard
          key={idx}
          title={p.title || `Project ${idx + 1}`}
          onDelete={() => remove(idx)}
        >
          <div className={styles.cmsGrid}>
            <TextInput label="Title" value={p.title} onChange={set(idx, 'title')} />
            <TextInput label="Tags (comma separated)" value={p.tags?.join(', ')} onChange={setTags(idx)} />
            <TextInput label="Live URL" value={p.liveUrl} onChange={set(idx, 'liveUrl')} mono />
            <TextInput label="GitHub URL" value={p.githubUrl} onChange={set(idx, 'githubUrl')} mono />
            <div className={styles.fullWidth}>
              <TextInput
                label="Image URL (leave empty to auto-screenshot from live URL via thum.io)"
                value={p.image}
                onChange={set(idx, 'image')}
                mono
              />
            </div>
            <Toggle label="Featured (large card)" value={p.featured} onChange={set(idx, 'featured')} />
            <div className={styles.fullWidth}>
              <TextArea label="Description" value={p.description} onChange={set(idx, 'description')} rows={3} />
            </div>
          </div>
        </SectionCard>
      ))}
      <button type="button" className={styles.addBtn} onClick={add}>+ Add project</button>
    </div>
  )
}

function ExperienceSection({ data, onChange }) {
  const set = (idx, key) => (val) => {
    const updated = data.map((e, i) => i === idx ? { ...e, [key]: val } : e)
    onChange(updated)
  }

  const setBullets = (idx) => (val) => {
    const bullets = val.split('\n').map(b => b.trim()).filter(Boolean)
    const updated = data.map((e, i) => i === idx ? { ...e, bullets } : e)
    onChange(updated)
  }

  const remove = (idx) => onChange(data.filter((_, i) => i !== idx))

  const add = () => onChange([...data, {
    company: 'Company Name',
    role: 'Role',
    period: '2024 - Present',
    location: 'Remote',
    bullets: [],
  }])

  return (
    <div>
      {data.map((e, idx) => (
        <SectionCard
          key={idx}
          title={`${e.role} at ${e.company}`}
          onDelete={() => remove(idx)}
        >
          <div className={styles.cmsGrid}>
            <TextInput label="Company" value={e.company} onChange={set(idx, 'company')} />
            <TextInput label="Role / Title" value={e.role} onChange={set(idx, 'role')} />
            <TextInput label="Period" value={e.period} onChange={set(idx, 'period')} />
            <TextInput label="Location" value={e.location} onChange={set(idx, 'location')} />
            <div className={styles.fullWidth}>
              <TextArea
                label="Bullet points (one per line)"
                value={e.bullets?.join('\n')}
                onChange={setBullets(idx)}
                rows={5}
              />
            </div>
          </div>
        </SectionCard>
      ))}
      <button type="button" className={styles.addBtn} onClick={add}>+ Add experience</button>
    </div>
  )
}

function EducationSection({ data, onChange }) {
  const set = (idx, key) => (val) => {
    const updated = data.map((e, i) => i === idx ? { ...e, [key]: val } : e)
    onChange(updated)
  }

  const remove = (idx) => onChange(data.filter((_, i) => i !== idx))

  const add = () => onChange([...data, { institution: '', degree: '', period: '' }])

  return (
    <div>
      {data.map((e, idx) => (
        <SectionCard
          key={idx}
          title={e.institution || `Education ${idx + 1}`}
          onDelete={() => remove(idx)}
        >
          <div className={styles.cmsGrid}>
            <TextInput label="Institution" value={e.institution} onChange={set(idx, 'institution')} />
            <TextInput label="Degree" value={e.degree} onChange={set(idx, 'degree')} />
            <TextInput label="Period" value={e.period} onChange={set(idx, 'period')} />
          </div>
        </SectionCard>
      ))}
      <button type="button" className={styles.addBtn} onClick={add}>+ Add education</button>
    </div>
  )
}

function SocialSection({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className={styles.cmsGrid}>
      <TextInput label="Email" value={data.email} onChange={(v) => onChange({ ...data, email: v })} mono />
      <TextInput label="GitHub URL" value={data.social?.github} onChange={(v) => onChange({ ...data, social: { ...data.social, github: v } })} mono />
      <TextInput label="LinkedIn URL" value={data.social?.linkedin} onChange={(v) => onChange({ ...data, social: { ...data.social, linkedin: v } })} mono />
      <TextInput label="Twitter / X URL" value={data.social?.twitter} onChange={(v) => onChange({ ...data, social: { ...data.social, twitter: v } })} mono />
    </div>
  )
}

// ─── CMS Tab (the whole editor) ───────────────────────────────
function CMSTab({ pw }) {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null) // { type: 'ok'|'err', msg }
  const [activeSection, setActiveSection] = useState('general')

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(d => { setPortfolio(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const showToast = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw, data: portfolio }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Save failed')
      showToast('ok', 'Saved! Changes are live on your site.')
    } catch (e) {
      showToast('err', e.message)
    }
    setSaving(false)
  }

  if (loading) return <div className={styles.cmsLoading}>Loading site data…</div>
  if (!portfolio) return <div className={styles.cmsLoading}>Failed to load site data.</div>

  const sections = [
    { id: 'general',    label: 'General' },
    { id: 'skills',     label: 'Skills' },
    { id: 'projects',   label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education',  label: 'Education' },
    { id: 'social',     label: 'Social / Contact' },
  ]

  return (
    <div className={styles.cms}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'ok' ? styles.toastOk : styles.toastErr}`}>
          {toast.type === 'ok' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <div className={styles.cmsSidebar}>
        {sections.map(s => (
          <button
            key={s.id}
            className={`${styles.cmsSidebarBtn} ${activeSection === s.id ? styles.cmsSidebarBtnActive : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
        <button
          className={styles.saveBtn}
          onClick={save}
          disabled={saving}
        >
          {saving ? 'Saving…' : '↑ Save & publish'}
        </button>
      </div>

      <div className={styles.cmsMain}>
        {activeSection === 'general' && (
          <GeneralSection
            data={portfolio}
            onChange={(updated) => setPortfolio(updated)}
          />
        )}
        {activeSection === 'skills' && (
          <SkillsSection
            data={portfolio.skills}
            onChange={(updated) => setPortfolio({ ...portfolio, skills: updated })}
          />
        )}
        {activeSection === 'projects' && (
          <ProjectsSection
            data={portfolio.projects || []}
            onChange={(updated) => setPortfolio({ ...portfolio, projects: updated })}
          />
        )}
        {activeSection === 'experience' && (
          <ExperienceSection
            data={portfolio.experience || []}
            onChange={(updated) => setPortfolio({ ...portfolio, experience: updated })}
          />
        )}
        {activeSection === 'education' && (
          <EducationSection
            data={portfolio.education || []}
            onChange={(updated) => setPortfolio({ ...portfolio, education: updated })}
          />
        )}
        {activeSection === 'social' && (
          <SocialSection
            data={portfolio}
            onChange={(updated) => setPortfolio(updated)}
          />
        )}
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────
export default function AdminPage() {
  const [pw, setPw]         = useState('')
  const [authed, setAuthed] = useState(false)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('')
  const [source, setSource]     = useState('local')
  const [tab, setTab]           = useState('contacts') // 'contacts' | 'content'

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

  // ── Login screen ─────────────────────────────────────────────
  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Admin<span>.</span></h1>
          <p className={styles.loginSub}>Enter your admin password to access the dashboard</p>
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

  // ── Dashboard ─────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Dashboard</h1>
          <nav className={styles.tabNav}>
            <button
              className={`${styles.tabBtn} ${tab === 'contacts' ? styles.tabBtnActive : ''}`}
              onClick={() => setTab('contacts')}
            >
              Contact Submissions
              {contacts.length > 0 && <span className={styles.badge}>{contacts.length}</span>}
            </button>
            <button
              className={`${styles.tabBtn} ${tab === 'content' ? styles.tabBtnActive : ''}`}
              onClick={() => setTab('content')}
            >
              Edit Site Content
            </button>
          </nav>
        </div>
        <div className={styles.headerRight}>
          {tab === 'contacts' && (
            <>
              <span className={`${styles.sourceBadge} ${source === 'supabase' ? styles.sourceSupabase : styles.sourceLocal}`}>
                {source === 'supabase' ? '🟢 Supabase' : '🟡 Local file'}
              </span>
              <button onClick={refresh} className="btn btn-outline">↻ Refresh</button>
            </>
          )}
          <a href="/" className="btn btn-outline">← Back to site</a>
        </div>
      </header>

      {/* Contacts Tab */}
      {tab === 'contacts' && (
        <div className={styles.body}>
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
      )}

      {/* Content Editor Tab */}
      {tab === 'content' && <CMSTab pw={pw} />}
    </div>
  )
}
