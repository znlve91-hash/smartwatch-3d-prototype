# Tasks: Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype

## Task T1: Core Models, Data Schemas, Mock Catalog & Foundation Setup

**Description:** Configure build tooling (Tailwind, PostCSS, Vitest), define data models, author the comprehensive mock product catalog matching the 5 taxonomy segments (Band Standard/Pro; Watch Standard/Pro/Pro Max), mock watch face presets, mock widget configurations, and implement catalog unit tests.

**Acceptance Criteria:**
- [x] Build & configuration files (`tailwind.config.js`, `postcss.config.js`, `vite.config.js`) configured with project color tokens (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`).
- [x] `src/data/products.js` exports a rich catalog of wearable products strictly categorized into:
  - Band: Standard (e.g. NovaBand Flow) & Pro (e.g. NovaBand Pro Elite)
  - Smart Watch: Standard (e.g. NovaWatch Core), Pro (e.g. NovaWatch Pro), & Pro Max (e.g. NovaWatch Pro Max Ultra)
- [x] Each product includes detailed specs (display, battery, water resistance, weight, sensors, casing material), colorways, pricing, and 3D configuration presets.
- [x] `src/data/watchFaces.js` exports metadata for 4 watch faces: Minimal, Neon, Chrono, Health.
- [x] `src/data/widgets.js` exports configuration and initial mock state for 5 simulated widgets: Heart Rate, Steps, Weather, Music, Battery.
- [x] `src/utils/formatters.js` provides currency (VND/USD), number, and date formatting helpers.
- [x] Unit tests in `tests/catalog.test.jsx` validate that every catalog product complies with the required schema and taxonomy rules.

**Verification:**
- [x] Tests pass: `npm test`
- [x] Build succeeds: `npm run build`

**Dependencies:** None

---

## Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas

**Description:** Implement the procedural 3D wearable rendering engine in Three.js, supporting both Smart Watch and Band geometries, a dynamic 512x512 Canvas texture generator for 4 watch faces (Minimal, Neon, Chrono, Health) and 5 simulated widgets (Heart Rate, Steps, Weather, Music, Battery), with 360-degree orbit rotation, auto-spin toggle, zoom controls, reset angle, and live color customization.

**Acceptance Criteria:**
- [x] `src/components/3d/ProceduralWatchMesh.js` constructs high-fidelity procedural 3D models for both Smart Band (elongated capsule, silicone strap) and Smart Watch (chamfered bevel disk, crown button, lug attachments, segmented strap).
- [x] `src/components/3d/WatchCanvasTexture.js` dynamically renders 4 distinct watch faces on a 512x512 canvas:
  - Minimal: Clean typography, sleek hour/minute hands, minimal date
  - Neon: Glowing cyber cyan/purple digital clock, pulsating second ring
  - Chrono: Luxury chronograph with 3 sub-dials, tachymeter scale, metallic indices
  - Health: Concentric activity rings (Move, Exercise, Stand) and live metric readouts
- [x] Dynamic widgets can be simulated and updated on the watch face (Heart Rate pulse, Step counter progress, Weather forecast, Music playback toggle, Battery status).
- [x] `src/components/3d/WatchViewer3D.jsx` supports smooth 360° mouse drag orbit, touch rotation, auto-spin toggle (1.5 RPM), zoom in/out, and reset view.
- [x] `src/components/3d/ViewerControls.jsx` provides an interactive floating dock to switch models, watch faces, widgets, and strap/casing colorways in real time.
- [x] WebGL resources and animation frame loops are properly cleaned up on unmount.
- [x] Unit tests in `tests/watchTexture.test.js` verify canvas face rendering logic and widget state updates.

**Verification:**
- [x] Tests pass: `npm test`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task T1

---

## Checkpoint 1: 3D Studio & Core Data Foundation
- [x] Product catalog schema and taxonomy tests pass
- [x] 3D procedural engine renders Band and Watch geometries without WebGL errors
- [x] All 4 watch faces and 5 widgets render correctly onto the canvas texture
- [x] All tests pass via `npm test`

---

## Task T3: UI Dashboard, Filters, Product Showcase & Comparison

**Description:** Build the modern minimalist user interface with light purple/cyan palette (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`), featuring a sticky glassmorphic header, hero 3D interactive stage, category & tier segmented filtering controls, product grid with informative product cards, "Try in 3D" quick preview trigger, and a comprehensive product detail modal with specs comparison.

