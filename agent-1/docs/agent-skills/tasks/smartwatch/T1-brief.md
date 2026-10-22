# Task brief: T1

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: **Task T1: Core Models, Types, Tailwind Theme & Mock Catalog**

- **Task T1: Core Models, Types, Tailwind Theme & Mock Catalog**
  - Establish base Tailwind configuration (palette tokens, typography, utilities) and index HTML.
  - Define all TypeScript contracts (`Product`, `CartItem`, `ColorOption`, `WatchFaceId`, `ActiveWidgetId`).
  - Create the complete 5-item mock dataset with detailed specs, colors, and 3D configuration flags.
  - Author schema and taxonomy unit tests in `tests/products.test.ts`.

## From tasks/todo.md: Task T1: Core Models, Types, Tailwind Theme & Mock Catalog

## Task T1: Core Models, Types, Tailwind Theme & Mock Catalog

**Description:** Set up the project foundation by configuring the Tailwind CSS theme with the specified minimalist soft purple and cyan palette, declaring all domain TypeScript schemas and interfaces, creating the complete 5-item wearable mock catalog across categories and tiers, and authoring unit tests verifying data integrity.

**Acceptance criteria:**
- [ ] `tailwind.config.js` and `src/index.css` configured with soft purple & cyan palette tokens (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`) and modern typography utilities.
- [ ] `src/types/index.ts` declares comprehensive TypeScript models: `Product`, `ProductCategory` (`band` | `watch`), `ProductTier` (`standard` | `pro` | `pro_max`), `ColorOption`, `WatchFaceId`, `ActiveWidgetId`, `CartItem`, and `CartState`.
- [ ] `src/data/products.ts` exports exactly 5 wearable devices matching specifications: 2 Smart Bands (Standard, Pro) and 3 Smart Watches (Standard, Pro, Pro Max) with detailed specifications, pricing, and color options.
- [ ] `tests/products.test.ts` authoritatively tests taxonomy completeness, pricing logic, required specs, and category constraints.

**Verification:**
- [ ] Tests pass: `npm test tests/products.test.ts`
- [ ] Build succeeds: `npm run build`

**Dependencies:** None

**Files likely touched:**
- `tailwind.config.js`
- `src/index.css`
- `src/types/index.ts`
- `src/data/products.ts`
- `tests/products.test.ts`

**Estimated scope:** Medium (4-5 files)

---
