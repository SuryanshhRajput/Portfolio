/**
 * Inlined into <head> by the build so the hero is painted in the right light on
 * the first frame, before any module loads. Keep this file small: it blocks render.
 */
import { sunPosition } from './sun/solar.js';
import { applySky, skyFor } from './sun/sky.js';

const root = document.documentElement;
root.classList.add('js');
try {
  const { altitude } = sunPosition(new Date(), 28.4744, 77.504);
  applySky(root, skyFor(altitude));
} catch {
  /* The CSS defaults (daylight) stay in place. */
}
