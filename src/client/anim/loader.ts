import { gsap } from './gsap.js';

/**
 * The preloader: a counter runs to 100 while the sun rises behind the name in
 * Devanagari, then the curtain lifts. It waits for fonts (and at most ~2.2s),
 * so it never holds the page hostage. Resolves when the page is uncovered.
 */
export function runLoader(reduced: boolean, heroReady: Promise<unknown> = Promise.resolve()): Promise<void> {
  const el = document.querySelector<HTMLElement>('.loader');
  if (!el) return Promise.resolve();
  const count = el.querySelector<HTMLElement>('[data-loader-count]');
  const done = () => {
    el.remove();
    document.documentElement.classList.add('is-loaded');
  };
  if (reduced) {
    done();
    return Promise.resolve();
  }

  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve();
  // Hold the curtain until the fonts and the hero scene are ready, so the page never
  // shows an empty black hero between the loader and the sun.
  const ready = Promise.race([Promise.all([fonts, heroReady]), new Promise((r) => setTimeout(r, 3200))]);

  return new Promise((resolve) => {
    const state = { n: 0 };
    const tl = gsap.timeline();
    tl.to(state, {
      n: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (count) count.textContent = String(Math.round(state.n)).padStart(3, '0');
      },
    })
      .fromTo('.loader__sun', { yPercent: 160, scale: 0.5 }, { yPercent: 0, scale: 1, duration: 1.6, ease: 'power2.out' }, 0)
      .fromTo('.loader__word', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1 }, 0.15)
      .fromTo('.loader__meaning', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.6);

    ready.then(() => {
      tl.then(() => {
        // The loader's sun sits where the particle sun is, so the curtain simply
        // dissolves into it: one continuous shot rather than two screens.
        gsap
          .timeline({ onComplete: done })
          .to('.loader__word, .loader__meaning, .loader__count', { opacity: 0, y: -24, duration: 0.45, stagger: 0.04, ease: 'power2.in' })
          .to('.loader__sun', { scale: 1.35, opacity: 0, duration: 1.1, ease: 'power2.inOut' }, 0.15)
          .to(el, { opacity: 0, duration: 0.9, ease: 'power1.inOut' }, 0.3)
          .call(() => resolve(), [], 0.45);
      });
    });
  });
}
