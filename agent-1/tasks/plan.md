# Implementation Plan: Smart Watch & Band 3D Interactive E-Commerce Prototype

**Document Version:** 1.0.0  
**Phase:** Phase 2 (Planning & Task Breakdown)  
**Workspace:** `c:\Users\Admin\Documents\antigravity\agent-run-1`  
**Reference Specification:** [`docs/spec.md`](file:///c:/Users/Admin/Documents/antigravity/agent-run-1/docs/spec.md)  

---

## 1. Overview & Objective

The objective is to implement a high-fidelity, client-side prototype web application for previewing, customizing, and purchasing next-generation smart wearable devices (Smart Bands and Smart Watches). The application showcases an interactive 3D WebGL studio powered by Three.js featuring 360-degree rotation, customizable band/case colors, 4 switchable dynamic watch faces, and 5 interactive simulated smart widgets (Heart Rate ECG, 10k Steps Counter, Weather, Music Player, and Battery status). The prototype is built with React 19, Vite, and Tailwind CSS, following a modern minimalist light aesthetic in soft purple and cyan tones (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`), accompanied by persistent client-side cart and mock checkout.

---

## 2. Architecture & Design Decisions

### 2.1 Three.js Procedural Geometry Synthesis vs External GLTF
- **Decision:** Generate 3D wearable geometries procedurally using Three.js built-in primitives (`CylinderGeometry`, `BoxGeometry`, `TubeGeometry`, `ExtrudeGeometry`) and parametric shapes instead of relying on external `.glb`/`.gltf` model files.
- **Rationale:** 
  1. Ensures instant loading without external asset network dependencies or 404 failures.
  2. Guarantees deterministic geometry and seamless color/material customization for casing, bezel, crown, and straps.
  3. Enables distinct physical forms for the **Band** (narrow rounded capsule with seamless continuous strap) versus the **Smart Watch** (circular/squircle chassis with rotating digital crown dial, tactile side button, and lug-anchored bands).

### 2.2 Dynamic CanvasTexture Engine for Watch Faces & Widgets
- **Decision:** Utilize an offscreen 2D HTML5 Canvas (512x512 resolution) mapped directly into a Three.js `CanvasTexture` (`needsUpdate = true`).
- **Rationale:**
  1. Allows crisp, vector-like rendering of both analog hands, sub-dials, digital typography, and real-time sparkline ECG waves onto the 3D watch face.
  2. Enables dynamic switching between 4 watch faces (**Minimal**, **Neon**, **Chrono**, **Health/Activity**).
  3. Seamlessly projects live states of the 5 interactive simulated widgets (**Heart Rate**, **Steps**, **Weather**, **Music Player**, **Battery**) directly onto the wearable's screen.

### 2.3 Client-Side State & Storage Architecture
- **Decision:** Implement dedicated React custom hooks (`useCart`, `useWatchSimulator`) backed by a resilient `localStorage` persistence layer (`aura_cart_v1`).
- **Rationale:**
  1. Completely eliminates backend server dependencies while maintaining full prototype interactivity.
  2. Allows users to save customized product variants (specific color, strap, and watch face selections) in their cart across page reloads.
  3. Provides an end-to-end simulated checkout flow (address input, payment method simulation, promo codes `AURA10` & `LAUNCH20`, order receipt generation).

### 2.4 UI Design System & Component Hierarchy
- **Decision:** Implement a modular, component-driven architecture with Tailwind CSS 3.4 utility styling and Lucide React icons.
- **Color Palette & Glassmorphic Surface:**
  - Background Base: `#F8F6FF` (Soft Lavender Frost)
  - Soft Tint / Surface: `#E0F7FA` (Pale Aqua / Cyan Tint)
  - Primary Brand Accent: `#7C3AED` (Deep Violet)
  - Secondary Brand Accent: `#06B6D4` (Tech Cyan)
  - Surface Containers: Frosted Glass (`rgba(255, 255, 255, 0.85)` with `backdrop-blur-md`)
- **Key Layout Sections:**
  1. `Navbar`: Header with logo, navigation links, search trigger, and live cart counter badge.
  2. `HeroSection`: High-impact landing showcase featuring the interactive 3D hero stage and quick CTAs.
  3. `Studio3DSection`: Full-featured 3D interactive studio with 360-degree orbit rotation, camera presets, material swatches, watch face selector, and widget simulator.
  4. `ProductCatalog`: Filterable grid supporting Category (`Band` vs `Watch`), Tier (`Standard`, `Pro`, `Pro Max`), search queries, and sorting.
  5. `CompareModal`: Side-by-side technical specification matrix.
  6. `CartDrawer` & `CheckoutModal`: Slide-over drawer and multi-step mock checkout modal.

---

## 3. Definition of Done (DoD)

A task or milestone is considered **Done** only when all of the following conditions are satisfied:
1. **Acceptance Criteria:** 100% of the task's explicit acceptance criteria are fulfilled.
2. **Type Safety & Build:** `npm run build` succeeds without TypeScript compiler errors or Vite build failures.
3. **Automated Testing:** `npm test` executes all unit tests with 100% pass rate.
4. **Visual & Interaction Quality:** Components adhere to the minimalist light theme with soft purple/cyan palette; Three.js canvas initializes cleanly with responsive resize and drag-to-rotate handling.
5. **Code Style & Modularity:** Clean, functional TypeScript React components, clear separation of concerns, no dead code or unhandled promise rejections.
6. **Version Control:** Changes are reviewed and committed to Git with semantic commit messages following the established subagent protocol.

---

## 4. Constraints

1. **Workspace Boundary:** All operations, files, and git commits must strictly occur within `c:\Users\Admin\Documents\antigravity\agent-run-1`.
2. **Zero Backend Requirement:** No backend server or external database. All cart, checkout, catalog, and simulation logic must operate purely on the client side.
3. **Product Taxonomy Invariance:** Exactly 5 wearable products across 2 categories and specific tiers:
   - Band: Standard (`band-aura-std`), Pro (`band-aura-pro`).
   - Smart Watch: Standard (`watch-horizon-std`), Pro (`watch-horizon-pro`), Pro Max (`watch-horizon-max`).
4. **Gated Workflow:** No application implementation code may be authored during Phase 2. Execution will occur in Phase 3 under the `subagent-implement` protocol (one task per fresh worker/reviewer pair).

---

## 5. Vertical Slices & Task Breakdown Summary

The implementation is broken down into 4 ordered, self-contained vertical slices:

```
[ T1: Core Foundation & Catalog ]
               │
               ▼
[ T2: 3D Three.js Studio & Simulator ]
               │
               ▼
[ T3: UI Showcase, Catalog & Compare ]
               │
               ▼
[ T4: Cart, Checkout & LocalStorage ]
```

- **Task T1: Core Models, Types, Tailwind Theme & Mock Catalog**
  - Establish base Tailwind configuration (palette tokens, typography, utilities) and index HTML.
  - Define all TypeScript contracts (`Product`, `CartItem`, `ColorOption`, `WatchFaceId`, `ActiveWidgetId`).
  - Create the complete 5-item mock dataset with detailed specs, colors, and 3D configuration flags.
  - Author schema and taxonomy unit tests in `tests/products.test.ts`.

- **Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas Engine**
  - Implement Three.js procedural geometries for Band (capsule & loop) and Smart Watch (casing, bezel, crown, lugs, straps).
  - Build dynamic 512x512 CanvasTexture generator supporting 4 watch faces (**Minimal**, **Neon**, **Chrono**, **Health/Activity**).
  - Build 5 interactive simulated widgets (**Heart Rate**, **Steps**, **Weather**, **Music**, **Battery**).
  - Implement `WatchViewer3D` container with 360-degree orbit rotation, camera presets, and `StudioControls`.
  - Author simulator unit tests in `tests/simulator.test.ts`.

- **Task T3: UI Dashboard, Filters, Product Showcase & Comparison Matrix**
  - Build navigation header (`Navbar`), hero section, category tabs (`Band` vs `Watch`), and tier filters (`Standard`, `Pro`, `Pro Max`).
  - Build product catalog grid (`ProductCatalog`, `ProductCard`) with live color swatches and "3D Studio" trigger.
  - Build side-by-side comparison modal (`CompareModal`) with detailed hardware spec breakdown.
  - Integrate 3D preview seamlessly into the hero and studio sections.

- **Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persistence**
  - Build resilient localStorage abstraction (`src/utils/storage.ts`) and cart management hook (`useCart`).
  - Implement slide-over `CartDrawer` with quantity adjustments, item removal, and promo code engine (`AURA10`, `LAUNCH20`).
  - Implement multi-step `CheckoutModal` (Shipping -> Simulated Payment -> Order Confirmation with tracking ID).
  - Author comprehensive cart unit tests in `tests/cart.test.ts`.
  - Final integration verification across all test suites and production build.

---

## 6. Risks and Mitigations

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| WebGL Context initialization failure on unsupported environments | Medium | Implement canvas fallback state and graceful WebGL context detection; ensure unit tests do not crash without WebGL. |
| Complex 3D mesh rendering causing frame drops on low-end devices | Medium | Use optimized parametric geometry subdivisions, dispose unused Three.js textures and geometries on unmount, and utilize requestAnimationFrame throttling. |
| Inconsistent localStorage state across browser sessions | Low | Wrap storage calls in try/catch with fallback defaults and schema validation; write comprehensive unit tests for corrupted storage recovery. |
| UI layout shifts between Band and Watch 3D viewports | Low | Standardize Three.js camera framing and bounding box calculation per model type (`band_capsule` vs `watch_round`). |

---

## 7. Open Questions

*None currently.* All product specifications, tier mappings, color palettes, watch faces, widgets, and state mechanics have been verified and approved in `docs/spec.md`.
