// main.ts — entry point. Boots all modules.
import { loadData } from "./data.js";
import { initI18n } from "./i18n.js";
import { renderAll, renderProjects } from "./render.js";
import { initReveal, initScramble } from "./motion.js";
import { initPalette } from "./palette.js";
import { initParticles, initClock, initShare, initFooterYear, initTermTyping, } from "./extras.js";
import { initGithubStats } from "./github.js";
async function boot() {
    initI18n();
    initPalette();
    initFooterYear();
    initClock();
    initShare();
    initTermTyping();
    initReveal();
    initScramble();
    void initGithubStats();
    try {
        const data = await loadData();
        renderAll(data);
        // v11: re-render projects on language toggle — the open-link label and
        // descriptions are language-aware and must follow the toggle.
        const toggle = document.getElementById("lang-toggle");
        if (toggle) {
            toggle.addEventListener("click", () => {
                renderProjects(data);
            });
        }
    }
    catch (e) {
        const status = document.getElementById("status-text");
        if (status)
            status.textContent = "Data failed to load: " + String(e);
    }
    initParticles();
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
}
else {
    void boot();
}
