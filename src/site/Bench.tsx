import { bench, minor } from '../content/projects.js';
import type { BenchProject } from '../content/types.js';
import { Arrow, Ext, LinkList, Picture, Tags } from './ui.js';

export function Bench() {
  return (
    <section className="bench" id="bench" data-tone="light" aria-labelledby="bench-title">
      <header className="section-head">
        <p className="label">05 · On the workbench</p>
        <h2 className="section-title" id="bench-title" data-split="">
          Bigger React apps, still being built.
        </h2>
        <p className="section-lede">
          State management, data fetching, auth and routing, on a larger scale than the live builds. Neither is deployed
          yet, so the screens come from their own builds, and each says plainly what isn’t finished.
        </p>
      </header>

      <div className="bench__features">
        {bench.map((p, i) => (
          <Specimen key={p.id} p={p} flip={i % 2 === 1} />
        ))}
      </div>

      <section className="more" aria-labelledby="more-title">
        <h3 className="label" id="more-title">
          Also built, no public link yet
        </h3>
        <ul className="more__list" role="list">
          {minor.map((m) => (
            <li key={m.id} id={m.id} className="more__row">
              <span className="more__year">{m.year}</span>
              <div className="more__main">
                <h4 className="more__name">{m.name}</h4>
                <p className="more__text">{m.summary}</p>
              </div>
              <p className="more__stack">{m.stack.join(' · ')}</p>
              <div className="more__links">
                {m.links.length ? (
                  m.links.map((l) => (
                    <Ext key={l.href} href={l.href} className="pill">
                      {l.label} <Arrow />
                    </Ext>
                  ))
                ) : (
                  <span className="more__nolink">No public link</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

    </section>
  );
}

function Specimen({ p, flip }: { p: BenchProject; flip: boolean }) {
  return (
    <article className={`specimen${flip ? ' specimen--flip' : ''}`} id={p.id} aria-labelledby={`${p.id}-title`}>
      <div className="specimen__shots" data-shots="">
        <div className="shots__frame">
          {p.shots.map((s, i) => (
            <div key={s.label} className="shots__img" hidden={i !== 0}>
              <Picture img={s.img} sizes="(min-width: 1100px) 58vw, 92vw" />
            </div>
          ))}
        </div>
        <div className="shots__tabs" role="group" aria-label={`${p.name} screens`}>
          {p.shots.map((s, i) => (
            <button key={s.label} type="button" data-shot={i} aria-pressed={i === 0 ? 'true' : 'false'}>
              {s.label}
            </button>
          ))}
        </div>
        {p.note ? <p className="shots__note">{p.note}</p> : null}
      </div>
      <div className="specimen__text">
        <p className="specimen__status">
          <span className="status__dot" aria-hidden="true" /> {p.status}
        </p>
        <h3 className="specimen__name" id={`${p.id}-title`}>
          {p.name}
          {p.alias ? <span className="specimen__alias"> · {p.alias}</span> : null}
        </h3>
        <p className="specimen__summary">{p.summary}</p>
        <div className="specimen__lists">
          <div>
            <h4 className="label">Built</h4>
            <ul className="built built--tight">
              {p.built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label">Not yet</h4>
            <ul className="built built--tight built--open">
              {p.notYet.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
        <Tags items={p.stack} />
        <LinkList links={p.links} />
      </div>
    </article>
  );
}
