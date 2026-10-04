import { chapters, person, profiles } from '../content/site.js';
import { bench, caseStudies } from '../content/projects.js';
import { liveProjects } from '../content/live.js';
import { Arrow, Ext } from './ui.js';

/** The fixed frame: wordmark and clock on top, chapter rail on the left, actions at the bottom. */
export function Chrome() {
  return (
    <>
      <a className="skip" href="#street">
        Skip to the work
      </a>
      <Loader />
      <div className="cursor" aria-hidden="true">
        <span className="cursor__ring" />
        <span className="cursor__dot" />
        <span className="cursor__label" />
      </div>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label={`${person.name}, back to the top`}>
          <span className="wordmark__dot" aria-hidden="true" />
          <span>{person.name}</span>
        </a>
        <p className="readout topbar__clock">
          <span className="readout__k">Greater Noida</span>{' '}
          <time data-clock="">--:--</time> <span className="readout__k">IST</span>
        </p>
      </header>

      <nav className="rail" aria-label="Chapters">
        <span className="rail__sun" aria-hidden="true" />
        <ol>
          {chapters.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>
                <span className="rail__tick" aria-hidden="true" />
                <span className="rail__label">{c.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="dock">
        <button className="dock__btn" type="button" data-open-index="" aria-haspopup="dialog" aria-controls="index" data-magnetic="0.25">
          Index <kbd>I</kbd>
        </button>
        <a className="dock__btn dock__btn--sun" href="#contact" data-magnetic="0.3">
          Write to me
        </a>
      </div>

      <IndexDialog />
    </>
  );
}

/** First paint: the name in Devanagari, a counter and the sun coming up. Removed by script. */
function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <div className="loader__sky">
        <span className="loader__sun" />
      </div>
      <p className="loader__word" lang="sa">
        {person.nameMeaning.devanagari}
      </p>
      <p className="loader__meaning">{person.nameMeaning.gloss}</p>
      <p className="loader__count">
        <span data-loader-count="">000</span>
      </p>
    </div>
  );
}

function IndexDialog() {
  return (
    <dialog id="index" className="index" aria-labelledby="index-title">
      <div className="index__inner">
        <div className="index__head">
          <h2 id="index-title" className="label">
            Index
          </h2>
          <button className="index__close" type="button" data-close-index="">
            Close <kbd>Esc</kbd>
          </button>
        </div>
        <div className="index__cols">
          <section aria-labelledby="ix-chapters">
            <h3 id="ix-chapters" className="label">
              Chapters
            </h3>
            <ol className="index__chapters">
              {chapters.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>
                    <span className="index__n">{String(i).padStart(2, '0')}</span>
                    {c.label}
                  </a>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="ix-work">
            <h3 id="ix-work" className="label">
              Storefronts
            </h3>
            <ul className="index__list" role="list">
              {caseStudies.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>{c.name}</a> <span>{c.kind}</span>
                </li>
              ))}
            </ul>
            <h3 className="label">On the bench</h3>
            <ul className="index__list" role="list">
              {bench.map((b) => (
                <li key={b.id}>
                  <a href={`#${b.id}`}>{b.name}</a> <span>{b.stack.slice(0, 3).join(', ')}</span>
                </li>
              ))}
            </ul>
            <h3 className="label">Live on the web</h3>
            <ul className="index__list index__list--live" role="list">
              {liveProjects.map((m) => (
                <li key={m.id}>
                  <a href={`#${m.id}`}>{m.name}</a> <span>{m.what}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="ix-elsewhere">
            <h3 id="ix-elsewhere" className="label">
              Elsewhere
            </h3>
            <ul className="index__list" role="list">
              {Object.values(profiles).map((p) => (
                <li key={p.href}>
                  <Ext href={p.href}>
                    {p.label} <Arrow />
                  </Ext>{' '}
                  <span>{p.handle}</span>
                </li>
              ))}
              <li>
                <a href="#contact">Email</a> <span>{person.email}</span>
              </li>
            </ul>
            <p className="index__tip">
              Press <kbd>I</kbd> anywhere to open or close this index.
            </p>
          </section>
        </div>
      </div>
    </dialog>
  );
}
