'use client'
import { useState } from 'react'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
]

export default function Navbar({ name }) {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#hero" className={styles.logo}>
          <span className={styles.name}>{name || 'Lakshay Chhikara'}</span>
          <span className={styles.role}>Video Editor &bull; Full-Stack Dev</span>
        </a>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={styles.link}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn btn-secondary"
            onClick={() => setOpen(false)}
          >
            Contact
          </a>
        </nav>

        <button
          className={styles.burger}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation menu"
        >
          <span className={open ? styles.bar1Open : styles.bar1} />
          <span className={open ? styles.bar2Open : styles.bar2} />
        </button>
      </div>
    </header>
  )
}
