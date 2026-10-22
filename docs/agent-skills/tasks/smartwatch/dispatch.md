plan: tasks/plan.md
task_list: tasks/todo.md
workspace: c:/Users/Admin/Documents/antigravity/agent-run-2
baseline: 90d764531c42087ebc1412e271f5cf984ba6eaae
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
