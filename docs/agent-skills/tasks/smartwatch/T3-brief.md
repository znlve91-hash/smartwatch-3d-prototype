# Task brief: T3

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: Task T3: UI Dashboard, Filters, Product Showcase & Comparison

### Task T3: UI Dashboard, Filters, Product Showcase & Comparison
- **Scope:** Build the responsive minimalist UI framework: sticky glassmorphic header, hero 3D interactive stage, category & tier segmented filters (Band Standard/Pro, Watch Standard/Pro/Pro Max), responsive product grid, product card with quick-preview and 3D triggers, and product detail comparison modal.
- **Deliverables:**
  - `src/components/common/Header.jsx`, `Footer.jsx`, `Badge.jsx`
  - `src/components/hero/HeroSection.jsx`
  - `src/components/catalog/ProductFilter.jsx`
  - `src/components/catalog/ProductCard.jsx`
  - `src/components/catalog/ProductGrid.jsx`
  - `src/components/catalog/ProductDetailModal.jsx`
  - `tests/catalog.test.jsx` (UI filter and rendering verification)

## From tasks/todo.md: Task T3: UI Dashboard, Filters, Product Showcase & Comparison

## Task T3: UI Dashboard, Filters, Product Showcase & Comparison

**Description:** Build the modern minimalist user interface with light purple/cyan palette (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`), featuring a sticky glassmorphic header, hero 3D interactive stage, category & tier segmented filtering controls, product grid with informative product cards, "Try in 3D" quick preview trigger, and a comprehensive product detail modal with specs comparison.

**Acceptance Criteria:**
- [ ] UI adopts the minimalist light theme with soft purple/cyan accents and glassmorphism styling (`src/index.css`, Tailwind classes).
- [ ] `src/components/common/Header.jsx` includes brand identity (*NOVA WEARABLES*), category navigation, search trigger, and cart drawer toggle button with dynamic badge count.
- [ ] `src/components/hero/HeroSection.jsx` embeds the interactive 3D studio with call-to-action badges and live spec highlights.
- [ ] `src/components/catalog/ProductFilter.jsx` provides segmented controls to filter by category (All, Band, Watch) and tier (Standard, Pro, Pro Max) with real-time reactive filtering.
- [ ] `src/components/catalog/ProductGrid.jsx` and `ProductCard.jsx` render responsive product cards displaying pricing, category/tier badge, key specs, color swatches, "Try in 3D" button, and "Add to Cart" button.
- [ ] `src/components/catalog/ProductDetailModal.jsx` opens an expanded view featuring a dedicated 3D viewer, deep-dive specifications table, and color/face customizers.
- [ ] `src/components/common/Footer.jsx` renders a clean minimalist footer with brand links, guarantees, and copyright.
- [ ] Tests in `tests/catalog.test.jsx` verify filtering logic, tier badges, and modal visibility.

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task T1, Task T2

---
