/**
 * Entry point. Every feature checks for its own markup and returns early when
 * it isn't on the page. Pinned scenes are set up first, in page order, so the
 * scroll positions of everything after them are measured correctly.
 */
import { gsap, ScrollSmoother, ScrollTrigger, WIDE } from './anim/gsap.js';
import { runLoader } from './anim/loader.js';
import { initCursor } from './anim/cursor.js';
import { initKineticTitles, initManifesto, initMarquee, initReveals, initSplitHeadings } from './anim/reveals.js';
import { initCaseReels, initLiveReel, initPasses } from './anim/reels.js';
import { initStreet } from './anim/street.js';
import { initTerminal } from './anim/terminal.js';
import { initClock, initCopy, initIndex, initMagnetic, initRail, initTone } from './features/chrome.js';
import { initFluted } from './features/fluted.js';
import { initSplitFlap } from './features/splitflap.js';
import { initStackMap } from './features/stackmap.js';
import { initGlobe } from './features/globe.js';
import { initScrollCue, initShotSwitchers } from './features/motion.js';
import { hasFinePointer, prefersReducedMotion } from './lib/core.js';
import type { ParticleHero } from './three/particles.js';

function safely<T>(name: string, fn: () => T): T | undefined {
  try {
    return fn();
  } catch (err) {
    console.error(`[${name}]`, err);
    return undefined;
  }
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const reduced = prefersReducedMotion();
const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
const lowPower = !!nav.connection?.saveData || (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
const webgl = supportsWebGL() && !lowPower;
document.documentElement.classList.toggle('webgl', webgl);

/* ------------------------------ smooth scroll ---------------------------- */

// `?nosmooth` turns smoothing off, which is handy when measuring the page.
const smoother =
  !reduced && hasFinePointer() && !location.search.includes('nosmooth')
    ? safely('smoother', () =>
        ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.1, effects: true, smoothTouch: false }),
      )
    : undefined;

// In-page links go through the smoother so they glide instead of jumping.
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href')!.slice(1);
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  e.preventDefault();
  if (smoother) smoother.scrollTo(target, true, 'top top');
  else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  history.replaceState(null, '', `#${id}`);
  if (!target.matches('a, button, input, [tabindex]')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});

/* ------------------------------ the frame -------------------------------- */

safely('clock', initClock);
safely('tone', initTone);
safely('rail', initRail);
safely('index', initIndex);
safely('copy', initCopy);
safely('magnetic', initMagnetic);
safely('cursor', initCursor);
safely('shots', initShotSwitchers);
safely('stack', initStackMap);
safely('globe', () => initGlobe(reduced));
safely('board', initSplitFlap);
safely('fluted', initFluted);
safely('cue', initScrollCue);

/* ------------------------------ hero ------------------------------------- */

const heroEl = document.querySelector<HTMLElement>('.hero');
const terminal = safely('terminal', () => initTerminal(reduced)) ?? null;
let particlesReady: Promise<ParticleHero | null> = Promise.resolve(null);

let particles: ParticleHero | null = null;
if (heroEl && webgl) {
  heroEl.classList.add('hero--3d');
  // Created now, in page order, so later pins measure the right positions.
  const pinIt = !reduced && window.matchMedia(WIDE).matches;
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: heroEl,
      start: 'top top',
      end: pinIt ? '+=90%' : 'bottom top',
      pin: pinIt,
      scrub: pinIt ? true : false,
      onUpdate: (self) => particles?.setScroll(self.progress),
      onToggle: (self) => particles?.setVisible(self.isActive || self.progress < 1),
    },
  });
  // The copy steps aside for the first half of the dive.
  if (pinIt) heroTl.to('.hero__bottom, .hero__hud, .hero__cue', { opacity: 0, y: -40, ease: 'none', duration: 0.5 }).to({}, { duration: 0.5 });
  const canvas = heroEl.querySelector<HTMLCanvasElement>('.hero__gl')!;
  particlesReady = import('./three/particles.js')
    .then(({ createParticles }) => createParticles(canvas, { reduced }))
    .then((p) => {
      particles = p;
      heroEl.classList.add('is-ready');
      const count = heroEl.querySelector('[data-particle-count]');
      if (count) count.textContent = `${p.count.toLocaleString('en-IN')} particles`;
      if (!reduced) {
        heroEl.addEventListener('pointermove', (e) =>
          p.setPointer((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2, true),
        );
        heroEl.addEventListener('pointerleave', () => p.setPointer(0, 0, false));
      }
      window.addEventListener('resize', () => p.resize());
      return p;
    })
    .catch((err) => {
      console.warn('[hero] 3D unavailable, using type', err);
      heroEl.classList.remove('hero--3d');
      return null;
    });
}

/* ------------------------------ pinned scenes, in page order ------------- */

safely('street', () => initStreet({ webgl, reduced }));
safely('reels', () => initCaseReels(reduced));
safely('live', () => initLiveReel(reduced));
safely('passes', () => initPasses(reduced));

/* ------------------------------ entrances -------------------------------- */

if (!reduced) {
  safely('split', initSplitHeadings);
  safely('kinetic', initKineticTitles);
  safely('reveals', initReveals);
  safely('manifesto', initManifesto);
  safely('marquee', initMarquee);
}

window.addEventListener('load', () => ScrollTrigger.refresh());
// A handle for inspecting scroll scenes from the console.
(window as Window & { __st?: typeof ScrollTrigger; __smoother?: unknown }).__st = ScrollTrigger;
(window as Window & { __smoother?: unknown }).__smoother = smoother;

/* ------------------------------ opening sequence ------------------------- */

runLoader(reduced).then(async () => {
  if (reduced) return;
  const p = await Promise.race([particlesReady, new Promise<null>((r) => setTimeout(() => r(null), 2000))]);
  if (p) void p.intro();
  gsap.from('.hero__eyebrow, .hero__lede, .hero__ctas, .term', {
    y: 36,
    opacity: 0,
    stagger: 0.09,
    duration: 1.2,
    ease: 'expo.out',
    delay: p ? 1.6 : 0.2,
    onComplete: () => void terminal?.play(),
  });
  if (!p) gsap.from('.hero__title > span', { yPercent: 40, opacity: 0, stagger: 0.12, duration: 1.4, ease: 'expo.out' });
});
