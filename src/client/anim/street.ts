import { gsap, ScrollTrigger } from './gsap.js';

export interface ShopData {
  id: string;
  name: string;
  bg: string;
  ink: string;
  accent: string;
  image: string | null;
  vacant: boolean;
}

export interface StreetScene {
  /** 0 at the top of the street, 1 at the far end. */
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  resize(): void;
}

/** Where along the street (0..1) the camera stands in front of each shop. */
export const SHOP_STOPS = [0.13, 0.4, 0.66, 0.93];

/**
 * Freelance Street. With WebGL the section pins and scrolling walks a camera
 * past the shops, rolling each shutter up as you reach it. Without WebGL (or
 * with reduced motion) the CSS shopfronts stand in a row and their shutters
 * lift as they scroll into view.
 */
export function initStreet(opts: { webgl: boolean; reduced: boolean }): void {
  const section = document.querySelector<HTMLElement>('.street');
  if (!section) return;
  const shops = Array.from(section.querySelectorAll<HTMLElement>('.shop'));
  const canvas = section.querySelector<HTMLCanvasElement>('.street__gl')!;
  const current = section.querySelector('[data-street-current]');
  const head = section.querySelector<HTMLElement>('.street__head');
  const bar = section.querySelector<HTMLElement>('.street__bar span');

  if (!opts.webgl || opts.reduced) {
    section.classList.add('street--flat');
    shops.forEach((shop) => {
      const shutter = shop.querySelector('.shop__shutter');
      if (!shutter || shop.classList.contains('shop--vacant')) return;
      if (opts.reduced) gsap.set(shutter, { yPercent: -100 });
      else
        gsap.to(shutter, {
          yPercent: -100,
          duration: 1.4,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: shop, start: 'top 70%' },
        });
    });
    return;
  }

  section.classList.add('street--3d');
  const data: ShopData[] = shops.map((li) => {
    const cs = getComputedStyle(li);
    return {
      id: li.className.match(/shop--(\w+)/)?.[1] ?? 'shop',
      name: li.querySelector('.shop__name')?.textContent ?? '',
      bg: cs.getPropertyValue('--shop-bg').trim() || '#222',
      ink: cs.getPropertyValue('--shop-ink').trim() || '#eee',
      accent: cs.getPropertyValue('--shop-accent').trim() || '#ff5a1f',
      image: li.querySelector<HTMLImageElement>('.shop__window img')?.getAttribute('src') ?? null,
      vacant: li.classList.contains('shop--vacant'),
    };
  });

  let scene: StreetScene | null = null;
  let progress = 0;
  let active = -1;

  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    shops.forEach((s, k) => s.classList.toggle('is-active', k === i));
    if (current) current.textContent = String(i + 1).padStart(2, '0');
    const info = shops[i]?.querySelector('.shop__info');
    if (info) gsap.fromTo(info.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: 'expo.out', overwrite: true });
  };

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => '+=' + window.innerHeight * 4.2,
    pin: section.querySelector<HTMLElement>('.street__pin'),
    anticipatePin: 1,
    onUpdate: (self) => {
      progress = self.progress;
      scene?.setProgress(progress);
      if (bar) bar.style.transform = `scaleX(${progress})`;
      // The street's title says hello at the entrance, then gets out of the way of the shops.
      if (head) head.style.opacity = String(1 - Math.min(1, Math.max(0, (progress - 0.02) / 0.06)));
      let best = 0;
      SHOP_STOPS.forEach((s, i) => {
        if (Math.abs(progress - s) < Math.abs(progress - SHOP_STOPS[best]!)) best = i;
      });
      setActive(best);
    },
  });
  setActive(0);

  section.addEventListener(
    'pointermove',
    (e) => scene?.setPointer((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2),
    { passive: true },
  );
  window.addEventListener('resize', () => scene?.resize());

  // Build the 3D street early (once the page has settled) so it is already lit by
  // the time anyone scrolls to it, instead of showing an empty dark stage.
  let started = false;
  const build = () => {
    if (started) return;
    started = true;
    import('../three/street3d.js')
      .then(({ createStreet }) => createStreet(canvas, data))
      .then((s) => {
        scene = s;
        scene.setProgress(progress);
        section.classList.add('is-ready');
      })
      .catch((err) => {
        console.warn('[street] 3D unavailable', err);
        section.classList.add('is-failed');
      });
  };
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
  const soon = () => (idle ? idle(build, { timeout: 2500 }) : setTimeout(build, 1200));
  if (document.readyState === 'complete') setTimeout(soon, 2500);
  else window.addEventListener('load', () => setTimeout(soon, 2500), { once: true });
  // And in any case as soon as it is within a few screens.
  ScrollTrigger.create({ trigger: section, start: 'top 400%', once: true, onEnter: build });
}
