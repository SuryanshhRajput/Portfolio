import { $, $$, hasFinePointer, prefersReducedMotion, rafThrottle } from '../lib/core.js';

/**
 * The fixed frame around the page: live clock, the chapter rail, colour tone
 * of the fixed UI, the index dialog, copy-to-clipboard and magnetic buttons.
 */

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kolkata',
});

export function initClock(): void {
  const els = $$('[data-clock]');
  if (!els.length) return;
  const update = () => {
    const t = timeFmt.format(new Date());
    els.forEach((el) => (el.textContent = t));
  };
  update();
  // Align to the next minute boundary, then tick every minute.
  window.setTimeout(() => {
    update();
    window.setInterval(update, 60000);
  }, 60000 - (Date.now() % 60000));
}

/**
 * Sections declare `data-tone="light|dark|sky"`. The fixed UI at the top and at
 * the bottom of the screen takes the tone of whatever is behind it.
 */
export function initTone(): void {
  const sections = $$('[data-tone]');
  const root = document.documentElement;
  const toneAt = (y: number): string => {
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) {
        const t = s.dataset.tone!;
        return t === 'sky' ? (root.dataset.sky === 'night' ? 'dark' : 'light') : t;
      }
    }
    return 'light';
  };
  const contact = document.getElementById('contact');
  const hero = document.getElementById('top');
  let lastY = window.scrollY;
  const update = () => {
    const y = window.scrollY;
    const atEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 4;
    if (y > lastY + 6 && !atEnd) root.classList.add('scroll-down');
    else if (y < lastY - 6 || atEnd) root.classList.remove('scroll-down');
    if (Math.abs(y - lastY) > 6) lastY = y;
    root.dataset.toneTop = toneAt(28);
    root.dataset.toneMid = toneAt(window.innerHeight / 2);
    root.dataset.toneBottom = toneAt(window.innerHeight - 36);
    root.classList.toggle('at-contact', !!contact && contact.getBoundingClientRect().top < window.innerHeight * 0.55);
    // The hero has its own calls to action, so the dock waits until the visitor moves on.
    root.classList.toggle('at-hero', !!hero && hero.getBoundingClientRect().bottom > window.innerHeight * 0.75);
  };
  const onScroll = rafThrottle(update);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  new MutationObserver(onScroll).observe(root, { attributes: true, attributeFilter: ['data-sky'] });
  update();
}

/** The left rail: marks the current chapter and moves the sun marker along it. */
export function initRail(): void {
  const rail = $('.rail');
  if (!rail) return;
  const links = $$<HTMLAnchorElement>('.rail a', rail);
  const marker = $('.rail__sun', rail);
  const targets = links
    .map((a) => ({ a, el: document.getElementById(a.hash.slice(1)) }))
    .filter((t): t is { a: HTMLAnchorElement; el: HTMLElement } => !!t.el);

  const update = () => {
    const mid = window.innerHeight * 0.4;
    let active = targets[0];
    for (const t of targets) {
      if (t.el.getBoundingClientRect().top <= mid) active = t;
    }
    targets.forEach((t) => {
      const on = t === active;
      t.a.classList.toggle('is-active', on);
      if (on) t.a.setAttribute('aria-current', 'true');
      else t.a.removeAttribute('aria-current');
    });
    if (active && marker) {
      const li = active.a.parentElement!;
      marker.style.transform = `translateY(${li.offsetTop + li.offsetHeight / 2}px)`;
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    rail.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0));
  };
  const onScroll = rafThrottle(update);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/** Full-screen index of every chapter and project, on a native <dialog>. */
export function initIndex(): void {
  const dialog = $<HTMLDialogElement>('#index');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const openers = $$('[data-open-index]');
  const open = () => {
    dialog.showModal();
    document.documentElement.classList.add('index-open');
  };
  const close = () => dialog.close();
  openers.forEach((b) => b.addEventListener('click', open));
  $$('[data-close-index]', dialog).forEach((b) => b.addEventListener('click', close));
  dialog.addEventListener('close', () => document.documentElement.classList.remove('index-open'));
  // Clicking the backdrop (the dialog box itself, outside its content) closes it.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // Following a link inside the index closes it first, so the page can scroll.
  $$<HTMLAnchorElement>('a[href^="#"]', dialog).forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (e.key.toLowerCase() !== 'i' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (dialog.open) close();
    else open();
  });
}

/** Copy buttons: `data-copy="text"`. Falls back to selecting the text if the clipboard is refused. */
export function initCopy(): void {
  $$<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    const label = btn.querySelector('[data-copy-label]') ?? btn;
    const original = label.textContent;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy!;
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        const target = btn.dataset.copyTarget ? document.getElementById(btn.dataset.copyTarget) : null;
        if (target) {
          const range = document.createRange();
          range.selectNodeContents(target);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }
      label.textContent = ok ? 'Copied' : 'Address selected';
      btn.dataset.state = ok ? 'copied' : 'selected';
      window.setTimeout(() => {
        label.textContent = original;
        delete btn.dataset.state;
      }, 2200);
    });
  });
}

/** Buttons that lean toward the pointer when it comes close. */
export function initMagnetic(): void {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  $$('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.3;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}
