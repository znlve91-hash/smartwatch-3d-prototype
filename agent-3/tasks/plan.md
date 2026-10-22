# Implementation Plan: Smart Watch & Band Interactive 3D E-Commerce Prototype

## 1. Overview
This implementation plan outlines the engineering roadmap to build a modern, minimalist smart wearable e-commerce prototype. The application features a real-time procedural 3D viewer (Three.js) supporting 360-degree rotation, dynamic watch faces (Minimal, Neon, Chrono, Health), simulated interactive widgets (heart rate, step counter, weather, music, battery), categorized wearable browsing across Bands (Standard, Pro) and Smart Watches (Standard, Pro, Pro Max), and a client-side shopping cart with simulated checkout persisted via `localStorage`.

---

## 2. Architecture & Design Decisions

### 2.1 Procedural 3D Mesh Generation vs. External GLTF
- **Decision:** Build 3D wearable models (Bands and Smart Watches) procedurally in Three.js using native parametric geometries (`CylinderGeometry`, `BoxGeometry`, `TorusGeometry`, `ExtrudeGeometry`) rather than loading external `.gltf` / `.glb` files.
- **Rationale:** 
  - Eliminates external asset loading latency, 404/CORS errors, and network bandwidth bottlenecks.
  - Guarantees immediate zero-wait rendering and 100% testability across all client devices.
  - Provides direct runtime control over chassis materials, bezel colors, strap roughness, and screen geometry.

### 2.2 Dynamic Canvas Texture for Screen Faces & Widgets
- **Decision:** Use an offscreen/in-memory 512x512 HTML5 `canvas` converted to a Three.js `CanvasTexture` (`texture.needsUpdate = true`) to render watch faces and widgets onto the 3D screen mesh.
- **Rationale:**
  - Enables fluid, 60fps simulated watch updates (clock hands, digital font glows, pulsating heart rate BPM, animated step dials).
  - Seamlessly decouples watch face logic from 3D geometry manipulation.
  - Highly testable in Vitest via canvas mock/unit tests.

### 2.3 Strict Client-Side State & LocalStorage Persistence
- **Decision:** All state (cart items, coupon discounts, user customization, order receipts) is managed through React 19 Context (`CartContext`) and synced to browser `localStorage` (`novawear_cart_v1`).
- **Rationale:**
  - Zero backend overhead or external API reliance; completely self-contained prototype.
  - Fully retains cart contents across page reloads and browser restarts.

### 2.4 Minimalist Light UI System with Soft Purple & Cyan Accent
- **Decision:** Tailwind CSS configured with custom color tokens:
  - Background canvas: `#F8F6FF` (soft lavender)
  - Card surfaces: `#FFFFFF` with glassmorphic backdrop filters
  - Accent Soft: `#E0F7FA` (ice cyan tint)
  - Primary Brand: `#7C3AED` (electric violet)
  - Secondary Brand: `#06B6D4` (cyber cyan)
  - Crisp slate typography: `#0F172A` and `#64748B`
- **Rationale:** Delivers a modern, premium aesthetic that differentiates wearable categories and complements vibrant watch face screens.

---

## 3. Definition of Done (DoD)
Every task must satisfy the following criteria before being marked complete:
1. **Spec Alignment:** Strict adherence to product taxonomy, 3D interaction specs, and color tokens defined in `docs/spec.md`.
2. **Automated Tests:** All unit and integration tests in `tests/` pass cleanly via `npm test`.
3. **Clean Build:** Production build finishes without syntax, type, or asset bundling errors via `npm run build`.
4. **Code Quality:** Modern React 19 functional components, idiomatic hooks, proper Three.js lifecycle cleanup (no memory leaks on unmount).
5. **No Direct Orchestrator Implementation:** Implementation code must be authored by worker subagents and verified by reviewer subagents during Phase 3.

---

