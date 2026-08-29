import { builds } from '../data/profile'

/**
 * Three builds, each rendered as the same four-part argument: what it is, the
 * ingest → extract → explain pipeline, the hardest problem in it, and what
 * Devansh specifically did. `data-build` is what the stage observer watches to
 * focus the matching node in the lattice.
 */
export default function Work() {
  return (
    <section className="sect work" id="work" data-section="work">
      <header className="sect-head">
        <h2>Work</h2>
        <p className="label">
          Three systems. Same shape: unreadable input, structure out, an answer a person can check.
        </p>
      </header>

      {builds.map((b) => (
        <article className="build grid" key={b.id} id={`build-${b.id}`} data-build={b.id}>
          <div className="build-inner" data-reveal>
            <p className="build-meta">
              <span className="build-index">{b.index}</span>
              <span className="build-context">{b.context}</span>
            </p>

            <h3 className="build-title display">{b.name}</h3>

            <p className="build-premise">{b.premise}</p>

            <div className="build-facts">
              {b.facts.map((f) => (
                /* warm accent only ever marks the NASA rank */
                <p className={`build-fact${f.value === '5th' ? ' is-flare' : ''}`} key={f.label}>
                  <b>{f.value}</b>
                  <span>{f.label}</span>
                </p>
              ))}
            </div>

            <div className="pipeline">
              <div className="beat">
                <h4>Ingest</h4>
                <p>{b.ingest}</p>
              </div>
              <div className="beat">
                <h4>Extract</h4>
                <p>{b.extract}</p>
              </div>
              <div className="beat">
                <h4>Explain</h4>
                <p>{b.explain}</p>
              </div>
            </div>

            <div className="note note-hard">
              <h5>The hard part</h5>
              <p>{b.hard}</p>
            </div>

            <div className="note note-mine">
              <h5>What I built · {b.status}</h5>
              <p>{b.contribution}</p>
            </div>

            <ul className="chips">
              {b.stack.map((s) => (
                <li className="chip" key={s}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  )
}
