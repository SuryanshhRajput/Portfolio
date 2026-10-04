import { renderToStaticMarkup } from 'react-dom/server';
import { caseStudies } from '../content/projects.js';
import { liveProjects } from '../content/live.js';
import { SITE_URL, person, profiles, seo } from '../content/site.js';
import { Bench } from './Bench.js';
import { Chrome } from './Chrome.js';
import { Hero, Manifesto, Marquee } from './Hero.js';
import { Live } from './Live.js';
import { Contact, Rooms } from './People.js';
import { Stack } from './Stack.js';
import { Street } from './Street.js';
import { CaseStudies } from './Work.js';

export interface Assets {
  css: string;
  js: string;
  /** Extra module chunks to preload. */
  preload: string[];
  boot: string;
  fonts: string[];
}

function structuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: person.name,
        url: SITE_URL,
        image: `${SITE_URL}/img/portrait-400.webp`,
        jobTitle: person.shortRole,
        email: `mailto:${person.email}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Greater Noida', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Bennett University' },
        sameAs: Object.values(profiles).map((p) => p.href),
        knowsAbout: ['React', 'JavaScript', 'TypeScript', 'Shopify', 'Liquid', 'Redux Toolkit', 'TanStack Query', 'Tailwind CSS', 'Next.js', 'FastAPI'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: person.name,
        description: seo.description,
        inLanguage: 'en-IN',
        author: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'ItemList',
        name: 'Selected work',
        itemListElement: [
          ...caseStudies.map((c) => ({
            '@type': 'CreativeWork',
            name: c.name,
            description: c.summary,
            url: `${SITE_URL}/#${c.id}`,
            creator: { '@id': `${SITE_URL}/#person` },
          })),
          ...liveProjects.map((l) => ({
            '@type': 'WebSite',
            name: l.name,
            description: l.detail,
            url: l.href,
            creator: { '@id': `${SITE_URL}/#person` },
          })),
        ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })),
      },
    ],
  };
}

function Body({ assets }: { assets: Assets }) {
  return (
    <>
      <Chrome />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main">
            <Hero />
            <Manifesto />
            <Marquee />
            <Street />
            <CaseStudies />
            <Live />
            <Bench />
            <Stack />
            <Rooms />
            <Contact />
          </main>
        </div>
      </div>
      <script type="module" src={assets.js} />
    </>
  );
}

function Head({ assets }: { assets: Assets }) {
  const ogImage = `${SITE_URL}/${seo.ogImage}`;
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="author" content={person.name} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <link rel="canonical" href={`${SITE_URL}/`} />
      <meta name="theme-color" content={seo.themeColor} />
      <meta name="color-scheme" content="light" />
      <link rel="icon" href="favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png" />
      <link rel="apple-touch-icon" href="apple-touch-icon.png" />
      <link rel="manifest" href="site.webmanifest" />

      <meta property="og:type" content="profile" />
      <meta property="og:site_name" content={person.name} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Suryansh Singh, frontend developer. An orange sun rising behind his name." />
      <meta property="og:locale" content="en_IN" />
      <meta property="profile:first_name" content={person.firstName} />
      <meta property="profile:last_name" content={person.lastName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={ogImage} />

      {assets.fonts.map((f) => (
        <link key={f} rel="preload" href={f} as="font" type="font/woff2" crossOrigin="anonymous" />
      ))}
      <link rel="stylesheet" href={assets.css} />
      {assets.preload.map((p) => (
        <link key={p} rel="modulepreload" href={p} />
      ))}
      <script dangerouslySetInnerHTML={{ __html: assets.boot }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }} />
    </>
  );
}

/** Values the build script needs for robots.txt, the sitemap and the web manifest. */
export function siteMeta() {
  return {
    url: SITE_URL,
    name: person.name,
    shortName: person.firstName,
    description: seo.description,
    themeColor: seo.themeColor,
    background: '#E4E4DF',
    lastModified: new Date().toISOString().slice(0, 10),
  };
}

/** The full HTML document for the deployed site. */
export function renderSite(assets: Assets): string {
  const head = renderToStaticMarkup(<Head assets={assets} />);
  const body = renderToStaticMarkup(<Body assets={assets} />);
  return `<!doctype html>\n<html lang="en-IN"><head>${head}</head><body>${body}</body></html>\n`;
}

/**
 * The same page as a fragment, for hosts that supply their own <html>, <head>
 * and <body> (the Claude artifact preview). Title and stylesheet lead the file.
 */
export function renderFragment(assets: Assets, title: string): string {
  const body = renderToStaticMarkup(<Body assets={assets} />);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${seo.description}">`,
    `<link rel="stylesheet" href="${assets.css}">`,
    ...assets.preload.map((p) => `<link rel="modulepreload" href="${p}">`),
    `<script>${assets.boot}</script>`,
    body,
  ].join('\n');
}
