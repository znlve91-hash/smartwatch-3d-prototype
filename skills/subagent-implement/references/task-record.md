# Task record

One file per task: `<records>/<task-id>.md`, created before the first dispatch. Records are execution state, not another task checklist. Do not create a separate progress or report file. Briefs, worker reports and artifact diffs are handoff files in the same folder (`references/handoff.md`); link them from `evidence`. Advisory records live separately under `<records>/advisory/` (see `references/advisory.md`).

```yaml
task: T1
status: PENDING
attempt: 1/5
round: 1
advisory: 0/2
worker_tier: null
baseline: null
preserved_changes: []
worker: null
reviewer: null
reviewed_artifact: null
verdict: null
tests: null
blocking: []
evidence: []
commit: null
```

Statuses: `PENDING`, `IMPLEMENTING`, `REVIEWING`, `REPAIRING`, `APPROVED`, `BLOCKED`, `ADVISORY`, `FROZEN`, `COMPLETE`.

Rules:
- Update in place at phase changes. Never append history.
- `attempt` counts worker attempts in the current round: attempt 1 is the initial implementation, and each correction is the next attempt. The limit is 5 (`limits.max_attempts` in `dispatch.md`). Increment it before each correction. Replacements, escalations, interruptions and new findings never reset it.
- `round` starts at 1. Only an Advisory `RESUME` decision starts a new round and resets `attempt` to 1/5. `advisory` counts consultations for this task (limit 2).
- `worker_tier` is the effective tier used for the current attempt, after escalation (`references/dispatch-map.md`).
- `baseline` = starting HEAD plus the tree id from `review_package.py snapshot`, which durably covers any pre-existing uncommitted changes. Keep it fixed. List unrelated changes to preserve under `preserved_changes`.
- `worker` and `reviewer` hold actual agent IDs and, if the backend exposes them, the actual model and settings. When an escalation replaces the worker, record the new ID and the reason.
- `blocking` lists only open Critical/Required finding IDs. Their full text and a short per-criterion or per-command evidence summary live in `evidence`, or link a durable artifact. Agent replies in chat are not recovery evidence.
- After any implementation edit, clear `tests`, `verdict` and `reviewed_artifact`. At review start record the artifact hash printed by `review_package.py package`; it covers implementation, tests and new files and ignores record bookkeeping.
- `FROZEN` tasks keep their evidence and are never committed. Set `COMPLETE` only after approval of the current artifact, a verified commit SHA, and any human checkpoint. Record the SHA after committing; do not amend only to insert it.
- Keep full logs out of the record.
