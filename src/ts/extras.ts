// extras.ts — ambient particles, header clock, share button, footer year.

export function initParticles(): void {
  const canvas = document.getElementById("network-canvas") as HTMLCanvasElement | null;
  if (!canvas) return;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  interface P { x: number; y: number; vx: number; vy: number; }
  let pts: P[] = [];

  const resize = (): void => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(70, Math.floor((w * h) / 22000));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  };

  const step = (): void => {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(198,255,61,0.35)";
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(198,255,61,${0.14 * (1 - d / 110)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  };

  resize();
  window.addEventListener("resize", resize);
  step();
}

export function initClock(): void {
  const el = document.getElementById("hero-clock");
  if (!el) return;
  const pad = (n: number): string => String(n).padStart(2, "0");
  const tick = (): void => {
    const now = new Date();
    const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    el.textContent = `${pad(ist.getHours())}:${pad(ist.getMinutes())}:${pad(ist.getSeconds())} IST`;
  };
  tick();
  window.setInterval(tick, 1000);
}

export function initShare(): void {
  const btn = document.getElementById("share-btn") as HTMLButtonElement | null;
  if (!btn) return;
  if (!("navigator" in window) || !navigator.share) {
    btn.hidden = true;
    return;
  }
  btn.addEventListener("click", () => {
    navigator.share({
      title: "JustJayDev · Forge Station",
      url: window.location.href,
    }).catch(() => {});
  });
}

export function initFooterYear(): void {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

/** Typewriter effect for the forge terminal command lines. */
export function initTermTyping(): void {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const lines = [
    document.getElementById("term-line-1"),
    document.getElementById("term-line-2"),
  ].filter((e): e is HTMLElement => Boolean(e));
  if (lines.length === 0) return;
  if (prefersReduced) {
    // show the full command text immediately, no animation
    lines.forEach((l) => {
      l.textContent = l.dataset.text || l.textContent || "";
    });
    return;
  }
  let lineIdx = 0;
  const typeLine = (): void => {
    if (lineIdx >= lines.length) return;
    const el = lines[lineIdx];
    const target = el.dataset.text || el.textContent || "";
    el.textContent = "";
    let i = 0;
    const interval = window.setInterval(() => {
      i++;
      el.textContent = target.slice(0, i);
      if (i >= target.length) {
        window.clearInterval(interval);
        lineIdx++;
        window.setTimeout(typeLine, 220);
      }
    }, 18);
  };
  window.setTimeout(typeLine, 400);
}