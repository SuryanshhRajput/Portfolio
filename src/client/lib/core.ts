/** Small shared helpers: math, DOM queries, media preferences and one rAF loop. */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invLerp = (a: number, b: number, v: number) => clamp((v - a) / (b - a));
/** Frame-rate independent smoothing toward a target. `rate` is roughly "fraction per 16ms". */
export const damp = (current: number, target: number, rate: number, dt: number) =>
  lerp(current, target, 1 - Math.pow(1 - rate, dt / 16.67));
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

export const prefersReducedMotion = () => reducedQuery.matches;
export const hasFinePointer = () => finePointerQuery.matches;
export const onReducedMotionChange = (fn: () => void) => reducedQuery.addEventListener('change', fn);

/* ------------------------------------------------------------------ */
/* One requestAnimationFrame loop for the whole page.                   */
/* Subscribers return `true` while they still need frames; the loop    */
/* stops itself when nobody does, so an idle page costs nothing.        */
/* ------------------------------------------------------------------ */

type Tick = (time: number, dt: number) => boolean | void;
const ticks = new Set<Tick>();
let rafId = 0;
let last = 0;

function frame(time: number) {
  const dt = Math.min(64, last ? time - last : 16.67);
  last = time;
  let keep = false;
  for (const t of ticks) {
    if (t(time, dt) === true) keep = true;
  }
  if (keep && !document.hidden) {
    rafId = requestAnimationFrame(frame);
  } else {
    rafId = 0;
    last = 0;
  }
}

/** Ask for frames. The callback keeps receiving frames while it returns true. */
export function wake(fn: Tick): void {
  ticks.add(fn);
  if (!rafId && !document.hidden) rafId = requestAnimationFrame(frame);
}

export function sleep(fn: Tick): void {
  ticks.delete(fn);
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && ticks.size && !rafId) rafId = requestAnimationFrame(frame);
});

/** Runs `fn` once per frame at most, for scroll and resize handlers. */
export function rafThrottle(fn: () => void): () => void {
  let queued = false;
  return () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn();
    });
  };
}

/** Calls `onEnter`/`onLeave` as an element comes within `margin` of the viewport. */
export function whenNear(
  el: Element,
  onEnter: () => void,
  onLeave?: () => void,
  margin = '25% 0px',
): IntersectionObserver {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onEnter();
        else onLeave?.();
      }
    },
    { rootMargin: margin },
  );
  io.observe(el);
  return io;
}

/** Progress of an element through the viewport: 0 when its top meets the viewport top, 1 when its bottom meets the viewport bottom. */
export function scrollProgress(el: Element): number {
  const r = el.getBoundingClientRect();
  const range = r.height - window.innerHeight;
  if (range <= 0) return r.top <= 0 ? 1 : 0;
  return clamp(-r.top / range);
}
