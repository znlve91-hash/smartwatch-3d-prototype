# File handoffs

Anything pasted into a dispatch, and anything an agent prints back, stays in the orchestrator's context and is re-read on every later turn. Bulk material therefore moves as files and prompts carry paths. Scripts are in this skill's `scripts/` directory (shown below as `scripts/...`). Run them with `python3` from the repository root, using the script's full path. They need only Python 3 and git, and never touch the real Git index.

## Files

All sit flat in `<records>`, beside the task records. They are git-ignored and never committed.

| File | Written by | Read by |
|---|---|---|
| `<task-id>-brief.md` | `task_brief.py` | worker, reviewer |
| `<task-id>-report.md` | worker (repair reports are appended) | reviewer |
| `<task-id>-artifact-<hash8>.diff` | `review_package.py package` | reviewer |
| `final-artifact-<hash8>.diff`, `final-fix-<hash8>.diff` | `review_package.py package` | final reviewer |

A new artifact gets a new file name, so earlier rounds stay on disk as evidence. Link them from `evidence` in the task record.

## Commands

**Baseline** (before the first worker dispatch of a task):

```
python3 scripts/review_package.py snapshot
```

Prints `HEAD`, `TREE` and `DIRTY`. `TREE` captures the whole worktree, including unrelated uncommitted and untracked work, so record `baseline: HEAD <sha>, tree:<TREE>` and use `TREE` as `--base`. The task artifact then contains only what the task changed, and `preserved_changes` needs no manual exclusion.

**Brief:**

```
python3 scripts/task_brief.py <task-id> --file <plan> --file <todo> --out <records> [--also "Definition of Done|Constraints"]
```

Copies the task's section verbatim (heading or list item starting with the ID; `T1` also finds `Task 1`, never `T10` or `T1a`). `--also` appends sections whose heading matches, so global constraints reach the worker unedited. A warning about several matching sections means the plan's headings are ambiguous; check the brief before dispatching. Exit 1 means the task was not found: resolve that before any dispatch.

**Artifact** (after the worker stops editing and the formatter has run):

```
python3 scripts/review_package.py package --base <TREE> --out <records> --name <task-id>-artifact
```

Prints `PATH`, `HASH` and `FILES`. `HASH` is the Git tree id of the resulting worktree: any edit to implementation, tests or new files changes it, and ignored files (records) never count. Record it as `reviewed_artifact`. Add `--exclude <path>` for a tracked file that is not part of the artifact, such as a plan or todo the Advisory edited.

**Before committing:**

```
python3 scripts/review_package.py hash --base <TREE> --expect <approved HASH>
```

Exit 1 means the worktree is no longer the approved artifact; the approval is void.

**Final review:**

```
python3 scripts/review_package.py package --base <run baseline> --head HEAD --out <records> --name final-artifact
python3 scripts/review_package.py package --base <reviewed commit> --out <records> --name final-fix
```

The first covers the committed range with the commit list; the second captures the uncommitted correction against the reviewed commit. Use `hash --expect` before committing the correction.

## Without Python

Do the same by hand: copy the task's text from the plan and todo verbatim into the brief file. For the artifact, use a temporary index so the real one stays untouched:

```
export GIT_INDEX_FILE=$(mktemp -u); git read-tree <BASE>; git add -A
git diff --cached -U10 <BASE> > <file>; git write-tree   # the hash
unset GIT_INDEX_FILE
```
