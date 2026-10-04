import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Fog,
  Group,
  HemisphereLight,
  LatheGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  RepeatWrapping,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { ShopData, StreetScene } from '../anim/street.js';
import { SHOP_STOPS } from '../anim/street.js';

/**
 * Freelance Street, after dark. One shop per client store, each with its own
 * signboard, awning and a corrugated shutter. The camera walks the pavement as
 * you scroll; as it reaches a shop the shutter rolls up, the lights come on and
 * the store's real home page lights up on the back wall.
 */

const W = 9; // shop width
const H = 7.2; // shopfront height
const OW = 6.4; // opening width
const OH = 4.4; // opening height
const GAP = 3.4;
const STEP = W + GAP;

const smooth = (a: number, b: number, x: number) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function tex(c: HTMLCanvasElement, srgb = true): CanvasTexture {
  const t = new CanvasTexture(c);
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** The signboard: each brand lettered in its own manner. */
function signTexture(s: ShopData): CanvasTexture {
  const [c, g] = canvas(1024, 192);
  g.fillStyle = s.vacant ? '#2a2a2c' : s.bg;
  g.fillRect(0, 0, 1024, 192);
  g.strokeStyle = s.vacant ? '#555' : s.accent;
  g.lineWidth = 6;
  g.strokeRect(14, 14, 996, 164);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  if (s.id === 'glasseria') {
    g.fillStyle = s.accent;
    g.font = '400 112px "Instrument Serif", Georgia, serif';
    g.letterSpacing = '18px';
    g.fillText('GLASSERIA', 520, 102);
  } else if (s.id === 'vellora') {
    g.fillStyle = s.accent;
    g.font = 'italic 400 104px "Instrument Serif", Georgia, serif';
    g.fillText('Vellora Escapes', 512, 100);
  } else if (s.id === 'dogindeed') {
    g.fillStyle = s.accent;
    g.font = '800 104px "Archivo", Arial, sans-serif';
    g.fillText('DOGINDEED', 512, 102);
  } else {
    g.fillStyle = '#d8d4cb';
    g.font = '700 92px "JetBrains Mono", monospace';
    g.letterSpacing = '24px';
    g.fillText('TO LET', 524, 100);
  }
  return tex(c);
}

/** Striped awning cloth. */
function awningTexture(a: string, b: string): CanvasTexture {
  const [c, g] = canvas(512, 128);
  for (let i = 0; i < 8; i++) {
    g.fillStyle = i % 2 ? b : a;
    g.fillRect(i * 64, 0, 64, 128);
  }
  // Scalloped edge
  g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 16; i++) {
    g.beginPath();
    g.arc(i * 32 + 16, 128, 14, 0, Math.PI * 2);
    g.fill();
  }
  return tex(c);
}

/** Corrugated steel with a stencilled shop number. */
function shutterTexture(n: string, label: string): CanvasTexture {
  const [c, g] = canvas(512, 512);
  for (let y = 0; y < 512; y += 16) {
    const grd = g.createLinearGradient(0, y, 0, y + 16);
    grd.addColorStop(0, '#9a9a96');
    grd.addColorStop(0.45, '#cfcfca');
    grd.addColorStop(0.55, '#7d7d79');
    grd.addColorStop(1, '#5d5d5a');
    g.fillStyle = grd;
    g.fillRect(0, y, 512, 16);
  }
  // Grime toward the bottom
  const dirt = g.createLinearGradient(0, 300, 0, 512);
  dirt.addColorStop(0, 'rgba(40,30,20,0)');
  dirt.addColorStop(1, 'rgba(40,30,20,0.45)');
  g.fillStyle = dirt;
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = 'rgba(20,20,20,0.82)';
  g.textAlign = 'center';
  g.font = '700 120px "JetBrains Mono", monospace';
  g.fillText(n, 256, 230);
  g.font = '600 30px "JetBrains Mono", monospace';
  g.letterSpacing = '6px';
  g.fillText(label, 256, 300);
  return tex(c);
}

