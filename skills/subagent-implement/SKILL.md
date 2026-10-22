---
name: subagent-implement
description: Execute or resume an approved implementation plan autonomously through subagents, one task at a time, each task with a fresh worker and a fresh independent reviewer, escalating the worker model on repeated failure, calling an Advisory agent when a task is blocked, and finishing with one whole-result review. Make sure to use this skill whenever the user asks to execute the plan or task list with subagents, delegate tasks to workers and reviewers, run the plan autonomously, or continue an interrupted delegated run, even if they do not name the skill. Requires an approved spec and plan with ordered tasks, acceptance criteria and verification steps from planning-and-task-breakdown, plus subagent tools; send missing or unapproved planning back to planning before any implementation.
---

# Subagent Implement

## Overview

This is the execution layer that runs after `planning-and-task-breakdown`. It is meant to run autonomously: no human checks between tasks, so the run has to handle failure and obstacles on its own and stop only when continuing would be unsafe.

Authority order: the **spec** is highest and only the user edits it. The **plan and todo list** are live documents, only a path to the spec, and only the Advisory edits them. The orchestrator (you) dispatches agents, keeps records, runs checks and makes commits. You do not edit implementation, the spec, the plan or the todo list, because the independence of the work depends on separate agents doing each job. Workers, reviewers and the Advisory never delegate further, and each dispatch covers exactly one task.

Every task gets its own independent reviewer because that reviewer is the only gate before a defect gets built on by later tasks. Each task costs two agents, so the approach is deliberately thorough rather than cheap: the per-task review is a light rubric, and the full five-axis `code-review-and-quality` review is saved for the end.

## When to use

- The user asks to execute an approved plan or task list with subagents, or to resume an interrupted delegated run.
- A spec and plan exist with ordered tasks, acceptance criteria, verification steps and dependencies.

Do not use it when there is no approved plan (go back to planning), for a single small change that one agent can do directly, or when subagent tools are unavailable. Inline self-review is not a substitute for independent review.

## Agents and context budget

- Per task: one fresh worker, then one fresh reviewer, dispatched sequentially. Reuse that same pair for context requests, repairs and re-reviews. Independence means separation from the implementer, not a new reviewer every round. Never reuse agents across tasks.
- Start every agent without the orchestrator's history or another agent's conversation, so the reviewer judges the work product and not the implementer's reasoning. Send only task-local inputs (`references/worker-brief.md`), with bulk material passed as file paths, never pasted (`references/handoff.md`). A new agent identity alone does not give isolation; use the backend's fresh-context option (checked in Setup).
- Add no exploration agents, second review seats, per-finding fixers or other helpers beyond the roles below. Extra agents multiply cost and blur who is accountable for what.
- Replace a task agent only when it is unavailable or unusable, or for a worker escalation (below), never to dodge a finding, the attempt limit or a model assignment. Record the reason and the new identity in the task evidence, give the replacement isolated context plus the durable task evidence, and preserve every counter. If replacements keep failing, stop and report instead of multiplying agents.
- Advisory: a new fresh Advisory for every consultation, on the advisor model, only when a task is blocked (`references/advisory.md`). At most 2 consultations per task and 6 per run.
- Final stage budget: one fresh whole-result reviewer and, only if blocking findings exist, one fresh correction worker. The same final reviewer does one scoped re-review of the correction; replace that reviewer only if it is unavailable, keeping a single review seat. Both final roles are isolated from the task agents and from each other. No finding validator, no second broad review, no second fix wave, and no Advisory at this stage. After an interruption, resume the recoverable instances.

## Setup (before any dispatch)

