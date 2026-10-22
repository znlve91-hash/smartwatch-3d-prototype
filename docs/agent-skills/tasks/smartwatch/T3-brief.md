# Task brief: T3

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: **Task T3: UI Dashboard, Filters, Product Showcase & Comparison Matrix

- **Task T3: UI Dashboard, Filters, Product Showcase & Comparison Matrix**
  - Build navigation header (`Navbar`), hero section, category tabs (`Band` vs `Watch`), and tier filters (`Standard`, `Pro`, `Pro Max`).
  - Build product catalog grid (`ProductCatalog`, `ProductCard`) with live color swatches and "3D Studio" trigger.
  - Build side-by-side comparison modal (`CompareModal`) with detailed hardware spec breakdown.
  - Integrate 3D preview seamlessly into the hero and studio sections.

## From tasks/todo.md: Task T3: Modern Minimalist UI Layout, Product Catalog, Filters & Model Comparison

## Task T3: Modern Minimalist UI Layout, Product Catalog, Filters & Model Comparison

**Description:** Implement the application shell, modern minimalist light theme UI layout, responsive navigation header with cart trigger, high-impact hero showcase with embedded 3D viewer, product catalog grid with category (Band vs Watch) and tier filtering (Standard, Pro, Pro Max), and a side-by-side hardware comparison modal.

**Acceptance criteria:**
- [ ] `src/components/layout/Navbar.tsx` renders brand logo, navigation links, search trigger, and cart drawer button with count badge.
- [ ] `src/components/catalog/ProductCatalog.tsx` displays filterable product grid with category tabs (`All`, `Smart Bands`, `Smart Watches`) and tier pill filters (`Standard`, `Pro`, `Pro Max`).
- [ ] `src/components/catalog/ProductCard.tsx` renders product image/preview, tier badge, color variant selector, pricing, and "3D Studio" & "Add to Bag" action buttons.
- [ ] `src/components/catalog/CompareModal.tsx` provides a side-by-side feature comparison table across tiers and categories.
- [ ] `src/App.tsx` integrates Hero Showcase, 3D Interactive Studio section, Catalog Grid, and Comparison modal with smooth scrolling.

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Visual check: Responsive layout, minimalist soft purple/cyan palette, glassmorphism cards.

**Dependencies:** Task T1, Task T2

**Files likely touched:**
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/catalog/ProductCatalog.tsx`
- `src/components/catalog/ProductCard.tsx`
- `src/components/catalog/TierFilter.tsx`
- `src/components/catalog/CompareModal.tsx`
- `src/components/common/Button.tsx`
- `src/components/common/Badge.tsx`
- `src/App.tsx`

**Estimated scope:** Medium (6-8 files)

---
