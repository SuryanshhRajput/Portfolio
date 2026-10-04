/**
 * Skills, grouped four ways. Each one names where it was used: a project on
 * this page, an event pass in the Off-screen chapter, or my own write-up.
 */
export interface Skill {
  name: string;
  where: string;
}
export interface Deck {
  id: 'code' | 'commerce' | 'design' | 'people';
  title: string;
  blurb: string;
  colour: string;
  skills: Skill[];
}

export const decks: Deck[] = [
  {
    id: 'code',
    title: 'Code',
    blurb: 'Frontend first, backend on the way.',
    colour: '#ff5a1f',
    skills: [
      { name: 'React', where: 'Six apps, from MusicHub to the Zoom clone' },
      { name: 'Next.js', where: 'Zoom clone' },
      { name: 'TypeScript', where: 'Zoom clone, resume scanner, VidyaVerse, SafeClicks' },
      { name: 'JavaScript', where: 'Every storefront and app here' },
      { name: 'HTML and CSS', where: 'Ten live layout builds' },
      { name: 'Tailwind CSS', where: 'Six React apps' },
      { name: 'Redux Toolkit', where: 'MusicHub, TeamSync, Redux cart' },
      { name: 'TanStack Query', where: 'TeamSync' },
      { name: 'React Native', where: 'SafeClicks, with Expo' },
      { name: 'Node.js and Express', where: 'SafeClicks; learning it properly now' },
      { name: 'FastAPI', where: 'Zoom clone and resume scanner backends' },
      { name: 'MongoDB · SQLite · Firebase', where: 'SafeClicks · Zoom clone · VidyaVerse' },
      { name: 'C++', where: 'DSA, 150+ problems solved' },
      { name: 'MediaPipe', where: 'Gesture canvas: drawing in the air' },
      { name: 'Solidity', where: 'A hackathon build, back in my blockchain days' },
    ],
  },
  {
    id: 'commerce',
    title: 'Commerce',
    blurb: 'Stores that take real orders.',
    colour: '#ffb000',
    skills: [
      { name: 'Shopify and Liquid', where: 'Glasseria and DogIndeed' },
      { name: 'Payment gateways', where: 'Cashfree, Razorpay and COD on Glasseria' },
      { name: 'Shipping integration', where: 'Glasseria' },
      { name: 'Meta Pixel', where: 'Glasseria' },
      { name: 'Working with founders', where: 'All three stores on the street' },
      { name: 'Digital marketing', where: 'Ran my own dropshipping store' },
    ],
  },
  {
    id: 'design',
    title: 'Design',
    blurb: 'I design what I build.',
    colour: '#e8336d',
    skills: [
      { name: 'UI design', where: 'Every storefront on the street' },
      { name: 'Figma', where: 'SafeClicks redesign' },
      { name: 'Canva', where: 'All of DogIndeed’s banners' },
      { name: 'Graphic design', where: 'Design Head on a college event team' },
    ],
  },
  {
    id: 'people',
    title: 'People',
    blurb: 'The off-screen half.',
    colour: '#19c38a',
    skills: [
      { name: 'Event management', where: 'Innovate 2025, PARALLAX 1.0, ARCADE' },
      { name: 'Team leadership', where: 'A twenty-person hospitality team at Zenevia' },
      { name: 'Public speaking', where: 'NSS digital skills class; anchored PARALLAX' },
      { name: 'Hosting guests', where: 'Manav Gupta and 12+ guests at Zenevia' },
      { name: 'Club operations', where: 'COO of AltReality, the #1 club' },
      { name: 'Outreach', where: 'Bennett placement committee' },
    ],
  },
];
