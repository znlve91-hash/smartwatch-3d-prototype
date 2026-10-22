#!/usr/bin/env python3
"""Snapshot the worktree, hash an artifact and write a review package file.

Subcommands (run from inside the repository):

  snapshot
      Print HEAD, TREE and DIRTY for the current worktree. TREE is a Git tree
      of everything not ignored (tracked, staged, unstaged and untracked), so
      it is a durable baseline even when unrelated uncommitted work exists.
      Use "HEAD=<sha> tree:<TREE>" as the task baseline and pass TREE as --base.

  package --base BASE --out RECORDS_DIR --name NAME [--head REV] [--exclude PATH]...
      Write RECORDS_DIR/<NAME>-<hash8>.diff and print PATH, HASH, FILES.
      Without --head the artifact is the current worktree against BASE
      (new files included, staged/unstaged/untracked all counted).
      With --head it is the committed range BASE..REV (used for the final review),
      and the file also lists the commits.

  hash --base BASE [--head REV] [--exclude PATH]... [--expect HASH]
      Print only HASH. With --expect, exit 1 when it differs. Use it before a
      commit to confirm the approved artifact is still the current one.

BASE is any commit or tree id. HASH is the Git tree id of the artifact state, so
any edit to implementation, tests or new files changes it. Ignored files (the
records directory must be git-ignored) never count. The real index is never
touched. Standard library only; needs git.
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def run(args, env=None, cwd=None, check=True):
    p = subprocess.run(["git"] + args, env=env, cwd=cwd, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if check and p.returncode != 0:
        sys.exit("git %s failed: %s" % (" ".join(args), p.stderr.strip()))
    return p.stdout


def repo_root():
    return run(["rev-parse", "--show-toplevel"]).strip()


def has_head(root):
    return subprocess.run(["git", "rev-parse", "--verify", "-q", "HEAD"], cwd=root,
                          capture_output=True).returncode == 0


def worktree_tree(root, base, excludes):
    """Tree id of the worktree. Paths in excludes stay at their BASE state."""
    # an excluded path that is already git-ignored needs no exclusion (and git rejects it)
    excludes = [e for e in excludes if subprocess.run(
        ["git", "check-ignore", "-q", "--", e], cwd=root, capture_output=True).returncode != 0]
    tmp = tempfile.mkdtemp(prefix="sdd-index-")
    env = dict(os.environ, GIT_INDEX_FILE=os.path.join(tmp, "index"))
    try:
        if base:
            run(["read-tree", base], env=env, cwd=root)
        spec = ["."] + [":(exclude)%s" % e for e in excludes]
        run(["add", "-A", "--"] + spec, env=env, cwd=root)
        tree = run(["write-tree"], env=env, cwd=root).strip()
        return tree, tmp, env
    except BaseException:
        shutil.rmtree(tmp, ignore_errors=True)
        raise


def auto_excludes(root, out, excludes):
    ex = list(excludes)
    if out:
        try:
            rel = Path(out).resolve().relative_to(Path(root).resolve())
            ex.append(rel.as_posix())
        except ValueError:
            pass
    return ex


def cmd_snapshot(args):
    root = repo_root()
    tree, tmp, _ = worktree_tree(root, "HEAD" if has_head(root) else None, [])
    shutil.rmtree(tmp, ignore_errors=True)
    head = run(["rev-parse", "HEAD"], cwd=root).strip() if has_head(root) else "none"
    head_tree = run(["rev-parse", "HEAD^{tree}"], cwd=root).strip() if head != "none" else ""
    print("HEAD %s" % head)
    print("TREE %s" % tree)
    print("DIRTY %s" % ("no" if tree == head_tree else "yes"))


def artifact(args):
    """Return (hash, diff_text, stat_text, commits_text, file_count)."""
    root = repo_root()
    ex = auto_excludes(root, getattr(args, "out", None), args.exclude)
    if args.head:
        h = run(["rev-parse", "%s^{tree}" % args.head], cwd=root).strip()
        diff = run(["diff", "-U10", "--no-color", "--no-ext-diff", args.base, args.head], cwd=root)
        stat = run(["diff", "--stat", "--no-color", args.base, args.head], cwd=root)
        log = subprocess.run(["git", "log", "--oneline", "%s..%s" % (args.base, args.head)], cwd=root,
                             capture_output=True, text=True, encoding="utf-8", errors="replace")
        commits = log.stdout if log.returncode == 0 else ""
        names = run(["diff", "--name-only", args.base, args.head], cwd=root)
    else:
        h, tmp, env = worktree_tree(root, args.base, ex)
        try:
            diff = run(["diff", "--cached", "-U10", "--no-color", "--no-ext-diff", args.base], env=env, cwd=root)
            stat = run(["diff", "--cached", "--stat", "--no-color", args.base], env=env, cwd=root)
            names = run(["diff", "--cached", "--name-only", args.base], env=env, cwd=root)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
        commits = ""
    return h, diff, stat, commits, len([n for n in names.splitlines() if n.strip()])


def cmd_package(args):
    h, diff, stat, commits, nfiles = artifact(args)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    path = out / ("%s-%s.diff" % (args.name, h[:8]))
    mode = ("committed range %s..%s" % (args.base, args.head)) if args.head else "worktree against base %s" % args.base
    body = ["# Review package: %s" % args.name, "mode: %s" % mode, "artifact-hash: %s" % h, "files-changed: %d" % nfiles, ""]
    if commits.strip():
        body += ["## Commits", commits.rstrip(), ""]
    body += ["## Stat", stat.rstrip() or "(no changes)", "", "## Diff", diff.rstrip() or "(no changes)", ""]
    path.write_text("\n".join(body), encoding="utf-8")
    if nfiles == 0:
        print("warning: the artifact has no changes against the base", file=sys.stderr)
    print("PATH %s" % path)
    print("HASH %s" % h)
    print("FILES %d" % nfiles)


def cmd_hash(args):
    h = artifact(args)[0]
    print(h)
    if args.expect and h != args.expect:
        print("mismatch: expected %s" % args.expect, file=sys.stderr)
        return 1
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("snapshot")
    for name in ("package", "hash"):
        p = sub.add_parser(name)
        p.add_argument("--base", required=True)
        p.add_argument("--head")
        p.add_argument("--exclude", action="append", default=[])
        if name == "package":
            p.add_argument("--out", required=True)
            p.add_argument("--name", required=True)
        else:
            p.add_argument("--expect")
    args = ap.parse_args()
    if args.cmd == "snapshot":
        cmd_snapshot(args)
        return 0
    if args.cmd == "package":
        cmd_package(args)
        return 0
    return cmd_hash(args)


if __name__ == "__main__":
    sys.exit(main())
