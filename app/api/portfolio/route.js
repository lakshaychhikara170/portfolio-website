import { NextResponse } from 'next/server'
import defaultPortfolio from '../../../portfolio.config.js'

const SUPABASE_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL  || ''
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD            || 'admin123'

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
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
  const data = (await fetchFromSupabase()) ?? defaultPortfolio
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

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json(
      { error: 'Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.' },
      { status: 503 }
    )
  }

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

  return NextResponse.json({ ok: true })
}
