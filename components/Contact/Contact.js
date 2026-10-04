'use client'
import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact({ data }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', subject: '', message: '',
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
    } catch {
      setStatus('error')
      setErrorMsg('Transmission failed. Please reach out directly via email.')
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Contact</h2>
          <p className="section-desc">
            Get in touch for project inquiries, engineering collaborations, or video post-production.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Direct channels */}
          <div className={styles.directCol}>
            <div className={styles.channelCard}>
              <h3 className={styles.channelTitle}>Direct Channels</h3>
              <p className={styles.channelDesc}>
                I typically respond within 24 hours. Feel free to use the form or reach out directly.
              </p>

              <div className={styles.channelList}>
                <div className={styles.channelItem}>
                  <span className={styles.channelLabel}>Email</span>
                  <a href={`mailto:${data.email}`} className={styles.channelLink}>
                    {data.email}
                  </a>
                </div>

                {data.social?.github && (
                  <div className={styles.channelItem}>
                    <span className={styles.channelLabel}>GitHub</span>
                    <a
                      href={data.social.github}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.channelLink}
                    >
                      {data.social.github.replace('https://', '')}
                    </a>
                  </div>
                )}

                {data.social?.linkedin && (
                  <div className={styles.channelItem}>
                    <span className={styles.channelLabel}>LinkedIn</span>
                    <a
                      href={data.social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.channelLink}
                    >
                      {data.social.linkedin.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formCol}>
            {status === 'success' ? (
              <div className={styles.successMessage}>
                <h3 className={styles.successTitle}>Message Sent</h3>
                <p className={styles.successDesc}>
                  Thank you for reaching out. Your message has been received and I will get back to you shortly.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStatus('idle')}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="name" className={styles.label}>
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={styles.input}
                      value={form.name}
                      onChange={set('name')}
                      required
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={styles.input}
                      value={form.email}
                      onChange={set('email')}
                      required
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="phone" className={styles.label}>
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={styles.input}
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="company" className={styles.label}>
                      Company or Studio
                    </label>
                    <input
                      id="company"
                      type="text"
                      className={styles.input}
                      value={form.company}
                      onChange={set('company')}
                      placeholder="Acme Studio"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="subject" className={styles.label}>
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className={styles.input}
                    value={form.subject}
                    onChange={set('subject')}
                    required
                    placeholder="Project Inquiry"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    className={styles.textarea}
                    value={form.message}
                    onChange={set('message')}
                    required
                    rows={5}
                    placeholder="Briefly describe your project, timeline, or requirements..."
                  />
                </div>

                {status === 'error' && (
                  <div className={styles.errorBox}>
                    {errorMsg}
                  </div>
                )}

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
