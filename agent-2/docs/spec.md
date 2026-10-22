# Technical Specification: Smart Watch & Fitness Band 3D Interactive Web Prototype

## 1. Objective & Scope

### 1.1 Objective
The goal is to build a high-performance, modern, minimalist e-commerce web prototype for exploring, configuring, and testing next-generation smart watches and fitness bands. The prototype features a real-time interactive 3D device preview powered by Three.js, allowing 360-degree orbit rotation, dynamic watch face switching, customizable strap and chassis finishes, and interactive simulation of core wearable widgets (heart rate, step counter, weather, music playback, and battery monitor).

### 1.2 Target Audience & User Stories
- **Tech-savvy Shopper**: Wants to inspect device hardware from all angles (360° rotation) and experiment with custom strap/chassis color pairings before buying.
- **Fitness & Smart Wearable Enthusiast**: Wants to test watch face layouts (Minimal, Neon, Chrono, Health) and interact directly with smart sensor widgets (ECG/heart rate, steps, music, weather) in a simulated wearable interface.
- **E-Commerce Buyer**: Wants a seamless browsing experience with product filtering by category and tier, comprehensive spec comparisons, instant cart management with persistent storage, and a friction-free simulated checkout.

### 1.3 Scope & Boundaries
- **In-Scope**:
  - Full client-side single-page application built with React 19, Vite, and Tailwind CSS.
  - Interactive 3D viewer using Three.js with procedural geometry for bands and smart watches (ensuring zero external 3D asset download lag or broken links).
  - 360-degree orbit controls, touch/mouse dragging, zoom limits, auto-rotation toggle, and camera reset.
  - Offscreen 2D dynamic canvas mapped onto 3D watch screen for responsive watch faces and interactive widget simulations.
  - Product catalog covering 2 main categories (Band and Smart Watch) across 5 distinct tiers.
  - Side-by-side product specification comparison modal/drawer.
  - Persistent shopping cart backed by browser `localStorage` with checkout flow simulation.
  - Light minimalist design system with soft purple and cyan palette (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`).
- **Out-of-Scope**:
  - Real backend database, user authentication, or payment gateway APIs (purely simulated on the client).
  - External server-side rendering (SSR).

---

## 2. Technical Stack & Development Commands

### 2.1 Stack Architecture
- **Framework**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite 6 (`vite`, `@vitejs/plugin-react`)
- **Styling**: Tailwind CSS 3.4 (`tailwindcss`, `postcss`, `autoprefixer`)
- **3D Graphics**: Three.js (`three`, `@types/three`)
- **Iconography**: Lucide React (`lucide-react`)
- **Testing**: Vitest (`vitest`) + `@testing-library/react` (or DOM utilities)
- **Language**: TypeScript / Modern ESM

### 2.2 CLI Commands
- **Local Development Server**:
  ```bash
  npm run dev
  ```
  Runs Vite dev server at `http://localhost:5173`.
- **Production Build**:
  ```bash
  npm run build
  ```
  Runs TypeScript compilation and generates optimized production bundle in `dist/`.
- **Preview Production Build**:
  ```bash
  npm run preview
  ```
  Locally serves production assets from `dist/`.
- **Unit & Integration Tests**:
  ```bash
  npm test
  ```
  Executes Vitest test suite once with full test output.
- **Test Watch Mode**:
  ```bash
  npm run test:watch
  ```
  Runs Vitest in interactive watch mode for rapid test-driven iteration.

---

## 3. Product Taxonomy & Mock Data Schemas

### 3.1 Category & Tier Taxonomy
The product catalog is partitioned into two primary device classes, each divided into distinct hardware tiers:

1. **Fitness Band (`band`)**:
   - **Standard (`standard`)**: Slim capsule profile, 1.1" crisp OLED screen, lightweight silicone band, 14-day battery life, daily activity tracking.
   - **Pro (`pro`)**: Curved 1.47" AMOLED display, aircraft-grade aluminum bezel, standalone GPS, continuous SpO2/ECG monitoring, fast magnetic charging.

2. **Smart Watch (`watch`)**:
   - **Standard (`standard`)**: Timeless round squircle case, 1.4" AMOLED display, aluminum frame, Bluetooth calls, 50+ workout modes, 7-day battery.
   - **Pro (`pro`)**: Aerospace titanium case, sapphire crystal glass, precision rotating digital crown, dual-mic noise cancelling speaker, advanced multi-sport telemetry.
   - **Pro Max (`pro_max`)**: Rugged expedition-ready 49mm titanium bumper chassis, dual-frequency high-precision GNSS, sapphire lens with 100m water resistance, emergency siren, ultra-extended 14-day dual-engine battery.

### 3.2 TypeScript Schemas
```typescript
export type ProductCategory = 'band' | 'watch';

export type BandTier = 'standard' | 'pro';
export type WatchTier = 'standard' | 'pro' | 'pro_max';
export type ProductTier = BandTier | WatchTier;

export type WatchFaceId = 'minimal' | 'neon' | 'chrono' | 'health';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSpecs {
  display: string;
  batteryLife: string;
  waterResistance: string;
  connectivity: string;
  sensors: string[];
  weight: string;
  casingMaterial: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  tier: ProductTier;
  price: number;
  originalPrice?: number;
  badge?: string;
  rating: number;
  reviewsCount: number;
  description: string;
  specs: ProductSpecs;
  chassisColors: ColorOption[];
  strapColors: ColorOption[];
  defaultChassisColor: string;
  defaultStrapColor: string;
  defaultFace: WatchFaceId;
  featured: boolean;
  modelType: 'band_standard' | 'band_pro' | 'watch_standard' | 'watch_pro' | 'watch_pro_max';
}

export interface CartItem {
  id: string; // unique item composite key (productId + chassisColor + strapColor + selectedFace)
  productId: string;
  name: string;
  category: ProductCategory;
  tier: ProductTier;
  price: number;
  quantity: number;
  chassisColor: ColorOption;
  strapColor: ColorOption;
  selectedFace: WatchFaceId;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
}
```

### 3.3 Mock Catalog Breakdown (5 Core Devices)
1. **PulseBand 2 (Band - Standard)**: $49 (Sale from $59). Sleek everyday fitness tracker, 14-day standby, silicone strap options (Obsidian Black, Frost White, Lavender Mist).
2. **PulseBand Pro (Band - Pro)**: $89. Curved AMOLED, aerospace aluminum border, built-in GPS, premium fluororubber strap (Midnight, Alpine Teal, Electric Violet).
3. **Horizon Watch SE (Watch - Standard)**: $179. Minimalist everyday smartwatch, vibrant 60Hz screen, customizable silicone & woven bands (Cloud Silver, Space Grey, Lavender Cyan).
4. **Horizon Watch Pro (Watch - Pro)**: $299. Brushed titanium chassis, sapphire crystal, rotating tactile crown, genuine leather / sport loop (Titanium Silver, Deep Indigo, Matte Black).
5. **Horizon Watch Pro Max (Watch - Pro Max)**: $449 (Flagship). Rugged 49mm titanium armor, dive-ready 10ATM, safety orange action button, high-strength ocean loop (Titanium Amber, Arctic White, Cyber Violet).

---

## 4. 3D Interactive Viewer Architecture

### 4.1 Rendering Pipeline (Three.js)
The 3D viewer is encapsulated in a dedicated canvas module:
- **WebGLRenderer**: Hardware-accelerated, tone-mapped (ACESFilmicToneMapping), antialiased, with sRGB encoding and device pixel ratio capped at 2 for optimal mobile/desktop frame rates.
- **Lighting Rig**:
  - `AmbientLight` (0.6 intensity, subtle lavender/cyan bounce) to prevent harsh pitch-black shadows.
  - Primary `DirectionalLight` (1.2 intensity, soft directional shadow) positioned at `[5, 8, 5]`.
  - Secondary `PointLight` rim light positioned behind the device to accentuate metallic bevels and strap edges.
- **Camera & OrbitControls**:
  - `PerspectiveCamera` with 45° FOV, centered at target `[0, 0, 0]`.
  - Orbit rotation with horizontal 360° free rotation, vertical polar limits (15° to 165° to avoid awkward under-flips), smooth damping (`dampingFactor: 0.05`), and restricted zoom distance (min: 2.2, max: 6.0).
  - Floating UI controls: Auto-rotate toggle (slow 2 RPM turntable presentation), Reset View button, and Quick Angle presets (Front, Angle 45°, Side profile).

### 4.2 Procedural Model Synthesis
To ensure instant load times without large binary mesh downloads or network failure risks, 3D meshes are procedurally constructed using Three.js primitives:
- **Band Capsule & Curved Strap**:
  - Capsule case generated via rounded cylinder/extrude geometry with metallic-sheen `MeshStandardMaterial`.
  - Flexible curved band generated using extruded CatmullRom curve or parametric cylinder segments wrapping naturally around a wrist form.
  - Bezel ring with subtle dark chrome roughness (`metalness: 0.85`, `roughness: 0.2`).
- **Smart Watch Body (Standard, Pro, Pro Max)**:
  - **Standard**: Polished cylindrical squircle casing, dual side buttons, sleek silicone lugs.
  - **Pro**: Chamfered titanium casing with ribbed rotating crown at 2 o'clock, secondary tactile pusher at 4 o'clock, elevated sapphire crystal rim.
  - **Pro Max**: Bold hexagonal/octagonal titanium armor case with raised protective bezel lip, safety orange side accent button, ribbed heavy-duty strap with titanium buckle pins.
- **Color Customization**:
  - Strap meshes dynamically update their material diffuse color to match user-selected strap swatches.
  - Case and bezel meshes dynamically update their specular and base colors to match user-selected chassis finishes (Titanium, Silver, Space Gray, Rose Violet).

### 4.3 Dynamic Watch Face Screen Texture
The watch display is rendered onto an offscreen HTML5 `CanvasRenderingContext2D` (e.g., 512x512 resolution) and mapped onto the 3D screen mesh as a `THREE.CanvasTexture`:
- When time updates, active face changes, or simulated widgets trigger, the 2D canvas is redrawn and `canvasTexture.needsUpdate = true` is flagged.
- **Watch Faces**:
  1. **Minimal**: Ultra-clean minimalist analog/digital watch face. Fine serif/sans-serif typography, crisp second markers, subtle battery pill, clean date display (`"WED 22 OCT"`).
  2. **Neon**: Vibrant cyberpunk inspired dual-gradient typography (cyan `#06B6D4` and purple `#7C3AED`), digital glowing clock, concentric glowing step and calorie progress rings.
  3. **Chrono**: Classic racing chronograph with three distinct circular sub-dials (active stopwatch seconds, 30-minute accumulator, 24h dial), tachymeter scale, and brushed slate backdrop.
  4. **Health**: Live telemetry dashboard featuring a dynamic animated ECG heart rhythm wave, current BPM counter, circular step goal arc, and calorie/hydration meter.

### 4.4 Interactive Simulated Widgets
Users can click or tap widgets on the screen or via the viewer control panel to interactively simulate smart functions:
- **Heart Rate Widget**:
  - Live pulse animation (heart icon beats with dynamic CSS/Canvas scale).
  - Tap "Measure" to trigger a 3-second diagnostic simulation that calculates a realistic reading between 68 and 125 BPM.
- **Steps & Activity Widget**:
  - Real-time animated circular progress ring (e.g., 7,420 / 10,000 steps).
  - "+100 Steps" and "+500 Steps" simulation buttons to see the goal ring fill up with celebration sparks.
- **Weather Widget**:
  - Displays location (`"Tokyo, JP"` / `"San Francisco"`), temperature (`24°C`), weather condition icon (Sunny, Partly Cloudy, Rain), and UV index.
  - Tap weather widget to toggle conditions and see the face theme adapt.
- **Music Playback Widget**:
  - Album art preview, song title (`"Neon Midnight - Synthwave"`), artist, animated playback equalizer bars, and Play/Pause/Next track toggles.
- **Battery & Power Widget**:
  - Percentage indicator (88%), charging animation toggle, and Power-Save mode toggle (dims background to conserve simulated battery).

---

## 5. UI/UX Design System: Minimalist Light Violet & Cyan

### 5.1 Color Palette & Tokens
- **Background**: `#F8F6FF` (Subtle lavender-tinted pearl white, calm and ultra-modern).
- **Surface / Card Background**: `#FFFFFF` with glassmorphic semi-transparent backdrop blur (`rgba(255, 255, 255, 0.85)`).
- **Primary Violet Accent**: `#7C3AED` (Deep vivid violet for primary CTA buttons, active state indicators, and glowing highlights).
- **Secondary Cyan Accent**: `#06B6D4` (Electric cyan for energetic micro-interactions, secondary accents, and step badges).
- **Soft Cyan Tint**: `#E0F7FA` (Used for subtle chip backgrounds, tag badges, and soft glow halos).
- **Text Primary**: `#0F172A` (Slate 900 for high-contrast, effortless readability).
- **Text Secondary / Muted**: `#64748B` (Slate 500 for secondary descriptions and specs).
- **Border Subtle**: `rgba(124, 58, 237, 0.08)` to `rgba(6, 182, 212, 0.15)`.

### 5.2 Typography & Aesthetics
- **Typeface**: Modern geometric sans-serif (Inter, Plus Jakarta Sans, or system-ui sans-serif stack).
- **Minimalist Principles**:
  - Generous whitespace and padding.
  - Crisp rounded pill buttons (`rounded-full`) and smooth card corners (`rounded-2xl`).
  - Subtle drop shadows (`shadow-sm`, `shadow-[0_12px_40px_rgba(124,58,237,0.06)]`).
  - Micro-interactions: 150ms-250ms smooth CSS transitions for hover, scale-up on interactive badges, and smooth tab switching.

### 5.3 Responsive Layout Structure
1. **Header & Navigation**:
   - Brand logo with subtle purple/cyan glowing gradient dot.
   - Category navigation pills: `All`, `Fitness Bands`, `Smart Watches`.
   - Action triggers: Compare Products, Wishlist count, and Shopping Cart drawer trigger with live item count badge.
2. **Hero 3D Studio Section**:
   - Split-screen or centered immersive 3D stage featuring the active configured device.
   - Left/Right control dock:
     - Model selector (Band Standard, Band Pro, Watch Standard, Watch Pro, Watch Pro Max).
     - Watch Face Selector (Minimal, Neon, Chrono, Health) with real-time screen re-rendering.
     - Case finish swatches & strap color swatches.
     - Interactive Widget Toolbar (Heart Rate test, Step counter boost, Music toggle).
     - Direct "Add Customized Device to Cart" button with price calculation.
3. **Product Catalog Showcase**:
   - Filterable grid with category and tier badges.
   - Product cards displaying high-res visual preview, key spec pills (battery, water resistance, screen type), pricing, and quick-actions ("Customize in 3D" or "Instant Add to Cart").
4. **Side-by-Side Comparison Drawer**:
   - Compare Band Standard vs Pro, or Watch Standard vs Pro vs Pro Max across 8 technical dimensions (display, casing, battery, GPS, waterproof rating, sensors, price).
5. **Slide-Over Shopping Cart**:
   - Slide-out drawer displaying customized item breakdown (device name, selected chassis, strap color swatch, watch face name).
   - Quantity increments/decrements, item removal, voucher code simulation, and subtotal/tax/shipping breakdown.
6. **Simulated Checkout Flow**:
   - 2-step checkout modal:
     - Step 1: Customer shipping address, simulated payment choice (Apple Pay, Credit Card, Cash on Delivery).
     - Step 2: Instant order confirmation screen with order reference number, delivery date estimate, and reset cart action.

---

## 6. Client-Side State Management & Storage

### 6.1 State Architecture
The application maintains two primary client state domains using React Context and standard hooks:

1. **`CartContext` (with `localStorage` persistence)**:
   - Key: `antigravity_smartwatch_cart_v1`
   - Actions:
     - `addItem(item: Omit<CartItem, 'id' | 'quantity'>)`: Checks if identical configuration exists; increments quantity or appends new item.
     - `removeItem(itemId: string)`: Removes item by composite key.
     - `updateQuantity(itemId: string, quantity: number)`: Updates item count; removes if quantity reaches 0.
     - `clearCart()`: Flushes cart state and removes storage key.
   - Computed properties: `totalItemsCount`, `subtotal`, `estimatedTax`, `shippingFee` (free over $100), `grandTotal`.

2. **`ViewerContext`**:
   - Active device configuration:
     - `selectedProductId`: string
     - `selectedChassisColor`: ColorOption
     - `selectedStrapColor`: ColorOption
     - `selectedWatchFace`: WatchFaceId
     - `isAutoRotating`: boolean
     - `simulatedWidgets`:
       - `heartRate`: number (BPM)
       - `isMeasuringHeartRate`: boolean
       - `steps`: number
       - `stepGoal`: number
       - `isPlayingMusic`: boolean
       - `currentTrack`: { title: string; artist: string }
       - `weather`: { temp: number; condition: 'sunny' | 'cloudy' | 'rainy'; city: string }
       - `battery`: number

---

## 7. Project Structure

```
c:\Users\Admin\Documents\antigravity\agent-run-2/
├── docs/
│   └── spec.md                  # This technical specification
├── tasks/
│   ├── plan.md                  # Phase 2 implementation plan (to be created in Phase 2)
│   └── todo.md                  # Phase 2 task breakdown (to be created in Phase 2)
├── src/
│   ├── assets/                  # Static assets and icons
│   ├── components/
│   │   ├── common/              # Buttons, Badges, Modals, Sliders, Dropdowns
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/              # Navbar, Footer, Container
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── viewer3d/            # 3D canvas, Three.js scene, geometry builders, controls
│   │   │   ├── WatchViewer3D.tsx
│   │   │   ├── SceneManager.ts
│   │   │   ├── proceduralMeshes.ts
│   │   │   ├── watchFaceCanvas.ts
│   │   │   └── ViewerControlsOverlay.tsx
│   │   ├── catalog/             # Product list, filters, cards, spec tables
│   │   │   ├── ProductCatalog.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── FilterTabs.tsx
│   │   │   └── ComparisonModal.tsx
│   │   └── cart/                # Cart drawer, cart item row, simulated checkout
│   │       ├── CartDrawer.tsx
│   │       ├── CartItemRow.tsx
│   │       └── CheckoutModal.tsx
│   ├── context/
│   │   ├── CartContext.tsx      # Cart state + localStorage sync
│   │   └── ViewerContext.tsx    # 3D customizer & widget state
│   ├── data/
│   │   └── products.ts          # Mock catalog: Band (Std/Pro), Watch (Std/Pro/Pro Max)
│   ├── types/
│   │   └── index.ts             # TypeScript domain models
│   ├── utils/
│   │   ├── formatters.ts        # Currency, date, and numbers formatting
│   │   └── storage.ts           # Type-safe localStorage wrapper
│   ├── App.tsx                  # Main application orchestrator
│   ├── main.tsx                 # Entrypoint
│   └── index.css                # Tailwind directives & custom light lavender utilities
├── tests/
│   ├── cart.test.ts             # Unit tests for cart calculations & localStorage persistence
│   ├── products.test.ts         # Unit tests for product catalog integrity & filtering
│   ├── watchFaceCanvas.test.ts  # Canvas rendering helper unit tests
│   └── setup.ts                 # Test environment setup
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Theme configuration (custom colors, fonts, shadows)
├── postcss.config.js            # PostCSS configuration
├── vite.config.ts               # Vite bundler configuration
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 8. Code Style & Conventions

- **TypeScript Strictness**: Strict mode enabled; no `any` types allowed. All component props and function signatures must be explicitly typed.
- **Naming Conventions**:
  - Components: PascalCase (e.g., `WatchViewer3D.tsx`, `CartDrawer.tsx`).
  - Hooks: camelCase with `use` prefix (e.g., `useCart.ts`, `useViewer.ts`).
  - Types / Interfaces: PascalCase (e.g., `Product`, `CartItem`, `WatchFaceId`).
  - Constants & Config: UPPER_SNAKE_CASE (e.g., `DEFAULT_WATCH_FACE`, `STORAGE_KEY_CART`).
- **React Standards**:
  - Pure functional components with custom hooks for complex logic.
  - Proper cleanup for Three.js WebGL context, animation request frames (`cancelAnimationFrame`), and window resize event listeners to prevent memory leaks.
- **Example Snippet**:
  ```typescript
  import React, { useMemo } from 'react';
  import { useCart } from '../../context/CartContext';
  import { Product, ColorOption, WatchFaceId } from '../../types';
  import { formatCurrency } from '../../utils/formatters';

  interface CustomizerBarProps {
    product: Product;
    selectedChassis: ColorOption;
    selectedStrap: ColorOption;
    selectedFace: WatchFaceId;
    onSelectChassis: (color: ColorOption) => void;
    onSelectStrap: (color: ColorOption) => void;
    onSelectFace: (face: WatchFaceId) => void;
  }

  export const CustomizerBar: React.FC<CustomizerBarProps> = ({
    product,
    selectedChassis,
    selectedStrap,
    selectedFace,
    onSelectChassis,
    onSelectStrap,
    onSelectFace,
  }) => {
    const { addItem } = useCart();

    const handleAddToCart = () => {
      addItem({
        productId: product.id,
        name: product.name,
        category: product.category,
        tier: product.tier,
        price: product.price,
        chassisColor: selectedChassis,
        strapColor: selectedStrap,
        selectedFace,
      });
    };

    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
          <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 rounded-full">
            {product.tier.replace('_', ' ')}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-full transition-all shadow-md hover:shadow-purple-200 active:scale-95"
        >
          Add Customized to Cart
        </button>
      </div>
    );
  };
  ```

---

## 9. Testing Strategy

### 9.1 Framework & Environment
- **Test Runner**: Vitest (`vitest`) for rapid native ESM test execution.
- **Environment**: jsdom / node for testing pure logic, state stores, and rendering utilities.

### 9.2 Test Coverage Scope
1. **Catalog & Taxonomy Integrity (`products.test.ts`)**:
   - Verify all 5 required tiers are present: Band Standard, Band Pro, Watch Standard, Watch Pro, Watch Pro Max.
   - Verify each product has valid chassis colors, strap colors, spec dimensions, and pricing.
   - Verify category filter functions (filter by Band, Watch, or All).
2. **Cart Logic & LocalStorage Persistence (`cart.test.ts`)**:
   - Adding a new custom device creates a distinct cart line item.
   - Adding the exact same configuration increments the item quantity rather than duplicating.
   - Updating item quantity adjusts subtotals accurately.
   - Removing an item drops it from state and updates `localStorage`.
   - Free shipping discount logic triggers when order exceeds $100.
   - Simulated checkout flushes cart and generates order summary.
3. **Canvas & 3D Utility Helpers (`watchFaceCanvas.test.ts`)**:
   - Test offscreen canvas text/time generation function.
   - Verify watch face ID mapping returns valid theme colors for Minimal, Neon, Chrono, and Health.
4. **Widget Simulator Logic**:
   - Test heart rate measurement range constraints (60–140 BPM).
   - Test step counter increment logic.
   - Test music player state toggling (play/pause).

---

## 10. Boundaries & Governance

- **Always Do**:
  - Run `npm test` and `npm run build` to verify clean compilation and zero lint/type errors before creating commits.
  - Follow the designated color scheme: `#F8F6FF` background, `#7C3AED` primary violet, `#06B6D4` vibrant cyan, `#E0F7FA` soft cyan tint.
  - Ensure 3D viewport has proper cleanup logic on unmount to release WebGL buffers and avoid GPU leaks.
  - Provide fallback visual states if WebGL is disabled or unsupported in older test environments.
