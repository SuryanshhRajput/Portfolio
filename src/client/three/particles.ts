import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  GridHelper,
  LineBasicMaterial,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';
import { gsap } from '../anim/gsap.js';

/**
 * The opening scene. सूर्यांश means "a part of the sun", so the page opens on a
 * sun made of particles. On load they break away and fly into the name; the
 * pointer pushes them aside; scrolling scatters them into a tunnel the camera
 * dives through, on its way down to the street.
 */
export interface ParticleHero {
  intro(): Promise<void>;
  setScroll(p: number): void;
  setPointer(x: number, y: number, active: boolean): void;
  resize(): void;
  setVisible(v: boolean): void;
  count: number;
}

const VERT = /* glsl */ `
  attribute vec3 aSun;
  attribute vec3 aName;
  attribute vec3 aWarp;
  attribute vec4 aRand;
  uniform float uTime;
  uniform float uIntro;
  uniform float uWarp;
  uniform vec3 uMouse;
  uniform float uMouseStr;
  uniform float uSize;
  uniform float uPixel;
  uniform vec3 uSunCol;
  uniform vec3 uHotCol;
  uniform vec3 uNameCol;
  varying vec3 vColor;
  varying float vAlpha;

  mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  void main() {
    // The sun turns slowly while it waits.
    vec3 sun = aSun;
    sun.xz = rot(uTime * 0.18) * sun.xz;
    sun.y += 0.6;

    // Each particle leaves the sun at its own moment, arcing outward on the way.
    float t = clamp(uIntro * 1.7 - aRand.x * 0.7, 0.0, 1.0);
    float e = t * t * (3.0 - 2.0 * t);
    vec3 pos = mix(sun, aName, e);
    vec3 fling = normalize(aSun + vec3(0.001)) * (1.2 + aRand.y * 2.4);
    pos += fling * sin(e * 3.14159) ;

    // Breathing: a little drift, larger while still part of the sun.
    float drift = 0.025 + (1.0 - e) * 0.05;
    pos += drift * vec3(
      sin(uTime * 1.3 + aRand.y * 6.283),
      cos(uTime * 1.1 + aRand.z * 6.283),
      sin(uTime * 0.9 + aRand.w * 6.283)
    );

    // The pointer pushes particles away and toward the viewer.
    vec2 d = pos.xy - uMouse.xy;
    float dist = length(d);
    float f = smoothstep(1.5, 0.0, dist) * uMouseStr;
    pos.xy += (dist > 0.0001 ? d / dist : vec2(0.0)) * f * 0.9;
    pos.z += f * 1.4;

    // Scroll: scatter into the tunnel.
    float w = clamp(uWarp * 1.5 - aRand.x * 0.5, 0.0, 1.0);
    w = w * w * (3.0 - 2.0 * w);
    pos = mix(pos, aWarp, w);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = uSize * (0.55 + aRand.y * 0.9) * (0.8 + (1.0 - e) * 0.8 + f * 1.5);
    gl_PointSize = min(size * uPixel / -mv.z, 34.0);

    vec3 sunCol = mix(uSunCol, uHotCol, aRand.z * 0.7);
    vec3 nameCol = aRand.w > 0.86 ? uSunCol : mix(uNameCol, uHotCol, aRand.z * 0.35);
    vColor = mix(sunCol, nameCol, e);
    vColor = mix(vColor, uHotCol, f * 0.6);
    vAlpha = mix(0.9, 0.5, e) * (1.0 - w * 0.4);
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, r);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

/** Pixels of the name drawn on a 2D canvas, as points in a unit box. */
async function sampleText(lines: string[]): Promise<{ pts: Float32Array; aspect: number }> {
  const fam = 'Archivo';
  try {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.load(`800 200px "${fam}"`);
  } catch {
    /* The fallback face is fine. */
  }
  const size = 200;
  const lh = size * 0.92;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.font = `800 ${size}px "${fam}", "Arial Black", sans-serif`;
  const widths = lines.map((l) => ctx.measureText(l).width);
  const W = Math.ceil(Math.max(...widths) + 20);
  const H = Math.ceil(lh * lines.length + 20);
  c.width = W;
  c.height = H;
  ctx.font = `800 ${size}px "${fam}", "Arial Black", sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 10 + size * 0.78 + i * lh));
  const data = ctx.getImageData(0, 0, W, H).data;
  const step = 2;
  const out: number[] = [];
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3]! > 128) out.push(x / W - 0.5, 0.5 - y / H);
    }
  }
  return { pts: new Float32Array(out), aspect: W / H };
}

