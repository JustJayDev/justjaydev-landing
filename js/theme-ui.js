// theme-ui.ts — one-tap theme + type pairing. Themes are CSS contracts on
// <html>; this module only moves the class, persists it, and keeps the
// theme-color meta and the command palette in sync. No colours live here.
import { t } from "./i18n.js";
const THEMES = ["forge", "paper", "slate", "ember", "grape"];
const TYPES = ["forge", "sans", "serif", "typewriter"];
const THEME_BG = {
    forge: "#06070d",
    paper: "#f6f1e7",
    slate: "#101820",
    ember: "#150b08",
    grape: "#150511",
};
export function getTheme() {
    const raw = document.documentElement.dataset.theme;
    return THEMES.includes(raw) ? raw : "forge";
}
export function getTypePair() {
    const raw = document.documentElement.dataset.type;
    return TYPES.includes(raw) ? raw : "forge";
}
function storageGet(key) {
    try {
        return window.localStorage.getItem(key);
    }
    catch {
        return null;
    }
}
function storageSet(key, value) {
    try {
        window.localStorage.setItem(key, value);
    }
    catch {
        /* storage unavailable — theme simply does not persist */
    }
}
function syncMeta() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta)
        meta.content = THEME_BG[getTheme()];
}
export function applyTheme(id) {
    document.documentElement.dataset.theme = id;
    syncMeta();
}
export function applyTypePair(id) {
    document.documentElement.dataset.type = id;
}
function orderLabel(kind) {
    if (kind === "theme") {
        return `Ui ${THEMES.indexOf(getTheme()) + 1} / ${t("theme.name")}`;
    }
    return `Ui ${TYPES.indexOf(getTypePair()) + 1} / ${t("type.name")}`;
}
function advance(kind) {
    if (kind === "theme") {
        const next = THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length];
        applyTheme(next);
        storageSet("forge-theme", next);
    }
    else {
        const next = TYPES[(TYPES.indexOf(getTypePair()) + 1) % TYPES.length];
        applyTypePair(next);
        storageSet("forge-type", next);
    }
    syncOrderLabels();
}
function syncOrderLabels() {
    document.querySelectorAll("[data-theme-label]").forEach((el) => {
        el.textContent = orderLabel("theme");
    });
    document.querySelectorAll("[data-type-label]").forEach((el) => {
        el.textContent = orderLabel("type");
    });
}
export function initThemeUi() {
    const savedTheme = storageGet("forge-theme");
    if (savedTheme && THEMES.includes(savedTheme)) {
        applyTheme(savedTheme);
    }
    else if (!document.documentElement.dataset.theme) {
        applyTheme("forge");
    }
    const savedType = storageGet("forge-type");
    if (savedType && TYPES.includes(savedType)) {
        applyTypePair(savedType);
    }
    else if (!document.documentElement.dataset.type) {
        applyTypePair("forge");
    }
    document.getElementById("theme-toggle")?.addEventListener("click", () => advance("theme"));
    document.getElementById("type-toggle")?.addEventListener("click", () => advance("type"));
    syncMeta();
    syncOrderLabels();
}
// Exposed for palette.ts — the palette is independent so it can add
// theme/type commands without importing DOM state it does not own.
export function cycleTheme() {
    advance("theme");
}
export function cycleTypePair() {
    advance("type");
}
