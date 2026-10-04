import { caseStudies } from '../content/projects.js';
import { Arrow } from './ui.js';

/** How each shop looks on the street: brand colours and what shows in the window. */
export const SHOPFRONTS: Record<string, { meta: string; bg: string; ink: string; accent: string; window?: string }> = {
  glasseria: {
    meta: 'Freelance · 2026',
    bg: '#F2EEE8',
    ink: '#1C1915',
    accent: '#E8412E',
    window: 'img/glasseria/f006-1152.webp',
  },
  vellora: { meta: 'Freelance · first version', bg: '#0C1626', ink: '#EDE6D6', accent: '#D2B06A', window: 'img/vellora/board-card.webp' },
  dogindeed: {
    meta: 'Paid internship · 2025–26',
    bg: '#F4E5D1',
    ink: '#1D1A13',
    accent: '#3F9A23',
    window: 'img/dogindeed/01-hero-1440.webp',
  },
};

/**
 * Freelance Street: each client store is a shop with a rolling shutter. With
 * WebGL the street is a 3D scene the camera walks along as you scroll, and each
 * shutter rolls up as you reach it. Without it, the same shops are drawn in CSS.
 * The text for each shop is always in the HTML.
 */
export function Street() {
  return (
    <section className="street" id="street" data-tone="dark" aria-labelledby="street-title">
      <div className="street__pin">
        <canvas className="street__gl" aria-hidden="true" />
        <header className="street__head">
          <p className="label">Freelance street</p>
          <h2 className="street__title" id="street-title">
            Three shops on one street. <em>I built every one of them.</em>
          </h2>
        </header>

        <ol className="street__shops">
          {caseStudies.map((c, i) => {
            const s = SHOPFRONTS[c.id]!;
            return (
              <li
                key={c.id}
                className={`shop shop--${c.id}`}
                data-shop={i}
                style={{ ['--shop-bg' as string]: s.bg, ['--shop-ink' as string]: s.ink, ['--shop-accent' as string]: s.accent }}
              >
                <div className="shop__front" aria-hidden="true">
                  <p className="shop__sign">{c.name}</p>
                  <div className="shop__window">
                    {s.window ? <img src={s.window} alt="" loading="lazy" decoding="async" /> : null}
                    <span className="shop__shutter" />
                  </div>
                </div>
                <div className="shop__info">
                  <p className="shop__n">
                    Shop {String(i + 1).padStart(2, '0')} · {c.kind}
                  </p>
                  <h3 className="shop__name">{c.name}</h3>
                  <p className="shop__pitch">{c.pitch}</p>
                  <p className="shop__meta">{s.meta}</p>
                  <a className="shop__enter" href={`#${c.id}`} data-cursor="Enter">
                    Enter the store <Arrow dir="right" />
                  </a>
                </div>
              </li>
            );
          })}
          <li className="shop shop--vacant" data-shop={caseStudies.length}>
            <div className="shop__front" aria-hidden="true">
              <p className="shop__sign">To let</p>
              <div className="shop__window">
                <span className="shop__shutter" />
              </div>
            </div>
            <div className="shop__info">
              <p className="shop__n">Shop {String(caseStudies.length + 1).padStart(2, '0')} · Vacant</p>
              <h3 className="shop__name">Your store?</h3>
              <p className="shop__pitch">This shutter is still down. If you need a storefront built, it could be yours.</p>
              <a className="shop__enter" href="#contact" data-cursor="Write">
                Write to me <Arrow dir="right" />
              </a>
            </div>
          </li>
        </ol>

        <div className="street__hud" aria-hidden="true">
          <span className="street__count">
            <span data-street-current="">01</span> / 0{caseStudies.length + 1}
          </span>
          <span className="street__bar">
            <span />
          </span>
          <span className="street__hint">Scroll to walk</span>
        </div>
      </div>
    </section>
  );
}
