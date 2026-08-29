import { profile, sections, type SectionId } from '../data/profile'

const items = sections.filter((s) => s.nav)

export function TopBar() {
  return (
    <header className="topbar">
      <a className="mark" href="#top" aria-label={`${profile.name} — back to top`}>
        {profile.initials}
        <i aria-hidden="true" />
      </a>
      <div className="topbar-right">
        <p className="label status">
          <b aria-hidden="true" />
          <span>Open to internships</span>
        </p>
        <a className="label resume-link" href={profile.links.resume} target="_blank" rel="noreferrer">
          Résumé <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  )
}

export function Rail({ active }: { active: SectionId }) {
  return (
    <nav className="rail" aria-label="Sections">
      <span className="rail-fill" aria-hidden="true" />
      <ul className="rail-nav">
        {items.map((s) => (
          <li key={s.id}>
            <a
              className="rail-item"
              href={`#${s.id}`}
              aria-current={active === s.id ? 'true' : undefined}
            >
              <span aria-hidden="true" />
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="rail-foot micro" aria-hidden="true" />
    </nav>
  )
}
