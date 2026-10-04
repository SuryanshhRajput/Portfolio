import { gsap, ScrollTrigger, WIDE } from './gsap.js';

/**
 * Horizontal reels. On wide screens with motion allowed, the section pins and
 * vertical scrolling slides the row sideways. Phones keep a native swipe strip.
 */
function pinnedRow(
  section: HTMLElement,
  track: HTMLElement,
  onProgress: (p: number, x: number) => void,
): gsap.core.Tween {
  // How far the row has to travel: from its start until the last item's right edge meets the viewport's.
  const distance = () => {
    const last = track.lastElementChild as HTMLElement | null;
    if (!last) return 0;
    const pad = parseFloat(getComputedStyle(track).paddingRight) || 0;
    return Math.max(0, last.offsetLeft + last.offsetWidth + pad - track.clientWidth);
  };
  // Images further along the row sit off to the side, so lazy loading would only fetch
  // them as they slide in. Ask for all of them once the section is close.
  ScrollTrigger.create({
    trigger: section,
    start: 'top 250%',
    once: true,
    onEnter: () => track.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = 'eager')),
  });
  return gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + Math.max(window.innerHeight * 0.6, distance() * 0.8),
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => onProgress(self.progress, -distance() * self.progress),
    },
  });
}

/** Case-study screens: a pinned reel with a counter, each frame leaning in as it nears the centre. */
export function initCaseReels(reduced: boolean): void {
  const mm = gsap.matchMedia();
  mm.add(WIDE, () => {
    if (reduced) return;
    document.querySelectorAll<HTMLElement>('[data-reel]').forEach((section) => {
      const track = section.querySelector<HTMLElement>('.reel__track')!;
      const frames = Array.from(section.querySelectorAll<HTMLElement>('.reel__frame'));
      const imgs = frames.map((f) => f.querySelector<HTMLElement>('.reel__img img'));
      const current = section.querySelector('[data-reel-current]');
      const bar = section.querySelector<HTMLElement>('.reel__bar span');
      section.classList.add('is-pinned');
      const centre = () => window.innerWidth / 2;
      let last = -1;
      const tilt = () => {
        const c = centre();
        let best = 0;
        let bestD = Infinity;
        frames.forEach((f, i) => {
          const r = f.getBoundingClientRect();
          const d = (r.left + r.width / 2 - c) / window.innerWidth;
          if (Math.abs(d) < bestD) {
            bestD = Math.abs(d);
            best = i;
          }
          gsap.set(f, { rotateY: gsap.utils.clamp(-28, 28, d * -38), z: -Math.min(1, Math.abs(d)) * 160, opacity: 1 - Math.min(0.55, Math.abs(d) * 0.5) });
          const img = imgs[i];
          if (img) gsap.set(img, { xPercent: gsap.utils.clamp(-8, 8, d * -10) });
        });
        if (best !== last && current) {
          last = best;
          current.textContent = String(best + 1).padStart(2, '0');
          frames.forEach((f, i) => f.classList.toggle('is-active', i === best));
        }
      };
      pinnedRow(section, track, (p) => {
        if (bar) bar.style.transform = `scaleX(${p})`;
        tilt();
      });
      requestAnimationFrame(tilt);
      return () => section.classList.remove('is-pinned');
    });
  });
}