**Acceptance Criteria:**
- [x] UI adopts the minimalist light theme with soft purple/cyan accents and glassmorphism styling (`src/index.css`, Tailwind classes).
- [x] `src/components/common/Header.jsx` includes brand identity (*NOVA WEARABLES*), category navigation, search trigger, and cart drawer toggle button with dynamic badge count.
- [x] `src/components/hero/HeroSection.jsx` embeds the interactive 3D studio with call-to-action badges and live spec highlights.
- [x] `src/components/catalog/ProductFilter.jsx` provides segmented controls to filter by category (All, Band, Watch) and tier (Standard, Pro, Pro Max) with real-time reactive filtering.
- [x] `src/components/catalog/ProductGrid.jsx` and `ProductCard.jsx` render responsive product cards displaying pricing, category/tier badge, key specs, color swatches, "Try in 3D" button, and "Add to Cart" button.
- [x] `src/components/catalog/ProductDetailModal.jsx` opens an expanded view featuring a dedicated 3D viewer, deep-dive specifications table, and color/face customizers.
- [x] `src/components/common/Footer.jsx` renders a clean minimalist footer with brand links, guarantees, and copyright.
- [x] Tests in `tests/catalog.test.jsx` verify filtering logic, tier badges, and modal visibility.

**Verification:**
- [x] Tests pass: `npm test`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task T1, Task T2

---

## Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persistence

**Description:** Implement client-side shopping cart state management (`CartContext`), slide-over cart drawer, quantity adjusters, selected color/face customization storage per item, discount coupon simulation (`NOVA10`), two-step simulated checkout modal with order confirmation receipt, toast notifications, and `localStorage` persistence.

**Acceptance Criteria:**
- [x] `src/context/CartContext.jsx` manages cart state with actions: `addItem`, `removeItem`, `updateQuantity`, `applyCoupon`, and `clearCart`.
- [x] Cart state automatically syncs with `localStorage` under `novawear_cart_v1` on changes and rehydrates on page load.
- [x] `src/components/cart/CartDrawer.jsx` and `CartItemRow.jsx` display itemized cart entries with selected colorway and watch face, quantity controls, subtotal, discount, and tax calculation.
- [x] Coupon code input validates promo codes (e.g. `NOVA10` gives 10% discount) with clear feedback.
- [x] `src/components/cart/CheckoutModal.jsx` implements a 2-step simulated checkout:
  - Step 1: Customer shipping address, contact, and shipping method
  - Step 2: Simulated payment options (Credit Card, Apple Pay / Google Pay, Cash on Delivery)
  - Order Confirmation screen displaying order ID, summary, estimated delivery, and a "Continue Shopping" reset action.
- [x] `src/components/common/Toast.jsx` provides non-blocking toast notifications when products are added to the cart or coupons applied.
- [x] Full application orchestration verified in `src/App.jsx`.
- [x] Unit tests in `tests/cart.test.jsx` cover cart operations, coupon calculation, checkout validation, and `localStorage` sync.

**Verification:**
- [x] Tests pass: `npm test`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task T1, Task T2, Task T3

---

## Checkpoint 2: Full Application Integration & Verification
- [x] Complete end-to-end shopping experience works smoothly: Browse -> Filter -> 3D Preview -> Customize -> Add to Cart -> Checkout -> Confirmation
- [x] 3D viewer interactive features (360° rotate, watch faces, widgets, color swapping) function without glitch
- [x] Cart persists across page reloads
- [x] `npm test` passes 100% of test suites
- [x] `npm run build` creates production bundle cleanly
