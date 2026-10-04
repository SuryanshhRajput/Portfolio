import type { BenchProject, CaseStudy, Img, MinorProject } from './types.js';

const img = (base: string, w: number, h: number, widths: number[], alt: string): Img => ({ base, w, h, widths, alt });

/* ------------------------------------------------------------------ */
/* Tier 1: the three storefronts                                       */
/* ------------------------------------------------------------------ */

const g = (file: string, caption: string, alt: string, h = 623) => ({
  img: img(`img/glasseria/${file}`, 1152, h, [1152, 640], alt),
  caption,
});

export const glasseria: CaseStudy = {
  id: 'glasseria',
  order: 1,
  name: 'Glasseria',
  kind: 'Shopify storefront',
  pitch: 'A glassware brand’s entire online store. 45+ pages, designed and coded by me.',
  stats: [
    { value: '45+', label: 'custom pages' },
    { value: '3', label: 'months, design to launch' },
    { value: '3', label: 'ways to pay: Cashfree, Razorpay, COD' },
    { value: '11', label: 'screens from my walkthrough' },
  ],
  summary:
    'An online store for Glasseria, a glassware brand. I designed and built it over three months: more than 45 custom pages, from the home page to checkout.',
  facts: [
    { label: 'Role', value: 'Freelance. Design and development' },
    { label: 'Time', value: 'Three months, 2026' },
    { label: 'Platform', value: 'Shopify, custom Liquid sections' },
    { label: 'Scale', value: '45+ pages' },
  ],
  status: {
    state: 'offline',
    text: 'The store is offline as of 3 Oct 2026, so the screens below come from my own walkthrough recording of the live site.',
  },
  built: [
    'More than 45 pages across categories and subcategories, held to one design system.',
    'Custom Liquid sections and CSS in place of a stock theme: hero carousels, a category rail, collection grids and product pages.',
    'Product discovery through collections, filtering, search and a recommendations shelf with sale and sold-out states.',
    'Checkout through Cashfree or Razorpay, with cash on delivery as a third option, plus a shipping partner integration.',
    'Meta Pixel for conversion and event tracking, and page structure and metadata written with search in mind.',
    'Responsive layouts and optimised images, tested on phone, tablet, laptop and desktop.',
  ],
  quote: {
    text: 'The hardest part wasn’t creating a beautiful homepage. It was maintaining the same level of precision across 45+ pages while making sure everything actually works.',
    source: 'From my LinkedIn post about the build',
    href: 'https://www.linkedin.com/posts/suryanshhsingh_glasseria-webdevelopment-frontenddevelopment-activity-7494491354538856448-IQXA',
  },
  chain: ['Shopify', 'Liquid sections', 'CSS', 'JavaScript', 'Cashfree + Razorpay', 'Shipping partner', 'Meta Pixel'],
  links: [
    {
      label: 'Watch the walkthrough',
      href: 'https://www.linkedin.com/posts/suryanshhsingh_glasseria-webdevelopment-frontenddevelopment-activity-7494491354538856448-IQXA',
      note: '5 min screen recording on LinkedIn',
    },
  ],
  address: 'glasseria.in',
  cover: img('img/glasseria/f001', 1152, 599, [1152, 640], 'Glasseria home page hero reading “Moments worth pouring” over wine glasses on a dinner table'),
  frames: [
    g('f006', 'Home: hero carousel', 'Glasseria home page with the logo, the line “Where Glass Becomes Art” and two crystal tumblers'),
    g('f001', 'Hero slide, “Moments worth pouring”', 'Dark hero slide with wine glasses and the words “Moments worth pouring”', 599),
    g('f099', 'Hero slide, “Nature meets craft”', 'Hero slide of glassware on a sunlit table with the words “Nature meets craft”'),
    g('f021', 'Category rail and curated collections', 'Round category buttons above cards for Bestsellers, Barware, Decor and Luxury Dining'),
    g('f035', 'Limited-time offer, shopping by occasion', 'A limited-time offer banner above tiles for cocktail evenings, whiskey, wine, shots and beer'),
    g('f182', 'Collection pages: décor and vases', 'Décor collection carousel above a row of vase products'),
    g('f060', 'Product page: ribbed glass vase', 'Product page for a burgundy-pink ribbed glass vase with price and buy buttons'),
    g('f226', 'Product page: price, quantity, trust badges', 'Product page for a ribbed glass bottle with a wooden lid, with delivery and returns badges'),
    g('f231', 'Product details and specifications', 'Product detail section listing key features and specifications'),
    g('f256', 'Recommendations with sale and sold-out states', 'A grid of recommended glassware with sale and sold-out labels'),
    {
      img: img('img/glasseria/f271-pay', 456, 268, [456], 'Checkout payment options: Cashfree, Razorpay and cash on delivery'),
      caption: 'Checkout: Cashfree, Razorpay or cash on delivery',
    },
  ],
};

