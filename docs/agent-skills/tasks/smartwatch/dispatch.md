plan: tasks/plan.md
task_list: tasks/todo.md
workspace: c:\Users\Admin\Documents\antigravity\agent-run-3
baseline: 22f7fca0fbe429615384be46fc42520a0741b77e
tree_baseline: acce66022288d0a0240d8afe1050d8f6c4c475e7
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
  T1: {worker: low, reviewer: low}
  T2: {worker: medium, reviewer: medium}
  T3: {worker: medium, reviewer: medium}
  T4: {worker: medium, reviewer: medium}
overrides: {}
final: {reviewer: high, worker: high}
