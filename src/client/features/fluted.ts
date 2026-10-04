import { $$, clamp, damp, hasFinePointer, prefersReducedMotion, sleep, wake, whenNear } from '../lib/core.js';
import { createShaderCanvas, type ShaderCanvas } from '../gl/gl.js';

/**
 * Glasseria's opener: the store's own hero frame seen through a pane of
 * fluted glass, like the ribbed tumblers it sells. The pointer is a clear lens.
 */
const FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uLens;
uniform float uLensR;
uniform float uLensOn;
uniform float uFlutes;
uniform float uPhase;
varying vec2 vUv;

vec2 cover(vec2 uv) {
  float rc = uRes.x / uRes.y;
  float ri = uImg.x / uImg.y;
  vec2 s = rc > ri ? vec2(1.0, ri / rc) : vec2(rc / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 px = uv * uRes;
  float dist = distance(px, uLens);
  float lens = (1.0 - smoothstep(uLensR * 0.72, uLensR, dist)) * uLensOn;
  float k = 1.0 - lens;

  float f = fract(uv.x * uFlutes + uPhase) - 0.5;
  float bend = sin(f * 3.14159265);
  float shift = bend * 0.6 / uFlutes * k;

  vec3 col;
  col.r = texture2D(uTex, cover(uv + vec2(shift * 1.1, 0.0))).r;
  col.g = texture2D(uTex, cover(uv + vec2(shift, 0.0))).g;
  col.b = texture2D(uTex, cover(uv + vec2(shift * 0.9, 0.0))).b;
  vec3 soft = texture2D(uTex, cover(uv + vec2(shift + 0.005 * k, 0.0))).rgb
            + texture2D(uTex, cover(uv + vec2(shift - 0.005 * k, 0.0))).rgb;
  col = mix(col, soft * 0.5, 0.5 * k);

  float highlight = smoothstep(0.16, 0.3, f) * (1.0 - smoothstep(0.3, 0.44, f));
  float shade = 1.0 - 0.22 * f * f * 4.0;
  col = col * mix(1.0, shade, k) + highlight * 0.11 * k;

  float rim = smoothstep(uLensR * 0.68, uLensR * 0.74, dist) * (1.0 - smoothstep(uLensR * 0.74, uLensR * 0.8, dist));
  col += rim * 0.16 * uLensOn;
  gl_FragColor = vec4(col, 1.0);
}`;

export function initFluted(): void {
  $$('[data-fluted]').forEach((wrap) => {
    whenNear(wrap, () => void setup(wrap), undefined, '50% 0px');
  });
}

const started = new WeakSet<HTMLElement>();

async function setup(wrap: HTMLElement): Promise<void> {
  if (started.has(wrap)) return;
  started.add(wrap);
  const img = wrap.querySelector('img');
  const canvas = wrap.querySelector('canvas');
  if (!img || !canvas) return;
  try {
    await img.decode();
  } catch {
    return;
  }
  const sc: ShaderCanvas | null = createShaderCanvas(canvas, FRAG);
  if (!sc) return;
  const { gl } = sc;

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.uniform1i(sc.uniform('uTex'), 0);
  gl.uniform2f(sc.uniform('uImg'), img.naturalWidth, img.naturalHeight);

  wrap.classList.add('is-gl');
  const fine = hasFinePointer();
  const reduced = prefersReducedMotion();
  const lens = { x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0 };
  let visible = true;
  let dpr = 1;

  const resize = () => {
    sc.resize(1.5);
    dpr = canvas.width / Math.max(1, canvas.clientWidth);
    gl.uniform2f(sc.uniform('uRes'), canvas.width, canvas.height);
    gl.uniform1f(sc.uniform('uFlutes'), Math.max(10, Math.round(canvas.clientWidth / 30)));
  };
  resize();
  window.addEventListener('resize', () => {
    resize();
    wake(tick);
  });

  const tick = (time: number, dt: number): boolean => {
    if (!visible) return false;
    if (!fine && !reduced) {
      // On touch screens the lens drifts on its own so the effect still shows.
      const t = time / 1000;
      lens.tx = canvas.clientWidth * (0.5 + 0.32 * Math.sin(t * 0.45));
      lens.ty = canvas.clientHeight * (0.5 + 0.22 * Math.sin(t * 0.7));
      lens.ton = 1;
    }
    lens.x = damp(lens.x, lens.tx, reduced ? 1 : 0.18, dt);
    lens.y = damp(lens.y, lens.ty, reduced ? 1 : 0.18, dt);
    lens.on = damp(lens.on, lens.ton, reduced ? 1 : 0.12, dt);
    const r = wrap.getBoundingClientRect();
    const phase = clamp(1 - (r.top + r.height) / (window.innerHeight + r.height)) * 1.5;
    gl.uniform2f(sc.uniform('uLens'), lens.x * dpr, lens.y * dpr);
    gl.uniform1f(sc.uniform('uLensR'), Math.min(canvas.clientWidth, canvas.clientHeight) * 0.24 * dpr);
    gl.uniform1f(sc.uniform('uLensOn'), lens.on);
    gl.uniform1f(sc.uniform('uPhase'), reduced ? 0 : phase);
    sc.draw();
    const settling =
      Math.abs(lens.x - lens.tx) > 0.5 || Math.abs(lens.y - lens.ty) > 0.5 || Math.abs(lens.on - lens.ton) > 0.01;
    return settling || (!fine && !reduced);
  };

  if (fine) {
    wrap.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      lens.tx = e.clientX - r.left;
      lens.ty = e.clientY - r.top;
      if (lens.on < 0.01) {
        lens.x = lens.tx;
        lens.y = lens.ty;
      }
      lens.ton = 1;
      wake(tick);
    });
    wrap.addEventListener('pointerleave', () => {
      lens.ton = 0;
      wake(tick);
    });
    window.addEventListener('scroll', () => visible && wake(tick), { passive: true });
  }

  whenNear(
    wrap,
    () => {
      visible = true;
      wake(tick);
    },
    () => {
      visible = false;
      sleep(tick);
    },
    '0px',
  );
  wake(tick);
}
