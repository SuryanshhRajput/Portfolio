import { liveProjects } from '../content/live.js';
import { Arrow, Ext, Picture } from './ui.js';

/**
 * Every build that is live on the web. On wide screens the row pins and
 * slides past like a reel of posters, each turning toward you as it reaches
 * the centre. On phones it is a swipeable strip.
 */
export function Live() {
  const apps = liveProjects.filter((p) => p.app).length;
  return (
    <section className="live" id="live" data-tone="dark" aria-labelledby="live-title">
      <header className="live__head">
        <p className="label">04 · Open around the clock</p>
        <h2 className="live__title" id="live-title" data-split="">
          Thirteen builds, live on the web right now.
        </h2>
        <p className="live__lede">
          {apps} working apps with real state behind them, and {liveProjects.length - apps} pages built to learn layout
          in HTML and CSS alone. Every one opens in a new tab.
        </p>
      </header>

      <div className="live__pin">
        <ol className="live__track" role="list">
          {liveProjects.map((p, i) => (
            <li key={p.id} id={p.id} className={`lcard${p.img ? '' : ' lcard--type'}${p.app ? ' lcard--app' : ''}`}>
              <article className="lcard__inner" aria-labelledby={`${p.id}-name`}>
                <div className="lcard__media">
                  {p.img ? (
                    <Picture img={p.img} sizes="(min-width: 960px) 34vw, 82vw" />
                  ) : (
                    <p className="lcard__poster" aria-hidden="true">
                      {p.name}
                    </p>
                  )}
                  <span className="lcard__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {p.app ? <span className="lcard__badge">App</span> : null}
                </div>
                <div className="lcard__body">
                  <p className="lcard__what">{p.what}</p>
                  <h3 className="lcard__name" id={`${p.id}-name`}>
                    {p.name}
                  </h3>
                  <p className="lcard__detail">{p.detail}</p>
                  {p.making ? <p className="lcard__making">{p.making}</p> : null}
                  <ul className="lcard__tags" role="list">
                    {p.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <div className="lcard__links">
                    <Ext href={p.href} className="lcard__live">
                      Open live <Arrow />
                    </Ext>
                    {p.code ? (
                      <Ext href={p.code} className="lcard__code">
                        Code <Arrow />
                      </Ext>
                    ) : null}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
        <div className="live__hud" aria-hidden="true">
          <span className="live__bar">
            <span />
          </span>
          <span className="live__hint">Scroll</span>
        </div>
      </div>
    </section>
  );
}
