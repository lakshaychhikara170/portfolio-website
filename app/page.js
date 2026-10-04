import portfolio from '../portfolio.config.js'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Skills from '../components/Skills/Skills'
import Projects from '../components/Projects/Projects'
import Experience from '../components/Experience/Experience'
import Contact from '../components/Contact/Contact'
import Footer from '../components/Footer/Footer'

export const metadata = {
  title: `${portfolio.name} | ${portfolio.role}`,
  description: portfolio.tagline,
  openGraph: {
    title: `${portfolio.name} | ${portfolio.role}`,
    description: portfolio.tagline,
  },
}

export default function Home() {
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
