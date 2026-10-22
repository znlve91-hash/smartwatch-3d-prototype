# Task brief: T3

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: **Task T3**: UI Dashboard, Category/Tier Filters, Product Showcase & C

- **Task T3**: UI Dashboard, Category/Tier Filters, Product Showcase & Comparison Modal

## From tasks/todo.md: Task T3: UI Dashboard, Filters, Product Showcase & Comparison Modal

## Task T3: UI Dashboard, Filters, Product Showcase & Comparison Modal

**Description:** Implement the modern minimalist user interface following the light violet/cyan aesthetic (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`). Create the header navigation with brand badge and cart trigger, category & tier filter tabs (All, Bands, Smart Watches), responsive product grid cards with key spec pills and quick-customization triggers, and a side-by-side technical specification comparison modal comparing up to 3 devices across 8 technical dimensions.

**Acceptance criteria:**
- [ ] Responsive navigation bar (`Navbar.tsx`) with brand logo, category links, and cart badge.
- [ ] Category & tier filtering component (`FilterTabs.tsx`) allowing users to filter by All, Bands (Standard, Pro), and Watches (Standard, Pro, Pro Max).
- [ ] Product card grid (`ProductCatalog.tsx`, `ProductCard.tsx`) with pricing, tier badge, spec pills, and "Preview in 3D" trigger that switches the active 3D model.
- [ ] Side-by-side comparison modal (`ComparisonModal.tsx`) comparing specs (display, battery, water resistance, sensors, weight, casing) across selected models.
- [ ] Modern minimalist Tailwind styling with light purple/cyan gradients and responsive design.

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Visual check: Tailwind styles and layout render cleanly without overflow or visual defects.

**Dependencies:** Task T1

**Files likely touched:**
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/catalog/ProductCatalog.tsx`
- `src/components/catalog/ProductCard.tsx`
- `src/components/catalog/FilterTabs.tsx`
- `src/components/catalog/ComparisonModal.tsx`
- `src/components/common/Badge.tsx`
- `src/components/common/Button.tsx`

**Estimated scope:** Medium (5-6 files)

---
