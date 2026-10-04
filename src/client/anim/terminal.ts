/**
 * The hero terminal. The full text is in the HTML; with motion allowed it is
 * cleared once script runs and typed back in, command by command, with a caret.
 */
export interface Terminal {
  play(): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function initTerminal(reduced: boolean): Terminal | null {
  const term = document.querySelector<HTMLElement>('.term');
  const body = term?.querySelector<HTMLElement>('[data-term]');
  if (!term || !body) return null;
  const caret = term.querySelector<HTMLElement>('.term__caret');
  const lines = Array.from(body.querySelectorAll<HTMLElement>('.term__line'));

  const placeCaret = (el: HTMLElement) => {
    if (!caret) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const r = range.getClientRects()[0] ?? el.getBoundingClientRect();
    const t = term.getBoundingClientRect();
    caret.style.left = `${r.right - t.left + 2}px`;
    caret.style.top = `${r.top - t.top + (r.height - caret.offsetHeight) / 2}px`;
  };

  if (reduced) {
    term.classList.add('is-done');
    const last = lines[lines.length - 1]?.querySelector<HTMLElement>('.term__out [data-type]');
    if (last) requestAnimationFrame(() => placeCaret(last));
    return { play: () => Promise.resolve() };
  }

  const spans = lines.map((l) => Array.from(l.querySelectorAll<HTMLElement>('[data-type]')));
  const texts = spans.map((s) => s.map((el) => el.textContent ?? ''));
  body.setAttribute('aria-hidden', 'true');
  spans.flat().forEach((el) => (el.textContent = ''));
  lines.forEach((l) => l.classList.add('is-hidden'));

  const type = async (el: HTMLElement, text: string, ms: number) => {
    for (let i = 1; i <= text.length; i++) {
      el.textContent = text.slice(0, i);
      placeCaret(el);
      if (ms) await wait(ms + (Math.random() - 0.5) * ms * 0.6);
    }
  };

  return {
    async play() {
      term.classList.add('is-typing');
      for (let i = 0; i < lines.length; i++) {
        lines[i]!.classList.remove('is-hidden');
        const [cmd, out] = spans[i]!;
        if (cmd) await type(cmd, texts[i]![0]!, 34);
        await wait(160);
        if (out) await type(out, texts[i]![1]!, 7);
        await wait(240);
      }
      term.classList.remove('is-typing');
      term.classList.add('is-done');
      body.removeAttribute('aria-hidden');
      window.addEventListener('resize', () => {
        const last = spans[spans.length - 1]?.[1];
        if (last) placeCaret(last);
      });
    },
  };
}
