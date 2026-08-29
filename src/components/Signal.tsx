import { profile } from '../data/profile'

export default function Signal() {
  return (
    <section className="sect signal" id="signal" data-section="signal">
      <div className="grid signal-grid">
        <div className="signal-main">
          <p className="signal-eyebrow label rise" style={{ '--delay': '520ms' } as React.CSSProperties}>
            <span>
              {profile.role} · {profile.locationShort}
            </span>
          </p>

          <h1 className="signal-name display">
            <span>{profile.first}</span>
            <span>{profile.last}</span>
          </h1>

          <p className="signal-thesis rise" style={{ '--delay': '620ms' } as React.CSSProperties}>
            I build systems that read what a person cannot — <b>six hundred research papers</b>,{' '}
            <b>a stack of policy documents</b>, <b>a database nobody has audited</b> — and hand back
            something you can act on.
          </p>

          <div className="cred rise" style={{ '--delay': '760ms' } as React.CSSProperties}>
            <p className="cred-num num">{profile.banner.prize}</p>
            <div className="cred-body">
              <p className="label">of {profile.banner.of}</p>
              <p className="cred-event">{profile.banner.event}</p>
              <p className="micro">{profile.banner.qualifier}</p>
            </div>
          </div>

          <p className="cue rise" style={{ '--delay': '900ms' } as React.CSSProperties}>
            <i aria-hidden="true" />
            <span className="micro">Scroll — three builds</span>
          </p>
        </div>

        <figure className="signal-figure rise" style={{ '--delay': '340ms' } as React.CSSProperties}>
          <img
            src="portrait.webp"
            srcSet="portrait.webp 560w, portrait@2x.webp 984w"
            sizes="(max-width: 1024px) 22rem, 40vw"
            width={984}
            height={880}
            alt={`${profile.name}, seated portrait`}
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  )
}
