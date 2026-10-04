import styles from './Experience.module.css'

export default function Experience({ experience, education }) {
  if (!experience?.length && !education?.length) return null

  // Ensure zero em-dashes per taste-skill rule 9.G
  const cleanPeriod = (period) => (period || '').replace(/[—–]/g, '-')

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Experience &amp; Background</h2>
          <p className="section-desc">
            Professional software development roles and formal technical education.
          </p>
        </div>

        <div className={styles.wrapper}>
          {experience?.length > 0 && (
            <div className={styles.sectionBlock}>
              <h3 className={styles.blockTitle}>Work History</h3>
              <div className={styles.timeline}>
                {experience.map((job, idx) => (
                  <article key={idx} className={styles.timelineItem}>
                    <div className={styles.periodCol}>
                      <span className={styles.periodText}>{cleanPeriod(job.period)}</span>
                      {job.location && (
                        <span className={styles.locationText}>{job.location}</span>
                      )}
                    </div>

                    <div className={styles.infoCol}>
                      <h4 className={styles.jobRole}>{job.role}</h4>
                      <p className={styles.companyName}>{job.company}</p>

                      <ul className={styles.bulletList}>
                        {job.bullets.map((b, bIdx) => (
                          <li key={bIdx} className={styles.bulletItem}>
                            {cleanPeriod(b)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {education?.length > 0 && (
            <div className={styles.sectionBlock}>
              <h3 className={styles.blockTitle}>Education</h3>
              <div className={styles.timeline}>
                {education.map((edu, idx) => (
                  <article key={idx} className={styles.timelineItem}>
                    <div className={styles.periodCol}>
                      <span className={styles.periodText}>{cleanPeriod(edu.period)}</span>
                    </div>
                    <div className={styles.infoCol}>
                      <h4 className={styles.jobRole}>{edu.degree}</h4>
                      <p className={styles.companyName}>{edu.institution}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
