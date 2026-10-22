#!/usr/bin/env python3
"""Extract one task's text from the plan and todo files into a brief file.

Usage:
  task_brief.py TASK_ID --out RECORDS_DIR --file tasks/plan.md --file tasks/todo.md
                [--also REGEX]... [--name NAME]

Writes RECORDS_DIR/<name>-brief.md (name defaults to TASK_ID) and prints:
  PATH <path>

A task is found by its ID at the start of a Markdown heading (the section runs to the next
heading of the same or higher level) or, failing that, of a list item (the item
and its indented continuation). "T1" also matches "Task 1" but never "T10" or
"T1a". --also appends sections whose heading matches REGEX (for example
"Definition of Done|Constraints"), so global rules reach the worker verbatim.
Exit 1 if the task is not found in any file. Standard library only.
"""
import argparse
import re
import sys
from pathlib import Path

HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
ITEM = re.compile(r"^(\s*)(?:[-*+]|\d+[.)])\s+(?:\[[ xX~-]\]\s*)?(.*)$")
FENCE = re.compile(r"^\s*(```|~~~)")


def id_pattern(task_id):
    esc = re.escape(task_id)
    alts = [esc]
    m = re.fullmatch(r"[Tt]?0*(\d+)([A-Za-z]?)", task_id)
    if m:
        alts.append(r"Task\s*[T#]?\s*0*%s%s" % (m.group(1), re.escape(m.group(2))))
    # anchored at the start of the heading or item text, so "Task 2 (depends on T1)" never matches T1
    return re.compile(r"^[\s*_\[(]*(?:%s)(?![A-Za-z0-9])" % "|".join(alts), re.I)


def scan(lines):
    """Yield (index, kind, level_or_indent, text), skipping fenced code."""
    in_fence = False
    for i, line in enumerate(lines):
        if FENCE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        h = HEADING.match(line)
        if h:
            yield i, "h", len(h.group(1)), h.group(2)
            continue
        it = ITEM.match(line)
        if it:
            yield i, "i", len(it.group(1).expandtabs(4)), it.group(2)


def heading_section(lines, start, level):
    end = len(lines)
    for i, kind, lvl, _ in scan(lines[start + 1:]):
        if kind == "h" and lvl <= level:
            end = start + 1 + i
            break
    return lines[start:end]


def item_block(lines, start, indent):
    end = start + 1
    while end < len(lines):
        line = lines[end]
        if line.strip():
            cur = len(line) - len(line.lstrip())
            if cur <= indent:
                break
        end += 1
    block = lines[start:end]
    while block and not block[-1].strip():
        block.pop()
    return block


def find_task(lines, pat):
    found = []
    for i, kind, lvl, text in scan(lines):
        if kind == "h" and pat.match(text):
            found.append((text, heading_section(lines, i, lvl)))
    if found:
        return found
    for i, kind, indent, text in scan(lines):
        if kind == "i" and pat.match(text):
            found.append((text[:70], item_block(lines, i, indent)))
    return found


def find_also(lines, regex):
    pat = re.compile(regex, re.I)
    return [(t, heading_section(lines, i, l))
            for i, k, l, t in scan(lines) if k == "h" and pat.search(t)]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    ap.add_argument("task_id")
    ap.add_argument("--file", action="append", required=True, help="plan or todo file (repeatable)")
    ap.add_argument("--out", required=True, help="records directory")
    ap.add_argument("--name", help="file name stem (default: task id)")
    ap.add_argument("--also", action="append", default=[], help="heading regex to append (repeatable)")
    args = ap.parse_args()

    pat = id_pattern(args.task_id)
    parts, hits = [], 0
    for f in args.file:
        p = Path(f)
        if not p.is_file():
            print("missing file: %s" % f, file=sys.stderr)
            continue
        lines = p.read_text(encoding="utf-8").splitlines()
        matches = find_task(lines, pat)
        hits += len(matches)
        if len(matches) > 1:
            print("warning: %d sections match %s in %s: %s" % (
                len(matches), args.task_id, f, "; ".join(t for t, _ in matches)), file=sys.stderr)
        for title, block in matches:
            parts.append("## From %s: %s\n\n%s" % (f, title, "\n".join(block).rstrip()))
        for rx in args.also:
            for title, block in find_also(lines, rx):
                parts.append("## Shared context from %s: %s\n\n%s" % (f, title, "\n".join(block).rstrip()))
    if hits == 0:
        print("task %s not found in any file" % args.task_id, file=sys.stderr)
        return 1

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    path = out / ("%s-brief.md" % (args.name or args.task_id))
    path.write_text("# Task brief: %s\n\nRequirements below are verbatim from the approved plan and task list. "
                    "Use exact values, names and test cases as written.\n\n%s\n"
                    % (args.task_id, "\n\n".join(parts)), encoding="utf-8")
    print("PATH %s" % path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
