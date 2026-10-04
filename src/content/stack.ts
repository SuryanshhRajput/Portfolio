/**
 * The stack map. Every tool is listed against the projects that actually use it,
 * checked against each repo's package.json or the project's own write-up.
 */
export const stackProjects = [
  { id: 'glasseria', short: 'GLS', name: 'Glasseria', href: '#glasseria' },
  { id: 'vellora', short: 'VEL', name: 'Vellora Escapes (v1)', href: '#vellora' },
  { id: 'dogindeed', short: 'DOG', name: 'DogIndeed', href: '#dogindeed' },
  { id: 'musichub', short: 'MUS', name: 'MusicHub', href: '#musichub' },
  { id: 'teamsync', short: 'TSY', name: 'TeamSync', href: '#teamsync' },
  { id: 'zoom', short: 'ZMC', name: 'Zoom clone', href: '#zoom' },
  { id: 'redux-cart', short: 'CRT', name: 'Redux cart', href: '#redux-cart' },
  { id: 'resume-scanner', short: 'RSM', name: 'AI resume scanner', href: '#resume-scanner' },
  { id: 'vidyaverse', short: 'VDY', name: 'VidyaVerse AI', href: '#vidyaverse' },
  { id: 'safeclicks', short: 'SFC', name: 'SafeClicks', href: '#safeclicks' },
  { id: 'live-builds', short: 'LIV', name: 'Ten live HTML/CSS builds', href: '#live' },
] as const;

export type StackProjectId = (typeof stackProjects)[number]['id'];

export interface StackRow {
  tool: string;
  used: StackProjectId[];
}

export const stackGroups: { group: string; rows: StackRow[] }[] = [
  {
    group: 'Storefront',
    rows: [
      { tool: 'Shopify + Liquid', used: ['glasseria', 'dogindeed'] },
      { tool: 'Checkout and payments', used: ['glasseria', 'dogindeed'] },
      { tool: 'Shipping integration', used: ['glasseria'] },
      { tool: 'Meta Pixel', used: ['glasseria'] },
    ],
  },
  {
    group: 'Frontend',
    rows: [
      { tool: 'HTML and CSS', used: ['glasseria', 'vellora', 'dogindeed', 'live-builds'] },
      { tool: 'JavaScript', used: ['glasseria', 'vellora', 'dogindeed', 'musichub', 'teamsync', 'redux-cart', 'live-builds'] },
      { tool: 'TypeScript', used: ['zoom', 'resume-scanner', 'vidyaverse', 'safeclicks'] },
      { tool: 'React', used: ['musichub', 'teamsync', 'redux-cart', 'zoom', 'resume-scanner', 'vidyaverse'] },
      { tool: 'Next.js', used: ['zoom'] },
      { tool: 'React Native (Expo)', used: ['safeclicks'] },
      { tool: 'Tailwind CSS', used: ['musichub', 'teamsync', 'redux-cart', 'zoom', 'resume-scanner', 'vidyaverse'] },
    ],
  },
  {
    group: 'State and data',
    rows: [
      { tool: 'Redux Toolkit', used: ['musichub', 'teamsync', 'redux-cart'] },
      { tool: 'TanStack Query', used: ['teamsync'] },
      { tool: 'React Router', used: ['musichub', 'teamsync', 'redux-cart'] },
      { tool: 'React Hook Form', used: ['musichub', 'teamsync', 'zoom'] },
      { tool: 'Axios', used: ['teamsync', 'zoom', 'safeclicks'] },
    ],
  },
  {
    group: 'Backend',
    rows: [
      { tool: 'FastAPI (Python)', used: ['zoom', 'resume-scanner'] },
      { tool: 'Express (Node.js)', used: ['safeclicks'] },
      { tool: 'SQLite', used: ['zoom'] },
      { tool: 'MongoDB', used: ['safeclicks'] },
      { tool: 'Firebase', used: ['vidyaverse'] },
      { tool: 'scikit-learn', used: ['resume-scanner'] },
    ],
  },
  {
    group: 'Design',
    rows: [
      { tool: 'Canva', used: ['dogindeed'] },
      { tool: 'Figma', used: ['safeclicks'] },
    ],
  },
];
