// motion.ts — scroll reveal + scramble effects + reduced-motion handling.

export function initReveal(): void {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

export function initScramble(): void {
  const el = document.querySelector<HTMLElement>(".scramble");
  if (!el) return;
  const target = el.dataset.text || el.textContent || "";
  const glyphs = "█▓▒░<>/\\|";
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) {
    el.textContent = target;
    return;
  }
  let frame = 0;
  const chars = target.split("");
  const interval = window.setInterval(() => {
    frame++;
    el.textContent = chars
      .map((c, i) => {
        if (i < frame) return c;
        return glyphs[Math.floor(Math.random() * glyphs.length)];
      })
      .join("");
    if (frame >= chars.length) window.clearInterval(interval);
  }, 40);
}

export function initTyping(selector: string): void {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  const text = el.dataset.type || el.textContent || "";
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) {
    el.textContent = text;
    return;
  }
  el.textContent = "";
  let i = 0;
  const interval = window.setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) window.clearInterval(interval);
  }, 28);
}