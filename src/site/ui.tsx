import type { ReactNode } from 'react';
import type { Img, Link } from '../content/types.js';

/** A responsive <img> from an Img record. */
export function Picture({
  img,
  sizes,
  eager = false,
  className,
}: {
  img: Img;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const widths = [...img.widths].sort((a, b) => a - b);
  const largest = widths[widths.length - 1]!;
  const srcSet = widths.map((w) => `${img.base}-${w}.webp ${w}w`).join(', ');
  return (
    <img
      className={className}
      src={`${img.base}-${largest}.webp`}
      srcSet={widths.length > 1 ? srcSet : undefined}
      sizes={widths.length > 1 ? sizes : undefined}
      width={img.w}
      height={img.h}
      alt={img.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
    />
  );
}

export const srcFor = (img: Img, width?: number) => {
  const widths = [...img.widths].sort((a, b) => a - b);
  const w = width ? (widths.find((x) => x >= width) ?? widths[widths.length - 1]!) : widths[widths.length - 1]!;
  return `${img.base}-${w}.webp`;
};

/** External link that opens in a new tab and says so to screen readers. */
export function Ext({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="vh"> (opens in a new tab)</span>
    </a>
  );
}

export function Arrow({ dir = 'ne' }: { dir?: 'ne' | 'down' | 'right' }) {
  const d = dir === 'ne' ? 'M4 12 12 4M5.5 4H12v6.5' : dir === 'down' ? 'M8 3v10M3.5 8.5 8 13l4.5-4.5' : 'M3 8h10M8.5 3.5 13 8l-4.5 4.5';
  return (
    <svg className="arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function LinkList({ links }: { links: Link[] }) {
  if (!links.length) return null;
  return (
    <ul className="linklist" role="list">
      {links.map((l) => (
        <li key={l.href}>
          <Ext href={l.href} className="linklist__a">
            <span className="linklist__label">{l.label}</span>
            <Arrow />
          </Ext>
          {l.note ? <span className="linklist__note">{l.note}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/** A tool chain: the stack read left to right, like the order things were wired together. */
export function Chain({ items, label }: { items: string[]; label: string }) {
  return (
    <div className="chain">
      <p className="label">{label}</p>
      <ol className="chain__list">
        {items.map((it) => (
          <li key={it} className="chain__item">
            {it}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags" role="list">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
