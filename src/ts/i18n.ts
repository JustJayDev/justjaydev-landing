// i18n.ts — bilingual (English / Hindi) text switching.
import type { Lang } from "./types";

interface Dict {
  en: Record<string, string>;
  hi: Record<string, string>;
}

export const dict: Dict = {
  en: {
    "nav.projects": "Projects",
    "nav.shiplog": "Ship Log",
    "nav.skills": "Skills",
    "nav.links": "Links",
    "hero.eyebrow": "Builder · Developer · Gamer",
    "hero.quote":
      "They call it impossible. I call it inevitable. Because an emperor's will cannot be denied.",
    "hero.cta1": "See my work",
    "hero.cta2": "Links",
    "hero.share": "Share",
    "status.label": "Currently building",
    "buildon.label": "Built on",
    "github.label": "GitHub",
    "github.repos": "repos",
    "github.stars": "stars",
    "github.lastPush": "last push",
    "github.asof": "as of 2026-11-04",
    "projects.title": "Projects",
    "projects.open": "Open →",
    "shiplog.title": "Ship Log",
    "skills.title": "Skills",
    "links.title": "Links",
    "footer.built": "Built on Android with Operit · Hosted on GitHub Pages",
    "palette.hint": "Type a command…",
    "palette.title": "Command palette",
    "theme.name": "Forge",
    "theme.title": "Theme",
    "theme.cycle": "Change theme",
    "type.name": "Space Grotesk",
    "type.title": "Type pairing",
    "type.cycle": "Change type pairing",
    "status.na": "No status",
    "time.now": "now",
  },
  hi: {
    "nav.projects": "प्रोजेक्ट्स",
    "nav.shiplog": "शिप लॉग",
    "nav.skills": "स्किल्स",
    "nav.links": "लिंक्स",
    "hero.eyebrow": "बिल्डर · डेवलपर · गेमर",
    "hero.quote":
      "वे इसे असंभव कहते हैं। मैं इसे अपरिहार्य कहता हूँ। क्योंकि सम्राट की इच्छा को नकारा नहीं जा सकता।",
    "hero.cta1": "मेरा काम देखें",
    "hero.cta2": "लिंक्स",
    "hero.share": "शेयर",
    "status.label": "अभी बना रहा हूँ",
    "buildon.label": "निर्मित पर",
    "github.label": "GitHub",
    "github.repos": "रेपो",
    "github.stars": "स्टार्स",
    "github.lastPush": "आखिरी पुश",
    "github.asof": "2026-11-04 तक",
    "projects.title": "प्रोजेक्ट्स",
    "projects.open": "खोलें →",
    "shiplog.title": "शिप लॉग",
    "skills.title": "स्किल्स",
    "links.title": "लिंक्स",
    "footer.built": "Android पर Operit से निर्मित · GitHub Pages पर होस्ट",
    "palette.hint": "कमांड लिखें…",
    "palette.title": "कमांड पैलेट",
    "theme.name": "फ़ोर्ज",
    "theme.title": "थीम",
    "theme.cycle": "थीम बदलें",
    "type.name": "Space Grotesk",
    "type.title": "फ़ॉन्ट जोड़ी",
    "type.cycle": "फ़ॉन्ट जोड़ी बदलें",
    "status.na": "कोई स्थिति नहीं",
    "time.now": "अभी",
  },
};

let current: Lang = "en";

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang): void {
  current = lang;
}

export function t(key: string): string {
  return dict[current][key] ?? dict.en[key] ?? key;
}

function applyElement(el: HTMLElement): void {
  const key = el.getAttribute("data-i18n");
  const htmlKey = el.getAttribute("data-i18n-html");
  if (htmlKey && el.tagName !== "INPUT") {
    el.innerHTML = t(htmlKey);
  } else if (key) {
    el.textContent = t(key);
  }
}

export function applyLang(): void {
  document.documentElement.lang = current;
  document.documentElement.classList.toggle("lang-hi", current === "hi");
  document
    .querySelectorAll<HTMLElement>("[data-i18n], [data-i18n-html]")
    .forEach(applyElement);

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.textContent = current === "en" ? "हिन्दी" : "English";
    toggle.setAttribute(
      "aria-label",
      current === "en" ? "Switch to Hindi" : "Switch to English",
    );
  }
}

export function initI18n(): void {
  // If user had a saved language, use it.
  let saved: Lang = "en";
  try {
    const s = localStorage.getItem("forege-lang");
    if (s === "en" || s === "hi") saved = s;
  } catch {
    /* storage unavailable */
  }
  setLang(saved);
  applyLang();

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      setLang(current === "en" ? "hi" : "en");
      applyLang();
      try {
        localStorage.setItem("forege-lang", current);
      } catch {
        /* ignore */
      }
    });
  }
}