'use client'
import { useEffect, useState } from 'react'
import styles from './Footer.module.css'

export default function Footer({ data }) {
  const [adminOpen, setAdminOpen] = useState(false)

  useEffect(() => {
    if (!adminOpen) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setAdminOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [adminOpen])

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <span className={styles.name}>{data.name || 'Lakshay Chhikara'}</span>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} Lakshay Chhikara. All rights reserved.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.links}>
            {data.social?.github && (
              <a
                href={data.social.github}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                GitHub
              </a>
            )}
            {data.social?.linkedin && (
              <a
                href={data.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                LinkedIn
              </a>
            )}
            {data.social?.twitter && (
              <a
                href={data.social.twitter}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                Twitter
              </a>
            )}
            <a href="#hero" className={styles.topLink}>
              Top
            </a>
            <button
              type="button"
              className={styles.adminTrigger}
              aria-label="Open admin panel"
              title="Admin access"
              onClick={() => setAdminOpen(true)}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
      {adminOpen && (
        <div className={styles.adminOverlay}>
          <div className={styles.adminFrameWrap} role="dialog" aria-modal="true" aria-label="Admin panel">
            <button
              type="button"
              className={styles.adminClose}
              aria-label="Close admin panel"
              onClick={() => setAdminOpen(false)}
            >
              Close
            </button>
            <iframe className={styles.adminFrame} src="/admin" title="Portfolio admin panel" />
          </div>
        </div>
      )}
    </footer>
  )
}
