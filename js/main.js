// main.ts — entry point. Boots all modules.
import { loadData } from "./data.js";
import { initI18n } from "./i18n.js";
import { renderAll, renderProjects } from "./render.js";
import { initReveal } from "./motion.js";
import { initPalette } from "./palette.js";
import { initFooterYear } from "./extras.js";
import { initGithubStats } from "./github.js";
async function boot() {
    initI18n();
    initPalette();
    initFooterYear();
    initReveal();
    void initGithubStats();
    try {
        const data = await loadData();
        renderAll(data);
        // re-render projects on language toggle so descriptions/labels follow
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
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
}
else {
    void boot();
}
