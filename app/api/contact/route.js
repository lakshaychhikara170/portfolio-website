import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// ─── Configuration via environment variables ───────────────
// For local dev: set these in .env.local (already gitignored)
// For Vercel: set them in Project Settings → Environment Variables
const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL   || ''
const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY  || ''
const RESEND_API_KEY   = process.env.RESEND_API_KEY             || ''
const NOTIFY_EMAIL     = process.env.NOTIFY_EMAIL               || ''
const ADMIN_PASSWORD   = process.env.ADMIN_PASSWORD             || 'admin123'


// ─── Local JSON fallback (development) ───────────────────────
const DATA_FILE = path.join(process.cwd(), 'data', 'contacts.json')

function readLocalContacts() {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeLocalContacts(contacts) {
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2))
  } catch {
    // Vercel serverless environment has read-only filesystem; ignore silently
  }
}

// ─── Supabase ────────────────────────────────────────────────
async function saveToSupabase(entry) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

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

    if (error) {
      console.error('Supabase insert notice:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.error('Supabase error:', err)
    return false
  }
}

async function getFromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Supabase fetch notice:', error.message)
      return null
    }
    return data
  } catch {
    return null
  }
}

// ─── Resend email ────────────────────────────────────────────
async function sendEmailNotification(entry) {
  if (!RESEND_API_KEY || !NOTIFY_EMAIL) return

  const toEmails = NOTIFY_EMAIL.split(',').map(e => e.trim()).filter(Boolean)
  if (toEmails.length === 0) return

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(RESEND_API_KEY)

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to:   toEmails,
      subject: `New contact: ${entry.subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0e1116;color:#f0f3f6;padding:32px;border-radius:4px;border:1px solid rgba(255,255,255,0.1)">
          <h2 style="color:#e3a34a;margin:0 0 20px;font-size:20px">New Message from Portfolio</h2>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:8px 0;color:#8b949e;font-size:13px;width:120px">Name</td>
              <td style="padding:8px 0;font-weight:600">${entry.name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#8b949e;font-size:13px">Email</td>
              <td style="padding:8px 0"><a href="mailto:${entry.email}" style="color:#e3a34a">${entry.email}</a></td>
            </tr>
            ${entry.phone ? `<tr><td style="padding:8px 0;color:#8b949e;font-size:13px">Phone</td><td style="padding:8px 0">${entry.phone}</td></tr>` : ''}
            ${entry.company ? `<tr><td style="padding:8px 0;color:#8b949e;font-size:13px">Company</td><td style="padding:8px 0">${entry.company}</td></tr>` : ''}
            <tr>
              <td style="padding:8px 0;color:#8b949e;font-size:13px">Subject</td>
              <td style="padding:8px 0;font-weight:600">${entry.subject}</td>
            </tr>
          </table>

          <div style="background:#161b22;border:1px solid rgba(255,255,255,0.08);border-radius:4px;padding:20px;margin:20px 0">
            <p style="color:#8b949e;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.06em">Message</p>
            <p style="margin:0;line-height:1.65;white-space:pre-wrap;font-size:14px">${entry.message}</p>
          </div>

          <a href="mailto:${entry.email}" style="display:inline-block;background:#e3a34a;color:#0b0d11;padding:10px 20px;border-radius:3px;text-decoration:none;font-weight:600;font-size:13px;margin-top:8px">
            Reply to ${entry.name}
          </a>

          <p style="color:#656d76;font-size:11px;margin-top:24px">
            Submitted at ${new Date(entry.submittedAt).toLocaleString()}
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Resend notification notice:', err)
  }
}

// ════════════════════════════════════════════════════════════
//  POST  /api/contact
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

    // Try Supabase first
    const savedToSupabase = await saveToSupabase(entry)
    if (!savedToSupabase) {
      const contacts = readLocalContacts()
      contacts.unshift(entry)
      writeLocalContacts(contacts)
    }

    // Non-blocking email dispatch
    sendEmailNotification(entry).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ════════════════════════════════════════════════════════════
//  GET  /api/contact?pw=...
// ════════════════════════════════════════════════════════════
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const pw = searchParams.get('pw')

  if (pw !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseData = await getFromSupabase()
  const contacts = supabaseData ?? readLocalContacts()

  return NextResponse.json({ contacts, source: supabaseData ? 'supabase' : 'local' })
}
