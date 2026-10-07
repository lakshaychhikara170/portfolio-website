import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import defaultPortfolio from '../../../portfolio.config.js'

const SUPABASE_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL  || ''
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD            || 'admin123'
const DATA_FILE      = path.join(process.cwd(), 'data', 'portfolio.json')

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
}

function readLocalPortfolio() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const fallback = defaultPortfolio
      writeLocalPortfolio(fallback)
      return fallback
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return defaultPortfolio
  }
}

function writeLocalPortfolio(data) {
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (err) {
    console.error('Local portfolio save failed:', err)
    return false
  }
}

async function fetchFromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_data?id=eq.main&select=data`,
      { headers: HEADERS, cache: 'no-store' }
    )
    const rows = await res.json()
    return rows?.[0]?.data ?? null
  } catch {
    return null
  }
}

// GET /api/portfolio — return portfolio data
export async function GET() {
  const data = (await fetchFromSupabase()) ?? readLocalPortfolio()
  return NextResponse.json(data)
}

// POST /api/portfolio — save portfolio data (admin only)
export async function POST(req) {
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { password, data } = body

  if (!password || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (SUPABASE_URL && SUPABASE_KEY) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_data`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: 'main',
        data,
        updated_at: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: 500 })
    }

    return NextResponse.json({ ok: true, source: 'supabase' })
  }

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'Deployment requires Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy.'
    }, { status: 503 })
  }

  if (!writeLocalPortfolio(data)) {
    return NextResponse.json({ error: 'Unable to save portfolio data locally on this machine.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, source: 'local' })
}
