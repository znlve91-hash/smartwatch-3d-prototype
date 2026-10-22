# Task brief: T1

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: **Task T1**: Core Models, Types, Mock Catalog & Utility Functions

- **Task T1**: Core Models, Types, Mock Catalog & Utility Functions

## From tasks/todo.md: Task T1: Core Models, Types, Mock Catalog & Utility Functions

## Task T1: Core Models, Types, Mock Catalog & Utility Functions

**Description:** Establish the domain foundation for the web prototype. Define all TypeScript models (Product, Category, Tier, ColorOption, WatchFaceId, CartItem, OrderDetails). Implement the mock catalog covering 5 devices across 2 categories (Band Standard, Band Pro, Watch Standard, Watch Pro, Watch Pro Max) with full technical specifications, pricing, and color options. Provide storage and currency formatting utilities, along with Vitest unit tests verifying taxonomy, product integrity, and filtering.

**Acceptance criteria:**
- [ ] Complete TypeScript interfaces exported from `src/types/index.ts`.
- [ ] Mock catalog implemented in `src/data/products.ts` covering all 5 required tiers: Band Standard, Band Pro, Watch Standard, Watch Pro, and Watch Pro Max.
- [ ] Helper utilities for currency formatting (`formatCurrency`) and safe local storage access (`storage.ts`).
- [ ] Unit tests in `tests/products.test.ts` verifying 5 distinct models, color swatches, filter functions, and specs pass without error.

**Verification:**
- [ ] Tests pass: `npm test tests/products.test.ts`
- [ ] Build succeeds: `npm run build`

**Dependencies:** None

**Files likely touched:**
- `src/types/index.ts`
- `src/data/products.ts`
- `src/utils/formatters.ts`
- `src/utils/storage.ts`
- `tests/products.test.ts`

**Estimated scope:** Medium (4-5 files)

---
