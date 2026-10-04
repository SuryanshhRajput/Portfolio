# Suryansh Singh · portfolio

A one-page portfolio built around the meaning of the name: सूर्यांश, *a part of the sun*.

1. **Hero.** सूर्यांश means "a part of the sun", so the page opens on a sun made of
   15,000 particles that breaks apart into the name. The pointer pushes the particles
   around, scrolling dives the camera through them, and a terminal types out who I am.
2. **Freelance Street.** A night-time street of 3D shopfronts, one per client store
   (Glasseria, Vellora Escapes, DogIndeed, plus a vacant lot). Scrolling walks the camera
   down the street and rolls each shutter up as you reach it.
3. **The three case studies.** Each with a pitch, real numbers and a pinned 3D reel of screens.
4. **Live on the web.** A coverflow of the 13 builds that are deployed today, each with its
   live link and its code.
5. The React apps on the bench, a skills globe with four decks (code, commerce, design,
   people) and the full tool map, the Off-screen chapter (event passes hanging on lanyards,
   told from my LinkedIn posts, with their photos) and the contact chapter.

## Running it

Needs Node 20 or newer.

```bash
npm install
npm run dev        # builds, serves http://localhost:4321 and rebuilds on change
npm run build      # writes the production site to dist/
npm run typecheck  # TypeScript over src/
```

## Deploying

The repo is ready for Vercel: `vercel.json` sets `npm run build` as the build command
and `dist` as the output. Hashed files under `/assets` are cached for a year.

Before the first deploy, set `SITE_URL` in `src/content/site.ts` to the final domain.
The canonical link, Open Graph tags, `sitemap.xml`, `robots.txt` and the JSON-LD
structured data all read from it.

## How it's built

- **Static HTML first.** The React components in `src/site` run only at build time and
  are rendered to static HTML (`react-dom/server`). Every word of content is in the HTML,
  so the page reads fully without JavaScript, and search engines see all of it.
- **GSAP for motion.** ScrollTrigger pins the street, the case reels and the live
  coverflow; ScrollSmoother smooths the scroll on desktop; SplitText drives the heading
  entrances and the word-by-word manifesto. All of it lives in `src/client/anim`.
- **Three.js for the 3D**, loaded lazily so it never blocks first paint:
  - `src/client/three/particles.ts`: the particle sun and name (the name is sampled from
    text drawn on a 2D canvas, so it always uses the page's own font).
  - `src/client/three/street3d.ts`: the street, built entirely in code (facades, awnings,
    shutters, signs, props). The store screens are the only images.
- **Fallbacks.** No WebGL, a low-power device (Save-Data on, 2 or fewer CPU cores, or 2 GB
  or less memory) or `prefers-reduced-motion` gets the name set in type and a flat CSS street whose
  shutters lift as they scroll in. Reduced motion also turns off smoothing, pinning and
  entrances; the reels become swipeable rows.

Debugging: add `?nosmooth` to the URL to turn ScrollSmoother off. `window.__st`
(ScrollTrigger) and `window.__smoother` are exposed for inspecting scroll scenes from the
console.

```
src/
  content/   every fact on the page, typed (projects, live builds, people, stack, site)
  site/      React components rendered to HTML at build time
  client/    browser code: anim/ (GSAP), three/ (3D scenes), sun/, features/
  styles/    CSS, split by chapter; tokens.css holds colours, type and spacing
scripts/     build.mjs (production build), dev.mjs (local server and watcher)
public/      images, fonts, icons and the Open Graph card, copied as-is
```

## Editing content

All copy and project data live in `src/content`:

- `projects.ts`: the three case studies (pitch, stats, screens) and the bench apps.
- `live.ts`: the deployed builds in the coverflow, each with its live URL, code link and
  screenshot (`public/img/live/<name>-1440.webp` and `-760.webp`).
- `stack.ts`: the tool matrix. Each tool lists the projects it was used in.
- `people.ts`: about, the event passes (`passes`) and groups, what I'm learning now,
  certificates. Event photos live in `public/img/offscreen/`.
- `skills.ts`: the four skill decks; each skill says where it was used.
- `site.ts`: name, email, profiles, SEO text and `SITE_URL`.

## Notes on the content

- Glasseria and DogIndeed are offline as of October 2026, so their screens come from
  walkthrough recordings made while the stores were live.
- Vellora Escapes has been rebuilt by the business since the first version, so its case
  study has no screenshots of the current site.
- MusicHub and TeamSync aren't deployed and are marked as such.
- The Dribbble-style gallery couldn't be captured, so its card is a typographic poster.