/** Live builds: a pinned coverflow. Cards turn toward the viewer as they pass the centre. */
export function initLiveReel(reduced: boolean): void {
  const section = document.querySelector<HTMLElement>('.live');
  if (!section) return;
  const pin = section.querySelector<HTMLElement>('.live__pin')!;
  const track = section.querySelector<HTMLElement>('.live__track')!;
  const cards = Array.from(track.querySelectorAll<HTMLElement>('.lcard'));
  const bar = section.querySelector<HTMLElement>('.live__bar span');

  const mm = gsap.matchMedia();
  mm.add(WIDE, () => {
    if (reduced) return;
    section.classList.add('is-pinned');
    const flow = () => {
      const c = window.innerWidth / 2;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const d = (r.left + r.width / 2 - c) / (window.innerWidth * 0.5);
        const a = Math.min(1.4, Math.abs(d));
        gsap.set(card, {
          rotateY: gsap.utils.clamp(-40, 40, d * -32),
          z: -a * 220,
          scale: 1 - a * 0.06,
          opacity: 1 - Math.max(0, a - 0.9) * 0.9,
        });
        card.classList.toggle('is-centre', Math.abs(d) < 0.32);
      });
    };
    pinnedRow(pin, track, (p) => {
      if (bar) bar.style.transform = `scaleX(${p})`;
      flow();
    });
    requestAnimationFrame(flow);
    return () => section.classList.remove('is-pinned');
  });

  // Mouse tilt on each card, for anyone with a pointer.
  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cards.forEach((card) => {
      const inner = card.querySelector<HTMLElement>('.lcard__inner')!;
      const rx = gsap.quickTo(inner, 'rotateX', { duration: 0.5, ease: 'power3' });
      const ry = gsap.quickTo(inner, 'rotateY', { duration: 0.5, ease: 'power3' });
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        rx(((e.clientY - r.top) / r.height - 0.5) * -8);
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
      });
      card.addEventListener('pointerleave', () => {
        rx(0);
        ry(0);
      });
    });
  }
  ScrollTrigger.refresh();
}

/**
 * Event passes hanging from a rail. On wide screens the rail pins and scrolling
 * slides it sideways; the passes swing on their straps with the speed of the scroll.
 * Phones swipe the row natively and the passes swing with the swipe.
 */
export function initPasses(reduced: boolean): void {
  const section = document.querySelector<HTMLElement>('[data-passes]');
  if (!section || reduced) return;
  const pin = section.querySelector<HTMLElement>('.passes__pin')!;
  const track = section.querySelector<HTMLElement>('.passes__track')!;
  const cards = Array.from(track.querySelectorAll<HTMLElement>('.pass'));
  const bar = section.querySelector<HTMLElement>('.passes__bar span');
  const swings = cards.map((c) => gsap.quickTo(c, 'rotation', { duration: 0.9, ease: 'elastic.out(1, 0.35)' }));
  const swing = (v: number) => {
    const a = gsap.utils.clamp(-14, 14, v);
    swings.forEach((s, i) => s(a * (0.75 + (i % 3) * 0.15)));
  };
  let settle: ReturnType<typeof setTimeout> | undefined;
  const kick = (v: number) => {
    swing(v);
    clearTimeout(settle);
    settle = setTimeout(() => swing(0), 120);
  };

  const mm = gsap.matchMedia();
  mm.add(WIDE, () => {
    section.classList.add('is-pinned');
    const tween = pinnedRow(pin, track, (p) => {
      if (bar) bar.style.transform = `scaleX(${p})`;
    });
    const st = tween.scrollTrigger!;
    const onScroll = () => kick(st.getVelocity() / -160);
    ScrollTrigger.addEventListener('scrollEnd', () => swing(0));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      section.classList.remove('is-pinned');
      window.removeEventListener('scroll', onScroll);
    };
  });

  // Native swipe on small screens.
  let lastX = track.scrollLeft;
  let lastT = performance.now();
  track.addEventListener(
    'scroll',
    () => {
      const now = performance.now();
      const v = ((track.scrollLeft - lastX) / Math.max(1, now - lastT)) * 1000;
      lastX = track.scrollLeft;
      lastT = now;
      kick(v / -120);
      if (bar) bar.style.transform = `scaleX(${track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)})`;
    },
    { passive: true },
  );

  // Hover nudges a pass on its strap.
  cards.forEach((c, i) =>
    c.addEventListener('pointerenter', (e) => {
      const r = c.getBoundingClientRect();
      const dir = e.clientX < r.left + r.width / 2 ? 1 : -1;
      swings[i]!(dir * 4);
      setTimeout(() => swings[i]!(0), 160);
    }),
  );
}
