# Changelog
## v11 — "Engineering Ledger" (2026-11-04)
- **Content honesty.** All project links verified live (HTTP 200). Deleted repos
  `team-quantum-gaming` / `match-archive` removed; added `toxic-quad-gaming`
  (successor) and `gamex-zone-revamp`. Projects now render **9 live builds**.
- **Terminal numbers are measured, not typed.** `src/py/build.py` stamps
  `term-build-stats` / `term-live-stats` from the real build output on every
  run (`css=16.0KB js=23.2KB · 53 tests passed` at ship time). v10 showed
  fabricated sizes (`13.1KB / 19.3KB / 70 tests`).
- **GitHub tile wired to the API.** New `src/ts/github.ts` fetches public user
  and repo stats on load; static fallback in HTML (`repos 8 · stars 0 · last
  push 2026-11-01`, verified via the GitHub API 2026-11-04) covers no-JS/at-rest.
- **Contrast fixed.** `--c-text-dim` `#5d6584` → `#8a93b2` (3.51:1 → 6.61:1,
  passes WCAG AA). `theme-color` unified to `#06070d` in manifest + HTML.
- **i18n completeness.** Added `projects.open` key; `render.ts` re-renders
  projects on language toggle so link labels follow the toggle.
- **Build pipeline hardened.** `build.py` calls the local dart-sass binary
  (`/tmp/sass-tool`) instead of `npx sass` (hangs in sandbox). `package.json`
  bumped to 11.0.0; tests cover `js/github.js`; `scripts/check.sh` updated.
### Verified
- `python3 src/py/build.py` — exit 0, stamps 16.0KB/23.2KB/53 tests, 9 live.
- `tests/dom.test.cjs` 53/53, `tests/build.test.cjs` 18/18 (github included).
- `scripts/check.sh` 23/23. Code weight 57KB vs 120KB budget.
- GitHub API (2026-11-04): nightforgeio=1 repo, JustJayDev=7, total stars 0,
  last push toxic-quad-gaming 2026-11-01.
- Contrast: dim 6.61:1, muted 8.02:1, body text 17.82:1.
## v8 — tablet/phone fixes, offline fix, honest verification
- **Hero art hidden below 1200px.** Without a side gutter it sat behind the card
  text on narrower screens. It now shows only on wide screens where there is room.
- **Offline mode was broken, now fixed.** The offline cache stored files without
  their `?v=` version, so an offline reload missed the CSS and loaded unstyled.
  The worker now stores and matches by path, so offline loads are fully styled.
- **"Scroll ↓" hint is now a 44px tap target** (it was 19px).
- Cache names: `jj-v11`; stylesheet `?v=13`.

### What was verified
- Desktop 1440x900: art in the gutter, 0 overlap, 0 overflow, 0 broken images.
- Phone 390x844: art hidden, 0 overflow, 0 broken images, CSS loaded.
- Animation layer forced on: card tilts on hover and resets on leave, orbs
  parallax on scroll, reveals trigger, 0 uncaught errors.
- Offline: server stopped, page reloaded from the service-worker cache with full CSS.

### What was NOT verified
- Real phones and tablets (the test browser reported a 865px width when asked for 768px,
  so tablet widths could not be measured reliably).
- Real Safari, Firefox and older Android browsers.
- Visual appearance (screenshots are not supported in the test browser).
- The Share button on a device that supports Web Share.

## v7 — desktop layout fix + second audit pass
- **NightForge card image removed** at Jay's request (file deleted, CSS dropped).
- **Hero artwork no longer overlaps the hero card.** It was 330px wide starting
  184px inside the card, so it sat on top of the glass panel. It now lives in the
  empty side gutter (`width: clamp(120px,16vw,232px)`, `right: 0`), so the two
  can never touch — measured overlap went from 80,960px² to 0.
- **Hard dark edge removed from the hero art.** The artwork is ~88% pure black,
  so it showed as a dark rectangle with a visible border. `mix-blend-mode:
  screen` makes black fully transparent and leaves only the lime glow; a radial
  mask softens the edges and `@supports` falls back to low opacity elsewhere.
- `assets/hero-art.webp` regenerated as opaque RGB (18.9 KB, 600x800).
- **Placeholder links are no longer links.** GitHub/YouTube/Instagram used
  `href="#" aria-disabled="true"`, which still let the keyboard focus them and
  jump to the top. They are now non-focusable `<span>`s.
- **Small tap targets fixed.** The brand link and "Visit team site" were 22-26px
  tall; both are now >= 44px (Apple/Google minimum) on every screen size.
- **Service worker precache list was incomplete** — `icon-32.png`,
  `apple-touch-icon.png` and `share.jpg` were missing. Added; cache name `jj-v8`.
- Removed the last dead CSS rule (`a.link-btn[aria-disabled=true]`).
- Cache-bust bumped to `?v=10` (index and 404 both carry the same version).

### Verified after the fix
Desktop 1440x900 and mobile 390x844: zero horizontal overflow, zero broken
images, zero console errors, correct H1 -> H2 -> H3 order, no dead anchors,
no unnamed links, both language directions work, copy-email works, service
worker activates, and the share/OG/Twitter images all resolve.

## v6 — artwork + first audit pass
- Added `assets/share.jpg` (1200x630) as the link preview image, replacing the
  1.97 MB `jay.png`. Social previews now work and load ~21x faster.
- Added `assets/hero-art.webp` and `assets/backdrop.webp` (new AI artwork).
- Added `og:image:width/height/alt` and full `twitter:*` tags.
- `og:image`/JSON-LD image updated to the new share card.

### Bugs found in that audit and fixed
- **Backdrop hid the animated orbs.** The backdrop was `z-index: -1` in its own
  layer, which covered the colour orbs behind it. It now sits inside `.bg`,
  behind the orbs, so the glow shows through again.
- **Service worker cache failed on one missing file.** `addAll()` rejects the
  whole install if any single file 404s, leaving no offline cache. Now each file
  is cached individually and failures are ignored.
- **Same-origin only caching.** The SW was caching cross-origin responses too,
  which throws. Now limited to same-origin GETs.
- **No offline fallback.** Added a fallback to `index.html`.
- **Old caches never cleared reliably.** Added `skipWaiting()` and
  `clients.claim()` so updates apply without a second reload.
- **404 page broken on deep URLs.** It used relative paths, so a missing URL
  like `/a/b/c` loaded no CSS. Now uses absolute paths.
- **Manifest not installable.** Icons had no `purpose`; app icons need a
  `maskable` entry to install properly. Added, plus `scope`, `description`,
  `orientation` and `lang`.
- Removed dead CSS for the `.card-art` class.

## v5 — team roster removed
- Removed the "Team roster" section and all four player cards.
- Deleted the roster images and their CSS rules.

## v4
- Removed HustleLaunch references; team card switched to TQG.
- Images compressed to WebP; new 32/180/512px icons.
- Manifest, 404 page, robots.txt, sitemap.xml, Person JSON-LD, canonical tag.
- Skip link, back-to-top, 44px tap targets, focus rings, high-contrast mode.
- Current-section marker in nav, Web Share button, QR code.
- Scripts deferred, CSS cache-busting, offline cache (service worker).