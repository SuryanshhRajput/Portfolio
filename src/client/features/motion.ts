import { $, $$, rafThrottle } from '../lib/core.js';

/** Screenshot switchers on the bench: tab-like buttons swap the visible shot. */
export function initShotSwitchers(): void {
  $$('[data-shots]').forEach((wrap) => {
    const buttons = $$<HTMLButtonElement>('[data-shot]', wrap);
    const shots = $$<HTMLElement>('.shots__img', wrap);
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.shot);
        buttons.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
        shots.forEach((s, k) => (s.hidden = k !== i));
      });
    });
  });
}

/** The hero's scroll cue fades once the visitor has started scrolling. */
export function initScrollCue(): void {
  const cue = $('.hero__cue');
  if (!cue) return;
  const onScroll = rafThrottle(() => cue.classList.toggle('is-gone', window.scrollY > 40));
  window.addEventListener('scroll', onScroll, { passive: true });
}
