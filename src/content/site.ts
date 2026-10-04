/**
 * Everything about the person and the site itself.
 * Change SITE_URL to the final domain before deploying; canonical, Open Graph,
 * the sitemap and structured data all read from it.
 */
export const SITE_URL = 'https://portfolio-iota-wine-34.vercel.app';

export const person = {
  name: 'Suryansh Singh',
  firstName: 'Suryansh',
  lastName: 'Singh',
  role: 'Frontend developer, moving to full-stack',
  shortRole: 'Frontend Developer',
  study: 'B.Tech CSE, Bennett University',
  years: '2023–27',
  base: 'Greater Noida, India',
  openTo: 'Frontend and full-stack internships and roles',
  email: 'suryanshhsingh986@gmail.com',
  /** Greater Noida. The hero's sun is computed for this point on Earth. */
  geo: { lat: 28.4744, lon: 77.504, timeZone: 'Asia/Kolkata', tzLabel: 'IST' },
  nameMeaning: {
    devanagari: 'सूर्यांश',
    gloss: 'a part of the sun',
  },
  portrait: {
    base: 'img/portrait',
    widths: [400],
    w: 400,
    h: 400,
    alt: 'Suryansh Singh sitting in an office lounge, wearing a checked shirt and a lanyard',
  },
};

export const profiles = {
  linkedin: { label: 'LinkedIn', handle: 'in/suryanshhsingh', href: 'https://www.linkedin.com/in/suryanshhsingh/' },
  github: { label: 'GitHub', handle: '@SuryanshhRajput', href: 'https://github.com/SuryanshhRajput' },
  codolio: { label: 'Codolio', handle: '@Suryanshh', href: 'https://codolio.com/profile/Suryanshh' },
};

export const seo = {
  title: 'Suryansh Singh · Frontend Developer (React, Shopify)',
  description:
    'Frontend developer moving to full-stack. Shopify storefronts for Glasseria and DogIndeed, the first Vellora Escapes website, thirteen live web builds and React apps on Redux Toolkit and TanStack Query. B.Tech CSE, Bennett University.',
  ogImage: 'og.png',
  themeColor: '#0E0E0D',
  keywords: [
    'Suryansh Singh',
    'frontend developer',
    'React developer',
    'Shopify developer',
    'portfolio',
    'Bennett University',
  ],
};

/** The chapters of the page, in order. Drives the side rail and the index. */
export const chapters = [
  { id: 'top', label: 'Start', short: 'Start' },
  { id: 'street', label: 'The street', short: 'Shops' },
  { id: 'glasseria', label: 'Glasseria', short: '01' },
  { id: 'vellora', label: 'Vellora Escapes', short: '02' },
  { id: 'dogindeed', label: 'DogIndeed', short: '03' },
  { id: 'live', label: 'Live builds', short: 'Live' },
  { id: 'bench', label: 'The bench', short: 'Bench' },
  { id: 'stack', label: 'Skills', short: 'Skills' },
  { id: 'rooms', label: 'Off-screen', short: 'People' },
  { id: 'contact', label: 'Nightfall', short: 'Contact' },
] as const;
