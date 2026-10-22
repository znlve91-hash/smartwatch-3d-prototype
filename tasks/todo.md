# Task Breakdown: Smart Watch & Band 3D Interactive E-Commerce Prototype

<!-- Plan Key: smartwatch-3d-prototype -->

## Task T1: Core Models, Types, Tailwind Theme & Mock Catalog

**Description:** Set up the project foundation by configuring the Tailwind CSS theme with the specified minimalist soft purple and cyan palette, declaring all domain TypeScript schemas and interfaces, creating the complete 5-item wearable mock catalog across categories and tiers, and authoring unit tests verifying data integrity.

**Acceptance criteria:**
- [x] `tailwind.config.js` and `src/index.css` configured with soft purple & cyan palette tokens (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`) and modern typography utilities.
- [x] `src/types/index.ts` declares comprehensive TypeScript models: `Product`, `ProductCategory` (`band` | `watch`), `ProductTier` (`standard` | `pro` | `pro_max`), `ColorOption`, `WatchFaceId`, `ActiveWidgetId`, `CartItem`, and `CartState`.
- [x] `src/data/products.ts` exports exactly 5 wearable devices matching specifications: 2 Smart Bands (Standard, Pro) and 3 Smart Watches (Standard, Pro, Pro Max) with detailed specifications, pricing, and color options.
- [x] `tests/products.test.ts` authoritatively tests taxonomy completeness, pricing logic, required specs, and category constraints.

**Verification:**
- [x] Tests pass: `npm test tests/products.test.ts`
- [x] Build succeeds: `npm run build`

**Dependencies:** None

**Files likely touched:**
- `tailwind.config.js`
- `src/index.css`
- `src/types/index.ts`
- `src/data/products.ts`
- `tests/products.test.ts`

**Estimated scope:** Medium (4-5 files)

---

## Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas Engine

**Description:** Build the Three.js procedural 3D wearable model synthesis for both Smart Band (capsule chassis + wrap-around strap) and Smart Watch (round/squircle case + bezel + crown + lugs + strap), implement dynamic 512x512 CanvasTexture watch face rendering with 4 faces (Minimal, Neon, Chrono, Health), implement 5 interactive simulated widgets (Heart Rate, Steps, Weather, Music, Battery), and provide 360-degree orbit rotation controls.

**Acceptance criteria:**
- [ ] `src/components/viewer3d/WatchGeometry.ts` generates Three.js procedural meshes for Band (capsule) and Watch (case, bezel, crown, lugs, straps) with real-time material/color updating.
- [ ] `src/components/viewer3d/WatchFaceRenderer.ts` draws 4 distinct watch faces (Minimal, Neon, Chrono, Health) on offscreen canvas.
- [ ] `src/components/widgets/` contains 5 interactive smart widgets: Heart Rate (ECG wave), Steps (10k progress ring), Weather, Music Player (playback controls & equalizer), and Battery (level & eco mode).
- [ ] `src/components/viewer3d/WatchViewer3D.tsx` provides 360-degree orbit mouse/touch drag rotation, auto-rotate toggle, and lighting setup.
- [ ] `src/components/viewer3d/StudioControls.tsx` provides color swatches, face picker, camera preset buttons, and widget drawer toggle.
- [ ] `tests/simulator.test.ts` validates widget calculation bounds and watch face switching logic.

**Verification:**
- [ ] Tests pass: `npm test tests/simulator.test.ts`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task T1

**Files likely touched:**
- `src/components/viewer3d/WatchViewer3D.tsx`
- `src/components/viewer3d/WatchGeometry.ts`
- `src/components/viewer3d/WatchScreenTexture.ts`
- `src/components/viewer3d/WatchFaceRenderer.ts`
- `src/components/viewer3d/StudioControls.tsx`
- `src/components/widgets/HeartRateWidget.tsx`
- `src/components/widgets/StepsWidget.tsx`
- `src/components/widgets/WeatherWidget.tsx`
- `src/components/widgets/MusicWidget.tsx`
- `src/components/widgets/BatteryWidget.tsx`
- `src/hooks/useWatchSimulator.ts`
- `tests/simulator.test.ts`

**Estimated scope:** Large (6-8 files)

---

## Checkpoint: Foundation & 3D Interactive Engine (After Tasks T1-T2)
- [ ] Unit tests for products and simulator pass cleanly (`npm test`)
- [ ] 3D Canvas renders without WebGL console errors
- [ ] Procedural geometries and dynamic screen textures update interactively

---

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

## Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persistence

**Description:** Build the persistent shopping cart state management (`useCart` hook) with localStorage storage (`aura_cart_v1`), slide-over Cart Drawer with item quantity modification and removal, promo code discount calculation (`AURA10`, `LAUNCH20`), and a multi-step simulated checkout modal with receipt confirmation.

**Acceptance criteria:**
- [ ] `src/utils/storage.ts` provides safe localStorage wrapper with error recovery and fallback handling.
- [ ] `src/hooks/useCart.ts` handles cart item additions (preserving custom color & watch face selections), quantity changes, removals, subtotal, tax, and discount code evaluations.
- [ ] `src/components/cart/CartDrawer.tsx` renders slide-over cart panel with items list, line total calculations, empty state, and "Proceed to Checkout" CTA.
- [ ] `src/components/cart/CheckoutModal.tsx` implements multi-step simulated checkout (Shipping Info -> Simulated Payment -> Order Confirmation with tracking ID) and clears cart on completion.
- [ ] `tests/cart.test.ts` validates cart additions, item deduplication/variant keys, quantity updates, removal, discount code math, and storage persistence.

**Verification:**
- [ ] Tests pass: `npm test tests/cart.test.ts`
- [ ] Full test suite passes: `npm test`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task T1, Task T2, Task T3

**Files likely touched:**
- `src/utils/storage.ts`
- `src/hooks/useCart.ts`
- `src/components/cart/CartDrawer.tsx`
- `src/components/cart/CartItemRow.tsx`
- `src/components/cart/CheckoutModal.tsx`
- `tests/cart.test.ts`
- `src/App.tsx`

**Estimated scope:** Medium (5-6 files)

---

## Checkpoint: Final Integration & Readiness (After Tasks T1-T4)
- [ ] All 4 tasks completed and verified
- [ ] `npm test` passes with 100% success rate across all test files
- [ ] `npm run build` builds cleanly with 0 TypeScript/Vite errors
- [ ] Complete user flow operates end-to-end: Explore -> 360 3D Studio -> Customize Face & Color -> Test Widgets -> Add to Cart -> Simulated Checkout with Confirmation
