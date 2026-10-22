# Technical Specification: Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype

## 1. Objective & Scope

### 1.1 Objective
Build a high-performance, modern, minimalist e-commerce prototype for smart wearables featuring an interactive 3D product viewer. The application allows users to preview wearable products (Smart Bands and Smart Watches), interact with a real-time 3D model with 360-degree rotation, test simulated interactive watch faces and widgets, browse a categorized catalog, and manage a client-side shopping cart with simulated checkout.

### 1.2 Target Audience & Core Experience
- **Audience:** Tech enthusiasts, fitness-focused users, and modern wearable buyers looking for an immersive online shopping experience.
- **Key UX Highlight:** Direct interactive engagement with 3D wearable models in browser (no plugins required), live watch face switching (Minimal, Neon, Chrono, Health), and interactive widget simulation (heart rate, step counter, weather, music, battery).
- **Scope Boundary:** Pure client-side prototype. No server or backend database; all catalog data is mocked, and cart state is persisted via browser `localStorage`.

---

## 2. Assumptions & Design Decisions
1. **Zero External 3D Asset Latency:** Rather than relying on large, brittle external `.gltf`/`.glb` files that may fail to load or have CORS/bandwidth issues, the 3D wearable models (both Bands and Smart Watches) are procedurally constructed using Three.js native primitives (geometries, materials, chamfers, bevels, buttons, strap latches).
2. **Dynamic Canvas Texture for Watch Faces:** The watch face screen is a dynamic HTML5 Canvas element rendered in real-time as a Three.js `CanvasTexture`. This enables zero-latency switching between interactive watch faces and animated widget states.
3. **Responsive & Mobile-Friendly:** Fully touch-enabled 360-degree rotation and zoom gestures for mobile devices, alongside desktop mouse orbit controls.
4. **Offline Persistence:** Cart data and preferences persist across reloads using `localStorage`.

---

## 3. Product Taxonomy & Mock Data Architecture

### 3.1 Taxonomy Breakdown
The catalog consists of two primary categories across distinct market segments:

1. **Band Category (`category: 'band'`):**
   - **Standard Tier (`tier: 'standard'`):** Ultra-slim form factor, lightweight elastomer band, 1.1" AMOLED display, core fitness and sleep tracking, 14-day battery life. (e.g., *NovaBand Flow*)
   - **Pro Tier (`tier: 'pro'`):** Curved edge-to-edge 1.47" AMOLED, aluminum bezel trim, built-in dual GPS, blood oxygen (SpO2), stress monitoring, fast charging. (e.g., *NovaBand Pro Elite*)

2. **Smart Watch Category (`category: 'watch'`):**
   - **Standard Tier (`tier: 'standard'`):** Classic circular 1.32" display, aerospace aluminum frame, 100+ sport modes, Bluetooth calls, 7-day battery. (e.g., *NovaWatch Core*)
   - **Pro Tier (`tier: 'pro'`):** Premium 1.43" sapphire glass, surgical stainless steel chassis, rotating crown, ECG sensor, speaker/mic, contactless NFC pay simulation. (e.g., *NovaWatch Pro*)
   - **Pro Max Tier (`tier: 'pro_max'`):** Rugged Grade 5 Titanium case, 1.96" high-brightness (2000 nits) sapphire display, dedicated programmable action button, dual-band 5-satellite GPS, 100m water resistance, 21-day adventure battery. (e.g., *NovaWatch Pro Max Ultra*)

### 3.2 Product Schema
```typescript
export interface Product {
  id: string;
  name: string;
  category: 'band' | 'watch';
  tier: 'standard' | 'pro' | 'pro_max';
  price: number;
  originalPrice: number;
  tagline: string;
  description: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  colors: {
    id: string;
    name: string;
    hex: string;
    chassisHex: string;
    strapHex: string;
  }[];
  specs: {
    display: string;
    batteryLife: string;
    waterResistance: string;
    weight: string;
    connectivity: string;
    sensors: string[];
    casingMaterial: string;
  };
  features: string[];
  defaultWatchFace: 'minimal' | 'neon' | 'chrono' | 'health';
  isNew?: boolean;
  isFeatured?: boolean;
}
```

---

## 4. 3D Interactive Viewer Architecture

