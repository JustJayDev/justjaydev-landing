export const dict = {
    en: {
        "hero.eyebrow": "const jay = builder",
        "hero.quote": "I build what others call impossible. Quietly, and with real numbers.",
        "hero.cta1": "See the builds",
        "hero.cta2": "Reach me",
        "status.live": "LIVE",
        "github.repos": "repos",
        "github.stars": "stars",
        "github.lastPush": "last push",
        "github.asof": "as of 2026-11-04",
        "projects.title": "Selected work",
        "shiplog.title": "Ship log",
        "skills.title": "Toolkit",
        "links.title": "Reach",
        "footer.built": "Built on Android with Operit · Hosted on GitHub Pages",
        "palette.hint": "Type a command…",
        "palette.title": "Command palette",
    },
    hi: {
        "hero.eyebrow": "const jay = builder",
        "hero.quote": "मैं वही बनाता हूँ जिसे दूसरे असंभव कहते हैं। चुपचाप, असली आँकड़ों के साथ।",
        "hero.cta1": "बिल्ड देखें",
        "hero.cta2": "संपर्क करें",
        "status.live": "लाइव",
        "github.repos": "रेपो",
        "github.stars": "स्टार्स",
        "github.lastPush": "आखिरी पुश",
        "github.asof": "2026-11-04 तक",
        "projects.title": "चुनिंदा काम",
        "shiplog.title": "शिप लॉग",
        "skills.title": "टूलकिट",
        "links.title": "संपर्क",
        "footer.built": "Android पर Operit से निर्मित · GitHub Pages पर होस्ट",
        "palette.hint": "कमांड लिखें…",
        "palette.title": "कमांड पैलेट",
    },
};
let current = "en";
export function getLang() {
    return current;
}
export function setLang(lang) {
    current = lang;
}
export function t(key) {
    return dict[current][key] ?? dict.en[key] ?? key;
}
function applyElement(el) {
    const key = el.getAttribute("data-i18n");
    const htmlKey = el.getAttribute("data-i18n-html");
    if (htmlKey && el.tagName !== "INPUT") {
        el.innerHTML = t(htmlKey);
    }
    else if (key) {
        el.textContent = t(key);
    }
}
export function applyLang() {
    document.documentElement.lang = current;
    document.documentElement.classList.toggle("lang-hi", current === "hi");
    document
        .querySelectorAll("[data-i18n], [data-i18n-html]")
        .forEach(applyElement);
    const toggle = document.getElementById("lang-toggle");
    if (toggle) {
        toggle.textContent = current === "en" ? "हिन्दी" : "English";
        toggle.setAttribute("aria-label", current === "en" ? "Switch to Hindi" : "Switch to English");
    }
}
export function initI18n() {
    let saved = "en";
    try {
        const s = localStorage.getItem("forge-lang");
        if (s === "en" || s === "hi")
            saved = s;
    }
    catch {
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
                localStorage.setItem("forge-lang", current);
            }
            catch {
                /* ignore */
            }
        });
    }
}
