/**
 * Builds the site into dist/.
 *
 *   1. Bundles the browser code (src/client) into small ES modules.
 *   2. Bundles the stylesheet and its fonts.
 *   3. Renders the React components in src/site to static HTML.
 *   4. Copies public/ and writes robots.txt, sitemap.xml and the web manifest.
 *
 * `node scripts/build.mjs --artifact` also writes dist-artifact/, the same page
 * as an HTML fragment for hosts that wrap pages in their own document.
 */
import * as esbuild from 'esbuild';
import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const cache = path.join(root, '.build');
const withArtifact = process.argv.includes('--artifact');
const quiet = process.argv.includes('--quiet');

/** Browsers the client bundle is written for. */
const JS_TARGET = ['es2020', 'chrome100', 'safari15', 'firefox100'];
/** The stylesheet uses color-mix() and container units, so it targets browsers that have them. */
const CSS_TARGET = ['chrome111', 'safari16.4', 'firefox113'];

const rel = (p) => path.relative(dist, p).split(path.sep).join('/');
const log = (...a) => !quiet && console.log(...a);

export async function build() {
  const started = performance.now();
  await rm(dist, { recursive: true, force: true });
  await mkdir(path.join(dist, 'assets'), { recursive: true });

  // 1. Browser modules. The sun shader is a separate chunk loaded on demand.
  const client = await esbuild.build({
    absWorkingDir: root,
    entryPoints: { main: 'src/client/main.ts' },
    bundle: true,
    splitting: true,
    format: 'esm',
    outdir: path.join(dist, 'assets'),
    entryNames: '[name]-[hash]',
    chunkNames: 'chunk-[hash]',
    minify: true,
    target: JS_TARGET,
    metafile: true,
    legalComments: 'none',
    // GSAP's package.json lists its "types" condition last, which esbuild warns about. Harmless.
    logLevel: 'error',
  });
  const outputs = Object.entries(client.metafile.outputs);
  const [mainPath] = outputs.find(([, o]) => o.entryPoint === 'src/client/main.ts');
  // Chunks the entry imports statically are worth preloading; dynamic ones are not.
  const mainImports = client.metafile.outputs[mainPath].imports
    .filter((i) => i.kind === 'import-statement')
    .map((i) => rel(path.join(root, i.path)));

  // Inline boot script: sets the sky colours before first paint.
  const boot = await esbuild.build({
    absWorkingDir: root,
    entryPoints: ['src/client/boot.ts'],
    bundle: true,
    format: 'iife',
    minify: true,
    target: JS_TARGET,
    write: false,
    legalComments: 'none',
  });
  const bootCode = boot.outputFiles[0].text.trim();

  // 2. Styles and fonts.
  const css = await esbuild.build({
    absWorkingDir: root,
    entryPoints: { styles: 'src/styles/main.css' },
    bundle: true,
    minify: true,
    outdir: path.join(dist, 'assets'),
    entryNames: '[name]-[hash]',
    assetNames: 'fonts/[name]-[hash]',
    loader: { '.woff2': 'file' },
    target: CSS_TARGET,
    metafile: true,
  });
  const cssOut = Object.keys(css.metafile.outputs);
  const cssPath = cssOut.find((p) => p.endsWith('.css'));
  const fonts = cssOut.filter((p) => p.endsWith('.woff2'));
  // Preload the two faces visible on first paint: the display face and the text face.
  const preloadFonts = fonts.filter((p) => /\/(archivo|isans)-/.test(p)).map((p) => rel(path.join(root, p)));

  // 3. Render the page.
  await mkdir(cache, { recursive: true });
  const renderer = path.join(cache, `render-${Date.now()}.mjs`);
  await esbuild.build({
    absWorkingDir: root,
    entryPoints: ['src/site/Document.tsx'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    packages: 'external',
    outfile: renderer,
    logLevel: 'error',
  });
  const { renderSite, renderFragment, siteMeta } = await import(pathToFileURL(renderer).href);
  await rm(renderer);

  const assets = {
    css: rel(path.join(root, cssPath)),
    js: rel(path.join(root, mainPath)),
    preload: mainImports,
    boot: bootCode,
    fonts: preloadFonts,
  };
  await writeFile(path.join(dist, 'index.html'), renderSite(assets));

  // 4. Static files.
  await cp(path.join(root, 'public'), dist, {
    recursive: true,
    // Fonts are bundled through the stylesheet with hashed names.
    filter: (src) => !src.includes(`${path.sep}public${path.sep}fonts`),
  });
  const { url, name, shortName, description, themeColor, background, lastModified } = siteMeta();
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
  await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}/</loc>\n    <lastmod>${lastModified}</lastmod>\n  </url>\n</urlset>\n`,
  );
  await writeFile(
    path.join(dist, 'site.webmanifest'),
    JSON.stringify(
      {
        name,
        short_name: shortName,
        description,
        start_url: '/',
        display: 'browser',
        background_color: background,
        theme_color: themeColor,
        icons: [
          { src: 'favicon.svg', type: 'image/svg+xml', sizes: 'any' },
          { src: 'apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
          { src: 'icon-512.png', type: 'image/png', sizes: '512x512' },
        ],
      },
      null,
      2,
    ) + '\n',
  );

  if (withArtifact) {
    const out = path.join(root, 'dist-artifact');
    await rm(out, { recursive: true, force: true });
    await mkdir(out, { recursive: true });
    await writeFile(path.join(out, 'index.html'), renderFragment(assets, `${name} Portfolio`));
  }

  const ms = Math.round(performance.now() - started);
  const jsBytes = await sizeOf(path.join(dist, 'assets'), (f) => f.endsWith('.js'));
  const cssBytes = await sizeOf(path.join(dist, 'assets'), (f) => f.endsWith('.css'));
  log(`Built dist/ in ${ms} ms. JS ${(jsBytes / 1024).toFixed(1)} KB, CSS ${(cssBytes / 1024).toFixed(1)} KB (minified, before gzip).`);
  return { assets };
}

async function sizeOf(dir, test) {
  let total = 0;
  for (const f of await readdir(dir)) {
    if (test(f)) total += (await stat(path.join(dir, f))).size;
  }
  return total;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
