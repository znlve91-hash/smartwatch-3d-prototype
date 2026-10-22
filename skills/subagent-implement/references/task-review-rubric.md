# Per-task review rubric

A light review for one task. It is deliberately smaller than the full `code-review-and-quality` skill, which is reserved for the final review. The reviewer starts with empty context and does not edit implementation.

## Inputs to send

Three file paths: the brief (task text, acceptance criteria, verification steps, Definition of Done items, constraints), the worker's report (evidence), and the artifact file (diff against the task baseline, new files included) with its content hash. Also the repository's test commands. Do not paste their contents into the prompt.

## What the reviewer checks

1. **Acceptance criteria.** Inspect the code against every criterion directly. Worker claims are leads to verify, not evidence.
2. **Correctness.** Logic, edge cases, error handling, and behavior that the criteria imply but do not spell out.
3. **Tests.** Do the tests prove the behavior? Would they fail if the feature broke? Do they assert behavior rather than mock calls? Read the worker's test evidence and check it covers this exact artifact (same hash, nothing edited since). Rerun the focused tests, which are cheap. Rerun the full suite only if the evidence is missing, stale or inconsistent, if the orchestrator's pre-review formatting changed code, or if you have a specific reason to doubt it. Say in the review which tests you reran and why.
4. **Scope.** Only task-related changes. Flag unrelated edits, scope creep and missing pieces.
5. **Obvious risks.** Security (input handling, secrets, auth), data loss, and a clear performance problem, only where this task touches them. Leave deep analysis of these to the final review.
6. **Structure.** Note a problem that would be costly to fix after later tasks build on it, such as a wrong module boundary or a leaking interface.

Lead with the finding that most changes the outcome. If there is one structural problem and ten nits, the structural problem is the review.

## Severity labels

- **Critical**: breaks a criterion, loses data, or opens a security hole. Blocks.
- **Required**: must be fixed before approval (default when unlabeled). Blocks.
- **Optional**: worth considering. Does not block.
- **Nit**: style or preference. Does not block.

## Output

Return `APPROVED`, `CHANGES_REQUESTED` or `BLOCKED`, plus:

- the artifact hash reviewed
- which criteria and checks were covered, and how
- findings, each with a stable ID, severity, location, impact and the expected fix; propose the concrete move rather than only naming the problem

Approve only when every mandatory criterion and check is satisfied and no Critical or Required finding is open. Return `BLOCKED` if the artifact is inaccessible or a mandatory check cannot run.

## On re-review

Check that each earlier finding is fixed, look for regressions caused by the fix, and confirm the criteria still hold. Do not restart a broad review.