## 4. Constraints & Guardrails
- **No Backend:** Do not add Node server routes, Express backends, or remote database connectors.
- **Dependency Guard:** Use only existing project dependencies (`react`, `react-dom`, `three`, `lucide-react`, `tailwindcss`, `vite`, `vitest`). Do not install heavy external libraries without explicit authorization.
- **Procedural 3D:** Do not download external heavy 3D assets or point to external model CDNs.
- **Atomic Commits:** Each completed task must be committed with a conventional commit message.

---

## 5. Vertical Slices & Task Breakdown

### Task T1: Core Models, Data Schemas, Mock Catalog & Foundation Setup
- **Scope:** Define data models, mock product catalog according to the 5-tier taxonomy (Band Standard/Pro; Watch Standard/Pro/Pro Max), watch face presets, widget defaults, formatting utilities, and base project configuration (Tailwind, PostCSS, Vitest).
- **Deliverables:**
  - `tailwind.config.js`, `postcss.config.js`, `vite.config.js`
  - `src/data/products.js` (complete catalog with specs, colorways, pricing, tags)
  - `src/data/watchFaces.js` (metadata for Minimal, Neon, Chrono, Health)
  - `src/data/widgets.js` (metadata & simulation defaults for Heart Rate, Steps, Weather, Music, Battery)
  - `src/utils/formatters.js` (VND/USD currency, dates, numbers)
  - `tests/catalog.test.jsx` (catalog taxonomy & schema validation tests)

### Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas
- **Scope:** Implement procedural 3D wearable geometries for Bands and Smart Watches, dynamic 512x512 Canvas watch face texture generator, 360-degree orbit rotation, auto-rotation toggle, zoom/reset controls, live color/chassis swapping, and widget interactions.
- **Deliverables:**
  - `src/components/3d/ProceduralWatchMesh.js`
  - `src/components/3d/WatchCanvasTexture.js`
  - `src/components/3d/WatchViewer3D.jsx`
  - `src/components/3d/ViewerControls.jsx`
  - `src/hooks/use3DWatch.js`
  - `tests/watchTexture.test.js`

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

### Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persistence
- **Scope:** Implement the cart state management, slide-over drawer, quantity adjustments, custom color/face configuration tracking per cart item, coupon code discount engine (`NOVA10`), 2-step simulated checkout dialog (shipping + payment simulation), order confirmation summary, and toast notification alerts.
- **Deliverables:**
  - `src/context/CartContext.jsx`
  - `src/hooks/useCart.js`
  - `src/components/cart/CartDrawer.jsx`
  - `src/components/cart/CartItemRow.jsx`
  - `src/components/cart/CheckoutModal.jsx`
  - `src/components/common/Toast.jsx`
  - `tests/cart.test.jsx`
  - Full application integration in `src/App.jsx` and `src/main.jsx`

---

## 6. Verification Checkpoints

### Checkpoint 1 (After T1 & T2):
- [ ] Catalog mock data adheres strictly to taxonomy.
- [ ] Procedural 3D engine renders Band and Watch geometries without WebGL errors.
- [ ] Watch face dynamic canvas accurately renders Minimal, Neon, Chrono, and Health presets.
- [ ] All unit tests pass: `npm test`.

### Checkpoint 2 (After T3 & T4):
- [ ] End-to-end shopping flow functional (browse -> filter by tier -> 3D preview -> add to cart -> adjust quantity -> apply coupon -> checkout -> order receipt).
- [ ] `localStorage` persists cart state across page reloads.
- [ ] Responsive layout verified on mobile, tablet, and desktop breakpoints.
- [ ] Production build succeeds cleanly: `npm run build`.

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| WebGL Context loss / canvas resize distortion | Medium | Safely handle window resize events with camera aspect ratio update and renderer resize; dispose Three.js geometries/materials on cleanup. |
| Canvas watch face re-render lag | Low | Debounce texture re-renders and update canvas texture only on face/widget/time state changes using `needsUpdate = true`. |
| Complex tier taxonomy confusion in UI filters | Low | Provide dedicated visual badges (`BAND • PRO`, `WATCH • PRO MAX`) and synchronized category-tier filter dropdowns. |
