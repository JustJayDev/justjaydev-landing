// dom.test.cjs — v13 "Forge Console" structural assertions.
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
const ji18n = fs.readFileSync(path.join(root, "js/i18n.js"), "utf8");

const dom = new JSDOM(html, { url: "https://nightforgeio.github.io/justjaydev-landing/" });
const doc = dom.window.document;

// ---------------------------------------------------------------
section("structure — console layout");
assert(doc.getElementById("main"), "main landmark exists");
assert(doc.querySelector("header.statusbar"), "status bar exists");
assert(doc.querySelector("footer"), "footer exists");
assert(doc.querySelector(".skip"), "skip link exists");
assert(doc.querySelector(".skip").getAttribute("href") === "#main", "skip targets #main");

assert(doc.querySelector("section.console"), "console/hero section exists");
assert(doc.querySelector(".console-name"), "console name exists");
assert(doc.querySelector(".console-eyebrow"), "console eyebrow exists");
assert(doc.querySelector(".console-readout"), "console readout exists");
assert(doc.querySelector("#status-text"), "status text exists");
assert(doc.querySelector("#status-date"), "status date exists");
assert(doc.querySelector(".readout-tick"), "readout live tick exists");

// panels
["work", "stats", "ships", "reach"].forEach(function (id) {
  assert(doc.getElementById(id), "section #" + id + " exists");
});
assert(doc.querySelectorAll("section.panel").length >= 4, "4+ .panel sections");
assert(doc.querySelector("#projects-list"), "work list container exists");
assert(doc.querySelector("#shiplog-list"), "ship list container exists");
assert(doc.querySelector("#skills-list"), "toolkit container exists");
assert(doc.querySelector("#links-list"), "reach list container exists");
assert(doc.querySelector("#gh-stats"), "github stats container exists");
assert(doc.querySelector("#gh-repos"), "github repos stat exists");
assert(doc.querySelector("#gh-stars"), "github stars stat exists");
assert(doc.querySelector("#gh-push"), "github last-push stat exists");

// ---------------------------------------------------------------
section("palette + type — Forge Console");
assert(/--c-canvas:\s*#0b0d0e/.test(css), "canvas present");
assert(/--c-accent:\s*#ff7a3c/.test(css), "signal accent present");
assert(/--c-ok:\s*#43c08b/.test(css), "verified green present");
assert(/--font-display:\s*"Azeret Mono"/.test(css), "display face is Azeret Mono");
assert(/--font-body:\s*system-ui/.test(css), "body face is system-ui");
assert(/--font-mono:\s*"JetBrains Mono"/.test(css), "mono face is JetBrains Mono");
assert(!/background-clip:\s*text/.test(css), "no gradient headline text");
assert(!/box-shadow:\s*0 0 16px|0 0 30px|0 0 12px/.test(css), "no glow shadows");

// ---------------------------------------------------------------
section("i18n keys on page");
const enKeys = new Set();
doc.querySelectorAll("[data-i18n]").forEach(function (el) { enKeys.add(el.getAttribute("data-i18n")); });
doc.querySelectorAll("[data-i18n-html]").forEach(function (el) { enKeys.add(el.getAttribute("data-i18n-html")); });
assert(ji18n.includes("hi: {"), "HI dictionary found in built js/i18n.js");
const hiSection = ji18n.slice(ji18n.indexOf("hi: {"));
const missing = [];
enKeys.forEach(function (k) {
  if (!hiSection.includes('"' + k + '"')) missing.push(k);
});
assert(missing.length === 0, "every data-i18n key has a Hindi translation: missing [" + missing.join(", ") + "]");

// ---------------------------------------------------------------
section("no-slop scrutiny");
assert(!/Welcome to|Elevate your|seamless|cutting-edge|unleash/i.test(html), "no stock AI phrases");
// CSS integrity
const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
assert(open === close, "braces balanced (" + open + "/" + close + ")");
// reduced motion
assert(/prefers-reduced-motion:\s*reduce/.test(css), "CSS honours prefers-reduced-motion");

console.log("");
console.log("  " + pass + " passed / " + fail + " failed");
process.exit(fail ? 1 : 0);