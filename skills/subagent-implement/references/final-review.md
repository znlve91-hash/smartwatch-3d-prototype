# Final review

Run once, after all non-frozen task commits, integration checks and human checkpoints are done. If any task is frozen, tell the reviewer which ones and why, and not to report their unmet requirements as findings; record them in `frozen` below. A run with frozen tasks is reported to the user as partial whatever the final verdict is. This is a whole-result review, not another task-by-task pass. It looks for cross-task defects, missed plan-level requirements, regressions, and architecture or integration problems.

## 1. Review the whole result

Dispatch one fresh reviewer using `models.reviewer.high` from `dispatch.md`. Tell it to read and follow `code-review-and-quality` in full (five axes: correctness, readability, architecture, security, performance, with severity labels). Send:

- the approved spec and plan, the task list, applicable Definition of Done
- integration evidence and deferred observations from task records
- the path of the whole-result package from `review_package.py package --base <run baseline> --head HEAD --out <records> --name final-artifact` (commit list, stat and full diff, new files included)

Record the exact reviewed commit. The reviewer reads without editing and returns `APPROVED`, `CHANGES_REQUESTED` or `BLOCKED`, with severity, location, impact and expected fix per finding.

- `APPROVED` with green checks and no open Critical/Required: record `FINAL_APPROVED` and finish. Optional and Nit findings are recorded and need no correction.
- `BLOCKED`: record the missing prerequisite as `FINAL_BLOCKED`. Never assume approval.
- `CHANGES_REQUESTED`: send all Critical/Required findings to one correction worker. Do not add a validator agent first.

## 2. Correct once, then review only the fix

Dispatch one fresh worker using `models.worker.high` with the original requirements, all blocking findings, the reviewed baseline, relevant context and the worker brief rules. It fixes all blocking findings together, runs focused regression tests plus integration checks, and leaves edits uncommitted. It returns changed files, an outcome per finding, exact commands and results, and `FIXED_AND_VERIFIED` or `BLOCKED`. No per-finding fixers and no second correction wave.

For `FIXED_AND_VERIFIED`, capture the fix artifact against the reviewed HEAD (staged, unstaged and untracked files) with `review_package.py package --base <reviewed commit> --out <records> --name final-fix` and send its path to the same final reviewer for one scoped re-review. If that reviewer cannot be resumed, replace it once and keep the single review seat. The re-review must:

- mark each original blocking finding `ADDRESSED` or `NOT_ADDRESSED` with code evidence
- inspect only the fix diff and directly affected paths for new Critical/Required breakage; note other observations as non-blocking
- return a verdict tied to the exact corrected artifact

If it approves and checks are green, stage only those changes, verify scope, commit, record the SHA, and finish as `COMPLETE_AFTER_CORRECTION`. A commit hook that changes more than formatting voids the approval; review the resulting artifact before committing.

If a finding remains disputed, you may record an evidence-backed ruling that it is a false positive or only Optional/Nit. Do not silently waive a real Critical/Required defect or change the approved plan. Unresolved blocking findings, failed checks, a scope decision, missing evidence or a commit failure end as `FINAL_BLOCKED`. Report the blockers to the user instead of starting another wave.

## `final.md`

Keep it in `<records>`, updated in place.

```yaml
state: PENDING
reviewer: null
worker: null
reviewed_commit: null
reviewed_artifact: null
initial_verdict: null
findings: []
fix_artifact: null
fix_verdict: null
evidence: []
verification: null
correction_commit: null
frozen: []
blockers: []
```

States in progress: `PENDING`, `REVIEWING`, `CORRECTING`, `REREVIEWING`. Final states: `FINAL_APPROVED`, `COMPLETE_AFTER_CORRECTION`, `FINAL_BLOCKED`. Persist agent IDs, actual model and settings, artifact hashes, findings and test evidence before moving to the next phase. After an interruption, resume the recorded phase instead of redispatching finished work. A completed state needs verified commits, passing checks, satisfied human checkpoints and no unresolved Critical/Required findings.
