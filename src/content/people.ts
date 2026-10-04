import type { Pass, Room } from './types.js';

export const about = [
  'I’m a final-year B.Tech CSE student at Bennett University. I started in blockchain: an NFT minted on Sepolia, a Hyperledger Fabric test network, a Solidity hackathon build. Then I moved to the web, where most of my real work has happened since.',
  'First came Shopify storefronts for real clients. Then React apps, built to learn state, data fetching and auth properly. Now I’m learning the backend those frontends talk to.',
];

/** Things that happened in rooms full of people, each checked against my own posts or resume. */
export const rooms: Room[] = [
  {
    stat: '#1',
    statLabel: 'club at Bennett',
    title: 'AltReality, the AR/VR club',
    text: 'As COO I helped rebuild a mostly inactive club into a working team. It was named the university’s top club and featured during its NIRF ranking drive.',
  },
  {
    stat: '7',
    statLabel: 'screenings, 6+ hours',
    title: 'PARALLAX 1.0',
    text: 'Bennett’s first 3D movie night, built around a Blender film of our own campus. Bookings filled in under a minute. I organised it and anchored the show.',
  },
  {
    stat: '2.5 h',
    statLabel: 'scavenger hunt',
    title: 'ARCADE',
    text: 'An AR/VR hunt in which teams scanned markers through our website to reveal creatures to catch. I organised it as COO, with a sponsor on board.',
  },
  {
    stat: '2 days',
    statLabel: 'multi-venue hackathon',
    title: 'Microsoft Innovate Hackathon 2025',
    text: 'I led its organisation with university leadership, faculty, the placement team and Microsoft. At the awarding ceremony the SCSET Dean named me Overall Champion for it.',
  },
  {
    stat: '20',
    statLabel: 'people on my team',
    title: 'Zenevia, the annual tech fest',
    text: 'As Hospitality Head I ran a twenty-person team looking after 12+ guests, speakers and judges over three days.',
  },
  {
    stat: 'NSS',
    statLabel: 'digital skills class',
    title: 'Teaching the campus security team',
    text: 'In a programme run by NSS and the SCSET student cabinet, I taught campus security guards to write emails, keep records in Excel and enhance surveillance images.',
  },
];

export const alsoHeld = [
  'Leadership roles in GDG, GFG and NSS chapters',
  'Bennett placement committee',
  'Smart India Hackathon, two years running',
];

export const learning = {
  now: [
    {
      title: 'Backend',
      text: 'Node.js and Express. The goal is to write the APIs my frontends call.',
    },
    {
      title: 'DSA',
      text: 'Working through Striver’s DSA sheet, with 150+ problems solved across LeetCode, GeeksforGeeks and HackerRank.',
      link: { label: 'Codolio profile', href: 'https://codolio.com/profile/Suryanshh' },
    },
  ],
  proof: [
    { label: 'AWS Academy Graduate, Cloud Foundations', meta: 'AWS Academy, 2025', href: 'https://www.credly.com/go/mcrp8nMe' },
    { label: '“Achiever in Recursion” badge, top 0.5% on the platform', meta: 'Naukri Code360' },
    { label: 'Data Structures', meta: 'UC San Diego, 2024' },
    { label: 'Dynamic Programming, Greedy Algorithms', meta: 'CU Boulder, 2025' },
    { label: 'Blockchain Platforms', meta: 'SUNY, 2025' },
  ],
};

const shot = (name: string, widths: number[], w: number, h: number, alt: string) => ({
  base: `img/offscreen/${name}`,
  widths,
  w,
  h,
  alt,
});

/** The groups I worked in, as named in my farewell post to college leadership roles. */
export const groups = [
  'AltReality, Bennett University',
  'NSS Bennett University',
  'SCSET Student Cabinet',
  'GDG On Campus, Bennett',
  'GeeksforGeeks Student Chapter',
];

export const badgesPhoto = shot(
  'badges',
  [420, 720],
  720,
  402,
  'A pile of event lanyards and passes from Zenevia, Innovate 2025, Converge 3.0, NSS, the Student Cabinet and AltReality, including a Design Head badge',
);

/** Event passes, each told from one of my LinkedIn posts or my resume. Photos are from those posts. */
export const passes: Pass[] = [
  {
    id: 'innovate',
    role: 'Overall Champion',
    event: 'Microsoft Innovate Hackathon 2025',
    org: 'Hosted by AltReality with Microsoft',
    when: 'Feb 2025',
    text: 'I led the organising of a two-day, multi-venue hackathon with faculty, the placement team and Microsoft. At the closing ceremony the SCSET Dean named me Overall Champion for that work. It’s still my most-read post.',
    stat: { value: '2 days', label: 'multi-venue' },
    img: shot('innovate-award', [420, 605], 605, 643, 'Suryansh receiving a Microsoft backpack at the Innovate 2025 closing ceremony'),
    accent: '#ff5a1f',
  },
  {
    id: 'zenevia-host',
    role: 'Host',
    event: 'Zenevia, Bennett’s tech fest',
    org: 'Guest: Manav Gupta, “Tensor Boy”',
    text: 'I hosted Manav Gupta, the AI engineer and creator known as Tensor Boy, through the fest, and spent the days meeting people building in tech.',
    img: shot('zenevia-manav', [420, 720], 720, 960, 'Suryansh with Manav Gupta in front of the Times Group history wall'),
    accent: '#e8336d',
  },
  {
    id: 'zenevia-hospitality',
    role: 'Hospitality Head',
    event: 'Zenevia and Uphoria fests',
    org: 'Bennett University',
    text: 'I ran a twenty-person team looking after 12+ guests, speakers and judges across the fest’s three days.',
    stat: { value: '20', label: 'people on my team' },
    img: shot('zenevia-team', [420, 553], 553, 737, 'Suryansh with two members of the Zenevia team at the Times Group wall'),
    accent: '#7b5cff',
  },
  {
    id: 'nss',
    role: 'Speaker',
    event: 'Digital Skills Training Program',
    org: 'NSS BU × Cabinet SCSET',
    when: 'Feb 2025',
    text: 'I taught the campus security team to write emails, keep records in Excel and enhance CCTV images.',
    img: shot('nss-class', [420, 521], 521, 585, 'Suryansh speaking to a room of campus security staff'),
    accent: '#2f8cff',
  },
  {
    id: 'altreality',
    role: 'COO',
    event: 'AltReality, the AR/VR club',
    org: 'Bennett University',
    text: 'I helped turn a mostly inactive club into a working team. It was named the university’s #1 club. Our first flagship, PARALLAX 1.0, was Bennett’s first 3D movie night: 750+ attendees, booked out in under a minute.',
    stat: { value: '#1', label: 'club at Bennett' },
    accent: '#19c38a',
  },
  {
    id: 'arcade',
    role: 'Organiser',
    event: 'ARCADE',
    org: 'AltReality × Coffee Vault',
    text: 'A 2.5-hour AR/VR scavenger hunt: teams scanned markers through the club’s website to reveal creatures to catch.',
    stat: { value: '2.5 h', label: 'scavenger hunt' },
    accent: '#ffb000',
  },
];