### 4.1 Rendering Engine (Three.js)
- **Scene Setup:** Perspective camera, hemispherical ambient lighting, directional key light with soft shadow approximation, environment reflection map.
- **Model Construction:**
  - *Smart Watch:* Chamfered cylinder chassis with metallic/roughness material, sapphire glass lens cap, rotatable digital crown on the right side, micro push button, lug attachments, and dual curved segmented wrist straps.
  - *Smart Band:* Elongated capsule/oblong chassis, seamless silicone band loop geometry wrapping around the pill-shaped screen module, accent clasp pin.
- **360-Degree Controls:**
  - Orbit rotation around X and Y axes with damping (inertia).
  - Auto-rotation toggle (smooth idle turntable spin at 1.5 RPM).
  - Zoom in/out clamped within ergonomic bounds (FOV or camera distance).
  - One-click "Reset View" button to return to optimal front-facing angle.
  - Interactive strap and chassis color real-time material swapping based on user selection.

### 4.2 Dynamic Watch Face Engine (Canvas Texture)
A dedicated 512x512 Canvas rendering sub-engine updates the watch screen texture dynamically:
1. **Minimal Face:**
   - Clean typographic clock, minimalist hour/minute hands, subtle date numeral, sleek high-contrast aesthetic.
2. **Neon Face:**
   - Cyberpunk inspired digital readout with neon cyan (`#06B6D4`) and purple (`#A855F7`) glowing dials, animated pulse second ring.
3. **Chrono Face:**
   - Classic luxury chronograph dial with three sub-dials (seconds, 30-minute timer, 24h clock), tachymeter scale ring, and metallic indices.
4. **Health Face:**
   - Tri-color concentric activity rings (Move, Exercise, Stand) reminiscent of modern fitness trackers, prominent live heart-rate metric, and calorie burn counter.

### 4.3 Simulated Interactive Widgets
Users can tap/click widgets on the screen or via the 3D control dock:
1. **Heart Rate (BPM):** Interactive animated pulse wave with live BPM simulator (fluctuates realistically between 68 and 115 BPM on click/toggle).
2. **Daily Steps:** Circular progress ring with step counter incrementation (e.g., 7,420 / 10,000 steps) and distance estimate.
3. **Weather:** Current temperature (e.g., 24°C / 75°F Sunny/Cloudy), high/low forecasts, UV index, and weather icon rendering.
4. **Music Controller:** Mini media player with track name ("Echoes of Tomorrow"), artist ("Nova Beats"), play/pause state toggle, and dynamic playback progress bar.
5. **Battery Indicator:** Dynamic percentage readout (e.g., 88%), charging status icon, and Low Power Mode toggle.

---

## 5. UI Design System & Aesthetic

### 5.1 Palette & Typography
- **Design Philosophy:** Minimalist, airy, modern high-end tech aesthetic with soft pastel gradients, clean glassmorphism, and generous white space.
- **Color Tokens:**
  - `bg-primary`: `#F8F6FF` (Soft light lavender-purple canvas)
  - `bg-secondary`: `#FFFFFF` (Pure white card surfaces)
  - `bg-accent-soft`: `#E0F7FA` (Soft cyan-teal tint for badges and highlights)
  - `brand-purple`: `#7C3AED` (Primary violet for CTAs, active states, indicators)
  - `brand-cyan`: `#06B6D4` (Secondary cyber cyan for glows, metrics, accents)
  - `text-main`: `#0F172A` (Slate 900 for crisp readability)
  - `text-muted`: `#64748B` (Slate 500 for secondary technical specs)
  - `border-soft`: `#E2E8F0` / `#EDE9FE` (Delicate subtle borders)
- **Glassmorphic Accents:** `backdrop-blur-md bg-white/70 border border-white/40 shadow-sm` for floating docks and headers.
- **Typography:** Modern clean sans-serif stack (`Inter`, `system-ui`, `-apple-system`, `sans-serif`) with balanced font weights (300 to 700).

### 5.2 Key User Interface Components
1. **Global Header:**
   - Brand logo (*NOVA WEARABLES*)
   - Category navigation tabs: All Products, Smart Bands, Smart Watches
   - Search input modal / trigger
   - Cart quick-access button with animated badge counter
2. **Hero 3D Interactive Stage:**
   - Large prominent 3D viewport featuring the flagship model
   - Interactive floating control dock:
     - Colorway selector (Midnight Black, Cosmic Purple, Glacier Cyan, Starlight Silver)
     - Watch Face switcher (Minimal, Neon, Chrono, Health)
     - Widget interactive test bar (Heart Rate, Steps, Weather, Music, Battery)
     - 360° spin / reset view buttons
   - Live spec highlight callout card
