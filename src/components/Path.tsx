import { profile } from '../data/profile'

/** the three rules the builds have in common, stated once and not embellished */
const principles = [
  {
    title: 'Show the evidence',
    body: 'An answer nobody can check is not an answer. Every insight in the knowledge engine traces back to the papers it came from; every violation the compliance agent reports names the clause that produced it.',
  },
  {
    title: 'Keep a person in the loop',
    body: 'Automation that cannot be rejected is a liability. In the compliance agent, human review is part of the architecture rather than a screen added at the end.',
  },
  {
    title: 'Ship the whole path',
    body: 'API to interface. A pipeline that never reaches a person in a form they can use is not finished, which is why I have built both ends of all three systems.',
  },
]

export default function Path() {
  const { education, banner, availability } = profile

  return (
    <section className="sect path" id="path" data-section="path">
      <header className="sect-head">
        <h2>Path</h2>
        <p className="label">Where I am, what it earned, what is next</p>
      </header>

      <div className="grid">
        <div className="path-now" data-reveal>
          <p className="label">Education</p>
          <h3 className="path-degree display">{education.degree}</h3>
          <p className="path-school">
            {education.school} · {education.place}
          </p>
          <p className="path-finish micro">{education.finish}</p>
          <p className="path-note">
            Everything on this site was built outside coursework — two hackathons and a college tech
            fest, three systems taken from an empty repository to a working interface.
          </p>
        </div>

        <div className="path-side" data-reveal>
          <div className="honour">
            <p className="honour-rank">
              <b>{banner.prize}</b>
              <span>of {banner.of}</span>
            </p>
            <h3>{banner.event}</h3>
            <p>{banner.qualifier}</p>
          </div>

          <div className="avail">
            <p>{availability.now}</p>
            <p>{availability.later}</p>
          </div>
        </div>

        <ul className="principles" data-reveal>
          {principles.map((p) => (
            <li className="principle" key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