/** Vellora's globe: navy with brass meridians and a dot for every place on their board. */
function globeTexture(): CanvasTexture {
  const [c, g] = canvas(1024, 512);
  g.fillStyle = '#0c1626';
  g.fillRect(0, 0, 1024, 512);
  g.strokeStyle = 'rgba(210,176,106,0.55)';
  g.lineWidth = 2;
  for (let x = 0; x <= 1024; x += 64) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, 512);
    g.stroke();
  }
  for (let y = 0; y <= 512; y += 64) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(1024, y);
    g.stroke();
  }
  // Approximate positions (longitude, latitude) of the destinations on the board.
  const places: [number, number][] = [
    [139, 36], [115, -8], [73, 3], [10, 50], [55, 25], [104, 1], [76, 10], [75, 34], [77, 32], [77, 31.6],
  ];
  g.fillStyle = '#d2b06a';
  places.forEach(([lon, lat]) => {
    const x = ((lon + 180) / 360) * 1024;
    const y = ((90 - lat) / 180) * 512;
    g.beginPath();
    g.arc(x, y, 7, 0, Math.PI * 2);
    g.fill();
  });
  return tex(c);
}

/** A ribbed tumbler, like the ones Glasseria sold. */
function tumblerGeometry(): LatheGeometry {
  const pts: Vector2[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    pts.push(new Vector2(0.26 + t * 0.06, t * 0.75));
  }
  pts.push(new Vector2(0.3, 0.75), new Vector2(0.28, 0.06), new Vector2(0.0, 0.06));
  const geo = new LatheGeometry(pts, 48);
  // Flutes: push vertices outward in a ripple around the circumference.
  const pos = geo.attributes.position!;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 0.2) continue;
    const a = Math.atan2(z, x);
    const k = 1 + Math.cos(a * 18) * 0.035;
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
  }
  geo.computeVertexNormals();
  return geo;
}

function haloTexture(): CanvasTexture {
  const [c, g] = canvas(128, 128);
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,0.9)');
  grd.addColorStop(0.3, 'rgba(255,255,255,0.25)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return tex(c);
}

interface Shop {
  group: Group;
  shutter: Mesh;
  signMat: MeshBasicMaterial;
  screenMat: MeshBasicMaterial | null;
  light: PointLight;
  halo: Sprite;
  props: Group;
  open: number;
  flicker: number;
}

