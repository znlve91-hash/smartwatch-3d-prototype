# Task List: Smart Watch & Fitness Band 3D Interactive Web Prototype

## Task T1: Core Models, Types, Mock Catalog & Utility Functions

**Description:** Establish the domain foundation for the web prototype. Define all TypeScript models (Product, Category, Tier, ColorOption, WatchFaceId, CartItem, OrderDetails). Implement the mock catalog covering 5 devices across 2 categories (Band Standard, Band Pro, Watch Standard, Watch Pro, Watch Pro Max) with full technical specifications, pricing, and color options. Provide storage and currency formatting utilities, along with Vitest unit tests verifying taxonomy, product integrity, and filtering.

**Acceptance criteria:**
- [x] Complete TypeScript interfaces exported from `src/types/index.ts`.
- [x] Mock catalog implemented in `src/data/products.ts` covering all 5 required tiers: Band Standard, Band Pro, Watch Standard, Watch Pro, and Watch Pro Max.
- [x] Helper utilities for currency formatting (`formatCurrency`) and safe local storage access (`storage.ts`).
- [x] Unit tests in `tests/products.test.ts` verifying 5 distinct models, color swatches, filter functions, and specs pass without error.

**Verification:**
- [x] Tests pass: `npm test tests/products.test.ts`
- [x] Build succeeds: `npm run build`

**Dependencies:** None

**Files likely touched:**
- `src/types/index.ts`
- `src/data/products.ts`
- `src/utils/formatters.ts`
- `src/utils/storage.ts`
- `tests/products.test.ts`

**Estimated scope:** Medium (4-5 files)

---

## Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas System

**Description:** Build the Three.js 3D rendering pipeline and dynamic offscreen canvas texture engine. Implement procedural 3D geometries for Band (capsule + curved strap) and Watch (Standard, Pro, Pro Max with rugged bumper and rotating crown). Create the dynamic 2D canvas renderer supporting 4 watch faces (Minimal, Neon, Chrono, Health) and interactive simulated telemetry widgets (live pulsing heart rate, step counter, weather toggle, music playback, battery monitor). Implement `ViewerContext` and interactive camera controls (360° orbit rotation, auto-rotate turntable, reset view).

**Acceptance criteria:**
- [x] Three.js scene manager with WebGLRenderer, lights, damping OrbitControls, and auto-rotation toggle in `src/components/viewer3d/SceneManager.ts`.
- [x] Procedural geometries for Band (Standard/Pro) and Watch (Standard/Pro/Pro Max) with customizable chassis and strap colors in `src/components/viewer3d/proceduralMeshes.ts`.
- [x] Dynamic offscreen canvas texture renderer in `src/components/viewer3d/watchFaceCanvas.ts` supporting Minimal, Neon, Chrono, and Health watch faces.
- [x] Interactive widget telemetry simulator (heart rate pulse & measurement, step increment, weather toggle, music player, battery status) in `src/context/ViewerContext.tsx`.
- [x] React 3D viewer component and control overlay (`WatchViewer3D.tsx`, `ViewerControlsOverlay.tsx`).
- [x] Unit tests in `tests/watchFaceCanvas.test.ts` verifying face rendering logic, color themes, and widget updates pass.

**Verification:**
- [x] Tests pass: `npm test tests/watchFaceCanvas.test.ts`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task T1

**Files likely touched:**
- `src/components/viewer3d/SceneManager.ts`
- `src/components/viewer3d/proceduralMeshes.ts`
- `src/components/viewer3d/watchFaceCanvas.ts`
- `src/components/viewer3d/WatchViewer3D.tsx`
- `src/components/viewer3d/ViewerControlsOverlay.tsx`
- `src/context/ViewerContext.tsx`
- `tests/watchFaceCanvas.test.ts`

**Estimated scope:** Medium-Large (6-7 files)

---

## Checkpoint: After Tasks T1-T2
- [x] Core data models and 3D rendering engine compile cleanly
- [x] Vitest unit tests pass (`npm test`)
- [x] 3D viewer renders procedurally without external asset dependencies

---

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

## Task T4: Client-side Cart, LocalStorage Persistence & Multi-Step Simulated Checkout

**Description:** Implement the client-side e-commerce shopping cart and simulated checkout experience. Create `CartContext` with `localStorage` persistence under key `antigravity_smartwatch_cart_v1`, handling item addition (with customized chassis/strap/watch face configuration), quantity adjustments, item removal, and auto-calculated subtotals, tax, and shipping. Build the slide-over cart drawer (`CartDrawer.tsx`) and the 2-step simulated checkout modal (`CheckoutModal.tsx`) with shipping form validation and instant order confirmation.

**Acceptance criteria:**
- [ ] `CartContext.tsx` implementing `addItem`, `removeItem`, `updateQuantity`, `clearCart`, and totals calculation with safe `localStorage` synchronization.
- [ ] Slide-out cart drawer (`CartDrawer.tsx`) showing custom item details (device name, selected chassis, strap color, face preview, price, quantity controls).
- [ ] Multi-step simulated checkout modal (`CheckoutModal.tsx`) with shipping input fields, simulated payment options, and order confirmation screen with order reference ID.
- [ ] Integration in `App.tsx` connecting Navbar, Hero 3D Studio, Catalog, Comparison, Cart Drawer, and Checkout Modal into a unified experience.
- [ ] Comprehensive unit tests in `tests/cart.test.ts` verifying cart operations, item deduplication, totals calculation, and `localStorage` persistence.

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task T1, Task T2, Task T3

**Files likely touched:**
- `src/context/CartContext.tsx`
- `src/components/cart/CartDrawer.tsx`
- `src/components/cart/CartItemRow.tsx`
- `src/components/cart/CheckoutModal.tsx`
- `src/App.tsx`
- `tests/cart.test.ts`

**Estimated scope:** Medium (5-6 files)

---

## Checkpoint: After Tasks T1-T4 (Full Solution)
- [ ] All tests pass: `npm test`
- [ ] Production build succeeds cleanly: `npm run build`
- [ ] End-to-end flow verified: Browse catalog -> 360° 3D preview & face customization -> Add custom device to cart -> Checkout simulation
