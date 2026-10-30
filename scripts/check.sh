#!/usr/bin/env bash
# check.sh — v10 "Forge Station" verification pipeline
set -o pipefail
cd "$(dirname "$0")/.."

PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); echo "  ✓ $1"; }
bad()  { FAIL=$((FAIL+1)); echo "  ✗ $1"; }

echo '═══ justjaydev-landing v10 — check suite ═══'

# 1. Build pipeline (Python orchestrates sass + tsc)
echo '── Build (python3 src/py/build.py) ──'
if python3 src/py/build.py >/tmp/forge-build.log 2>&1; then ok "python build OK"; else bad "python build failed"; tail -5 /tmp/forge-build.log; fi

# 2. Compiled CSS exists and non-empty
echo '── CSS output ──'
if [ -s css/main.css ]; then ok "css/main.css ($(wc -c < css/main.css) bytes)"; else bad "css/main.css missing/empty"; fi

# 3. Compiled JS modules exist
echo '── JS output ──'
for f in js/main.js js/data.js js/i18n.js js/render.js js/motion.js js/palette.js js/extras.js; do
  if [ -s "$f" ]; then ok "$f"; else bad "$f missing/empty"; fi
done

# 4. JSON validity
echo '── JSON ──'
for f in manifest.json data/projects.json data/links.json data/shiplog.json data/status.json; do
  if python3 -c "import json,io; json.load(io.open('$f',encoding='utf-8'))" 2>/dev/null; then ok "$f"; else bad "$f invalid"; fi
done

# 5. Tests (DOM + build)
echo '── Tests ──'
if node tests/dom.test.cjs >/dev/null 2>&1; then ok "dom.test.cjs (all pass)"; else bad "dom.test.cjs failures"; fi
if node tests/build.test.cjs >/dev/null 2>&1; then ok "build.test.cjs (all pass)"; else bad "build.test.cjs failures"; fi

# 6. Fonts exist
echo '── Fonts ──'
for f in fonts/space-grotesk-var.woff2 fonts/jetbrains-mono-var.woff2 fonts/noto-sans-devanagari.woff2; do
  if [ -s "$f" ]; then ok "$f"; else bad "$f missing"; fi
done

# 7. Weight budget (code only, excl images/fonts)
echo '── Weight budget ──'
CODE_BYTES=$(cat index.html 404.html css/*.css js/*.js sw.js manifest.json 2>/dev/null | wc -c)
CODE_KB=$((CODE_BYTES / 1024))
if [ "$CODE_KB" -le 120 ]; then ok "code weight: ${CODE_KB}KB (budget: 120KB)"; else bad "code weight: ${CODE_KB}KB exceeds 120KB budget"; fi

# 8. Anti-slop
echo '── Anti-slop ──'
if grep -q 'card3d\|tilt-wrap\|orb o1\|spinRing\|spin3d' index.html; then bad 'old v9 cruft found in index.html'; else ok 'no v9 cruft in index.html'; fi
if grep -q 'css/tokens.css\|css/sections.css\|css/layout.css' index.html; then bad 'old CSS references in index.html'; else ok 'no old CSS references'; fi

echo ''
echo "═══ RESULT: $PASS passed / $FAIL failed ═══"
exit $FAIL