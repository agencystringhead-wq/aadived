// Header menus: hover (with close delay), click/Enter/Space, Esc, click-outside, one panel at a time.
// Mobile: off-canvas panel with accordions and body scroll lock.

const CLOSE_DELAY = 120;
const desktop = window.matchMedia('(min-width: 961px)');
const canHover = window.matchMedia('(hover: hover)');

const header = document.querySelector<HTMLElement>('[data-header]');
const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-menu-trigger]'));
const timers = new WeakMap<HTMLElement, number>();
// Panels the user has pinned open by clicking; hover-out does not close these.
const pinned = new WeakSet<HTMLButtonElement>();

function panelFor(t: HTMLButtonElement): HTMLElement | null {
  const id = t.getAttribute('aria-controls');
  return id ? document.getElementById(id) : null;
}

function setOpen(t: HTMLButtonElement, open: boolean) {
  const panel = panelFor(t);
  if (!panel) return;
  panel.hidden = !open;
  if (!open) pinned.delete(t);
  t.setAttribute('aria-expanded', String(open));
  t.closest('li')?.classList.toggle('is-open', open);
}

function closeAll(except?: HTMLButtonElement) {
  triggers.forEach((t) => {
    if (t !== except) setOpen(t, false);
  });
}

function cancel(t: HTMLButtonElement) {
  const id = timers.get(t);
  if (id) window.clearTimeout(id);
}

function scheduleClose(t: HTMLButtonElement) {
  cancel(t);
  timers.set(t, window.setTimeout(() => setOpen(t, false), CLOSE_DELAY));
}

triggers.forEach((t) => {
  const item = t.closest('li');
  if (!item) return;

  t.addEventListener('click', () => {
    const isOpen = t.getAttribute('aria-expanded') === 'true';
    cancel(t);
    closeAll(t);
    if (isOpen && pinned.has(t)) {
      setOpen(t, false); // second click on a pinned panel closes it
    } else {
      // Click after a hover-open pins the panel instead of toggling it shut
      setOpen(t, true);
      pinned.add(t);
    }
  });

  // Hover only on real pointers, so touch taps use the click path above.
  item.addEventListener('mouseenter', () => {
    if (!desktop.matches || !canHover.matches) return;
    cancel(t);
    closeAll(t);
    setOpen(t, true);
  });
  item.addEventListener('mouseleave', () => {
    if (!desktop.matches || !canHover.matches || pinned.has(t)) return;
    scheduleClose(t);
  });

  // Tabbing out of the item closes it.
  item.addEventListener('focusout', (e) => {
    const next = (e as FocusEvent).relatedTarget as Node | null;
    if (next && !item.contains(next)) setOpen(t, false);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const openTrigger = triggers.find((t) => t.getAttribute('aria-expanded') === 'true');
  if (openTrigger) {
    setOpen(openTrigger, false);
    openTrigger.focus();
  }
});

document.addEventListener('click', (e) => {
  if (!header || header.contains(e.target as Node)) return;
  closeAll();
});

// Sticky header shadow / shrink state
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ---- Mobile navigation ----
const burger = document.querySelector<HTMLButtonElement>('[data-mnav-open]');
const mnav = document.getElementById('mobile-nav');

function openMobile() {
  if (!mnav || !burger) return;
  mnav.hidden = false;
  burger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-locked');
  mnav.querySelector<HTMLElement>('[data-mnav-close]')?.focus();
}
function closeMobile(returnFocus = true) {
  if (!mnav || !burger || mnav.hidden) return;
  mnav.hidden = true;
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-locked');
  if (returnFocus) burger.focus();
}

burger?.addEventListener('click', openMobile);
mnav?.querySelector('[data-mnav-close]')?.addEventListener('click', () => closeMobile());

mnav?.querySelectorAll<HTMLButtonElement>('[data-acc]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    const panel = document.getElementById(btn.getAttribute('aria-controls') ?? '');
    if (panel) panel.hidden = !open;
  });
});

mnav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => closeMobile(false)));

document.addEventListener('keydown', (e) => {
  if (!mnav || mnav.hidden) return;
  if (e.key === 'Escape') {
    closeMobile();
    return;
  }
  if (e.key === 'Tab') {
    const f = Array.from(mnav.querySelectorAll<HTMLElement>('button, a[href]')).filter(
      (el) => el.offsetParent !== null,
    );
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

desktop.addEventListener('change', (e) => {
  if (e.matches) closeMobile(false);
  else closeAll();
});
