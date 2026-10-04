/** A responsive image. Files live at `public/${base}-${width}.webp` for every width listed. */
export interface Img {
  base: string;
  widths: number[];
  /** Intrinsic aspect, used for width/height attributes so nothing shifts while loading. */
  w: number;
  h: number;
  alt: string;
}

export interface Link {
  label: string;
  href: string;
  /** Short note shown next to the link, e.g. "store offline since 2026". */
  note?: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface Frame {
  img: Img;
  caption: string;
}

export type CaseStatus = 'offline' | 'rebuilt' | 'live';

export interface CaseStudy {
  id: string;
  /** Position in the priority order, shown as 01 / 02 / 03. */
  order: number;
  name: string;
  kind: string;
  /** One bold line used on the shopfront and at the top of the case. */
  pitch: string;
  summary: string;
  /** Big numbers, each one a fact from the build. */
  stats: { value: string; label: string }[];
  facts: Fact[];
  status: { state: CaseStatus; text: string };
  built: string[];
  quote?: { text: string; source: string; href?: string };
  chain: string[];
  links: Link[];
  /** Screens shown in the scroll stage. Empty for text-led case studies. */
  frames: Frame[];
  /** Browser-bar address shown above the frames. */
  address?: string;
  phone?: Img;
  cover?: Img;
}

export interface BenchProject {
  id: string;
  name: string;
  alias?: string;
  summary: string;
  status: string;
  built: string[];
  notYet: string[];
  stack: string[];
  shots: { label: string; img: Img }[];
  links: Link[];
  note?: string;
}

export interface MinorProject {
  id: string;
  name: string;
  year: string;
  summary: string;
  stack: string[];
  links: Link[];
  preview?: Img;
}

/** A project that is live on the web right now. */
export interface LiveProject {
  id: string;
  name: string;
  /** What it is, in a few words. */
  what: string;
  /** Two or three sentences on what was built. */
  detail: string;
  /** A note on how it was made, from my own README or write-up. */
  making?: string;
  stack: string[];
  href: string;
  code?: string;
  img?: Img;
  /** True for the apps built with a framework; the rest are HTML and CSS exercises. */
  app?: boolean;
}

export interface Room {
  stat: string;
  statLabel: string;
  title: string;
  text: string;
  href?: string;
}

/** An event pass in the Off-screen chapter: one role at one event, told from my own posts. */
export interface Pass {
  id: string;
  role: string;
  event: string;
  org: string;
  when?: string;
  text: string;
  stat?: { value: string; label: string };
  img?: Img;
  /** Strap and header colour. */
  accent: string;
}
