// theme-ui.ts — one-tap theme + type pairing. Themes are CSS contracts on
// <html>; this module only moves the class, persists it, and keeps the
// theme-color meta and the command palette in sync. No colours live here.
import { t } from "./i18n.js";

export type ThemeId = "forge" | "paper" | "slate" | "ember" | "grape";
export type TypePairId = "forge" | "sans" | "serif" | "typewriter";

const THEMES: ThemeId[] = ["forge", "paper", "slate", "ember", "grape"];
const TYPES: TypePairId[] = ["forge", "sans", "serif", "typewriter"];

const THEME_BG: Record<ThemeId, string> = {
  forge: "#06070d",
  paper: "#f6f1e7",
  slate: "#101820",
  ember: "#150b08",
  grape: "#150511",
};

export function getTheme(): ThemeId {
  const raw = document.documentElement.dataset.theme;
  return THEMES.includes(raw as ThemeId) ? (raw as ThemeId) : "forge";
}

export function getTypePair(): TypePairId {
  const raw = document.documentElement.dataset.type;
  return TYPES.includes(raw as TypePairId) ? (raw as TypePairId) : "forge";
}

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — theme simply does not persist */
  }
}

function syncMeta(): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = THEME_BG[getTheme()];
}

export function applyTheme(id: ThemeId): void {
  document.documentElement.dataset.theme = id;
  syncMeta();
}

export function applyTypePair(id: TypePairId): void {
  document.documentElement.dataset.type = id;
}

function orderLabel(kind: "theme" | "type"): string {
  if (kind === "theme") {
    return `Ui ${THEMES.indexOf(getTheme()) + 1} / ${t("theme.name")}`;
  }
  return `Ui ${TYPES.indexOf(getTypePair()) + 1} / ${t("type.name")}`;
}

function advance(kind: "theme" | "type"): void {
  if (kind === "theme") {
    const next = THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length];
    applyTheme(next);
    storageSet("forge-theme", next);
  } else {
    const next = TYPES[(TYPES.indexOf(getTypePair()) + 1) % TYPES.length];
    applyTypePair(next);
    storageSet("forge-type", next);
  }
  syncOrderLabels();
}

function syncOrderLabels(): void {
  document.querySelectorAll<HTMLElement>("[data-theme-label]").forEach((el) => {
    el.textContent = orderLabel("theme");
  });
  document.querySelectorAll<HTMLElement>("[data-type-label]").forEach((el) => {
    el.textContent = orderLabel("type");
  });
}

export function initThemeUi(): void {
  const savedTheme = storageGet("forge-theme");
  if (savedTheme && THEMES.includes(savedTheme as ThemeId)) {
    applyTheme(savedTheme as ThemeId);
  } else if (!document.documentElement.dataset.theme) {
    applyTheme("forge");
  }
  const savedType = storageGet("forge-type");
  if (savedType && TYPES.includes(savedType as TypePairId)) {
    applyTypePair(savedType as TypePairId);
  } else if (!document.documentElement.dataset.type) {
    applyTypePair("forge");
  }
  document.getElementById("theme-toggle")?.addEventListener("click", () => advance("theme"));
  document.getElementById("type-toggle")?.addEventListener("click", () => advance("type"));
  syncMeta();
  syncOrderLabels();
}

// Exposed for palette.ts — the palette is independent so it can add
// theme/type commands without importing DOM state it does not own.
export function cycleTheme(): void {
  advance("theme");
}
export function cycleTypePair(): void {
  advance("type");
}
