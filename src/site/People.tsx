import { about, alsoHeld, badgesPhoto, groups, learning, passes } from '../content/people.js';
import { person, profiles } from '../content/site.js';
import { Arrow, Ext, Picture } from './ui.js';

export function Rooms() {
  return (
    <section className="rooms" id="rooms" data-tone="dark" aria-labelledby="rooms-title">
      <header className="off__head">
        <div className="off__intro">
          <p className="label">07 · Off-screen</p>
          <h2 className="off__title" id="rooms-title" data-split="">
            Off-screen, I’m usually the one running the room.
          </h2>
          <p className="off__lede">
            Organiser, host, speaker, club COO. Two years of college events across five student groups, and a drawer full of
            lanyards to show for it.
          </p>
          <ul className="off__groups" role="list" aria-label="Groups I worked in">
            {groups.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <Ext href={profiles.linkedin.href} className="pill pill--night">
            The posts are on LinkedIn <Arrow />
          </Ext>
        </div>
        <figure className="off__photo" data-reveal="clip">
          <Picture img={badgesPhoto} sizes="(min-width: 960px) 46vw, 92vw" />
          <figcaption>Every pass from two years of college events.</figcaption>
        </figure>
      </header>

      <div className="passes" data-passes="">
        <div className="passes__pin">
          <div className="passes__stage">
          <div className="passes__rail" aria-hidden="true" />
          <ol className="passes__track">
            {passes.map((p, i) => (
              <li key={p.id} className="pass" style={{ ['--accent' as string]: p.accent }}>
                <article className="pass__card" aria-labelledby={`pass-${p.id}`}>
                  <span className="pass__hole" aria-hidden="true" />
                  <header className="pass__top">
                    <span className="pass__role">{p.role}</span>
                    {p.when ? <span className="pass__when">{p.when}</span> : null}
                  </header>
                  <div className={`pass__media${p.img ? '' : ' pass__media--type'}`}>
                    {p.img ? (
                      <Picture img={p.img} sizes="(min-width: 960px) 340px, 78vw" />
                    ) : (
                      <p className="pass__poster" aria-hidden="true">
                        {p.stat?.value}
                      </p>
                    )}
                  </div>
                  <div className="pass__body">
                    <h3 className="pass__event" id={`pass-${p.id}`}>
                      {p.event}
                    </h3>
                    <p className="pass__org">{p.org}</p>
                    <p className="pass__text">{p.text}</p>
                    {p.stat && p.img ? (
                      <p className="pass__stat">
                        <strong>{p.stat.value}</strong> {p.stat.label}
                      </p>
                    ) : null}
                  </div>
                  <footer className="pass__foot" aria-hidden="true">
                    <span className="pass__code" />
                    <span>No. {String(i + 1).padStart(3, '0')}</span>
                  </footer>
                </article>
              </li>
            ))}
          </ol>
          </div>
          <div className="passes__hud" aria-hidden="true">
            <span>Drag or scroll</span>
            <span className="passes__bar">
              <span />
            </span>
            <span>
              {passes.length} passes
            </span>
          </div>
        </div>
      </div>

      <div className="off__about">
        <aside className="about" aria-label="About me">
          <Picture img={person.portrait} sizes="(min-width: 960px) 220px, 40vw" className="about__photo" />
          <div className="about__text">
            {about.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ul className="about__also" role="list">
              {alsoHeld.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="now" aria-labelledby="now-title">
          <h3 className="label" id="now-title">
            Right now
          </h3>
          <div className="now__grid">
            {learning.now.map((n) => (
              <div key={n.title} className="now__item">
                <h4 className="now__title">{n.title}</h4>
                <p>{n.text}</p>
                {'link' in n && n.link ? (
                  <Ext href={n.link.href} className="pill pill--night">
                    {n.link.label} <Arrow />
                  </Ext>
                ) : null}
              </div>
            ))}
            <div className="now__item now__proof">
              <h4 className="now__title">Certificates and badges</h4>
              <ul role="list">
                {learning.proof.map((c) =>
                  c.href ? (
                    <li key={c.label}>
                      <Ext href={c.href}>
                        {c.label} <Arrow />
                      </Ext>
                      <span>{c.meta}</span>
                    </li>
                  ) : (
                    <li key={c.label}>
                      {c.label}
                      <span>{c.meta}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="contact" id="contact" data-tone="dark" aria-labelledby="contact-title">
      <div className="contact__sun" aria-hidden="true" />
      <p className="label">08 · Nightfall</p>
      <h2 className="contact__title" id="contact-title" data-split="chars">
        Write to me.
      </h2>
      <p className="contact__lede">
        I’m looking for frontend and full-stack internships and roles. Email is the quickest way to reach me.
      </p>
      <div className="contact__mail">
        <a className="contact__email" id="email" href={`mailto:${person.email}`}>
          {person.email}
        </a>
        <button className="btn btn--sun" type="button" data-copy={person.email} data-copy-target="email" data-magnetic="0.2">
          <span data-copy-label="">Copy address</span>
        </button>
      </div>
      <ul className="contact__profiles" role="list">
        {Object.values(profiles).map((p) => (
          <li key={p.href}>
            <Ext href={p.href}>
              <span className="contact__net">{p.label}</span>
              <span className="contact__handle">{p.handle}</span>
              <Arrow />
            </Ext>
          </li>
        ))}
      </ul>
      <p className="contact__time readout">
        It’s <time data-clock="">--:--</time> in Greater Noida.
      </p>
      <footer className="colophon">
        <p>
          © 2026 {person.name}. Built with React rendered to static HTML at build time, TypeScript in the browser, GSAP
          for motion and Three.js for the particle sun and the street. Type set in Archivo, Instrument Sans, Instrument Serif and JetBrains Mono.
        </p>
        <a href="#top" className="colophon__top">
          Back to the top <Arrow dir="ne" />
        </a>
      </footer>
    </section>
  );
}
