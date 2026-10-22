plan: tasks/plan.md
task_list: tasks/todo.md
workspace: c:/Users/Admin/Documents/antigravity/agent-run-1
baseline: b64848a7c05655efc538597bbc9d915120a16be5
commands:
  focused_test: npm test
  full_suite: npm test
  build: npm run build
models:
  worker:
    low: {model: inherit, reasoning: default}
    medium: {model: inherit, reasoning: default}
    high: {model: inherit, reasoning: default}
  reviewer:
    low: {model: inherit, reasoning: default}
    medium: {model: inherit, reasoning: default}
    high: {model: inherit, reasoning: default}
  advisor: {model: inherit, reasoning: default}
limits:
  max_attempts: 5
  escalate_from_attempt: 4
  max_advisory_per_task: 2
  max_advisory_per_run: 6
tasks:
  T1: {worker: medium, reviewer: medium}
  T2: {worker: high, reviewer: high}
  T3: {worker: medium, reviewer: medium}
  T4: {worker: medium, reviewer: medium}
overrides: {}
final: {reviewer: high, worker: high}