- **Ask First**:
  - Introducing heavy external 3D asset files (.gltf / .glb files > 5MB) that could degrade web load speeds.
  - Changing product category taxonomy or removing tiers.
  - Adding heavy third-party UI component libraries (keep bundle lean using Tailwind CSS and Lucide React).
- **Never Do**:
  - Never introduce external backend dependencies or real payment integrations (client-side prototype only).
  - Never silence TypeScript errors with `@ts-ignore` or `any`.
  - Never skip or delete failing tests to achieve a green build.

---

## 11. Success Criteria & Acceptance Checklist

- [ ] **Catalog Taxonomy**:
  - [ ] Fitness Band with Standard and Pro tiers properly configured with unique specs.
  - [ ] Smart Watch with Standard, Pro, and Pro Max tiers properly configured with unique specs.
- [ ] **3D Interactive Experience**:
  - [ ] Three.js 3D viewport displays responsive 3D model corresponding to active device.
  - [ ] Smooth 360° orbit rotation with mouse/touch drag, damping, and zoom limits.
  - [ ] 4 distinct watch faces (Minimal, Neon, Chrono, Health) can be swapped dynamically on the 3D model.
  - [ ] Strap and chassis colors can be customized with real-time 3D material updates.
  - [ ] Interactive simulated widgets (Heart rate pulse, step counter boost, music play/pause, weather, battery).
- [ ] **UI & Design**:
  - [ ] Minimalist aesthetic with light purple/cyan theme (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`).
  - [ ] Responsive layout across mobile, tablet, and desktop viewports.
  - [ ] Side-by-side product specification comparison drawer.
- [ ] **Cart & Checkout**:
  - [ ] Add customized or catalog products to cart.
  - [ ] Persistent cart state stored in `localStorage`.
  - [ ] Slide-out cart drawer with live price calculation and quantity controls.
  - [ ] Simulated checkout modal with order confirmation step.
- [ ] **Quality & Verification**:
  - [ ] Vitest test suite runs and passes all tests.
  - [ ] Production build (`npm run build`) compiles cleanly without TypeScript errors.
