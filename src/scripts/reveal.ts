// Fade-and-rise reveal for sections marked .reveal.
// An IntersectionObserver does all the work, so there are no synchronous layout reads at load (those cost
// 300ms or more of blocking time on long pages). Sections that start below the fold are marked pending
// after the first observer callback, so nothing flashes, and nothing is hidden if JavaScript is off.
// Skipped entirely under prefers-reduced-motion. Replaces CSS scroll-driven animations, which were slower.
const seen = new WeakSet<Element>();

function init() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) {
          el.removeAttribute('data-reveal');
          seen.add(el);
          io.unobserve(el);
        } else if (!seen.has(el) && e.boundingClientRect.top > 0) {
          // First report and still below the fold: hide it until it scrolls into view
          el.setAttribute('data-reveal', 'pending');
          seen.add(el);
        }
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.04 },
  );
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => io.observe(el));
}

// Wait until the browser is idle so it never competes with first paint
if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 1500 });
else setTimeout(init, 200);
