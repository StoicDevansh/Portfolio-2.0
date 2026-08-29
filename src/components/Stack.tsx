import { builds, tech } from '../data/profile'

/** most-used first: the order itself is the argument */
const shipped = tech
  .filter((t) => t.tier === 'shipped')
  .sort((a, b) => b.builds.length - a.builds.length || a.name.localeCompare(b.name))

const core = tech.filter((t) => t.tier === 'core')
const buildOf = (id: string) => builds.find((b) => b.id === id)

export default function Stack({ onHover }: { onHover: (id: string | null) => void }) {
  return (
    <section className="sect stack" id="stack" data-section="stack">
      <header className="sect-head">
        <h2>Stack</h2>
        <p className="label">What shipped, and what it shipped in</p>
      </header>

      <div className="grid">
        <p className="stack-lede lead">
          Anyone can list twenty-six technologies. These are the ones with a build behind them —
          each row prints the projects it actually appears in.{' '}
          {/* the lattice answers a pointer, so the invitation is only true where there is one */}
          <span className="only-pointer">Hover a row to find it in the lattice.</span>
        </p>

        <div className="stack-body" data-reveal>
          <h3 className="tier-head label">
            Shipped<span>{shipped.length} tools, three builds</span>
          </h3>

          <ul className="rows">
            {shipped.map((t) => (
              <li
                className="row"
                key={t.id}
                onPointerEnter={() => onHover(t.id)}
                onPointerLeave={() => onHover(null)}
                onFocus={() => onHover(t.id)}
                onBlur={() => onHover(null)}
              >
                <span className="row-name">{t.name}</span>
                <span className="meter" aria-hidden="true">
                  <i className={t.builds.length > 0 ? 'on' : undefined} />
                  <i className={t.builds.length > 1 ? 'on' : undefined} />
                  <i className={t.builds.length > 2 ? 'on' : undefined} />
                </span>
                <span className="row-tags">
                  {t.builds.map((id) => {
                    const b = buildOf(id)
                    return (
                      <a className="row-tag" href={`#build-${id}`} key={id} title={b?.name}>
                        {b?.index}
                        <span className="sr"> — {b?.name}</span>
                      </a>
                    )
                  })}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="tier-head label">
            Foundation<span>{core.length} tools</span>
          </h3>
          <ul className="core">
            {core.map((t) => (
              <li className="chip" key={t.id}>
                {t.name}
              </li>
            ))}
          </ul>
          <p className="core-note">
            Coursework, competitive programming and day-to-day tooling. Listed separately because
            they have not carried one of the three builds above — the distinction seemed worth
            keeping.
          </p>
        </div>
      </div>
    </section>
  )
}
