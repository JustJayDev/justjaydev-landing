// main.ts — entry point. Boots all modules.
import { loadData } from "./data.js";
import { initI18n } from "./i18n.js";
import { renderAll } from "./render.js";
import { initReveal, initScramble } from "./motion.js";
import { initPalette } from "./palette.js";
import { initParticles, initClock, initShare, initFooterYear, initTermTyping } from "./extras.js";

async function boot(): Promise<void> {
  initI18n();
  initPalette();
  initFooterYear();
  initClock();
  initShare();
  initTermTyping();
  initReveal();
  initScramble();
  try {
    const data = await loadData();
    renderAll(data);
  } catch (e) {
    const status = document.getElementById("status-text");
    if (status) status.textContent = "Data failed to load: " + String(e);
  }
  initParticles();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  void boot();
}