3. **Filter & Category Bar:**
   - Main category toggle: `All` | `Smart Bands` | `Smart Watches`
   - Tier filter pills:
     - For Bands: `All Tiers` | `Standard` | `Pro`
     - For Watches: `All Tiers` | `Standard` | `Pro` | `Pro Max`
   - Sorting options: Price (Low to High, High to Low), Popularity, Rating
4. **Product Grid & Cards:**
   - High-contrast visual thumbnail
   - Category & Tier badges (e.g., "BAND • PRO", "WATCH • PRO MAX")
   - Spec tags (Battery life, Water rating, Display size)
   - Color swatch previews
   - "Try in 3D" quick trigger button
   - "Add to Cart" button with instant visual feedback
5. **Product Detail & 3D Modal:**
   - Deep-dive product preview with dedicated 3D viewer
   - Full technical specification breakdown
   - Color selection and custom face preset choice
   - Customer review rating summary
6. **Cart Slide-Over Drawer & Checkout Flow:**
   - Itemized cart list with thumbnail, selected color/strap, quantity modifier, and remove action
   - Subtotal, estimated tax, and free shipping threshold tracker
   - Discount coupon simulation (e.g., `NOVA10` for 10% off)
   - Two-step checkout dialog:
     - Step 1: Customer shipping details and shipping speed selection
     - Step 2: Payment method simulation (Card, Apple Pay / Google Pay, Cash on Delivery)
     - Order Confirmation screen with generated Order ID, delivery timeline, and order summary.

---

## 6. Client-Side State Management

### 6.1 State Stores
- **`CartContext`:**
  - `items: CartItem[]`
  - `totalCount: number`
  - `subtotal: number`
  - `discountAmount: number`
  - `appliedCoupon: string | null`
  - Methods: `addItem(product, color, face, quantity)`, `removeItem(itemId)`, `updateQuantity(itemId, quantity)`, `applyCoupon(code)`, `clearCart()`
- **Storage Sync:** Persists to `localStorage` under `novawear_cart_v1` on every state mutation.
- **`ViewerState` (for 3D viewer):**
  - `activeModel: 'band' | 'watch'`
  - `selectedTier: 'standard' | 'pro' | 'pro_max'`
  - `selectedColor: ColorOption`
  - `activeFace: 'minimal' | 'neon' | 'chrono' | 'health'`
  - `activeWidget: 'heartRate' | 'steps' | 'weather' | 'music' | 'battery'`
  - `autoRotate: boolean`

---

## 7. Project Structure & Code Style

### 7.1 Directory Layout
```
c:\Users\Admin\Documents\antigravity\agent-run-3\
├── docs/
│   └── spec.md
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── WatchViewer3D.jsx         # Main Three.js canvas & orbit controller
│   │   │   ├── ProceduralWatchMesh.js    # Watch & Band procedural geometry builder
│   │   │   ├── WatchCanvasTexture.js     # 2D Canvas watch face & widget generator
│   │   │   └── ViewerControls.jsx        # Floating 3D controls (face, widget, color)
│   │   ├── cart/
│   │   │   ├── CartDrawer.jsx            # Slide-over cart overlay
│   │   │   ├── CartItemRow.jsx           # Single item row with quantity adjuster
│   │   │   └── CheckoutModal.jsx         # 2-step mock checkout and confirmation
│   │   ├── catalog/
│   │   │   ├── ProductGrid.jsx           # Responsive product catalog grid
│   │   │   ├── ProductCard.jsx           # Individual product card with quick actions
│   │   │   ├── ProductFilter.jsx         # Category & tier filter segmented controls
│   │   │   └── ProductDetailModal.jsx    # Deep-dive 3D preview & specs modal
│   │   ├── common/
│   │   │   ├── Header.jsx                # Sticky glassmorphic navigation
│   │   │   ├── Footer.jsx                # Minimalist footer with brand links
│   │   │   ├── Toast.jsx                 # Cart notification toasts
│   │   │   └── Badge.jsx                 # Category & Tier badge pills
│   │   └── hero/
│   │       └── HeroSection.jsx           # Hero showcase wrapper with 3D stage
│   ├── context/
│   │   └── CartContext.jsx               # Global cart context & localStorage sync
│   ├── data/
│   │   ├── products.js                   # Mock product catalog (Bands & Watches)
│   │   ├── watchFaces.js                 # Watch faces metadata and themes
│   │   └── widgets.js                    # Widget initial mock states and ranges
│   ├── hooks/
│   │   ├── useCart.js                    # Cart context consumer hook
│   │   └── use3DWatch.js                 # Three.js lifecycle and render loop hook
│   ├── utils/
│   │   └── formatters.js                 # Currency and date formatting utilities
│   ├── App.jsx                           # Application root component
│   ├── main.jsx                          # React 19 bootstrap entry
│   └── index.css                         # Tailwind directives and custom scrollbars
├── tests/
│   ├── cart.test.jsx                     # Cart actions & localStorage persistence tests
│   ├── catalog.test.jsx                  # Product filtering & tier taxonomy tests
│   └── watchTexture.test.js              # Canvas watch face rendering tests
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

### 7.2 Code Style Conventions
- **Functional Components:** React 19 hooks and functional components exclusively.
- **Tailwind Utility First:** Prefer Tailwind utility classes for all layout, styling, and transitions.
- **Self-Documenting Code:** Clean descriptive naming (`selectedTier`, `onFaceChange`, `cartItems`).
- **Safety & Resilience:** Three.js resources (`geometry`, `material`, `texture`) must be safely disposed on unmount in `useEffect` cleanup to prevent WebGL memory leaks.

---

## 8. Development & Build Commands

```bash
# Start local development server with Vite HMR
npm run dev

