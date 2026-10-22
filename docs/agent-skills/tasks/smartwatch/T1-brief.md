# Task brief: T1

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: Task T1: Core Models, Data Schemas, Mock Catalog & Foundation Setup

### Task T1: Core Models, Data Schemas, Mock Catalog & Foundation Setup
- **Scope:** Define data models, mock product catalog according to the 5-tier taxonomy (Band Standard/Pro; Watch Standard/Pro/Pro Max), watch face presets, widget defaults, formatting utilities, and base project configuration (Tailwind, PostCSS, Vitest).
- **Deliverables:**
  - `tailwind.config.js`, `postcss.config.js`, `vite.config.js`
  - `src/data/products.js` (complete catalog with specs, colorways, pricing, tags)
  - `src/data/watchFaces.js` (metadata for Minimal, Neon, Chrono, Health)
  - `src/data/widgets.js` (metadata & simulation defaults for Heart Rate, Steps, Weather, Music, Battery)
  - `src/utils/formatters.js` (VND/USD currency, dates, numbers)
  - `tests/catalog.test.jsx` (catalog taxonomy & schema validation tests)

## From tasks/todo.md: Task T1: Core Models, Data Schemas, Mock Catalog & Foundation Setup

## Task T1: Core Models, Data Schemas, Mock Catalog & Foundation Setup

**Description:** Configure build tooling (Tailwind, PostCSS, Vitest), define data models, author the comprehensive mock product catalog matching the 5 taxonomy segments (Band Standard/Pro; Watch Standard/Pro/Pro Max), mock watch face presets, mock widget configurations, and implement catalog unit tests.

**Acceptance Criteria:**
- [ ] Build & configuration files (`tailwind.config.js`, `postcss.config.js`, `vite.config.js`) configured with project color tokens (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`).
- [ ] `src/data/products.js` exports a rich catalog of wearable products strictly categorized into:
  - Band: Standard (e.g. NovaBand Flow) & Pro (e.g. NovaBand Pro Elite)
  - Smart Watch: Standard (e.g. NovaWatch Core), Pro (e.g. NovaWatch Pro), & Pro Max (e.g. NovaWatch Pro Max Ultra)
- [ ] Each product includes detailed specs (display, battery, water resistance, weight, sensors, casing material), colorways, pricing, and 3D configuration presets.
- [ ] `src/data/watchFaces.js` exports metadata for 4 watch faces: Minimal, Neon, Chrono, Health.
- [ ] `src/data/widgets.js` exports configuration and initial mock state for 5 simulated widgets: Heart Rate, Steps, Weather, Music, Battery.
- [ ] `src/utils/formatters.js` provides currency (VND/USD), number, and date formatting helpers.
- [ ] Unit tests in `tests/catalog.test.jsx` validate that every catalog product complies with the required schema and taxonomy rules.

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`

**Dependencies:** None

---
