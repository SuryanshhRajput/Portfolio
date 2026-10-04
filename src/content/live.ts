import type { Img, LiveProject } from './types.js';

/**
 * Every project from my previous portfolio that is live right now, plus the
 * resume scanner. The old site listed 15 cards; three of them were the same app
 * deployed twice, so this is the full set of distinct builds.
 *
 * Screens were captured from the live URLs in October 2026.
 */
const shot = (id: string, alt: string): Img => ({ base: `img/live/${id}`, widths: [1440, 760], w: 1440, h: 900, alt });
const REPO = 'https://github.com/SuryanshhRajput/Task-Projects/tree/main';

/** Where the island version of this portfolio is deployed. */
export const ISLAND_URL = 'https://suryansh-island.vercel.app/';

export const liveProjects: LiveProject[] = [
  {
    id: 'island',
    name: 'Suryansh’s Island',
    what: 'This portfolio, as a 3D world',
    detail:
      'A second take on this site: a hand-drawn island you can drag around and zoom into. Tap a building and the camera flies to it, the building opens up and its part of my work unrolls beside it. Every building is made in code, a custom shader draws the scene in ink and watercolour, and day and night follow the real sun over Greater Noida.',
    making: 'An experiment in turning a portfolio into a place.',
    stack: ['Three.js', 'GLSL shaders', 'GSAP', 'TypeScript', 'Web Audio'],
    href: ISLAND_URL,
    code: 'https://github.com/SuryanshhRajput/suryansh-island',
    img: shot('island', 'A hand-drawn 3D island with labelled buildings: an observatory under a sun, a market street, an arcade, a library tower and a stage'),
    app: true,
  },
  {
    id: 'zoom',
    name: 'Zoom clone',
    what: 'Full-stack meeting app',
    detail:
      'Instant and scheduled meetings, joining by ID or link, and a meeting room that switches on your webcam. Next.js 16 on the front, a FastAPI backend split into routes, services and repositories.',
    making: 'A full-stack take-home assignment.',
    stack: ['Next.js 16', 'TypeScript', 'shadcn/ui', 'FastAPI', 'SQLAlchemy', 'SQLite'],
    href: 'https://zoom-clone-nine-cyan.vercel.app/dashboard',
    code: 'https://github.com/SuryanshhRajput/ZOOM-CLONE',
    img: shot('zoom', 'Zoom clone dashboard: a welcome message and quick actions for new, join, schedule and share screen'),
    app: true,
  },
  {
    id: 'redux-cart',
    name: 'Redux cart',
    what: 'Storefront on one Redux slice',
    detail: 'A product grid, cart, totals and badge, all driven by a single Redux Toolkit slice.',
    making: 'Built for a Sheryians Coding School mini-hackathon, before Redux Toolkit had been taught. I learned it from the docs.',
    stack: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Vite'],
    href: 'https://shopping-cart-jade-delta.vercel.app/',
    code: 'https://github.com/SuryanshhRajput/Shopping-cart',
    img: shot('cart', 'Redux Cart storefront with a dark banner and product cards for a lamp, headphones and a backpack'),
    app: true,
  },
  {
    id: 'resume-scanner',
    name: 'ResumeAI',
    what: 'AI resume scanner',
    detail:
      'Upload a resume PDF and get its likely job category, predicted with TF-IDF and logistic regression, with keyword weighting as a fallback. A FastAPI service does the work and OpenAI suggests next steps.',
    making: 'Built at a friend’s request. The interface was scaffolded with Lovable.',
    stack: ['FastAPI', 'scikit-learn', 'pdfplumber', 'OpenAI API', 'React', 'TypeScript'],
    href: 'https://ai-resume-scanner-chi.vercel.app/',
    code: 'https://github.com/SuryanshhRajput/AI-Resume-Scanner',
    img: shot('resume', 'ResumeAI landing page with the heading “AI Resume Scanner” and an upload button'),
    app: true,
  },
  {
    id: 'basecamp',
    name: 'Basecamp',
    what: 'Productivity dashboard',
    detail:
      'A bento-grid workspace with a todo list, an hourly planner, daily goals with a progress bar, a Pomodoro timer and a focus-minutes tracker. Tasks and the light or dark theme survive a reload through localStorage.',
    making: 'Plain HTML, CSS and JavaScript. No framework and no external APIs.',
    stack: ['HTML', 'CSS Grid', 'JavaScript', 'localStorage'],
    href: 'https://suryansh-productivity-dashboard.vercel.app/',
    code: `${REPO}/Productivity-dashboard`,
    img: shot('basecamp', 'Basecamp dashboard with tiles for the todo list, planner, focus session, goals and motivation'),
    app: true,
  },
  {
    id: 'digital-hunters',
    name: 'Digital Hunters',
    what: 'Game studio landing page',
    detail: 'A sci-fi landing page for a mobile and XR game studio, with a service list and a stats band.',
    making: 'HTML and CSS only, laid out with positioning and flexbox. About five hours.',
    stack: ['HTML', 'CSS', 'Flexbox'],
    href: 'https://gaming-dashboard-red.vercel.app/',
    code: `${REPO}/task-3/hard`,
    img: shot('hunters', 'Digital Hunters landing page with an armoured figure and the line “Mobile & XR game development studio”'),
  },
  {
    id: 'butusic',
    name: 'BUTUSIC',
    what: 'Exhibition landing page',
    detail: 'A bento-style page for an illustration exhibition: navigation, ratings, an app-store card and big character art.',
    making: 'CSS Grid and Flexbox only.',
    stack: ['HTML', 'CSS Grid', 'Flexbox'],
    href: 'https://grid-dashboard-chi.vercel.app/',
    code: `${REPO}/Task-4/Task-4.1`,
    img: shot('butusic', 'BUTUSIC exhibition page laid out as a bento grid of purple, lime and black tiles'),
  },
  {
    id: 'two-leaves',
    name: 'Two Leaves and a Bud',
    what: 'Tea brand landing page',
    detail: 'A tea brand’s landing page, designed mobile-first and carried up to desktop, with a scroll-snap card slider.',
    making: 'HTML and CSS only, with media queries for the breakpoints.',
    stack: ['HTML', 'CSS', 'Media queries', 'Scroll snap'],
    href: 'https://suryansh-singh-responsive-landing-p.vercel.app/',
    code: `${REPO}/Responsive-assignment`,
    img: shot('twoleaves', 'Two Leaves and a Bud landing page with iced teas and the heading “Nice Over Ice”'),
  },
  {
    id: 'loome',
    name: 'loomé',
    what: 'Scarf product page',
    detail: 'A product page for a cotton twill scarf, with colour swatches, a thumbnail rail, details and trust badges.',
    making: 'My first task. Flexbox and positioning only.',
    stack: ['HTML', 'CSS', 'Flexbox'],
    href: 'https://product-page-eight-nu.vercel.app/',
    code: `${REPO}/task1`,
    img: shot('scarf', 'loomé product page with the heading “a cotton weave” and a model wearing the scarf'),
  },
  {
    id: 'insights',
    name: 'Insights & Blogs',
    what: 'Blog index',
    detail: 'A dark blog index with category chips and image-led article cards.',
    making: 'Built in 20 minutes, with flexbox only.',
    stack: ['HTML', 'CSS', 'Flexbox'],
    href: 'https://blog-dashboard-phi-three.vercel.app/',
    code: `${REPO}/task2/task2-EASY`,
    img: shot('blog', 'Insights & Blogs page with a giant heading and three red-toned article cards'),
  },
  {
    id: 'gunaforycter',
    name: 'Gunaforycter',
    what: 'Juice bar menu',
    detail: 'A drinks menu for a juice and cocktail bar, with priced cards and a chef’s special.',
    stack: ['HTML', 'CSS'],
    href: 'https://juice-shop-iota-kohl.vercel.app/',
    code: `${REPO}/task2/task2-Medium`,
    img: shot('juice', 'Dark drinks menu with four glasses: Sunset Flame, Tropical Passion, Citrus Dawn and Berry Breeze'),
  },
  {
    id: 'insect',
    name: 'INSECT',
    what: 'Specimen product page',
    detail: 'A collector’s product page for a beetle under glass, with its full classification on a split two-colour layout.',
    making: 'Flexbox and positioning only.',
    stack: ['HTML', 'CSS', 'Flexbox'],
    href: 'https://task-projects-eati.vercel.app/',
    code: `${REPO}/task2/task2-hard`,
    img: shot('specimen', 'INSECT product page with a beetle under a glass dome beside its classification'),
  },
  {
    id: 'art-auction',
    name: 'Art auction',
    what: 'Marketplace grid',
    detail: 'An “Explore Art Work” grid for an art marketplace, with like counts and bid buttons on every piece.',
    stack: ['HTML', 'CSS'],
    href: 'https://task-projects-dnah.vercel.app/',
    code: `${REPO}/task-3/easy`,
    img: { base: 'img/live/auction', widths: [640], w: 640, h: 365, alt: 'Two artwork cards from the auction grid, Light Moon and Skull Wiro, with Place Bid buttons' },
  },
  {
    id: 'dribbble-gallery',
    name: 'Dribbble-style gallery',
    what: 'Design showcase landing',
    detail: 'A Dribbble-like landing page with a gallery of shots, hover overlays on images and video, and an author row under each card.',
    making: 'I picked the hardest task in the set and finished it in one night, about six hours.',
    stack: ['HTML', 'CSS'],
    href: 'https://task-5-suryansh-rajput.vercel.app/',
    code: `${REPO}/task-5`,
  },
];
