import styles from './Skills.module.css'

export default function Skills({ skills }) {
  const categories = Object.entries(skills || {})

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Skills &amp; Technologies</h2>
          <p className="section-desc">
            Core stack for full-stack web applications and post-production editing pipelines.
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map(([category, items]) => (
            <div key={category} className={styles.group}>
              <h3 className={styles.groupTitle}>{category}</h3>
              <ul className={styles.itemList}>
                {items.map(item => (
                  <li key={item} className={styles.item}>
                    <span className={styles.bullet}>+</span>
                    <span className={styles.name}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
