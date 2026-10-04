import { gsap, ScrollTrigger, SplitText } from './gsap.js';

/**
 * Scroll-triggered entrances. Everything is visible in the HTML; these only set
 * a starting state once script runs, so nothing is lost without it.
 */

/** Headings marked `data-split` rise in line by line from behind a mask; `data-split="chars"` flips in letter by letter. */
export function initSplitHeadings(): void {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const chars = el.dataset.split === 'chars';
    SplitText.create(el, {
      type: chars ? 'chars,words' : 'lines',
      mask: chars ? undefined : 'lines',
      autoSplit: !chars,
      linesClass: 'split-line',
      charsClass: 'split-char',
      onSplit(self: SplitText) {
        if (chars) {
          return gsap.from(self.chars, {
            yPercent: 80,
            rotateX: -90,
            opacity: 0,
            transformOrigin: '50% 100% -20px',
            stagger: 0.035,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true, fastScrollEnd: true },
          });
        }
        return gsap.from(self.lines, {
          yPercent: 110,
          stagger: 0.09,
          duration: 1.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true, fastScrollEnd: true },
        });
      },
    });
  });
}

/** Case titles open from condensed to wide as they rise into view, scrubbed to the scroll. */
export function initKineticTitles(): void {
  document.querySelectorAll<HTMLElement>('[data-kinetic]').forEach((el) => {
    gsap.fromTo(
      el,
      { '--open': 0 },
      { '--open': 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 100%', end: 'top 30%', scrub: 0.6 } },
    );
  });
}

export function initReveals(): void {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.dataset.reveal === 'clip') {
      gsap.fromTo(
        el,
        { clipPath: 'inset(18% 8% 18% 8% round 14px)', scale: 0.94 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          scale: 1,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        },
      );
      return;
    }
    gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((list) => {
    gsap.from(list.children, {
      y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: list, start: 'top 85%' },
    });
  });

  // Plain numbers count up from zero the first time they appear.
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const state = { n: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          n: end,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = Math.round(state.n) + suffix),
        }),
    });
  });

  // Section heads, the bench, the rooms and the contact list drift up as they arrive.
  const groups = ['.specimen', '.more__row', '.now__item', '.about', '.contact__profiles li'];
  groups.forEach((sel) =>
    ScrollTrigger.batch(sel, {
      start: 'top 92%',
      once: true,
      onEnter: (els) => gsap.from(els, { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out' }),
    }),
  );

  // Bench screens tilt up out of the page as they arrive.
  gsap.utils.toArray<HTMLElement>('.bench .shots__frame').forEach((f) => {
    gsap.fromTo(
      f,
      { rotateX: 24, rotateY: f.closest('.specimen--flip') ? 10 : -10, scale: 0.9, transformOrigin: '50% 100%' },
      { rotateX: 0, rotateY: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: f, start: 'top 95%', end: 'top 35%', scrub: 0.6 } },
    );
  });

  // Skill decks deal in one after another.
  const decksEl = document.querySelector('.decks');
  if (decksEl) {
    gsap.from(decksEl.children, {
      y: 60,
      rotateX: -25,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'expo.out',
      transformPerspective: 900,
      scrollTrigger: { trigger: decksEl, start: 'top 85%', once: true },
    });
  }

  // Stack dots pop in row by row.
  const map = document.querySelector('.stackmap');
  if (map) {
    gsap.from(map.querySelectorAll('.stackmap__dot'), {
      scale: 0,
      duration: 0.5,
      ease: 'back.out(3)',
      stagger: { each: 0.012, from: 'start' },
      scrollTrigger: { trigger: map, start: 'top 75%' },
    });
  }
}

/** The intro paragraph: every word starts dim and lights up in reading order as you scroll. */
export function initManifesto(): void {
  const el = document.querySelector<HTMLElement>('[data-scrub-words]');
  if (!el) return;
  const split = SplitText.create(el, { type: 'words', wordsClass: 'mword' });
  gsap.fromTo(
    split.words,
    { opacity: 0.14 },
    {
      opacity: 1,
      stagger: 0.12,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true },
    },
  );
}

/** The name band: always running, faster and leaning in the direction you scroll. */
export function initMarquee(): void {
  const track = document.querySelector<HTMLElement>('[data-marquee]');
  if (!track) return;
  const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
  const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
  let dir = 1;
  ScrollTrigger.create({
    trigger: track,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const v = self.getVelocity();
      dir = self.direction;
      gsap.to(loop, { timeScale: dir * (1 + Math.min(6, Math.abs(v) / 300)), duration: 0.3, overwrite: true });
      skew(gsap.utils.clamp(-12, 12, v / -220));
    },
    onLeave: () => skew(0),
  });
  // Ease back to a steady crawl when scrolling stops.
  ScrollTrigger.addEventListener('scrollEnd', () => {
    gsap.to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out' });
    skew(0);
  });
}