export const vellora: CaseStudy = {
  id: 'vellora',
  order: 2,
  name: 'Vellora Escapes',
  kind: 'Travel company website',
  pitch: 'The first website a Lucknow travel company put in front of its travellers. I designed and built it.',
  stats: [
    { value: 'v1', label: 'the company’s first website' },
    { value: '4', label: 'kinds of trips: group, private, honeymoon, corporate' },
    { value: '0', label: 'frameworks. Hand-written HTML, CSS and JS' },
  ],
  summary:
    'The first website for Vellora Escapes, a Lucknow travel company that plans group trips, private getaways, honeymoons and corporate retreats. I designed and built it as a destination and package catalogue for the business.',
  facts: [
    { label: 'Role', value: 'Freelance. Design and development' },
    { label: 'Version', value: 'The first site. The business has rebuilt it since' },
    { label: 'Stack', value: 'HTML, CSS, JavaScript' },
    { label: 'Client', value: 'Vellora Escapes, Lucknow' },
  ],
  status: {
    state: 'rebuilt',
    text: 'velloraescapes.com is live, but the business has rebuilt it since my version. None of its current code is mine, so there are no screenshots here.',
  },
  built: [
    'Destination and package pages for the business’s real trip catalogue.',
    'Responsive layouts from phone to desktop.',
    'Interactive pages built from the business’s own travel requirements.',
  ],
  chain: ['HTML', 'CSS', 'JavaScript', 'Responsive layout'],
  links: [
    {
      label: 'Visit velloraescapes.com',
      href: 'https://www.velloraescapes.com/',
      note: 'their current site, rebuilt after my version',
    },
  ],
  frames: [],
};

const d = (file: string, caption: string, alt: string) => ({
  img: img(`img/dogindeed/${file}`, 1440, 720, [1440, 800], alt),
  caption,
});

export const dogindeed: CaseStudy = {
  id: 'dogindeed',
  order: 3,
  name: 'DogIndeed',
  kind: 'Pet-supplies storefront',
  pitch: 'A pet-supplies store built in production on a paid internship, down to every banner.',
  stats: [
    { value: '2', label: 'months, paid internship' },
    { value: 'All', label: 'banners and assets designed by me' },
    { value: '2', label: 'kinds of customer: dogs and cats' },
    { value: '8', label: 'pages in my LinkedIn walkthrough' },
  ],
  summary:
    'A Shopify store for DogIndeed, which sells supplies and care for dogs and cats. Over a two-month paid internship I built the frontend and the whole shopping journey, and designed every banner on it.',
  facts: [
    { label: 'Role', value: 'Paid internship. Frontend and visual design' },
    { label: 'Time', value: 'Dec 2025 – Jan 2026' },
    { label: 'Platform', value: 'Shopify' },
    { label: 'Design', value: 'All banners and assets made in Canva' },
  ],
  status: {
    state: 'offline',
    text: 'dogindeed.com is unreachable as of 3 Oct 2026. The screens below are from the walkthrough I published when the store was live.',
  },
  built: [
    'The storefront frontend and the user journey: navigation, browsing, product pages, cart and checkout.',
    'Every banner and visual asset on the store, designed in Canva.',
    'Shop-by-pet sections for dogs and cats, a category mega-menu, brand deals and a best-sellers carousel.',
    'Trust blocks for certified products, vet-approved brands and secure payments, plus customer reviews.',
    'Mobile layouts, checked on a Galaxy S20 Ultra profile in Chrome DevTools.',
  ],
  quote: {
    text: 'This was not a tutorial build. This was production.',
    source: 'From my LinkedIn post about the internship',
    href: 'https://www.linkedin.com/posts/suryanshhsingh_internship-project-activity-7445458786989027328-lJpO',
  },
  chain: ['Shopify', 'Liquid', 'CSS', 'JavaScript', 'Checkout', 'Canva assets'],
  links: [
    {
      label: 'See the 8-page walkthrough',
      href: 'https://www.linkedin.com/posts/suryanshhsingh_internship-project-activity-7445458786989027328-lJpO',
      note: 'LinkedIn post, Mar 2026',
    },
  ],
  address: 'dogindeed.com',
  phone: img('img/dogindeed/mobile', 323, 718, [323], 'DogIndeed on a phone: search bar, a dog and cat hero reading “Welcome to our pet store”, and category cards'),
  frames: [
    d('01-hero', 'Home: hero carousel', 'DogIndeed home page with a golden retriever and the line “Everything your pet needs, in one place”'),
    d('02-categories', 'Shop by pet: dogs and cats', 'Two large cards for dog and cat products under the line “India’s trusted platform for dog services, products and care”'),
    d('03-menu', 'Category mega-menu', 'An open menu with dog food, accessories, beds, treats and grooming over a cat banner'),
    d('05-brands', 'Brand deals', 'Brand cards for dog food labels with discount tags'),
    d('06-bestsellers', 'Best-sellers carousel', 'A best-seller carousel of shampoos and dog food with prices'),
    d('08-testimonials', 'Reviews and why-choose-us', 'Customer reviews titled “Loved by pets, trusted by parents” above four reasons to choose DogIndeed'),
    d('07-footer', 'Footer: support, newsletter, accepted payments', 'Black footer with support links, a newsletter form and payment card logos'),
  ],
};