export async function createParticles(canvas: HTMLCanvasElement, opts: { reduced: boolean }): Promise<ParticleHero> {
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const N = small ? 7000 : 15000;

  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.6 : 1.75));
  renderer.setClearColor('#06070b', 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 200);
  const CAM_Z = 12;
  camera.position.set(0, 0, CAM_Z);

  /* A faint floor grid: the "instrument" the name stands over. */
  const grid = new GridHelper(80, 64, new Color('#3a2014'), new Color('#16181f'));
  (grid.material as LineBasicMaterial).transparent = true;
  (grid.material as LineBasicMaterial).opacity = 0.55;
  grid.position.y = -3.2;
  scene.add(grid);

  /* Shapes */
  const aSun = new Float32Array(N * 3);
  const aName = new Float32Array(N * 3);
  const aWarp = new Float32Array(N * 3);
  const aRand = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    // The sun: mostly a shell with a little depth, the rest a loose corona.
    const u = Math.random();
    const v = Math.random();
    const th = 2 * Math.PI * u;
    const ph = Math.acos(2 * v - 1);
    const corona = Math.random() < 0.22;
    const r = corona ? 1.75 + Math.pow(Math.random(), 2.2) * 2.4 : 1.6 + (Math.random() - 0.5) * 0.12;
    aSun[i * 3] = r * Math.sin(ph) * Math.cos(th);
    aSun[i * 3 + 1] = r * Math.cos(ph);
    aSun[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    // The tunnel the camera dives through.
    const a = Math.random() * Math.PI * 2;
    const rr = 2.2 + Math.random() * 7;
    aWarp[i * 3] = Math.cos(a) * rr;
    aWarp[i * 3 + 1] = Math.sin(a) * rr * 0.75;
    aWarp[i * 3 + 2] = 6 - Math.random() * 60;
    aRand[i * 4] = Math.random();
    aRand[i * 4 + 1] = Math.random();
    aRand[i * 4 + 2] = Math.random();
    aRand[i * 4 + 3] = Math.random();
  }

  const one = await sampleText(['SURYANSH SINGH']);
  const two = await sampleText(['SURYANSH', 'SINGH']);

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute('aSun', new BufferAttribute(aSun, 3));
  geo.setAttribute('aName', new BufferAttribute(aName, 3));
  geo.setAttribute('aWarp', new BufferAttribute(aWarp, 3));
  geo.setAttribute('aRand', new BufferAttribute(aRand, 4));

  const uniforms = {
    uTime: { value: 0 },
    uIntro: { value: opts.reduced ? 1 : 0 },
    uWarp: { value: 0 },
    uMouse: { value: new Vector3(99, 99, 0) },
    uMouseStr: { value: 0 },
    uSize: { value: small ? 0.075 : 0.06 },
    uPixel: { value: 1 },
    uSunCol: { value: new Color('#ff5a1f') },
    uHotCol: { value: new Color('#ffc58f') },
    uNameCol: { value: new Color('#f1ece2') },
  };
  const mat = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  let visW = 1;
  let visH = 1;
  let nameY = 0;
  const layoutName = () => {
    const aspect = camera.aspect;
    const two_ = aspect < 0.95;
    const src = two_ ? two : one;
    visH = 2 * CAM_Z * Math.tan((camera.fov * Math.PI) / 360);
    visW = visH * aspect;
    const w = Math.min(visW * (two_ ? 0.86 : 0.8), visH * src.aspect * (two_ ? 0.5 : 0.62));
    const h = w / src.aspect;
    // Upper half on wide screens, upper third on phones, leaving room for the copy.
    nameY = two_ ? visH * 0.2 : visH * 0.135;
    const n = src.pts.length / 2;
    for (let i = 0; i < N; i++) {
      const k = Math.floor(Math.random() * n);
      aName[i * 3] = src.pts[k * 2]! * w + (Math.random() - 0.5) * 0.02;
      aName[i * 3 + 1] = src.pts[k * 2 + 1]! * h + nameY;
      aName[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    (geo.getAttribute('aName') as BufferAttribute).needsUpdate = true;
  };

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uPixel.value = h * renderer.getPixelRatio() * 0.5 / Math.tan((camera.fov * Math.PI) / 360) / 1;
    layoutName();
    if (opts.reduced) renderer.render(scene, camera);
  };
  resize();

  /* Pointer, eased */
  const pointer = { x: 0, y: 0, str: 0 };
  const target = { x: 0, y: 0, str: 0 };
  const setPointer = (x: number, y: number, active: boolean) => {
    target.x = x * visW * 0.5;
    target.y = -y * visH * 0.5;
    target.str = active ? 1 : 0;
  };

  let scroll = 0;
  let visible = true;
  let raf = 0;
  const t0 = performance.now();
  const frame = () => {
    raf = 0;
    if (!visible) return;
    const t = (performance.now() - t0) / 1000;
    uniforms.uTime.value = opts.reduced ? 0 : t;
    pointer.x += (target.x - pointer.x) * 0.12;
    pointer.y += (target.y - pointer.y) * 0.12;
    pointer.str += (target.str - pointer.str) * 0.08;
    uniforms.uMouse.value.set(pointer.x, pointer.y, 0);
    uniforms.uMouseStr.value = pointer.str * (1 - scroll);
    // Camera: a gentle sway with the pointer, then a dive forward on scroll.
    const sway = opts.reduced ? 0 : 1;
    camera.position.x += ((pointer.str ? pointer.x * 0.05 : 0) * sway - camera.position.x) * 0.05;
    camera.position.y += ((pointer.str ? pointer.y * 0.03 : 0) * sway + scroll * -0.6 - camera.position.y) * 0.08;
    camera.position.z = CAM_Z - scroll * 22;
    // The whole cloud turns a little toward the pointer, so the name reads as an object in space.
    const ty = ((pointer.x / visW) * 0.5 * pointer.str + Math.sin(t * 0.25) * 0.06 * (1 - pointer.str)) * sway;
    const tx = (-pointer.y / visH) * 0.3 * pointer.str * sway;
    points.rotation.y += (ty - points.rotation.y) * 0.05;
    points.rotation.x += (tx - points.rotation.x) * 0.05;
    camera.lookAt(0, nameY * 0.35 * (1 - scroll), camera.position.z - CAM_Z);
    grid.position.z = (t * 0.6) % (80 / 64); // a slow conveyor
    (grid.material as LineBasicMaterial).opacity = 0.55 * (1 - scroll);
    renderer.render(scene, camera);
    if (!opts.reduced) raf = requestAnimationFrame(frame);
  };
  frame();

  return {
    count: N,
    intro() {
      if (opts.reduced) return Promise.resolve();
      return new Promise((resolve) => {
        gsap.to(uniforms.uIntro, { value: 1, duration: 2.8, delay: 0.5, ease: 'power2.inOut', onComplete: () => resolve() });
      });
    },
    setScroll(p: number) {
      scroll = p;
      uniforms.uWarp.value = p;
      if (opts.reduced) frame();
    },
    setPointer,
    resize,
    setVisible(v: boolean) {
      if (v === visible) return;
      visible = v;
      if (v && !raf) raf = requestAnimationFrame(frame);
    },
  };
}
