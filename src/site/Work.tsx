import { caseStudies, velloraDestinations } from '../content/projects.js';
import type { CaseStudy, Img } from '../content/types.js';
import { Arrow, Chain, LinkList, Picture } from './ui.js';

export function CaseStudies() {
  return (
    <>
      {caseStudies.map((c) => (
        <Case key={c.id} c={c} />
      ))}
    </>
  );
}

function Case({ c }: { c: CaseStudy }) {
  const titleId = `${c.id}-title`;
  return (
    <article className={`case case--${c.id}`} id={c.id} data-tone={c.id === 'vellora' ? 'dark' : 'light'} aria-labelledby={titleId}>
      <header className="case__head">
        <p className="case__kicker">
          <span className="case__n">Shop {String(c.order).padStart(2, '0')}</span>
          <span>{c.kind}</span>
        </p>
        <h2 className="case__title" id={titleId} data-kinetic="" style={{ ['--chars' as string]: c.name.length }}>
          {c.name}
        </h2>
        <p className="case__pitch" data-reveal="">
          {c.pitch}
        </p>
      </header>

      <ul className="stats" role="list">
        {c.stats.map((s) => {
          // Plain numbers count up when they scroll in; the final value is in the HTML either way.
          const m = s.value.match(/^(\d+)(\+?)$/);
          return (
            <li key={s.label} className="stat" data-reveal="">
              <span className="stat__value" data-count={m ? m[1] : undefined} data-suffix={m && m[2] ? m[2] : undefined}>
                {s.value}
              </span>
              <span className="stat__label">{s.label}</span>
            </li>
          );
        })}
      </ul>

      <div className="case__cover">
        <div className="case__intro">
          <p className="case__summary">{c.summary}</p>
          <dl className="facts">
            {c.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="status" data-state={c.status.state}>
            <span className="status__dot" aria-hidden="true" />
            <span>{c.status.text}</span>
          </p>
        </div>
        <div className="case__window" data-reveal="clip">
          {c.id === 'glasseria' && c.cover ? <Fluted img={c.cover} /> : null}
          {c.id === 'vellora' ? <Board /> : null}
          {c.id === 'dogindeed' ? <DogCover c={c} /> : null}
        </div>
      </div>

      {c.frames.length ? <Reel c={c} /> : null}

      <div className="case__notes">
        <section className="notes__built" aria-labelledby={`${c.id}-built`}>
          <h3 className="label" id={`${c.id}-built`}>
            What I built
          </h3>
          <ul className="built" data-stagger="">
            {c.built.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
        <div className="notes__side">
          {c.quote ? (
            <figure className="quote" data-reveal="">
              <blockquote>
                <p>{c.quote.text}</p>
              </blockquote>
              <figcaption>{c.quote.source}</figcaption>
            </figure>
          ) : null}
          <Chain items={c.chain} label={c.id === 'vellora' ? 'Stack of my version' : 'Stack, in the order it was wired'} />
          <LinkList links={c.links} />
        </div>
      </div>
    </article>
  );
}

function Fluted({ img }: { img: Img }) {
  return (
    <figure className="fluted" data-fluted="">
      <div className="fluted__glass">
        <Picture img={img} sizes="(min-width: 960px) 55vw, 92vw" className="fluted__img" />
        <canvas className="fluted__gl" aria-hidden="true" />
      </div>
      <figcaption className="fluted__cap">
        <span>The store’s hero, through fluted glass like the tumblers it sold.</span>
        <span className="fluted__hint">Move the pointer across it to look through.</span>
      </figcaption>
    </figure>
  );
}

function Board() {
  const pad = (s: string, n: number) => s.padEnd(n, ' ').slice(0, n);
  return (
    <figure className="board" data-board="">
      <div className="board__panel">
        <div className="board__head" aria-hidden="true">
          <span>Destination</span>
          <span>Region</span>
        </div>
        <ol className="board__rows">
          {velloraDestinations.map((d) => (
            <li
              key={d.place}
              className="board__row"
              aria-label={`${d.place.charAt(0)}${d.place.slice(1).toLowerCase()}, ${d.region === 'INTL' ? 'international' : 'India'}`}
            >
              <span className="board__cells" aria-hidden="true">
                {[...pad(d.place, 9)].map((ch, i) => (
                  <span key={i} className="flap" data-ch={ch}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </span>
              <span className="board__cells board__cells--region" aria-hidden="true">
                {[...pad(d.region, 5)].map((ch, i) => (
                  <span key={i} className="flap" data-ch={ch}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption>
        Where Vellora sends travellers, taken from the destinations on their current site. I made the board for this
        page.
      </figcaption>
    </figure>
  );
}

function DogCover({ c }: { c: CaseStudy }) {
  const first = c.frames[0];
  return (
    <div className="devices">
      {first ? (
        <figure className="browser devices__desk">
          <BrowserBar address={c.address ?? ''} />
          <Picture img={first.img} sizes="(min-width: 960px) 50vw, 92vw" />
          <figcaption className="vh">{first.caption}</figcaption>
        </figure>
      ) : null}
      {c.phone ? (
        <figure className="phone devices__phone">
          <Picture img={c.phone} sizes="180px" />
          <figcaption className="vh">The same store on a phone</figcaption>
        </figure>
      ) : null}
    </div>
  );
}

function BrowserBar({ address }: { address: string }) {
  return (
    <div className="browser__bar" aria-hidden="true">
      <span className="browser__dots">
        <i />
        <i />
        <i />
      </span>
      <span className="browser__url">{address}</span>
    </div>
  );
}

/**
 * The store, screen by screen. On wide screens the reel pins and scrolling
 * slides it sideways; elsewhere it is a swipeable strip.
 */
function Reel({ c }: { c: CaseStudy }) {
  const n = c.frames.length;
  const first = c.frames[0]!.img;
  const ratio = first.w / first.h;
  const isDetail = (img: Img) => Math.abs(img.w / img.h - ratio) / ratio > 0.15;
  return (
    <section
      className="reel"
      data-reel=""
      style={{ ['--count' as string]: n, ['--stage-ar' as string]: `${first.w} / ${first.h}` }}
      aria-label={`${c.name} screens, ${n} frames`}
    >
      <div className="reel__pin">
        <div className="reel__head">
          <p className="label">The store, screen by screen</p>
          <p className="reel__count" aria-hidden="true">
            <span data-reel-current="">01</span>
            <span className="reel__of"> / {String(n).padStart(2, '0')}</span>
          </p>
        </div>
        <ol className="reel__track">
          {c.frames.map((f, i) => (
            <li key={f.img.base} className="reel__frame">
              <figure>
                <div className="reel__screen browser">
                  <BrowserBar address={c.address ?? ''} />
                  <div className={`reel__img${isDetail(f.img) ? ' reel__img--detail' : ''}`}>
                    <Picture img={f.img} sizes="(min-width: 960px) 60vw, 86vw" />
                  </div>
                </div>
                <figcaption>
                  <span className="reel__fi">{String(i + 1).padStart(2, '0')}</span> {f.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
        <div className="reel__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