export const caseStudies: CaseStudy[] = [glasseria, vellora, dogindeed];

/** Destinations listed on Vellora’s current site, for the departures board. */
export const velloraDestinations: { place: string; region: 'INTL' | 'INDIA' }[] = [
  { place: 'JAPAN', region: 'INTL' },
  { place: 'BALI', region: 'INTL' },
  { place: 'MALDIVES', region: 'INTL' },
  { place: 'EUROPE', region: 'INTL' },
  { place: 'DUBAI', region: 'INTL' },
  { place: 'SINGAPORE', region: 'INTL' },
  { place: 'KERALA', region: 'INDIA' },
  { place: 'SRINAGAR', region: 'INDIA' },
  { place: 'HIMACHAL', region: 'INDIA' },
  { place: 'JIBHI', region: 'INDIA' },
];

/* ------------------------------------------------------------------ */
/* Tier 2: the bench                                                   */
/* ------------------------------------------------------------------ */

const s = (base: string, alt: string) => img(base, 1440, 900, [1600, 900], alt);

export const bench: BenchProject[] = [
  {
    id: 'musichub',
    name: 'MusicHub',
    alias: 'Music application',
    summary:
      'A listening app with separate listener and artist accounts. Tracks play through Spotify’s embed API, and the app keeps each listener’s favourites and play history.',
    status: 'Not deployed. Runs locally',
    built: [
      'Sign-up and login with listener and artist roles, and route guards that send each role to its own home.',
      'A Redux Toolkit store hydrated from and saved to localStorage, so sessions survive a reload.',
      'A player on Spotify’s iFrame API whose playback events write a per-user recently-played list.',
      'Per-user favourites, and auth forms validated with React Hook Form.',
    ],
    notYet: [
      'The artist dashboard and uploads are placeholders.',
      'Accounts live in the browser. There is no backend yet.',
    ],
    stack: ['React 19', 'Vite', 'Redux Toolkit', 'React Router', 'React Hook Form', 'Tailwind CSS', 'Spotify iFrame API'],
    shots: [
      { label: 'Login', img: s('img/music/login', 'MusicHub login screen with a vinyl record and the words “Sound matters”') },
      { label: 'Home', img: s('img/music/home', 'MusicHub home screen greeting the listener, with a sidebar and a player panel') },
      { label: 'Sign-up', img: s('img/music/register', 'MusicHub sign-up screen with a choice between listener and artist accounts') },
    ],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/SuryanshhRajput/music-application' }],
    note: 'Screens rendered from the project’s own production build.',
  },
  {
    id: 'teamsync',
    name: 'TeamSync',
    summary:
      'An admin and employee workspace built against a REST API. Admins manage the company’s people, and employees get an area of their own, which is still being built.',
    status: 'Not deployed. Runs locally',
    built: [
      'Cookie-based login, with an Axios interceptor that refreshes the access token on a 401 and retries the request.',
      'Public, protected and role-based routes for admins and employees.',
      'An employee directory on TanStack Query: cached and paginated, with search, role, department and status filters and live counts.',
      'A multi-section add-employee form with photo upload, built with React Hook Form.',
    ],
    notYet: ['Tasks, departments, documents, chat, attendance and profile pages are routed but not built yet.'],
    stack: ['React 19', 'Vite', 'Redux Toolkit', 'TanStack Query', 'Axios', 'React Router', 'React Hook Form', 'Tailwind CSS'],
    shots: [
      { label: 'Directory', img: s('img/teamsync/employees', 'TeamSync employee directory with stat cards, filters and a table of employees') },
      { label: 'Add employee', img: s('img/teamsync/add', 'TeamSync add-employee form with photo upload and personal information fields') },
      { label: 'Login', img: s('img/teamsync/login', 'TeamSync sign-in card with Google and GitHub buttons and an email form') },
    ],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/SuryanshhRajput/Team-Sync' }],
    note: 'Screens rendered from the project’s build. The directory shows sample employees, because the API is not running.',
  },
];

export const minor: MinorProject[] = [
  {
    id: 'vidyaverse',
    name: 'VidyaVerse AI',
    year: '2025',
    summary:
      'Smart India Hackathon build: gamified physics for government-school students in grades 6 to 10, with separate student and teacher dashboards. I worked across the frontend and backend.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'React Testing Library'],
    links: [],
  },
  {
    id: 'safeclicks',
    name: 'SafeClicks',
    year: '2025',
    summary:
      'A team project that checks links for phishing. The app sends a link to an Express API, which looks it up in a MongoDB collection of known phishing URLs. I later redesigned its screens in Figma.',
    stack: ['Expo', 'React Native', 'TypeScript', 'Express', 'MongoDB'],
    links: [{ label: 'Code', href: 'https://github.com/SuryanshhRajput/SafeClicks' }],
  },
  {
    id: 'gesture-canvas',
    name: 'Gesture canvas',
    year: '2026',
    summary: 'Draw in the air with your finger: webcam hand tracking with MediaPipe, painted onto a canvas. Built out of curiosity.',
    stack: ['JavaScript', 'MediaPipe', 'Canvas API'],
    links: [],
  },
];
