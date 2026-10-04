import { gsap } from './gsap.js';

/**
 * A two-part cursor for mouse users: a dot that follows exactly and a ring that
 * trails. Over links the ring grows; elements with `data-cursor="Label"` show a
 * word inside it. Touch screens and reduced motion keep the system cursor.
 */
export function initCursor(): void {
  const el = document.querySelector<HTMLElement>('.cursor');
  if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) {
    el?.remove();
    return;
  }
  const ring = el.querySelector<HTMLElement>('.cursor__ring')!;
  const dot = el.querySelector<HTMLElement>('.cursor__dot')!;
  const label = el.querySelector<HTMLElement>('.cursor__label')!;
  document.documentElement.classList.add('has-cursor');

  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  const labelX = gsap.quickTo(label, 'x', { duration: 0.45, ease: 'power3' });
  const labelY = gsap.quickTo(label, 'y', { duration: 0.45, ease: 'power3' });
  const dotX = gsap.quickSetter(dot, 'x', 'px');
  const dotY = gsap.quickSetter(dot, 'y', 'px');

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      el.classList.add('is-on');
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      labelX(e.clientX);
      labelY(e.clientY);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => el.classList.remove('is-on'));
  document.addEventListener('pointerdown', () => el.classList.add('is-down'));
  document.addEventListener('pointerup', () => el.classList.remove('is-down'));

  const set = (t: Element | null) => {
    const target = t?.closest<HTMLElement>('[data-cursor], a, button, input, label, summary, [role="button"]');
    const word = target?.getAttribute('data-cursor') ?? '';
    el.classList.toggle('is-link', !!target && !word);
    el.classList.toggle('is-label', !!word);
    label.textContent = word;
  };
  document.addEventListener('pointerover', (e) => set(e.target as Element), { passive: true });
}
