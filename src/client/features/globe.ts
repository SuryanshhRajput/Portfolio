/**
 * The skills globe: chips spread over a sphere, projected in script so it stays
 * cheap. It turns on its own, can be dragged, and lights up one group of skills
 * when you point at its deck. Pauses while off screen.
 */
export function initGlobe(reduced: boolean): void {
  const globe = document.querySelector<HTMLElement>('[data-globe]');
  if (!globe) return;
  const chips = Array.from(globe.querySelectorAll<HTMLElement>('.globe__chip'));
  const n = chips.length;
  // Even spread over the sphere (Fibonacci lattice).
  const pts = chips.map((_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const th = i * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
  });

  let rx = -0.25;
  let ry = 0;
  let vx = 0;
  let vy = reduced ? 0 : 0.0035;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let size = globe.clientWidth;
  let visible = false;
  let raf = 0;

  const draw = () => {
    const R = size * 0.4;
    const cx = Math.cos(rx);
    const sx = Math.sin(rx);
    const cy = Math.cos(ry);
    const sy = Math.sin(ry);
    for (let i = 0; i < n; i++) {
      const p = pts[i]!;
      // Rotate around Y, then X.
      const x1 = p.x * cy + p.z * sy;
      const z1 = -p.x * sy + p.z * cy;
      const y2 = p.y * cx - z1 * sx;
      const z2 = p.y * sx + z1 * cx;
      const depth = (z2 + 1) / 2; // 0 at the back, 1 at the front
      const s = 0.62 + depth * 0.5;
      const el = chips[i]!;
      el.style.transform = `translate(-50%, -50%) translate3d(${(x1 * R).toFixed(1)}px, ${(y2 * R).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      el.style.opacity = (0.22 + depth * 0.78).toFixed(3);
      el.style.zIndex = String(Math.round(depth * 100));
    }
  };

  const tick = () => {
    raf = 0;
    if (!dragging) {
      ry += vy;
      rx += vx;
      vx *= 0.94;
      // Drift back to a steady spin after a fling.
      vy += ((reduced ? 0 : 0.0035) - vy) * 0.02;
      rx += (-0.25 - rx) * 0.01;
    }
    draw();
    if (visible && !reduced) raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting;
    if (visible) start();
  }).observe(globe);
  window.addEventListener('resize', () => {
    size = globe.clientWidth;
    start();
  });

  globe.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    globe.setPointerCapture(e.pointerId);
  });
  globe.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    ry += dx * 0.008;
    rx -= dy * 0.008;
    vy = dx * 0.002;
    vx = -dy * 0.002;
    start();
  });
  const end = () => {
    dragging = false;
    start();
  };
  globe.addEventListener('pointerup', end);
  globe.addEventListener('pointercancel', end);

  // Pointing at (or focusing) a deck lights its skills on the globe.
  document.querySelectorAll<HTMLElement>('[data-deck]').forEach((deck) => {
    const cat = deck.dataset.deck;
    const on = () => {
      globe.classList.add('is-filtering');
      chips.forEach((c) => c.classList.toggle('is-on', c.dataset.cat === cat));
      start();
    };
    const off = () => {
      globe.classList.remove('is-filtering');
      chips.forEach((c) => c.classList.remove('is-on'));
    };
    deck.addEventListener('pointerenter', on);
    deck.addEventListener('pointerleave', off);
    deck.addEventListener('focusin', on);
    deck.addEventListener('focusout', off);
  });

  draw();
}
