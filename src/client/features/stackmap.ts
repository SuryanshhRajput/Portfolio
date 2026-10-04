import { $, $$ } from '../lib/core.js';

/**
 * The stack table: pointing at a tool lights the projects that use it, and
 * pointing at a project lights the tools it uses. Works on hover and on focus.
 */
export function initStackMap(): void {
  const table = $<HTMLTableElement>('[data-stackmap]');
  if (!table) return;
  const cells = $$<HTMLElement>('[data-r], [data-c]', table);
  const summary = $('[data-stack-summary]');
  const defaultSummary = summary?.textContent ?? '';

  const clear = () => {
    table.classList.remove('is-focusing');
    cells.forEach((c) => c.classList.remove('is-hot', 'is-hit'));
    if (summary) summary.textContent = defaultSummary;
  };

  const light = (r: string | undefined, c: string | undefined) => {
    clear();
    table.classList.add('is-focusing');
    if (r !== undefined && c === undefined) {
      // A tool: its row, plus the projects that use it.
      const used = cells.filter((el) => el.dataset.r === r && el.dataset.used === 'true');
      cells.filter((el) => el.dataset.r === r).forEach((el) => el.classList.add('is-hot'));
      const cols = new Set(used.map((el) => el.dataset.c));
      cells.filter((el) => el.tagName === 'TH' && el.dataset.c && cols.has(el.dataset.c)).forEach((el) => el.classList.add('is-hit'));
      used.forEach((el) => el.classList.add('is-hit'));
      const tool = cells.find((el) => el.tagName === 'TH' && el.dataset.r === r)?.dataset.label;
      if (summary && tool) summary.textContent = `${tool}: ${used.length} project${used.length === 1 ? '' : 's'}`;
    } else if (c !== undefined && r === undefined) {
      // A project: its column, plus the tools it uses.
      const used = cells.filter((el) => el.dataset.c === c && el.dataset.used === 'true');
      cells.filter((el) => el.dataset.c === c).forEach((el) => el.classList.add('is-hot'));
      const rows = new Set(used.map((el) => el.dataset.r));
      cells.filter((el) => el.tagName === 'TH' && el.dataset.r && rows.has(el.dataset.r)).forEach((el) => el.classList.add('is-hit'));
      used.forEach((el) => el.classList.add('is-hit'));
      const name = cells.find((el) => el.tagName === 'TH' && el.dataset.c === c)?.dataset.label;
      if (summary && name) summary.textContent = `${name}: ${used.length} tools`;
    } else if (r !== undefined && c !== undefined) {
      cells.filter((el) => el.dataset.r === r || el.dataset.c === c).forEach((el) => el.classList.add('is-hot'));
      cells.filter((el) => el.dataset.r === r && el.dataset.c === c).forEach((el) => el.classList.add('is-hit'));
    }
  };

  const fromEvent = (e: Event) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-r], [data-c]');
    if (!el || !table.contains(el)) return;
    light(el.dataset.r, el.dataset.c);
  };
  table.addEventListener('pointerover', fromEvent);
  table.addEventListener('focusin', fromEvent);
  table.addEventListener('pointerleave', clear);
  table.addEventListener('focusout', (e) => {
    if (!table.contains(e.relatedTarget as Node)) clear();
  });
}
