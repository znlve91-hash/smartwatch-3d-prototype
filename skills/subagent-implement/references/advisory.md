# Advisory

The Advisory is a fresh-context agent that decides what happens when a task cannot move forward. It exists so the run can continue autonomously instead of stopping at the first obstacle, while the spec stays protected.

## Authority order

1. **Spec**: highest authority. Only the user edits it. Nobody else may, including the Advisory.
2. **Plan and todo list**: live documents and only a path to the spec. The Advisory may change them. The orchestrator, workers and reviewers may not.
3. **Task criteria**: derived from the spec. They may be refined by the Advisory, never weakened below what the spec requires.

## When to call it

Call a fresh Advisory when a task is blocked:

- the task reached the attempt limit (5 attempts) and the latest verdict is still `CHANGES_REQUESTED`;
- a worker or reviewer returned `BLOCKED` and you cannot resolve it from approved sources;
- the task depends on a frozen task or on something the plan did not provide.

Limits: at most 2 consultations per task and 6 per run (see `limits` in `dispatch.md`). If a task is blocked again after its second consultation, or the run has used its consultations, stop and report to the user. Each consultation uses a new Advisory agent with no memory of earlier ones; it reads the earlier advisory records instead.

## Setup

- Model: `models.advisor` in `dispatch.md`, normally the most capable approved model with the highest reasoning setting. Verify the actual selection like any dispatch.
- Before dispatch, copy the spec to a scratch location outside the repository and record its content hash.
- The Advisory does not delegate and does not edit implementation code, tests, the spec or `dispatch.md`.

## Send the Advisory

- The spec (read-only), the plan, the todo list, `dispatch.md` task statuses, and the Definition of Done.
- The blocked task's record and its `evidence` (all findings and attempt history), plus the paths of its brief, worker report and current artifact file.
- Records of tasks it depends on, and earlier advisory records for this task.
- The trigger (which of the three above) and the stop conditions below.

## What it does

1. **Diagnose the root cause.** For example: the task is too large or vague, the worker's model is too weak, the plan is wrong or missing information, a prerequisite is missing, the reviewer's finding is wrong or disputed (rule on it with code evidence), or the spec itself is contradictory or cannot be met.
2. **Check the stop conditions first.** If one applies, the decision is `STOP`.
3. **Decide** one of:
   - `RESUME`: the task continues in a new round. Make whatever changes are needed (below), and set the worker and reviewer tier for the new round.
   - `FREEZE`: park the task. Mark it frozen in the todo list, mark or re-sequence the tasks that depend on it, and let the run continue with tasks that can still proceed safely.
   - `STOP`: end the run and report to the user.

### Allowed edits (plan and todo only)

- Todo list: split a task (keep the original ID and add suffixed IDs like `T4a`, `T4b`; never renumber), add, reorder, clarify or refine acceptance criteria and verification steps, freeze tasks.
- Plan: update the approach, ordering and constraints; add a new rule under a "Rules learned during execution" section, each with the date and a reference to the advisory record.
- Every change must trace to a spec requirement, be minimal, and never touch tasks that are already complete.
- Never weaken acceptance criteria, the Definition of Done, or tests, never drop behavior the spec requires, never mark a task complete. If the only way forward breaks a spec requirement, that is a spec conflict: `STOP`.

### Stop conditions

Decide `STOP` when continuing could cause any of these, even if the plan could technically be carried on:

- a destructive or irreversible operation;
- a security-sensitive action;
- a side effect outside the worktree that needs permission, such as pushing to a shared branch or publishing;
- a plan so broken that every way forward is a guess;
- a spec problem (contradiction, gap, or a requirement that cannot be met), or anything else that should be discussed with a human first.

The Advisory does not have to push the plan through to the end. Stopping early with a clear reason is a valid outcome.

## Advisory record

Write `<records>/advisory/<NN>-<task-id>.md`, where `NN` is the consultation number in the run. Reasons matter more than length.

```yaml
consultation: 1
task: T2
trigger: attempts_exhausted   # attempts_exhausted | blocked | dependency
decision: RESUME              # RESUME | FREEZE | STOP
root_cause: <one or two sentences>
reasons: <why this decision, and why it is safe to proceed or why it stops>
spec_check: unchanged         # the spec was not edited; hash before and after
plan_changes: []              # each: section, what changed, spec requirement it traces to
todo_changes: []              # each: task ID, what changed (split, new criteria, frozen, reordered)
rules_added: []               # each: rule text and where it was added
resume: {worker_tier: high, reviewer_tier: medium}   # RESUME only
frozen: []                    # task IDs frozen by this decision
stop_reason: null             # STOP only: which stop condition, and what the user must decide
next_steps: []
```

## What the orchestrator does after the Advisory returns

1. Compare the spec hash with the pre-dispatch hash. If it changed, restore the spec from the scratch copy, treat the decision as `STOP` and tell the user. Also check that only the plan, the todo list and the advisory record changed; undo anything else and treat it as `STOP`.
2. Check that the record exists, the decision is valid, and every edit is listed.
3. If the plan or todo list is tracked by Git, commit those changes separately following `git-workflow-and-versioning`. The records directory stays uncommitted.
4. Update `dispatch.md` for new or split task IDs: assign tiers using the dispatch-map criteria with the models the user already confirmed (no new confirmation unless a model changes), and report these additions at the end.
5. Update the task record: for `RESUME`, increment `round`, reset `attempt` to 1/5 (the only way the attempt count resets), apply the advisory's tiers, and keep the earlier rounds' findings in `evidence`; for `FREEZE`, set `FROZEN`; for `STOP`, stop and report.
6. Continue the run according to the decision.
