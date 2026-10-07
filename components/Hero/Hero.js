import styles from './Hero.module.css'

export default function Hero({ data }) {
  return (
    <section id="hero" className={styles.hero}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          {/* ── Left Column: Editorial & Value Proposition ── */}
          <div className={styles.content}>
            <span className={styles.availability}>
              {data.availableForWork ? 'Available for select projects' : 'Currently booked'} &bull; {data.location || 'India'}
            </span>

            <h1 className={styles.title}>
              {data.name || 'Lakshay Chhikara'}
            </h1>

            <p className={styles.role}>
              {data.role || 'Video Editor and Full-Stack Developer'}
            </p>

            <p className={styles.tagline}>
              {data.tagline || 'I craft fast, purposeful web architectures and cinematic visual edits.'}
            </p>

            <div className={styles.actions}>
              <a href="#projects" className="btn btn-primary">
                View Projects
              </a>
              <a href="#contact" className="btn btn-secondary">
                Contact
              </a>
              {data.resumeUrl && (
                <a
                  href={data.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Resume
                </a>
              )}
            </div>
          </div>

          {/* ── Right Column: Portrait Frame ───────────────── */}
          <div className={styles.media}>
            <div className={styles.portraitCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={data.avatar || '/avatar.jpg'}
                  alt={data.name}
                  className={styles.portraitImg}
                />
                <div className={styles.portraitFallback}>
                  <span className={styles.fallbackLetter}>
                    {data.name ? data.name.charAt(0) : 'L'}
                  </span>
                </div>
              </div>

              <div className={styles.portraitCaption}>
                <span className={styles.captionRole}>Engineering &bull; Post-Production</span>
                <span className={styles.captionStack}>Next.js &bull; Premiere &bull; Node</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
