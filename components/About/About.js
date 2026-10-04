import styles from './About.module.css'

export default function About({ data }) {
  const edu = data.education?.[0] || { degree: 'B.Tech in Computer Science', institution: 'University' }

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">About</h2>
          <p className="section-desc">
            Bridging software engineering discipline with creative video editing.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.proseColumn}>
            <p className={styles.lead}>
              {data.bio}
            </p>
            <p className={styles.bodyText}>
              In development, I focus on performance, clarity, and dependable architectures.
              In video editing, I focus on rhythm, visual tension, and emotional pacing.
              The intersection of both disciplines allows me to build digital products with
              uncompromising technical execution and sharp creative intuition.
            </p>
          </div>

          <div className={styles.specColumn}>
            <div className={styles.specBox}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Primary Disciplines</span>
                <span className={styles.specValue}>Video Editing, Full-Stack Web Development</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Location</span>
                <span className={styles.specValue}>{data.location || 'India'} (Remote Worldwide)</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Education</span>
                <span className={styles.specValue}>{edu.degree}, {edu.institution}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Email</span>
                <a href={`mailto:${data.email}`} className={styles.specLink}>
                  {data.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
