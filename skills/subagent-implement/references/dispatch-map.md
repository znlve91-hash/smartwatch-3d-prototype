# Dispatch map

## 1. Ask for models (once per plan)

Ask the user for up to three assignments per role. Accept model IDs, reasoning settings and per-task overrides. Reuse any saved preference. One model may fill several slots, but worker and reviewer must still be separate agent instances.

| Tier | Worker | Reviewer |
|---|---|---|
| low | small, well-bounded task | small, low-risk task |
| medium | medium task or integration | medium-complexity task |
| high | complex or high-risk task; final corrections | complex or high-risk task; final review |

Make `reviewer.high` the most capable reviewer model the user approves. If the capability order is unclear, ask.

Also ask for one **advisor** assignment: the most capable approved model with the highest reasoning setting. The advisor is used only when a task is blocked (`references/advisory.md`). The worker tiers also form the escalation ladder below, so the user should put the worker models in increasing capability from low to high.

## 2. Choose a tier per task

Propose a tier for worker and reviewer separately. The user can change any of them at confirmation.

| Tier | Typical signs |
|---|---|
| low | one or two files, isolated change, clear acceptance criteria, easy to verify, no security or data impact |
| medium | several files or a module boundary, integration with existing code, moderate logic |
| high | touches auth, payments, data migrations or concurrency; public API changes; unfamiliar code; irreversible or hard-to-test behavior |

Rule of thumb: raise the reviewer tier before the worker tier when the risk is in subtle correctness or security. A high tier never permits enlarging a task.

## 3. Write `dispatch.md`

```yaml
plan: tasks/plan.md
task_list: tasks/todo.md
workspace: /path/to/project
baseline: <starting HEAD>
commands:
  focused_test: <command>
  full_suite: <command>
  build: <command or null>
models:
  worker:
    low: {model: ID, reasoning: SETTING}
    medium: {model: ID, reasoning: SETTING}
    high: {model: ID, reasoning: SETTING}
  reviewer:
    low: {model: ID, reasoning: SETTING}
    medium: {model: ID, reasoning: SETTING}
    high: {model: ID, reasoning: SETTING}
  advisor: {model: ID, reasoning: SETTING}
limits:
  max_attempts: 5            # worker attempts per task per round
  escalate_from_attempt: 4   # from this attempt the worker moves up one tier per attempt
  max_advisory_per_task: 2
  max_advisory_per_run: 6
tasks:
  T1: {worker: low, reviewer: low}
  T2: {worker: medium, reviewer: medium}
overrides: {}   # e.g. {T2: {worker: {model: ID, reasoning: SETTING}}}; an override wins over the tier
final: {reviewer: high, worker: high}
```

Keep all seven model slots (three worker, three reviewer, one advisor). Use `null` reasoning only if the backend has no such setting. List every original task ID exactly once; task IDs added or split by an Advisory are appended here by the orchestrator. If task IDs cannot be filenames, add an explicit ID-to-filename mapping here.

## 3a. Worker escalation ladder

A task's worker tier in `tasks` is its starting tier. Attempts 1 to 3 use it. From `escalate_from_attempt` (4) the worker moves up one tier per attempt, capped at `high`:

`effective tier = min(starting tier + max(0, attempt - 3), high)`

| Starting tier | Attempts 1-3 | Attempt 4 | Attempt 5 |
|---|---|---|---|
| low | low | medium | high |
| medium | medium | high | high |
| high | high | high | high |

Example: Task 02 starts on `worker.medium` (say Gemini 3.8 medium) and fails three times. Attempt 4 runs on `worker.high` (say Sonnet high); attempt 5 stays on `worker.high` because it is already the top. A per-task override only applies at the starting tier; escalation uses the model of the next tier in `models.worker`.

A running agent cannot change its model, so each escalation dispatches a fresh worker on the new tier. Give it the open findings, the current uncommitted state and the task evidence. This is an allowed replacement; keep every counter. The reviewer is not escalated. If the next tier's model is unavailable, stop and ask the user rather than substituting.

## 4. Confirm

Show the whole map: models per slot (including the advisor and the limits), tier per task with a one-line reason, and the discovered test commands. Ask: "Is this correct?" Wait for an explicit yes or edits. Update `dispatch.md` with any change before use. Dispatch only from the confirmed map. Keep execution status out of this file.
