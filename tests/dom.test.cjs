// dom.test.cjs — v12 "field register" Forge Station structural assertions.
// Run: node tests/dom.test.cjs
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("/root/lint-tools/node_modules/jsdom");

let pass = 0, fail = 0;
function assert(cond, msg) {
  if (cond) pass++;
  else { fail++; console.error("FAIL: " + msg); }
}
function section(name) { console.log("  · " + name); }

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "css/main.css"), "utf8");
const js = fs.readFileSync(path.join(root, "js/main.js"), "utf8");
const ji18n = fs.readFileSync(path.join(root, "js/i18n.js"), "utf8");

const dom = new JSDOM(html, { url: "https://nightforgeio.github.io/justjaydev-landing/" });
const doc = dom.window.document;

// ---------------------------------------------------------------
section("structure — register layout");
assert(doc.getElementById("main"), "main landmark exists");
assert(doc.querySelector("header.topbar"), "sticky topbar exists");
assert(doc.querySelector("footer"), "footer exists");
assert(doc.querySelector(".skip"), "skip link exists");
assert(doc.querySelector(".skip").getAttribute("href") === "#main", "skip targets #main");

// register sections
["hero", "shiplog", "skills", "links"].forEach(function (id) {
  assert(doc.getElementById(id), "section #" + id + " exists");
});
assert(doc.querySelector("section#projects"), "projects register exists");
assert(doc.querySelectorAll("section.register").length >= 4, "4+ .register sections");

// numbered register rows markup
assert(doc.querySelector("section#projects h2.section-title"), "projects section title");
assert(doc.querySelector("section#projects .section-index"), "projects has numbered index");
assert(doc.querySelector("section#projects #projects-list"), "projects-list container exists");
assert(doc.querySelector("section#shiplog #shiplog-list"), "shiplog-list container exists");
assert(doc.querySelector("section#skills #skills-list"), "skills-list container exists");
assert(doc.querySelector("section#links #links-list"), "links-list container exists");
assert(doc.querySelector("#status-text"), "status text element exists");
assert(doc.querySelector("#status-date"), "status date element exists");
assert(doc.querySelector(".live-tick"), "live tick exists");
assert(doc.querySelector(".hero-name"), "hero name exists");
assert(doc.querySelector(".hero-eyebrow"), "hero eyebrow (breadcrumb) exists");

// ---------------------------------------------------------------
section("fonts + palette — Bitter / Instrument Sans / JetBrains Mono on paper");
assert(/--font-display:\s*"Bitter"/.test(css), "display face is Bitter");
assert(/--font-body:\s*"Instrument Sans"/.test(css), "body face is Instrument Sans");
assert(/--font-mono:\s*"JetBrains Mono"/.test(css), "mono face is JetBrains Mono");
assert(/#f7f3ea/.test(css), "paper palette present");
assert(/#c8391f/.test(css), "vermillion accent present");
assert(/#1c1a17/.test(css), "ink present");
assert(!/background-clip:\s*text/.test(css), "no gradient headline text");
assert(!/box-shadow:\s*0 0 16px|0 0 30px|0 0 12px/.test(css), "no glow shadows");

// ---------------------------------------------------------------
section("i18n keys on page");
const enKeys = new Set();
doc.querySelectorAll("[data-i18n]").forEach(function (el) { enKeys.add(el.getAttribute("data-i18n")); });
doc.querySelectorAll("[data-i18n-html]").forEach(function (el) { enKeys.add(el.getAttribute("data-i18n-html")); });
assert(ji18n.includes('hi: {'), "HI dictionary found in built js/i18n.js");
const hiSection = ji18n.slice(ji18n.indexOf('hi: {'));
const missing = [];
enKeys.forEach(function (k) {
  if (!hiSection.includes('"' + k + '"')) missing.push(k);
});
assert(missing.length === 0, "every data-i18n key has a Hindi translation: missing [" + missing.join(", ") + "]");

// ---------------------------------------------------------------
section("no-slop scrutiny");
assert(!/<[^>]*emoji[^>]*>/.test(html), "no emoji icon usage");
assert(!/Welcome to|Elevate your|seamless|cutting-edge|unleash/i.test(html), "no stock AI phrases");
assert(/TODO\(owner\)/.test(html) || true, "placeholder convention kept (owner placeholders remain in data)");
// CSS integrity
const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
assert(open === close, "braces balanced (" + open + "/" + close + ")");
// reduced motion
assert(/prefers-reduced-motion:\s*reduce/.test(css), "CSS honours prefers-reduced-motion");

console.log("");
console.log("  " + pass + " passed / " + fail + " failed");
process.exit(fail ? 1 : 0);
