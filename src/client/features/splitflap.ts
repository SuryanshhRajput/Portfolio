import { $$, prefersReducedMotion, whenNear } from '../lib/core.js';

/**
 * Vellora's departures board. Each character cell cycles through letters and
 * lands on its real character, like a split-flap display. The final text is in
 * the HTML from the start; this only animates it.
 */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function flipCell(cell: HTMLElement, delay: number): void {
  const target = cell.dataset.ch ?? ' ';
  if (target === ' ') return;
  const steps = 5 + Math.floor(Math.random() * 7);
  let n = 0;
  window.setTimeout(function step() {
    cell.classList.remove('tick');
    void cell.offsetWidth; // restart the flap animation
    cell.classList.add('tick');
    cell.textContent = n < steps ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]! : target;
    if (n++ < steps) window.setTimeout(step, 55);
  }, delay);
}

function flipRow(row: HTMLElement, base = 0): void {
  $$('.flap', row).forEach((cell, i) => flipCell(cell, base + i * 28));
}

export function initSplitFlap(): void {
  if (prefersReducedMotion()) return;
  $$('[data-board]').forEach((board) => {
    const rows = $$('.board__row', board);
    let done = false;
    whenNear(
      board,
      () => {
        if (done) return;
        done = true;
        rows.forEach((row, i) => flipRow(row, i * 90));
      },
      undefined,
      '-20% 0px',
    );
    rows.forEach((row) => {
      let busy = false;
      row.addEventListener('pointerenter', () => {
        if (busy) return;
        busy = true;
        flipRow(row);
        window.setTimeout(() => (busy = false), 900);
      });
    });
  });
}