1. Read the project rules, the approved spec, the plan and the task list. Defaults are `tasks/plan.md` and `tasks/todo.md`; keep custom paths or an external tracker. If approval, criteria, verification, dependencies or consistency are missing, resolve them before the affected work. Task splitting or scope changes go to the Advisory (when a task is blocked) or back to planning (before the run starts). Never edit the plan or todo list yourself to make a review pass, and never edit the spec.
2. Find these skills by installed name, including plugin namespaces: `incremental-implementation`, `test-driven-development`, `code-review-and-quality`, `git-workflow-and-versioning`. Resolve any Definition of Done or checklist references they cite. Missing required skills or missing subagent capability block execution.
3. Check the branch, starting HEAD and staged, unstaged and untracked changes. Preserve unrelated work and stop if it overlaps and cannot be separated. Honor existing user and project authorization for edits, branches or worktrees, pushes and version changes.
4. Check that `python3` and `git` run so the scripts in `scripts/` work (`references/handoff.md` has a manual fallback). Discover the repository's focused-test, full-suite and build commands once, from its own manifests, wrappers, README and CI config. Pass them to workers so they do not each rediscover them, and never assume a default such as `npm test`.
5. Read the dispatch backend's documentation, then confirm with a trivial dispatch that it can (a) start a subagent with empty context and (b) set model and reasoning per subagent. If (a) fails, fall back to a self-contained brief file and tell the user the isolation limit. If (b) fails, tell the user and ask how to proceed. Never substitute models silently.
6. Choose a stable `<plan-key>` and create `docs/agent-skills/tasks/<plan-key>/` as `<records>`. Add it to `.gitignore` if it is not ignored. Records hold `dispatch.md`, one `<task-id>.md` per task, `advisory/` and `final.md`. They are execution state, not another task checklist, and they are never committed. Handoff files (briefs, worker reports, artifact diffs) sit flat in the same folder (`references/handoff.md`). Do not create aggregate progress files or separate execution reports.

## Models and dispatch map (the user confirms before work starts)

Follow `references/dispatch-map.md`:

1. Ask once per plan which model and reasoning setting to use for worker low/medium/high, reviewer low/medium/high and the advisor (normally the most capable model). Reuse saved preferences. Models may be shared across slots, but implementation and review are always separate agent instances.
2. Propose a tier per task from the criteria in that file, with a one-line reason, and write `dispatch.md` including the limits.
3. Show the whole map and wait for an explicit yes or edits. Dispatch nothing before that.
4. Before every dispatch, replacement, escalation or advisory call, resolve the exact model and settings from the confirmed map, pass them to the backend and verify the actual selection when the backend exposes it. A missing assignment, placeholder or mismatch blocks the dispatch. A high tier never authorizes enlarging a task.

## Task cycle

Run tasks sequentially in approved dependency order, skipping frozen ones. Create the task record (`references/task-record.md`) before the first dispatch and update it in place at each phase change. Only the orchestrator updates task status and evidence in the original task list; task definitions change only through the Advisory.

1. **Worker.** Take the task baseline with `review_package.py snapshot`, extract the brief with `task_brief.py`, then dispatch with the prompt from `references/worker-brief.md` (brief and report as paths), on the tier for the current attempt. The worker leaves its edits uncommitted and returns `READY_FOR_REVIEW`, `NEEDS_CONTEXT` or `BLOCKED` with evidence. Answer context requests from approved sources and the spec; if the answer would change scope, treat the task as blocked (step 4). A blocked worker consumes no attempt.
2. **Prepare the artifact.** Stop worker edits. Run the formatter or linter that would run at commit; if it changes code, rerun the checks so the worker's test evidence still describes this artifact. The full suite runs once per artifact (by the worker), and the reviewer reruns it only when the evidence is stale or doubtful, which keeps slow suites from running twice per task. Write the artifact with `review_package.py package`: the full diff against the task baseline, new files included, unrelated pre-existing changes left out because they are in the baseline. It prints the file path and the content hash. Never substitute `HEAD~1`.
3. **Reviewer.** Dispatch a separate fresh reviewer with `references/task-review-rubric.md` and three paths: the brief, the worker's report and the artifact file, plus the hash. Worker claims are leads to verify, not proof. The reviewer does not edit; any mutation experiment runs in a disposable copy.
4. **Verdict.**
   - `APPROVED`: go to commit.
   - `CHANGES_REQUESTED` with `attempt` below 5: send all open Critical and Required findings verbatim to a worker, increment `attempt` before the correction, rerun the affected checks and return the new artifact to the same reviewer. The re-review checks earlier findings, regressions and continued compliance. Attempts 2 and 3 go to the same worker. From attempt 4, escalate: a fresh worker one tier higher takes over (attempt 5 goes up another tier, capped at high), following `references/dispatch-map.md`. The reviewer stays.
   - `CHANGES_REQUESTED` at attempt 5, or `BLOCKED` from a worker or reviewer that you cannot resolve from approved sources: the task is blocked. Set it to `ADVISORY` and call the Advisory (`references/advisory.md`). Do not commit.
   Optional and Nit findings never block. Findings are never waived, checks never weakened, scope never enlarged and the attempt limit never raised to get a pass.
