/**
 * The hero's palette as a function of the sun's altitude. Sky colours blend
 * smoothly; the ground (where the body text sits) switches between a light and
 * a dark surface at one threshold so text contrast never passes through grey.
 */

type RGB = [number, number, number];

interface Stop {
  alt: number;
  top: string;
  low: string;
  glyph: string;
  glow: number;
  /** Strength of the light rim on the name once the sky is dark. */
  rim: number;
}

const STOPS: Stop[] = [
  { alt: -18, top: '#0B0C11', low: '#17141A', glyph: '#08080A', glow: 0.2, rim: 0.62 },
  { alt: -10, top: '#111219', low: '#3B2528', glyph: '#09090A', glow: 0.5, rim: 0.5 },
  { alt: -4, top: '#272938', low: '#9B4E39', glyph: '#0A0A09', glow: 0.85, rim: 0.18 },
  { alt: 0, top: '#4F5263', low: '#E5784A', glyph: '#0F0F0E', glow: 1, rim: 0 },
  { alt: 4, top: '#9A9BA2', low: '#F1A475', glyph: '#141412', glow: 0.95, rim: 0 },
  { alt: 10, top: '#C5C6C3', low: '#EFC6A2', glyph: '#161614', glow: 0.75, rim: 0 },
  { alt: 22, top: '#D4D5D1', low: '#EBDCCA', glyph: '#161614', glow: 0.55, rim: 0 },
  { alt: 50, top: '#DADBD7', low: '#E8E2D8', glyph: '#161614', glow: 0.45, rim: 0 },
  { alt: 90, top: '#DEDFDB', low: '#E7E4DD', glyph: '#161614', glow: 0.4, rim: 0 },
];

/** Altitude at which the ground and its text flip from night to day. */
export const DAY_THRESHOLD = 5;

const GROUND_DAY = { ground: '#E4E4DF', ink: '#161614', mute: '#66665F', line: 'rgba(22,22,20,.16)' };
const GROUND_NIGHT = { ground: '#121211', ink: '#E7E6E0', mute: '#9C9B93', line: 'rgba(231,230,224,.16)' };

const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const toHex = (c: RGB) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export interface SkyPalette {
  top: string;
  low: string;
  glyph: string;
  glow: number;
  rim: number;
  ground: string;
  ink: string;
  mute: string;
  line: string;
  tone: 'day' | 'night';
}

export function skyFor(altitude: number): SkyPalette {
  const a = Math.max(STOPS[0]!.alt, Math.min(STOPS[STOPS.length - 1]!.alt, altitude));
  let i = 0;
  while (i < STOPS.length - 2 && a > STOPS[i + 1]!.alt) i++;
  const s0 = STOPS[i]!;
  const s1 = STOPS[i + 1]!;
  const t = (a - s0.alt) / (s1.alt - s0.alt || 1);
  const day = altitude >= DAY_THRESHOLD;
  const g = day ? GROUND_DAY : GROUND_NIGHT;
  return {
    top: toHex(mix(hex(s0.top), hex(s1.top), t)),
    low: toHex(mix(hex(s0.low), hex(s1.low), t)),
    glyph: toHex(mix(hex(s0.glyph), hex(s1.glyph), t)),
    glow: s0.glow + (s1.glow - s0.glow) * t,
    rim: s0.rim + (s1.rim - s0.rim) * t,
    ground: g.ground,
    ink: g.ink,
    mute: g.mute,
    line: g.line,
    tone: day ? 'day' : 'night',
  };
}

/** Writes the palette onto an element as CSS custom properties. */
export function applySky(el: HTMLElement, p: SkyPalette): void {
  const s = el.style;
  s.setProperty('--sky-top', p.top);
  s.setProperty('--sky-low', p.low);
  s.setProperty('--glyph', p.glyph);
  s.setProperty('--sun-glow', p.glow.toFixed(3));
  s.setProperty('--rim', p.rim.toFixed(3));
  s.setProperty('--ground', p.ground);
  s.setProperty('--ground-ink', p.ink);
  s.setProperty('--ground-mute', p.mute);
  s.setProperty('--ground-line', p.line);
  el.dataset.sky = p.tone;
}
