import fs from 'fs'
import path from 'path'
import defaultPortfolio from '../portfolio.config.js'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Skills from '../components/Skills/Skills'
import Projects from '../components/Projects/Projects'
import Experience from '../components/Experience/Experience'
import Contact from '../components/Contact/Contact'
import Footer from '../components/Footer/Footer'

const PORTFOLIO_DATA_FILE = path.join(process.cwd(), 'data', 'portfolio.json')

function readLocalPortfolio() {
  try {
    if (!fs.existsSync(PORTFOLIO_DATA_FILE)) return defaultPortfolio
    return JSON.parse(fs.readFileSync(PORTFOLIO_DATA_FILE, 'utf-8'))
  } catch {
    return defaultPortfolio
  }
}

// Fetch live portfolio data from Supabase; fall back to local JSON then portfolio.config.js
async function getPortfolio() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL  || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (url && key) {
    try {
      const res = await fetch(
        `${url}/rest/v1/portfolio_data?id=eq.main&select=data`,
        {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          cache: 'no-store',
        }
      )
      const rows = await res.json()
      if (rows?.[0]?.data) return rows[0].data
    } catch {}
  }
  return readLocalPortfolio()
}

export async function generateMetadata() {
  const p = await getPortfolio()
  return {
    title: `${p.name} | ${p.role}`,
    description: p.tagline,
    openGraph: { title: `${p.name} | ${p.role}`, description: p.tagline },
  }
}

export default async function Home() {
  const portfolio = await getPortfolio()
  return (
    <>
      <Navbar name={portfolio.name} />
      <main>
        <Hero data={portfolio} />
        <About data={portfolio} />
        <Skills skills={portfolio.skills} />
        <Projects projects={portfolio.projects} />
        <Experience experience={portfolio.experience} education={portfolio.education} />
        <Contact data={portfolio} />
      </main>
      <Footer data={portfolio} />
    </>
  )
}