5. **Advisory outcome.** The Advisory returns `RESUME`, `FREEZE` or `STOP`. Verify its work as `references/advisory.md` says (spec untouched, only plan, todo and record changed), then act: `RESUME` starts a new round with a fresh attempt count and the tiers the Advisory chose, `FREEZE` parks the task and continues with tasks that can still proceed, `STOP` ends the run and reports to the user. Edits to the plan and todo list are allowed only this way. A spec problem is never fixed by editing the spec: it is a `STOP` for the user.
6. **Commit.** Confirm the approval matches the current artifact (`review_package.py hash --expect`) and the mandatory checks pass. Any implementation edit, including a hook's, invalidates approval and needs an independent re-review, which consumes an attempt; if none is left, the task is blocked (step 4). A commit hook that changes only formatting needs a check rerun and a behavior-neutral comparison, not a new attempt. Follow `git-workflow-and-versioning`: stage only the approved task changes, inspect the exact staged scope, make and verify a local commit, record its SHA, then update the original task list. A failed commit leaves the task incomplete and blocks advancement. If a satisfying commit already exists, review and record it rather than making an empty one. Pushes, merges and version changes follow their own authorization.
7. Plan-defined human checkpoints still apply before moving on.

## Final review

After all non-frozen tasks are committed, integration checks pass and human checkpoints are done, follow `references/final-review.md` (the reviewer gets the whole-result package as a file): one whole-result review with `code-review-and-quality`, at most one correction pass, one scoped re-review. Unresolved blocking findings, failed checks or a scope decision end as `FINAL_BLOCKED` and go to the user. Never start another wave. If any task was frozen, report the run as partial.

## Recovery

Read the spec, plan, task list, `dispatch.md`, the task records, `advisory/` and `final.md`, then reconcile them with Git state and durable evidence. Resume the recorded phase with the saved attempt, round and advisory counts; a restart never resets a budget, and only an Advisory `RESUME` starts a new round. Approval holds only for the exact artifact it covered, and completion needs its verified commit. Briefs, reports and artifact files in `<records>` are recoverable evidence; regenerate a missing one with the scripts from the recorded baseline. Recover missing bookkeeping instead of redispatching completed tasks. For an interrupted advisory call, reuse its record if it was written, otherwise call a new Advisory (this does not count twice). For an interrupted final pass, reuse the recorded agents and artifacts. If the evidence cannot show whether a step finished, or records contradict each other, stop and ask.

## Finish

Report briefly in chat: tasks completed, the models actually used (including escalations), verification run, advisory decisions and what they changed in the plan, todo list and rules, frozen tasks, the original final verdict, the final state and correction outcome, commit SHAs, and remaining blockers or Optional findings.

## Common rationalizations

