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
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
CSS = ROOT / "css"
JS = ROOT / "js"
SRC_SCSS = ROOT / "src/scss/main.scss"
TSC = Path("/root/forge-tools/node_modules/.bin/tsc")
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


def build_css() -> None:
    """Compile SCSS -> CSS with dart-sass."""
    os.makedirs(CSS, exist_ok=True)
    rc, out = sh(f"npx sass --style=compressed {SRC_SCSS} {CSS / 'main.css'}")
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
    """Report build stats."""
    css_size = (CSS / "main.css").stat().st_size if (CSS / "main.css").exists() else 0
    js_size = sum(f.stat().st_size for f in JS.glob("*.js"))
    print(f"build: css={css_size/1024:.1f}KB js={js_size/1024:.1f}KB")


def main() -> None:
    validate_data()
    build_css()
    build_ts()
    run_tests()
    report()
    print("build: OK")


if __name__ == "__main__":
    main()