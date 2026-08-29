import { useCallback, useRef, useState } from 'react'
import { profile } from '../data/profile'

export default function Contact() {
  const { links, availability, thesisShort } = profile
  const [copied, setCopied] = useState(false)
  const [phone, setPhone] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(links.email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* no clipboard permission — the mailto link below still works */
      window.location.href = `mailto:${links.email}`
    }
  }, [links.email])

  return (
    <section className="sect contact" id="contact" data-section="contact">
      <header className="sect-head">
        <h2>Contact</h2>
        <p className="label">Open to internships now · full-time from 2028</p>
      </header>

      <div className="grid">
        <p className="contact-lede lead">{thesisShort} If that is the kind of problem on your desk, I would like to hear about it.</p>

        <button className="mailto" onClick={copy} aria-label={`Copy email address ${links.email}`}>
          {links.email}
          <i aria-hidden="true" />
        </button>

        <p className={`copy-state${copied ? ' is-copied' : ''}`}>
          <span className="micro only-pointer">Click to copy</span>
          <span className="micro only-touch">Tap to copy</span>
          <em className="micro" role="status">
            {copied ? 'Copied to clipboard' : ''}
          </em>
        </p>

        <div className="reach">
          <a className="reach-item" href={links.github} target="_blank" rel="noreferrer noopener">
            <b>GitHub</b>
            <span>{links.githubHandle} ↗</span>
          </a>
          <a className="reach-item" href={links.linkedin} target="_blank" rel="noreferrer noopener">
            <b>LinkedIn</b>
            <span>{links.linkedinHandle} ↗</span>
          </a>
          <a className="reach-item" href={links.resume} target="_blank" rel="noreferrer noopener">
            <b>Résumé</b>
            <span>PDF ↗</span>
          </a>
          {phone ? (
            <a className="reach-item" href={links.phoneHref}>
              <b>Phone</b>
              <span>{links.phone}</span>
            </a>
          ) : (
            <button className="reach-item" onClick={() => setPhone(true)}>
              <b>Phone</b>
              <span>Reveal</span>
            </button>
          )}
        </div>

        <div className="contact-avail">
          <p>{availability.now}</p>
          <p>{availability.later}</p>
        </div>

        <footer className="foot micro">
          <span>
            {profile.name} · {profile.locationShort}
          </span>
          <span>React · three.js · no template</span>
          <a href="#signal">Back to top ↑</a>
        </footer>
      </div>
    </section>
  )
}
