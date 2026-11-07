// build.test.cjs — verifies the build produced the expected compiled output.
// Run after: python3 src/py/build.py
const fs = require("fs");
const path = require("path");

let pass = 0,
  fail = 0;
function assert(cond, msg) {
  if (cond) {
    pass++;
  } else {
    fail++;
    console.error("FAIL: " + msg);
  }
}

const root = path.join(__dirname, "..");

// CSS compiled exists and has content
const cssPath = path.join(root, "css/main.css");
assert(fs.existsSync(cssPath), "css/main.css exists");
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, "utf8");
  assert(css.length > 1000, "css/main.css has content (>1KB)");
  assert(css.includes("--c-accent"), "tokens present in compiled css");
  assert(css.includes(".work-row"), "work rows compiled");
  assert(css.includes(".ship-entry"), "ship log entries compiled");
  assert(css.includes("prefers-reduced-motion"), "reduced-motion block present");
}

// TS compiled JS modules exist
[
  "js/main.js",
  "js/data.js",
  "js/i18n.js",
  "js/render.js",
  "js/motion.js",
  "js/palette.js",
  "js/extras.js",
  "js/github.js",
].forEach((f) => {
  assert(fs.existsSync(path.join(root, f)), f + " exists");
});

// main.js is an ES module that imports the others
const mainJs = fs.readFileSync(path.join(root, "js/main.js"), "utf8");
assert(mainJs.includes("import"), "main.js uses import statements");

// 4 languages all present in source tree
assert(fs.existsSync(path.join(root, "src/scss/main.scss")), "SCSS source");
assert(fs.existsSync(path.join(root, "src/ts/main.ts")), "TS source");
assert(fs.existsSync(path.join(root, "src/py/build.py")), "Python source");
assert(fs.existsSync(path.join(root, "index.html")), "HTML source");

console.log("\n" + pass + " passed / " + fail + " failed");
process.exit(fail > 0 ? 1 : 0);