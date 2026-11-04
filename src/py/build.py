#!/usr/bin/env python3
"""Forge Station build orchestrator.

This is the 4th language in the stack: it validates the data, runs the
Sass and TypeScript compiles, writes the built CSS/JS, and runs the tests.

It does NOT generate HTML — HTML is hand-written in index.html. This script
is the pipeline that assembles the static site.

Usage:
    python3 src/py/build.py
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
CSS = ROOT / "css"
JS = ROOT / "js"
SRC_SCSS = ROOT / "src/scss/main.scss"
TSC = Path("/root/forge-tools/node_modules/.bin/tsc")
SASS = Path("/tmp/sass-tool/node_modules/.bin/sass")
# sass lives in /tmp/sass-tool — npx sass hangs in this sandbox (no npm registry access)
# tsc lives in /root/forge-tools — a real filesystem, since /sdcard (FUSE)
# cannot create the node_modules/.bin symlinks that npm needs.


def sh(cmd: str, cwd=None) -> tuple[int, str]:
    """Run a shell command and return (rc, output)."""
    proc = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd)
    return proc.returncode, proc.stdout + proc.stderr


def validate_data() -> None:
    """Validate JSON data files exist and are well-formed."""
    required = ["projects.json", "links.json", "shiplog.json", "status.json"]
    for name in required:
        p = DATA / name
        if not p.exists():
            raise SystemExit(f"Missing data file: {p}")
        json.loads(p.read_text(encoding="utf-8"))
    projects = json.loads((DATA / "projects.json").read_text(encoding="utf-8"))
    for proj in projects:
        for key in ("id", "name", "tag", "desc", "status"):
            if key not in proj:
                raise SystemExit(f"Project {proj.get('id')} missing key {key}")


def check_legacy() -> None:
    """Warn if legacy css/style.css (v9 leftover, tracked in git) is missing.
    It is not referenced by index.html but is tracked — deleting it silently
    would be an unrelated change. Keep it until an explicit removal."""
    if not (CSS / "style.css").exists():
        print("warn: css/style.css missing (legacy, untracked since v10 — restore from git if needed)")

def build_css() -> None:
    """Compile SCSS -> CSS with dart-sass."""
    os.makedirs(CSS, exist_ok=True)
    rc, out = sh(f"{SASS} --style=compressed {SRC_SCSS} {CSS / 'main.css'}")
    if rc != 0:
        raise SystemExit(f"Sass failed:\n{out}")
    print("css: compiled main.css")


def build_ts() -> None:
    """Compile TypeScript -> JS with tsc."""
    os.makedirs(JS, exist_ok=True)
    rc, out = sh(f"{TSC} -p {ROOT / 'tsconfig.json'}")
    if rc != 0:
        raise SystemExit(f"tsc failed:\n{out}")
    print("js: compiled TypeScript → js/")
    if not (JS / "main.js").exists():
        raise SystemExit("tsc did not emit js/main.js")


def run_tests() -> None:
    """Run the DOM tests."""
    rc, out = sh(f"node {ROOT / 'tests/dom.test.cjs'}")
    print(out)
    if rc != 0:
        raise SystemExit("DOM tests failed")


def report() -> None:
    """Report build stats and stamp the measured numbers into index.html.
    The hero terminal shows these values — they must be measured, never
    hand-typed, or they drift from the actual build (v10 showed fake sizes)."""
    css_size = (CSS / "main.css").stat().st_size if (CSS / "main.css").exists() else 0
    js_size = sum(f.stat().st_size for f in JS.glob("*.js"))
    print(f"build: css={css_size/1024:.1f}KB js={js_size/1024:.1f}KB")
    # stamp terminal stats into index.html from the measured sizes + test count
    idx = ROOT / "index.html"
    if idx.exists():
        html = idx.read_text(encoding="utf-8")
        # count tests from the test files' assert calls is unreliable; instead
        # run the dom test and parse "N passed"
        rc, out = sh(f"node {ROOT / 'tests/dom.test.cjs'}")
        m = re.search(r"(\d+) passed", out)
        passed = m.group(1) if m else "?"
        projects = json.loads((DATA / "projects.json").read_text(encoding="utf-8"))
        live_n = len([x for x in projects if x.get("status") == "live"])
        new_build = f"css={css_size/1024:.1f}KB js={js_size/1024:.1f}KB · {passed} tests passed"
        html = re.sub(r'<span id="term-build-stats">[^<]*</span>', f'<span id="term-build-stats">{new_build}</span>', html)
        html = re.sub(r'<span id="term-live-stats">[^<]*</span>', f'<span id="term-live-stats">{live_n} builds live on staging</span>', html)
        idx.write_text(html, encoding="utf-8")
        print(f"build: stamped terminal stats ({new_build}; {live_n} live)")


def main() -> None:
    validate_data()
    check_legacy()
    build_css()
    build_ts()
    run_tests()
    report()
    print("build: OK")


if __name__ == "__main__":
    main()