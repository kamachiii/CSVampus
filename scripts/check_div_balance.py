#!/usr/bin/env python3
"""Simple DOM balance checker for <div> tags in a file.
Exits with code 0 when balanced, non-zero when imbalance detected.
Usage: python3 scripts/check_div_balance.py index.html
"""
import sys
from pathlib import Path

if len(sys.argv) < 2:
    print("Usage: check_div_balance.py <file1> [file2 ...]")
    sys.exit(2)

had_error = False
for path in sys.argv[1:]:
    p = Path(path)
    if not p.exists():
        print(f"File not found: {path}")
        had_error = True
        continue
    open_count = 0
    close_count = 0
    with p.open('r', encoding='utf-8') as f:
        for i, line in enumerate(f, start=1):
            open_count += line.count('<div')
            close_count += line.count('</div>')
    diff = open_count - close_count
    if diff == 0:
        print(f"OK: {path} (div tags balanced: {open_count}/{close_count})")
    else:
        print(f"IMBALANCE: {path} (open: {open_count}, close: {close_count}, diff: {diff})")
        had_error = True

sys.exit(1 if had_error else 0)