# Run automated tests using Vitest
npm test

# Run tests in watch mode
npm run test:watch

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 9. Testing Strategy

### 9.1 Test Levels & Framework
- **Test Runner:** Vitest with jsdom environment.
- **Scope of Automated Tests:**
  1. **Product Taxonomy & Filtering:** Verify correct segregation of `band` (standard, pro) and `watch` (standard, pro, pro_max), filtering by category and tier.
  2. **Cart Context Reducer:** Unit test cart additions, item deduplication (matching color/tier), quantity increments, removals, coupon application (`NOVA10`), and subtotal calculations.
  3. **LocalStorage Persistence:** Verify that cart changes serialize to and deserialize from `localStorage`.
  4. **Watch Texture Generator:** Unit test face rendering helper to ensure canvas dimensions, color assignments, and time/metric formatting execute without error.

---

## 10. Boundaries & Guardrails

### Always Do:
- Verify that every product strictly follows the category/tier taxonomy (`band`: standard, pro | `watch`: standard, pro, pro_max).
- Dispose Three.js scenes, meshes, and materials on component unmount.
- Keep the light minimalist purple/cyan palette consistent across all components.
- Ensure the 3D viewer gracefully handles resize events and touch drag gestures.
- Run tests (`npm test`) and build validation (`npm run build`) before committing code.

### Ask First:
- Introducing heavy external 3D libraries or remote asset URLs.
- Adding third-party CSS or UI widget libraries not already in `package.json`.
- Modifying project dependencies or build configurations.

### Never Do:
- Implement any backend server, Node API, or database connections.
- Silently degrade the 3D viewer or omit required watch faces and widgets.
- Write direct implementation code during orchestration phases.

---

## 11. Acceptance & Success Criteria

1. **Product Showcase & Taxonomy:**
   - [ ] All 5 segments are available in the mock catalog:
     - Band: Standard, Pro
     - Smart Watch: Standard, Pro, Pro Max
   - [ ] Category and tier filters accurately isolate products matching selected criteria.
2. **Interactive 3D Wearable Experience:**
   - [ ] Three.js 360-degree rotation operates smoothly with drag/orbit controls and auto-spin toggle.
   - [ ] Dynamic switching between Band and Watch 3D geometries.
   - [ ] Live switching between 4 watch faces: Minimal, Neon, Chrono, Health.
   - [ ] Interactive simulated widgets: Heart Rate pulse, Step counter, Weather display, Music player controls, and Battery status.
   - [ ] Real-time material/color changes on the 3D strap and casing.
3. **Design & Theme Fidelity:**
   - [ ] Light minimalist aesthetic matching the designated palette (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`).
   - [ ] Responsive across mobile, tablet, and desktop viewports.
4. **E-Commerce Functionality:**
   - [ ] Users can add items to cart with specific color/preset options.
   - [ ] Cart drawer shows accurate itemized list, quantity adjustment, subtotal, and coupon discount.
   - [ ] Cart persists across page reloads via `localStorage`.
   - [ ] Mock 2-step checkout flow completes with an order confirmation receipt.
5. **Quality & Stability:**
   - [ ] Automated tests pass (`npm test`).
   - [ ] Build completes without errors (`npm run build`).
