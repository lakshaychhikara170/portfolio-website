import styles from './Projects.module.css'

export default function Projects({ projects }) {
  const featured = projects.filter(p => p.featured)
  const secondary = projects.filter(p => !p.featured)

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Selected Projects</h2>
          <p className="section-desc">
            Production web platforms, interactive applications, and digital products.
          </p>
        </div>

        <div className={styles.stack}>
          {/* Featured Projects */}
          <div className={styles.featuredList}>
            {featured.map((p, idx) => (
              <article key={p.title} className={styles.featuredItem}>
                <div className={styles.screen}>
                  {p.image ? (
                    <img src={p.image} alt={p.title} className={styles.img} />
                  ) : null}
                  <div className={styles.previewBackdrop}>
                    <span className={styles.previewTitle}>{p.title}</span>
                  </div>
                </div>

                <div className={styles.featuredBody}>
                  <div className={styles.tags}>
                    {p.tags.map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>

                  <h3 className={styles.projectTitle}>{p.title}</h3>
                  <p className={styles.projectDesc}>{p.description}</p>

                  <div className={styles.links}>
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                      >
                        Live Demo
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Secondary Projects Grid */}
          {secondary.length > 0 && (
            <div className={styles.secondaryGrid}>
              {secondary.map(p => (
                <article key={p.title} className={styles.secondaryCard}>
                  <div className={styles.tags}>
                    {p.tags.map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                  <h4 className={styles.cardTitle}>{p.title}</h4>
                  <p className={styles.cardDesc}>{p.description}</p>
                  <div className={styles.cardLinks}>
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.textLink}
                      >
                        Live Demo
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.textLinkMuted}
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
