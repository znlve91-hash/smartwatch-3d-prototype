# Worker brief

The worker starts with empty context. Build the dispatch prompt from these parts and send nothing else from your own history. The task text is not pasted: it lives in the brief file made by `task_brief.py` (`references/handoff.md`), which stays the single source of requirements and exact values.

## What to send

The prompt contains, in this order:

1. One line on where this task fits in the plan.
2. The brief path, introduced as "read this first: it is your requirements, with the exact values to use verbatim" (task text, acceptance criteria, verification steps, Definition of Done items, constraints).
3. Interfaces and outcomes from earlier tasks that the brief cannot know (short), and your resolution of any ambiguity you noticed in the brief.
4. The report path (`<records>/<task-id>-report.md`) and the report contract below.

Also:

- Task baseline (`HEAD` plus tree id) and the list of unrelated changes it must not touch.
- Permitted scope: which files or modules it may change.
- The test and build commands from `dispatch.md` (`focused_test`, `full_suite`, `build`). The worker does not rediscover them.
- Paths to the skills, to read only where needed:
  - `incremental-implementation`: read the part on thin vertical slices and verify-as-you-go.
  - `test-driven-development`: read RED/GREEN/REFACTOR, the Prove-It pattern for bug fixes, and "Writing Good Tests". Skip the browser-testing and subagent sections unless the task is browser-based.

## Core rules to state in the prompt

1. Work in thin increments. Keep each step verified before the next.
2. For any behavior change: write the failing test first, run it, and confirm it fails for the right reason. Then write the minimum code to pass, then refactor with tests green. For a bug, reproduce it with a failing test before fixing.
3. For documentation or static changes with no behavior impact, say why TDD does not apply and validate another way.
4. Prefer real implementations over mocks; mock only slow, non-deterministic or side-effecting boundaries.
5. Stay inside the task. Do not refactor unrelated code, fix other issues or enlarge scope. Report them instead.
6. Do not commit. Leave all edits uncommitted. The orchestrator commits after review.
7. Do not delegate to other agents.
8. Run the focused tests during work and the full suite once on the final state before reporting. Do not edit after that run; if you do, rerun. The reviewer relies on this run instead of repeating the full suite.

## What the worker returns

The worker writes the full report to the report file and replies with only the status, a one-line test summary and its concerns. The report holds:

- status: one of `READY_FOR_REVIEW`, `NEEDS_CONTEXT`, `BLOCKED`
- changed files (new files included)
- evidence per acceptance criterion
- commands run and their actual results (failing run first, then passing)
- TDD evidence, or why it did not apply
- concerns, deferred observations, and any failure seen that it did not cause

A `BLOCKED` or `NEEDS_CONTEXT` reply does not consume a repair round.

## Repair dispatches

Send all open Critical/Required findings verbatim, plus the brief path, the report path and the attempt number. The worker fixes only those, reruns the affected checks and the full suite, appends a fix report to the same report file and replies in the same short form.

From the escalation attempt onward (attempt 4 by default) a fresh worker on a higher tier takes over (`references/dispatch-map.md`). It starts with empty context, so also send it the report path (earlier attempts and findings), the current uncommitted state, and a one-line note that earlier attempts failed so it should not repeat their approach. After an Advisory `RESUME`, regenerate the brief with `task_brief.py` so it carries the updated task text, and send any new rules the Advisory added.
