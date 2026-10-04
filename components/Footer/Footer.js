import styles from './Footer.module.css'

export default function Footer({ data }) {
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
          </div>
        </div>
      </div>
    </footer>
  )
}
