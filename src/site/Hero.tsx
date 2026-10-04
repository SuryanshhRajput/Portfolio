import { person } from '../content/site.js';
import { Arrow } from './ui.js';

/** What the terminal in the hero types out. Every line is checked against the rest of the page. */
const TERMINAL: { cmd: string; out: string }[] = [
  { cmd: 'whoami', out: 'Suryansh Singh, frontend developer moving to full-stack' },
  { cmd: 'ls ~/shipped', out: 'glasseria/  vellora-escapes/  dogindeed/  +13 live builds' },
  { cmd: 'cat stack.txt', out: 'React · Next.js · TypeScript · Shopify Liquid · Tailwind · Redux Toolkit' },
  { cmd: 'tail offscreen.log', out: 'AltReality COO · Zenevia Hospitality Head · Innovate 2025 organiser' },
  { cmd: 'status --hiring', out: 'Open to frontend and full-stack roles' },
];

/**
 * The opening scene. With WebGL a sun made of particles breaks apart into the
 * name (सूर्यांश is "a part of the sun"), the pointer pushes the particles
 * around, and scrolling dives through them. Without it the name is set in type
 * over the same dark field. The terminal works either way.
 */
export function Hero() {
  return (
    <section className="hero" id="top" data-tone="dark" aria-labelledby="hero-name">
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__hud" aria-hidden="true">
        <span>28.47° N · 77.50° E</span>
        <span>
          <span data-particle-count="">Portfolio</span> · 2026
        </span>
      </div>

      <h1 className="hero__title" id="hero-name">
        <span className="hero__first">{person.firstName}</span> <span className="hero__last">{person.lastName}</span>
      </h1>

      <div className="hero__bottom">
        <div className="hero__intro">
          <p className="hero__eyebrow">
            <span className="hero__dot" aria-hidden="true" />
            <span lang="sa">{person.nameMeaning.devanagari}</span> · {person.nameMeaning.gloss}
          </p>
          <p className="hero__lede">
            I build online stores for real businesses, and React apps to learn the rest.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--sun" href="#street" data-magnetic="0.25" data-cursor="Walk in">
              Walk down the street <Arrow dir="down" />
            </a>
            <a className="btn btn--ghost" href="#live" data-magnetic="0.2">
              13 live builds
            </a>
          </div>
        </div>

        <figure className="term" aria-label="About me, as a terminal session">
          <div className="term__bar" aria-hidden="true">
            <span className="term__dots">
              <i />
              <i />
              <i />
            </span>
            <span className="term__path">~/suryansh — zsh</span>
          </div>
          <ol className="term__body" data-term="">
            {TERMINAL.map((l) => (
              <li key={l.cmd} className="term__line">
                <p className="term__cmd">
                  <span className="term__prompt" aria-hidden="true">
                    ❯
                  </span>{' '}
                  <span data-type="">{l.cmd}</span>
                </p>
                <p className="term__out">
                  <span data-type="">{l.out}</span>
                </p>
              </li>
            ))}
          </ol>
          <span className="term__caret" aria-hidden="true" />
        </figure>
      </div>

      <a className="hero__cue" href="#intro" aria-label="Scroll to the introduction">
        <span>Scroll to dive in</span>
        <Arrow dir="down" />
      </a>
    </section>
  );
}

/** A paragraph that lights up word by word as it scrolls past, then the basic facts. */
export function Manifesto() {
  return (
    <section className="manifesto" id="intro" data-tone="dark" aria-labelledby="intro-title">
      <h2 className="label manifesto__label" id="intro-title">
        Hello. I’m Suryansh.
      </h2>
      <p className="manifesto__text" data-scrub-words="">
        I build storefronts for real businesses. A glassware brand, a travel company and a pet-supplies startup put
        their websites in my hands, and I shipped all three. On the side I build React apps to learn what a storefront doesn’t
        teach: state, data and auth. <em>Three shops are open on the street below.</em> Thirteen more builds are live on
        the web.
      </p>
      <dl className="manifesto__facts">
        <div>
          <dt>Role</dt>
          <dd>{person.role}</dd>
        </div>
        <div>
          <dt>Study</dt>
          <dd>
            {person.study}, {person.years}
          </dd>
        </div>
        <div>
          <dt>Base</dt>
          <dd>{person.base}</dd>
        </div>
        <div>
          <dt>Open to</dt>
          <dd>{person.openTo}</dd>
        </div>
      </dl>
    </section>
  );
}

const MARQUEE = [
  'Glasseria',
  'Vellora Escapes',
  'DogIndeed',
  'Shopify',
  'Liquid',
  'React',
  'Redux Toolkit',
  'TanStack Query',
  'Next.js',
  'FastAPI',
  'Tailwind CSS',
  'Canva',
];

/** A band of names that runs sideways and leans into the scroll. */
export function Marquee() {
  const row = (key: string) => (
    <span className="marquee__row" key={key}>
      {MARQUEE.map((m) => (
        <span key={m} className="marquee__item">
          {m}
          <svg className="marquee__star" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" data-marquee="">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