export async function createStreet(canvasEl: HTMLCanvasElement, shops: ShopData[]): Promise<StreetScene> {
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (fonts) {
    await Promise.all(
      ['400 100px "Instrument Serif"', 'italic 400 100px "Instrument Serif"', '800 100px "Archivo"', '700 100px "JetBrains Mono"'].map((f) =>
        fonts.load(f).catch(() => null),
      ),
    );
  }

  const renderer = new WebGLRenderer({ canvas: canvasEl, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.background = new Color('#07080d');
  scene.fog = new Fog('#07080d', 22, 70);
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.22;

  const camera = new PerspectiveCamera(38, 1, 0.1, 200);
  const halo = haloTexture();
  const loader = new TextureLoader();
  const load = (src: string) =>
    new Promise<Texture | null>((res) =>
      loader.load(
        src,
        (t) => {
          t.colorSpace = SRGBColorSpace;
          t.anisotropy = 4;
          res(t);
        },
        undefined,
        () => res(null),
      ),
    );

  /* The street itself */
  const len = STEP * shops.length + 60;
  const road = new Mesh(new PlaneGeometry(len, 40), new MeshStandardMaterial({ color: '#0d0e12', roughness: 0.32, metalness: 0.35 }));
  road.rotation.x = -Math.PI / 2;
  road.position.set(STEP * 1.5, 0, 12);
  scene.add(road);
  const pavement = new Mesh(new BoxGeometry(len, 0.18, 3.2), new MeshStandardMaterial({ color: '#2a2a2e', roughness: 0.75 }));
  pavement.position.set(STEP * 1.5, 0.09, 1.6);
  scene.add(pavement);
  // Pavement joints
  const joints = new Group();
  const jointMat = new MeshBasicMaterial({ color: '#17171a' });
  for (let x = -40; x < len - 40; x += 1.6) {
    const j = new Mesh(new PlaneGeometry(0.04, 3.2), jointMat);
    j.rotation.x = -Math.PI / 2;
    j.position.set(x, 0.181, 1.6);
    joints.add(j);
  }
  scene.add(joints);
  const hemi = new HemisphereLight('#3a4466', '#08080a', 0.55);
  scene.add(hemi);

  /* Stars over the roofline */
  const starGeo = new BufferGeometry();
  const sp: number[] = [];
  for (let i = 0; i < 700; i++) sp.push(-40 + Math.random() * (len + 20), 16 + Math.random() * 30, -30 - Math.random() * 20);
  starGeo.setAttribute('position', new Float32BufferAttribute(sp, 3));
  scene.add(new Points(starGeo, new PointsMaterial({ color: '#ffffff', size: 1.4, sizeAttenuation: false, transparent: true, opacity: 0.7, fog: false })));

  /* Shops */
  const built: Shop[] = [];
  const images = await Promise.all(shops.map((s) => (s.image ? load(s.image) : Promise.resolve(null))));

  shops.forEach((s, i) => {
    const group = new Group();
    group.position.x = i * STEP;
    scene.add(group);

    // Facade slab with the opening cut out
    const outline = new Shape();
    outline.moveTo(-W / 2, 0);
    outline.lineTo(W / 2, 0);
    outline.lineTo(W / 2, H);
    outline.lineTo(-W / 2, H);
    outline.lineTo(-W / 2, 0);
    const hole = new Shape();
    hole.moveTo(-OW / 2, 0.18);
    hole.lineTo(-OW / 2, 0.18 + OH);
    hole.lineTo(OW / 2, 0.18 + OH);
    hole.lineTo(OW / 2, 0.18);
    hole.lineTo(-OW / 2, 0.18);
    outline.holes.push(hole);
    const facadeCol = s.vacant ? '#3a3a3d' : s.bg;
    const facade = new Mesh(
      new ExtrudeGeometry(outline, { depth: 0.5, bevelEnabled: false }),
      new MeshStandardMaterial({ color: facadeCol, roughness: 0.8 }),
    );
    facade.position.z = -0.5;
    group.add(facade);

    // The building above
    const upper = new Mesh(
      new BoxGeometry(W, 7, 6),
      new MeshStandardMaterial({ color: new Color(s.vacant ? '#202024' : s.bg).multiplyScalar(0.28), roughness: 0.9 }),
    );
    upper.position.set(0, H + 3.5, -3.3);
    group.add(upper);
    // Windows upstairs, some lit
    const winMatOn = new MeshBasicMaterial({ color: '#ffcf8a' });
    const winMatOff = new MeshBasicMaterial({ color: '#15161c' });
    for (let r = 0; r < 2; r++)
      for (let k = 0; k < 3; k++) {
        const lit = (i * 7 + r * 3 + k * 5) % 4 === 0;
        const win = new Mesh(new PlaneGeometry(1.4, 1.9), lit ? winMatOn : winMatOff);
        win.position.set(-2.6 + k * 2.6, H + 1.8 + r * 2.8, -0.29);
        group.add(win);
      }
    // Cornice
    const cornice = new Mesh(new BoxGeometry(W + 0.4, 0.35, 0.8), new MeshStandardMaterial({ color: '#1b1b1f', roughness: 0.7 }));
    cornice.position.set(0, H + 0.1, -0.2);
    group.add(cornice);

    // Interior room
    const room = new Mesh(
      new BoxGeometry(OW, OH, 4.4),
      new MeshStandardMaterial({ color: new Color(s.bg).lerp(new Color('#ffffff'), 0.1), roughness: 0.9, side: BackSide }),
    );
    room.position.set(0, 0.18 + OH / 2, -2.7);
    group.add(room);

    // The store on the back wall
    let screenMat: MeshBasicMaterial | null = null;
    const img = images[i];
    if (img) {
      const aspect = (img.image as HTMLImageElement).width / (img.image as HTMLImageElement).height || 16 / 9;
      const sw = Math.min(OW - 0.9, (OH - 1.2) * aspect);
      screenMat = new MeshBasicMaterial({ map: img, toneMapped: false, color: '#000000' });
      const screen = new Mesh(new PlaneGeometry(sw, sw / aspect), screenMat);
      screen.position.set(0, 0.18 + OH * 0.58, -4.85);
      group.add(screen);
      const bezel = new Mesh(new BoxGeometry(sw + 0.16, sw / aspect + 0.16, 0.08), new MeshStandardMaterial({ color: '#111', roughness: 0.4 }));
      bezel.position.set(0, screen.position.y, -4.9);
      group.add(bezel);
    }

    // Counter and props
    const counter = new Mesh(new BoxGeometry(OW - 1.4, 0.95, 0.9), new MeshStandardMaterial({ color: new Color(s.ink).lerp(new Color(s.bg), 0.55), roughness: 0.6 }));
    counter.position.set(0, 0.18 + 0.475, -1.6);
    if (!s.vacant) group.add(counter);
    const props = new Group();
    props.position.set(0, 0.18 + 0.95, -1.6);
    group.add(props);
    if (s.id === 'glasseria') {
      const glass = new MeshPhysicalMaterial({ color: '#ffffff', transmission: 1, roughness: 0.06, thickness: 0.35, ior: 1.5, metalness: 0 });
      const geo = tumblerGeometry();
      for (let k = 0; k < 5; k++) {
        const t = new Mesh(geo, glass);
        t.position.set(-1.8 + k * 0.9, 0, (k % 2) * 0.15);
        t.scale.setScalar(k === 2 ? 1.25 : 1);
        props.add(t);
      }
    } else if (s.id === 'vellora') {
      const globe = new Mesh(new SphereGeometry(0.72, 48, 24), new MeshStandardMaterial({ map: globeTexture(), roughness: 0.5, metalness: 0.1 }));
      globe.position.set(-1.3, 1.05, 0);
      globe.rotation.z = 0.41;
      globe.name = 'spin';
      props.add(globe);
      const stand = new Mesh(new CylinderGeometry(0.05, 0.3, 0.3, 24), new MeshStandardMaterial({ color: '#d2b06a', metalness: 0.8, roughness: 0.3 }));
      stand.position.set(-1.3, 0.15, 0);
      props.add(stand);
      const ring = new Mesh(new TorusGeometry(0.82, 0.025, 8, 64), stand.material);
      ring.position.copy(globe.position);
      ring.rotation.y = Math.PI / 2;
      ring.rotation.z = 0.41;
      props.add(ring);
      const suitcase = new Mesh(new BoxGeometry(1.1, 0.75, 0.38), new MeshStandardMaterial({ color: '#7a2e25', roughness: 0.5 }));
      suitcase.position.set(1.3, 0.38, 0);
      suitcase.rotation.y = -0.4;
      props.add(suitcase);
    } else if (s.id === 'dogindeed') {
      const bag = (color: string, x: number, h: number) => {
        const b = new Mesh(new BoxGeometry(0.8, h, 0.4), new MeshStandardMaterial({ color, roughness: 0.75 }));
        b.position.set(x, h / 2, 0);
        const handle = new Mesh(new TorusGeometry(0.2, 0.025, 8, 24, Math.PI), new MeshStandardMaterial({ color: '#1d1a13' }));
        handle.position.set(x, h, 0);
        props.add(b, handle);
      };
      bag(s.accent, -1.6, 0.95);
      bag('#ff7a1c', -0.65, 0.75);
      // A bone, for good measure
      const boneMat = new MeshStandardMaterial({ color: '#f3ead9', roughness: 0.55 });
      const bone = new Group();
      const shaft = new Mesh(new CapsuleGeometry(0.09, 0.8, 6, 12), boneMat);
      shaft.rotation.z = Math.PI / 2;
      bone.add(shaft);
      [-0.5, 0.5].forEach((x) =>
        [-0.09, 0.09].forEach((y) => {
          const knob = new Mesh(new SphereGeometry(0.14, 16, 12), boneMat);
          knob.position.set(x, y, 0);
          bone.add(knob);
        }),
      );
      bone.position.set(1.15, 0.2, 0.05);
      bone.rotation.y = 0.5;
      props.add(bone);
    }

    // Signboard, lit from behind when the shop opens
    const signMat = new MeshBasicMaterial({ map: signTexture(s), toneMapped: false, color: '#555555' });
    const sign = new Mesh(new PlaneGeometry(OW + 0.6, (OW + 0.6) * (192 / 1024)), signMat);
    sign.position.set(0, H - 1.05, 0.03);
    group.add(sign);
    const haloSprite = new Sprite(
      new SpriteMaterial({ map: halo, color: s.vacant ? '#777777' : s.accent, blending: AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }),
    );
    haloSprite.scale.set(OW + 3, 3.2, 1);
    haloSprite.position.set(0, H - 1.05, 0.2);
    group.add(haloSprite);

    // Awning
    if (!s.vacant) {
      const awn = new Mesh(new PlaneGeometry(OW + 0.8, 1.6), new MeshStandardMaterial({ map: awningTexture(s.accent, '#f4efe6'), roughness: 0.85, side: DoubleSide, transparent: true }));
      awn.position.set(0, 0.18 + OH + 0.55, 0.65);
      awn.rotation.x = -1.05;
      group.add(awn);
    }

    // Shutter and its housing
    const shutTex = shutterTexture(String(i + 1).padStart(2, '0'), s.vacant ? 'SPACE AVAILABLE' : s.name.toUpperCase());
    shutTex.wrapS = RepeatWrapping;
    const shutter = new Mesh(new PlaneGeometry(OW, OH), new MeshStandardMaterial({ map: shutTex, metalness: 0.55, roughness: 0.42 }));
    shutter.position.set(0, 0.18 + OH / 2, 0.06);
    group.add(shutter);
    const housing = new Mesh(new BoxGeometry(OW + 0.3, 0.42, 0.5), new MeshStandardMaterial({ color: '#2b2b2e', metalness: 0.6, roughness: 0.4 }));
    housing.position.set(0, 0.18 + OH + 0.2, 0.15);
    group.add(housing);

    // Shop light
    const light = new PointLight('#ffd3a0', 0, 11, 1.6);
    light.position.set(0, OH - 0.3, -1.4);
    group.add(light);

    built.push({ group, shutter, signMat, screenMat, light, halo: haloSprite, props, open: 0, flicker: Math.random() * 10 });

    // Street lamp in the gap after the shop
    {
      const lx = W / 2 + GAP / 2;
      const pole = new Mesh(new CylinderGeometry(0.07, 0.1, 6.2, 12), new MeshStandardMaterial({ color: '#1c1c1f', metalness: 0.7, roughness: 0.35 }));
      pole.position.set(lx, 3.1, 2.4);
      group.add(pole);
      const arm = new Mesh(new BoxGeometry(1.2, 0.08, 0.08), pole.material);
      arm.position.set(lx - 0.5, 6.1, 2.4);
      group.add(arm);
      const bulb = new Mesh(new SphereGeometry(0.22, 16, 12), new MeshBasicMaterial({ color: '#ffe0b0', toneMapped: false }));
      bulb.position.set(lx - 1, 5.9, 2.4);
      group.add(bulb);
      const lamp = new PointLight('#ffcc8a', 9, 13, 1.7);
      lamp.position.copy(bulb.position);
      group.add(lamp);
      const glow = new Sprite(new SpriteMaterial({ map: halo, color: '#ffbb70', blending: AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.8 }));
      glow.position.copy(bulb.position);
      glow.scale.setScalar(2.6);
      group.add(glow);
    }
  });

  /* Camera path: approach, stop in front of each shop, then drift past the last. */
  const xs = shops.map((_, i) => i * STEP);
  const keys: [number, number][] = [[0, -STEP * 0.4], ...SHOP_STOPS.slice(0, shops.length).map((p, i) => [p, xs[i]!] as [number, number]), [1, xs[xs.length - 1]! + 1.5]];
  const camX = (p: number) => {
    for (let i = 0; i < keys.length - 1; i++) {
      const [p0, x0] = keys[i]!;
      const [p1, x1] = keys[i + 1]!;
      if (p <= p1) return MathUtils.lerp(x0, x1, smooth(p0, p1, p));
    }
    return keys[keys.length - 1]![1];
  };

  const st = { p: 0, cp: 0, px: 0, py: 0, cx: 0, cy: 0, visible: true };
  let dist = 14;
  const fit = () => {
    const w = canvasEl.clientWidth || window.innerWidth;
    const h = canvasEl.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const hfov = 2 * Math.atan(Math.tan(MathUtils.degToRad(camera.fov) / 2) * camera.aspect);
    const portrait = camera.aspect < 0.9;
    const span = portrait ? W + 0.6 : W + GAP * 2.2;
    dist = span / 2 / Math.tan(hfov / 2) + 1;
    // Leave the lower part of the frame for the shop's text on phones, the left on wide screens.
    camera.setViewOffset(w, h, portrait ? 0 : -w * 0.17, portrait ? h * 0.16 : -h * 0.02, w, h);
    camera.updateProjectionMatrix();
  };
  fit();

  const look = new Vector3();
  let raf = 0;
  let last = performance.now();
  const frame = (t: number) => {
    raf = 0;
    if (!st.visible) return;
    const dt = Math.min(64, t - last) / 16.67;
    last = t;
    const k = 1 - Math.pow(1 - 0.08, dt);
    st.cp += (st.p - st.cp) * k;
    st.cx += (st.px - st.cx) * k;
    st.cy += (st.py - st.cy) * k;
    const p = st.cp;

    const x = camX(p);
    const bob = Math.sin(p * 90) * 0.04;
    camera.position.set(x + st.cx * 0.9, 2.5 + bob - st.cy * 0.35, dist);
    look.set(x + st.cx * 0.25, 2.6, 0);
    camera.lookAt(look);

    built.forEach((b, i) => {
      const s = shops[i]!;
      const stop = SHOP_STOPS[i] ?? 1;
      const open = s.vacant ? smooth(stop - 0.05, stop + 0.02, p) * 0.12 : smooth(stop - 0.1, stop - 0.015, p);
      b.open = open;
      b.shutter.scale.y = 1 - open * 0.97;
      b.shutter.position.y = 0.18 + OH - (OH * b.shutter.scale.y) / 2;
      (b.shutter.material as MeshStandardMaterial).map!.repeat.set(1, b.shutter.scale.y);
      // Lights stutter on, like old tube lights, then hold.
      b.flicker += 0.25 * dt;
      const on = s.vacant ? 0.15 + Math.max(0, Math.sin(b.flicker * 3)) * 0.12 : smooth(0.25, 0.75, open);
      const stutter = on > 0 && on < 1 ? (Math.sin(b.flicker * 19) > 0.2 ? 1 : 0.35) : 1;
      const lit = on * stutter;
      b.signMat.color.setScalar(0.32 + lit * 0.68);
      (b.halo.material as SpriteMaterial).opacity = lit * 0.55;
      b.light.intensity = lit * 14;
      if (b.screenMat) b.screenMat.color.setScalar(smooth(0.4, 1, open) * 0.95);
      const spin = b.props.getObjectByName('spin');
      if (spin) spin.rotation.y += 0.01 * dt;
    });

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf && st.visible) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  const io = new IntersectionObserver(
    ([e]) => {
      st.visible = !!e?.isIntersecting;
      kick();
    },
    { rootMargin: '10% 0px' },
  );
  io.observe(canvasEl);
  kick();

  return {
    setProgress(p) {
      st.p = p;
      kick();
    },
    setPointer(x, y) {
      st.px = x;
      st.py = y;
      kick();
    },
    resize() {
      fit();
      kick();
    },
  };
}