| Rationalization | Required response |
|---|---|
| "The worker already reviewed it." | A separate reviewer checks the exact artifact. |
| "These tasks are related; combine them." | Dispatch one original task at a time. |
| "I can patch this faster myself." | Send the fix to the worker; the orchestrator never edits implementation. |
| "One more attempt will work." | Stop at five attempts and call the Advisory. |
| "The same model just needs another try." | From attempt 4, escalate the worker one tier. |
| "I'll tweak the plan so this task passes." | Only the Advisory edits the plan and todo list, and never to weaken criteria. |
| "The spec is wrong, I'll fix it." | Nobody but the user edits the spec; stop and report. |
| "The Advisory can push on even though this is risky." | A stop condition means `STOP`, however much of the plan is left. |
| "Tests passed before that last edit." | Verify the resulting version and renew the approval. |
| "Restarting gives a fresh budget." | Recover the saved counts; only an Advisory `RESUME` starts a new round. |
| "A fresh agent means isolated context." | Disable inherited history and send only scoped inputs. |
| "Another helper or reviewer will make this safer." | Keep the task pair, the bounded final roles and the Advisory; add no duplicate seats. |
| "The light review is enough for the final pass too." | The final pass uses full `code-review-and-quality` on the whole result. |
| "The user will not mind if I pick the models." | Dispatch only from the map the user confirmed. |

## Red flags

- The orchestrator edits implementation, an agent reviews its own work, agents delegate, history is inherited or agents are reused across tasks.
- Several task IDs in one dispatch, rewritten criteria or bypassed checkpoints.
- Briefs, diffs, reports or accumulated history pasted into a dispatch prompt instead of passed as file paths.
- Dispatch before the user confirmed the map, or silent model substitution.
- New files missing from the review artifact, approval reused after an edit, or a commit before approval.
- A reset attempt counter outside an Advisory `RESUME`, a blocked task committed, or escalation skipped from attempt 4.
- Anyone other than the Advisory editing the plan or todo list, or anyone at all editing the spec.
- An Advisory decision without a record, a record without reasons, or advisory edits that weaken criteria, the Definition of Done or tests.
- Pushing, publishing or another outside side effect, a destructive or security-sensitive step, or a guessed plan continued past a stop condition.
- Records committed to Git, aggregate progress files, or recovery evidence that lives only in chat.
- Extra helpers or review seats, a finding validator, a second broad final review or a second correction wave.
- Final corrections committed without a scoped re-review of the exact corrected artifact.

## Verification

- [ ] The spec is unchanged, and the plan and todo list changed only through recorded Advisory decisions.
- [ ] The user confirmed the dispatch map (including the advisor and limits), and every dispatch matches it (tier or explicit override).
- [ ] Each task used one fresh isolated worker and reviewer, reused for repairs; replacements and escalations have recorded reasons and kept the counters.
- [ ] From attempt 4 the worker was escalated one tier per attempt, capped at the highest tier.
- [ ] No inherited orchestrator history, cross-task reuse, nested delegation or extra seats.
- [ ] Dispatches passed the brief, report and artifact as file paths, and every artifact hash came from `review_package.py`.
- [ ] Workers got the brief and the repository's test commands; task reviewers used the rubric; the final reviewer used `code-review-and-quality`.
- [ ] Each task has one compact record with the current artifact hash, test result, open findings, attempt, round and recoverable evidence.
- [ ] No task exceeded five attempts per round; blocked tasks went to the Advisory and stay uncommitted unless resumed and approved.
- [ ] Every Advisory consultation has a record with decision, reasons, and what changed in the plan, todo list and rules; limits (2 per task, 6 per run) were respected.
- [ ] Every completed task has an approval matching its artifact, a verified commit SHA and an updated original task list.
- [ ] The records directory is ignored by Git and not committed.
- [ ] One whole-result review at the highest approved reviewer assignment; at most one correction worker and one scoped re-review; frozen tasks reported as partial.
- [ ] Any final correction was approved on its exact artifact before commit; mandatory checks, commits and human checkpoints are satisfied.
