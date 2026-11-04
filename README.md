# JustJayDev · Forge Station — v11 "Engineering Ledger"
Live at: https://nightforgeio.github.io/justjaydev-landing/

Jay (JustJayDev) — builder, developer, gamer. Verified live builds, ship log and links.

## Design
v11 keeps the forge identity (lime `#c6ff3d` on `#06070d`) and fixes the
things v10 got wrong:

- **All project links verified live** — deleted repos `team-quantum-gaming` and
  `match-archive` removed; live builds `toxic-quad-gaming` and `gamex-zone-revamp`
  added. Every URL in `data/projects.json` returned HTTP 200 when checked.
- **Honest numbers** — the hero terminal stamps measured build sizes and test
  counts (`css=16.0KB js=23.2KB · 53 tests passed`). `src/py/build.py` re-stamps
  them on every build from the actual files, so they cannot drift.
- **GitHub tile wired** — `src/ts/github.ts` populates repos / stars / last push
  from the public GitHub API at runtime. The static HTML ships a verified
  fallback (`repos 8 · stars 0 · last push 2026-11-01`) so the tile is never a
  permanent dead dash when JS or the API is unavailable.
- **WCAG AA text** — dim text raised `#5d6584` (3.51:1, failed) → `#8a93b2`
  (6.61:1). Muted text measures 8.02:1.

## Architecture — 4-language pipeline
| Layer | Source | Output |
|---|---|---|
| HTML | `index.html` (hand-written, semantic, one `h1`) | — |
| SCSS | `src/scss/*.scss` (`main.scss` entry) | `css/main.css` |
| TypeScript | `src/ts/*.ts` (9 modules, ES modules) | `js/*.js` |
| Python | `src/py/build.py` — validates data, runs sass+tsc+tests, stamps stats | build report |

No frameworks, no build-tool CDNs, no jQuery. Fonts are self-hosted variable
`woff2` with `font-display: swap`. The only runtime network calls are the
public GitHub API (60 req/hr unauthenticated, best-effort) and the JSON data
files.

## Data
`data/projects.json` (9 live projects), `data/links.json`, `data/shiplog.json`,
`data/status.json`. All copy is bilingual EN + HI; `src/ts/i18n.ts` carries the
dictionary with parity enforced by `tests/dom.test.cjs` (25 keys each).

## Local build
```
python3 src/py/build.py   # sass + tsc + tests + stamp terminal stats
node tests/dom.test.cjs
node tests/build.test.cjs
bash scripts/check.sh     # full suite: 23 checks, code budget 120KB
```

Tools are expected at `/root/forge-tools` (tsc + jsdom) and
`/tmp/sass-tool` (dart-sass) in this sandbox — `npx sass` hangs here, so
`build.py` calls the local sass binary directly.

## PWA
`manifest.json` + `sw.js` (cache `jj-v16`). Service worker is network-first for
data JSON, cache-first for static assets. Theme colour unified to `#06070d`.

## License
MIT
