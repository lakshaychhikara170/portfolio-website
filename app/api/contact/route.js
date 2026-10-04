import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// ─── Local JSON fallback (development) ───────────────────────
const DATA_FILE = path.join(process.cwd(), 'data', 'contacts.json')

function readLocalContacts() {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch { return [] }
}

function writeLocalContacts(contacts) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2))
}

// ─── Supabase ────────────────────────────────────────────────
async function saveToSupabase(entry) {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return false

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, key)

  const { error } = await supabase.from('contacts').insert({
    id:           entry.id,
    name:         entry.name,
    email:        entry.email,
    phone:        entry.phone,
    company:      entry.company,
    subject:      entry.subject,
    message:      entry.message,
    submitted_at: entry.submittedAt,
    read:         false,
  })

  if (error) { console.error('Supabase insert error:', error); return false }
  return true
}

async function getFromSupabase() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, key)

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) { console.error('Supabase fetch error:', error); return null }
  return data
}

// ─── Resend email ────────────────────────────────────────────
async function sendEmailNotification(entry) {
  const apiKey   = process.env.RESEND_API_KEY
  const toRaw    = process.env.NOTIFY_EMAIL   // supports "a@x.com,b@x.com"
  if (!apiKey || !toRaw) return

  // Support multiple comma-separated emails
  const toEmails = toRaw.split(',').map(e => e.trim()).filter(Boolean)
  if (toEmails.length === 0) return

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to:   toEmails,
      subject: `📬 New contact: ${entry.subject}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#e8e8f0;padding:32px;border-radius:12px">
          <h2 style="color:#a07cc5;margin:0 0 24px">New message from your portfolio</h2>

          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;color:#8888a8;font-size:13px;width:120px">Name</td>
              <td style="padding:10px 0;font-weight:600">${entry.name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#8888a8;font-size:13px">Email</td>
              <td style="padding:10px 0"><a href="mailto:${entry.email}" style="color:#a07cc5">${entry.email}</a></td>
            </tr>
            ${entry.phone ? `<tr><td style="padding:10px 0;color:#8888a8;font-size:13px">Phone</td><td style="padding:10px 0">${entry.phone}</td></tr>` : ''}
            ${entry.company ? `<tr><td style="padding:10px 0;color:#8888a8;font-size:13px">Company</td><td style="padding:10px 0">${entry.company}</td></tr>` : ''}
            <tr>
              <td style="padding:10px 0;color:#8888a8;font-size:13px">Subject</td>
              <td style="padding:10px 0;font-weight:600">${entry.subject}</td>
            </tr>
          </table>

          <div style="background:#16161f;border:1px solid #ffffff0f;border-radius:10px;padding:20px;margin:20px 0">
            <p style="color:#8888a8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.1em">Message</p>
            <p style="margin:0;line-height:1.7;white-space:pre-wrap">${entry.message}</p>
          </div>

          <a href="mailto:${entry.email}" style="display:inline-block;background:#7b5ea7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">
            Reply to ${entry.name} →
          </a>

          <p style="color:#8888a8;font-size:11px;margin-top:24px">
            Submitted at ${new Date(entry.submittedAt).toLocaleString()}
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Resend error:', err)
  }
}

// ─── Admin password ───────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// ════════════════════════════════════════════════════════════
//  POST  /api/contact  — save submission
// ════════════════════════════════════════════════════════════
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const entry = {
      id:          Date.now().toString(),
      name,
      email,
      phone:       phone   || '',
      company:     company || '',
      subject,
      message,
      submittedAt: new Date().toISOString(),
      read:        false,
    }

    // Try Supabase first; fall back to local JSON in dev
    const savedToSupabase = await saveToSupabase(entry)
    if (!savedToSupabase) {
      const contacts = readLocalContacts()
      contacts.unshift(entry)
      writeLocalContacts(contacts)
    }

    // Send email notification (non-blocking — won't break the form if it fails)
    sendEmailNotification(entry).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ════════════════════════════════════════════════════════════
//  GET  /api/contact?pw=...  — fetch all submissions
// ════════════════════════════════════════════════════════════
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const pw = searchParams.get('pw')

  if (pw !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Try Supabase first; fall back to local JSON
  const supabaseData = await getFromSupabase()
  const contacts = supabaseData ?? readLocalContacts()

  return NextResponse.json({ contacts, source: supabaseData ? 'supabase' : 'local' })
}
