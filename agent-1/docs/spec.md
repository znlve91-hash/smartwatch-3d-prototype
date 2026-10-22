# Technical Specification: Smart Watch & Fitness Band 3D Interactive E-Commerce Prototype

**Document Version:** 1.0.0  
**Status:** Ready for Review (Phase 1)  
**Target Platform:** Web (Desktop & Mobile Responsive, Modern Browsers)  
**Author:** Autonomous Lead Orchestrator  

---

## 1. Executive Summary & Objective

### 1.1 Objective
Build a modern, minimalist prototype web application for showcasing and purchasing smart wearable devices (Smart Watches & Smart Bands). The platform features an interactive 3D WebGL preview studio powered by Three.js, enabling users to inspect wearable hardware in 360-degree rotation, customize watch bands/casing finishes, switch between dynamic digital/analog watch faces, and interact with simulated on-device smart widgets (Heart Rate, Activity/Steps, Weather, Music Player, Battery).

### 1.2 Core Scope & Constraints
- **Client-Side Prototype:** 100% frontend implementation running on React 19, Vite, and Tailwind CSS.
- **No Backend Requirement:** Mock product catalog, mock inventory, and persistent client-side Cart & Simulated Checkout backed by browser `localStorage`.
- **Aesthetic Direction:** Modern Minimalist Light Theme featuring soft lilac/violet (`#F8F6FF`, `#7C3AED`) and light cyan/aqua accents (`#E0F7FA`, `#06B6D4`) with sleek glassmorphism and crisp typography.
- **Hardware Categories:**
  1. **Smart Band:** 2 product tiers — **Standard** and **Pro**.
  2. **Smart Watch:** 3 product tiers — **Standard**, **Pro**, and **Pro Max**.
- **Interactive 3D Experience:** Three.js procedural WebGL model with orbit/touch controls, material customization, and dynamic CanvasTexture-driven screen rendering for watch faces and responsive widgets.

---

## 2. Product Taxonomy & Mock Catalog Specification

### 2.1 Product Hierarchy & Segmentation

```
Wearable Catalog
├── Category: Smart Band ("band")
│   ├── Tier: Standard ("standard")
│   │   └── Aura Band Lite — Slim, silicone strap, essential fitness tracking ($49)
│   └── Tier: Pro ("pro")
│       └── Aura Band Pro — Curved AMOLED, GPS, woven active strap, SpO2 & sleep monitor ($89)
└── Category: Smart Watch ("watch")
    ├── Tier: Standard ("standard")
    │   └── Horizon Watch — Circular 1.4" aluminum case, fitness & notification hub ($149)
    ├── Tier: Pro ("pro")
    │   └── Horizon Watch Pro — Stainless steel, sapphire glass, ECG + skin temp, Milanese loop ($249)
    └── Tier: Pro Max ("pro_max")
        └── Horizon Watch Pro Max — 49mm Aerospace titanium, dive computer, ultra-bright 2000-nit sapphire screen, alpine loop ($399)
```

### 2.2 Data Schemas (TypeScript Definitions)

```typescript
export type ProductCategory = 'band' | 'watch';
export type ProductTier = 'standard' | 'pro' | 'pro_max';

export type WatchFaceId = 'minimal' | 'neon' | 'chrono' | 'health';
export type ActiveWidgetId = 'heart_rate' | 'steps' | 'weather' | 'music' | 'battery';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  caseHex: string;
  strapHex: string;
}

export interface ProductSpecification {
  display: string;
  caseMaterial: string;
  strapMaterial: string;
  batteryLife: string;
  waterResistance: string;
  sensors: string[];
  connectivity: string[];
  weight: string;
  dimensions: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  tier: ProductTier;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  featured?: boolean;
  colors: ColorOption[];
  defaultColorId: string;
  defaultFace: WatchFaceId;
  specs: ProductSpecification;
  features: string[];
  description: string;
  // 3D Canvas configuration hints
  modelType: 'band_capsule' | 'watch_round' | 'watch_squircle';
  bezelThickness: number;
  caseSizeMm: number;
}
```

### 2.3 Mock Dataset Specification

| ID | Product Name | Category | Tier | Price | Case Material | Display | Default Face |
|---|---|---|---|---|---|---|---|
| `band-aura-std` | **Aura Band Standard** | Band | Standard | $49 | Lightweight Polycarbonate | 1.1" Flat AMOLED | Minimal |
| `band-aura-pro` | **Aura Band Pro** | Band | Pro | $89 | Brushed Aluminum | 1.47" Curved AMOLED | Neon |
| `watch-horizon-std`| **Horizon Watch Standard** | Watch | Standard | $149 | Anodized Aluminum | 1.39" Circular Retina | Minimal |
| `watch-horizon-pro`| **Horizon Watch Pro** | Watch | Pro | $249 | 316L Stainless Steel | 1.43" Always-On Sapphire | Chrono |
| `watch-horizon-max`| **Horizon Watch Pro Max** | Watch | Pro Max | $399 | Grade 5 Aerospace Titanium | 1.95" Rugged Sapphire (2000 nits) | Health |

---

## 3. 3D Interactive Viewer Architecture

### 3.1 Three.js Procedural Hardware Synthesis
Rather than relying on heavy external `.gltf` asset loading that can stall or fail in static environments, the 3D viewer will utilize Three.js parametric geometries and procedural mesh synthesis for instant, high-fidelity rendering:

1. **Smart Band Geometry (`band_capsule`):**
   - **Case:** Rounded capsule (`CylinderGeometry` / rounded box) with smooth chamfered edges.
   - **Strap:** Smooth parametric spline curve (`TubeGeometry` or curved extrusion) seamlessly hugging the band case.
   - **Glass Screen:** Slightly curved frontal cap with glossy glass material (`MeshPhysicalMaterial`, roughness: 0.1, transmission: 0.2, clearcoat: 1.0).

2. **Smart Watch Geometry (`watch_round` & `watch_squircle`):**
   - **Casing:** Outer cylinder / rounded super-ellipse with metallic shader attributes (metalness: 0.85, roughness: 0.25).
   - **Bezel:** Precision chamfer ring with tachymeter notches or polished rim.
   - **Lugs & Crown Button:** Distinct knurled digital crown dial at 2 o'clock / 3 o'clock position with rotatable interaction and side tactile button.
   - **Straps:** Articulated multi-segment silicone sport band, woven nylon, or stainless mesh strap anchored at top and bottom lugs.

### 3.2 Dynamic Watch Screen CanvasTexture Engine
The watch screen is rendered using an offscreen HTML `<canvas>` (512x512 resolution) mapped as a dynamic `THREE.CanvasTexture` with `needsUpdate = true`:

```
               +--------------------------------------+
               |      Offscreen 2D Canvas (512x512)   |
               |                                      |
               |   [Time / Date Engine]               |
               |   [Watch Face Render Layer]          |
               |   [Active Simulated Widget Layer]    |
               +------------------+-------------------+
                                  |
                           CanvasTexture
                                  |
                                  v
                  Three.js Screen Mesh Material
                  (Emissive + Glossy Glass Face)
```

#### Watch Faces:
1. **Minimal Face:**
   - Sleek typography: oversized modern numerals, thin baton analog hands, battery ring percentage indicator, calendar date pill.
2. **Neon Face:**
   - Cyber-minimalist aesthetics: Glowing violet (`#7C3AED`) and cyan (`#06B6D4`) numeric readouts, pulsing seconds counter, dynamic gradient glow.
3. **Chrono Face:**
   - Precision chronograph: 3 sub-dials (60-sec chronograph, 30-min counter, 24-hr dial), dual-color bezel markings, ticking sweep second hand.
4. **Health / Activity Face:**
   - Apple-style concentric activity rings: Calories (Violet), Steps (Cyan), Active Minutes (Emerald); real-time mini heart-rate sparkline graph.

#### Interactive On-Screen Widgets (Simulated):
1. **Heart Rate Widget:**
   - Real-time animated ECG pulse wave.
   - Interactive "Measure Now" button simulating fluctuating 68 - 128 BPM with status message ("Normal Resting Rate").
2. **Steps & Activity Widget:**
   - Daily progress circular gauge towards 10,000 steps.
   - Interactive "+500 Steps Walk" simulation button updating step count, distance (km), and calories burned (kcal).
3. **Weather Widget:**
   - Current temperature (e.g. 24°C / 75°F), animated sun/cloud icon, humidity index, UV index, 3-hour mini forecast.
4. **Music Player Widget:**
   - Simulated track playback: Track title ("Midnight Horizon"), artist ("Aura Sounds"), Play/Pause toggle, Skip Next/Prev, dynamic animated equalizer bars.
5. **Battery & Power Widget:**
   - Real-time battery meter (86%), charging indicator toggle, power-saving mode toggle (dims display, limits background widgets).

### 3.3 3D Studio User Controls
- **Rotation:** Smooth 360-degree orbit rotation via mouse drag and touch gestures (damped inertia).
- **Auto-Rotate Toggle:** Elegant 4 RPM display rotation with auto-pause on user interaction.
- **Lighting Studio:**
  - Ambient light: Subtle lilac-tinted fill (`#F5F3FF`, 0.8 intensity).
  - Key light: Sharp directional light (`#FFFFFF`, 1.2 intensity) creating metallic edge highlights.
  - Rim light: Cool cyan directional light (`#06B6D4`, 0.6 intensity) highlighting the watch silhouette.
- **Customization Panel Controls:**
  - Case & Strap Color Picker: Updates 3D mesh materials in real time.
  - Watch Face Switcher: Instantly redraws screen texture.
  - Widget Mode Toggle: Opens and interacts with on-screen widgets.
  - Camera Preset Buttons: Front View, Perspective View, Crown Detail View, Strap Side Profile.

---

## 4. UI/UX Design System & Color Palette

### 4.1 Visual Theme: Modern Minimalist Light
- **Design Philosophy:** Airiness, clarity, subtle depths, micro-interactions, and premium tactile feel inspired by high-end consumer hardware showcases (Nothing, Apple, Bang & Olufsen).
- **Color Palette Tokens:**
  - **Background Primary:** `#F8F6FF` (Soft Lavender Frost)
  - **Background Secondary:** `#F1EFFF` (Subtle Lilac Muted Surface)
  - **Surface White:** `#FFFFFF` (Card container with `rgba(255, 255, 255, 0.85)` backdrop blur)
  - **Primary Brand (Violet):** `#7C3AED` (Deep Vibrant Purple - Primary CTAs, active highlights)
  - **Primary Glow (Light Purple):** `#DDD6FE` (Hover halos, active pill backgrounds)
  - **Accent Cyan:** `#06B6D4` (Tech Cyan - Highlights, step rings, status active)
  - **Accent Soft Cyan:** `#E0F7FA` (Water / Cyan background tints, badge backgrounds)
  - **Text Primary:** `#0F172A` (Slate 900 - High contrast headers and values)
  - **Text Secondary:** `#475569` (Slate 600 - Body copy and descriptions)
  - **Text Muted:** `#94A3B8` (Slate 400 - Captions, borders, inactive indicators)
  - **Borders & Dividers:** `rgba(124, 58, 237, 0.08)` to `rgba(6, 182, 212, 0.12)`

### 4.2 Layout & Navigation Hierarchy
1. **Header / Navbar:**
   - Brand Logo ("**AURA** WEARABLES") with cyan-purple gradient dot.
   - Primary Navigation: "Products", "3D Studio Preview", "Compare Models", "Technology".
   - Category Quick Filters: "All", "Smart Bands (2)", "Smart Watches (3)".
   - Action Items: Search bar modal trigger, Wishlist, Cart Drawer trigger with animated badge counter.
2. **Hero Section:**
   - Split layout: Left column with punchy headline, tier badge, CTA "Customize in 3D" & "Add to Cart"; Right column with floating interactive 3D hero stage.
3. **Interactive 3D Studio Section:**
   - Full-width immersive workspace with 3D canvas viewport, floating toolbar for Face selection, Color palette swatches, and Widget simulator drawer.
4. **Product Catalog Grid:**
   - Filterable by Category (`Band` vs `Watch`) and Tier (`Standard`, `Pro`, `Pro Max`).
   - Clean product cards displaying 3D rendering preview, key specs badges, color variant dots, pricing with discount tag, and "Try 3D" & "Add to Cart" buttons.
5. **Comparison Matrix:**
   - Side-by-side comparison table between Standard vs Pro (Band) and Standard vs Pro vs Pro Max (Watch).
6. **Cart Slide-Over Drawer & Simulated Checkout Flow:**
   - Sleek slide-out modal from right side, displaying selected items, custom strap/color configurations, quantities, totals, and "Proceed to Checkout" button.

---

## 5. Client-Side Cart & Checkout State Management

### 5.1 Cart State Model (`localStorage` key: `aura_cart_v1`)

```typescript
export interface CartItem {
  id: string; // unique item uuid (product.id + color + strap + face)
  productId: string;
  name: string;
  category: ProductCategory;
  tier: ProductTier;
  price: number;
  quantity: number;
  selectedColor: ColorOption;
  selectedFace: WatchFaceId;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountPercentage: number;
  taxRate: number; // default 0.08 (8%)
  shippingCost: number; // default $0 (Free shipping prototype)
}
```

### 5.2 Cart Operations & React Hook API
- `useCart()` custom hook:
  - `items: CartItem[]`
  - `totalItemsCount: number`
  - `subtotal: number`
  - `discountAmount: number`
  - `taxAmount: number`
  - `totalPrice: number`
  - `addItem(product: Product, color: ColorOption, face: WatchFaceId, qty?: number): void`
  - `removeItem(cartItemId: string): void`
  - `updateQuantity(cartItemId: string, quantity: number): void`
  - `applyDiscount(code: string): { success: boolean; message: string }`
  - `clearCart(): void`

### 5.3 Mock Checkout Flow
1. **Step 1: Review Order:** Items list, selected finishes, price calculation with promo code support (`AURA10` for 10% off, `LAUNCH20` for 20% off).
2. **Step 2: Shipping Details:** Name, email, shipping address, simulated delivery estimate (2-3 business days).
3. **Step 3: Simulated Payment:** Select Payment Method (Apple Pay, Credit Card, Cash on Delivery), with simulated card number validator and instantaneous checkout approval.
4. **Step 4: Order Confirmation:** Confirmed screen with generated Order ID (`AURA-XXXXXX`), summary recap, order tracking simulation, and "Continue Shopping" button (auto-clears cart).

---

## 6. Technical Stack & Development Commands

### 6.1 Technology Stack
- **Framework & Runtime:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite 6 (`@vitejs/plugin-react`)
- **Styling:** Tailwind CSS 3.4 (`tailwindcss`, `postcss`, `autoprefixer`)
- **3D Graphics:** Three.js (`three`, `@types/three`)
- **Icons:** Lucide React (`lucide-react`)
- **Test Runner:** Vitest 3 (`vitest`)

### 6.2 Executable CLI Commands
```bash
# Start local development server (HMR enabled)
npm run dev

# Run production build and generate static assets into dist/
npm run build

# Preview production build locally
npm run preview

# Run automated test suite
npm test

# Run tests in continuous watch mode
npm run test:watch
```

---

## 7. Project Structure & Code Architecture

```
agent-run-1/
├── docs/
│   └── spec.md                    # This Technical Specification
├── public/
│   └── favicon.svg                # Modern wearable logo icon
├── src/
│   ├── assets/                    # Static mock textures and icons
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx         # Reusable minimalist button (primary, ghost, pill)
│   │   │   ├── Badge.tsx          # Tier and category badges
│   │   │   └── Modal.tsx          # Accessible modal dialog
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Navigation header with cart badge
│   │   │   └── Footer.tsx         # Minimal footer with links & credits
│   │   ├── viewer3d/
│   │   │   ├── WatchViewer3D.tsx  # Three.js Canvas container and WebGL renderer
│   │   │   ├── WatchGeometry.ts   # Three.js procedural meshes (case, band, crown)
│   │   │   ├── WatchScreenTexture.ts # Dynamic 2D canvas texture generator
│   │   │   ├── WatchFaceRenderer.ts  # Minimal, Neon, Chrono, Health face drawings
│   │   │   └── StudioControls.tsx    # 360 spin, color picker, face selector
│   │   ├── widgets/
│   │   │   ├── HeartRateWidget.tsx   # Simulated ECG & live pulse
│   │   │   ├── StepsWidget.tsx       # 10k step progress simulator
│   │   │   ├── WeatherWidget.tsx     # Weather & forecast simulator
│   │   │   ├── MusicWidget.tsx       # Music player controls simulator
│   │   │   └── BatteryWidget.tsx     # Battery percentage & eco mode
│   │   ├── catalog/
│   │   │   ├── ProductCatalog.tsx    # Filterable grid of Band & Watch items
│   │   │   ├── ProductCard.tsx       # Individual card with tier & quick 3D trigger
│   │   │   ├── TierFilter.tsx        # Standard / Pro / Pro Max selector
│   │   │   └── CompareModal.tsx      # Feature matrix comparison modal
│   │   └── cart/
│   │       ├── CartDrawer.tsx        # Slide-over cart panel
│   │       ├── CartItemRow.tsx       # Individual line item with controls
│   │       └── CheckoutModal.tsx     # Multi-step checkout flow
│   ├── data/
│   │   └── products.ts            # Mock catalog (Bands & Smart Watches)
│   ├── hooks/
│   │   ├── useCart.ts             # Cart state hook with localStorage sync
│   │   └── useWatchSimulator.ts   # Active watch face & simulated widget values
│   ├── types/
│   │   └── index.ts               # Shared TypeScript schemas & interfaces
│   ├── utils/
│   │   ├── formatters.ts          # Currency, date, and unit formatters
│   │   └── storage.ts             # Safe localStorage abstraction
│   ├── App.tsx                    # Root application component
│   ├── main.tsx                   # React root entry point
│   └── index.css                  # Tailwind directives and custom utility classes
├── tests/
│   ├── cart.test.ts               # Cart calculation, add/remove, discount tests
│   ├── products.test.ts           # Taxonomy and schema validation tests
│   └── simulator.test.ts          # Watch face & widget simulation state tests
├── index.html                     # HTML5 template
├── package.json                   # Dependency and script definitions
├── tailwind.config.js             # Color palette tokens & typography
├── vite.config.ts                 # Vite build & plugin configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## 8. Code Style & Quality Standards

### 8.1 Functional Component Style Convention
Components must be written as functional React components with explicit prop types, clean early returns, and modular styling using Tailwind utility classes:

```tsx
import React, { useState } from 'react';
import { Product, ColorOption, WatchFaceId } from '../../types';
import { Button } from '../common/Button';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onPreview3D: (product: Product) => void;
  onAddToCart: (product: Product, color: ColorOption, face: WatchFaceId) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPreview3D,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);

  return (
    <article className="group relative rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur-md border border-purple-100/60 transition-all duration-300 hover:shadow-xl hover:border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/50">
          {product.tier.replace('_', ' ')}
        </span>
        <span className="text-sm font-semibold text-slate-900">
          ${product.price}
        </span>
      </div>

      <div className="h-48 w-full flex items-center justify-center bg-gradient-to-br from-[#F8F6FF] to-[#E0F7FA]/40 rounded-2xl mb-5 overflow-hidden">
        {/* Visual 3D Preview Placeholder or thumbnail */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-purple-600 font-bold mb-1">
            {product.category}
          </p>
          <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 flex items-center justify-center gap-1.5"
          onClick={() => onPreview3D(product)}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>3D Studio</span>
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1 flex items-center justify-center gap-1.5"
          onClick={() => onAddToCart(product, selectedColor, product.defaultFace)}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </Button>
      </div>
    </article>
  );
};
```

---

## 9. Testing Strategy

### 9.1 Test Levels & Frameworks
- **Framework:** Vitest (`vitest run`).
- **Unit Testing:**
  - `tests/cart.test.ts`:
    * Adding items increases cart count and subtotal correctly.
    * Adding identical product with distinct color/face creates distinct or merged line items according to spec.
    * Removing items and quantity updating.
    * Discount code calculations (`AURA10`, `LAUNCH20`, invalid code handling).
    * LocalStorage serialization and edge cases (corrupt storage recovery).
  - `tests/products.test.ts`:
    * Complete taxonomy validation: ensures all 5 products exist (Band Standard/Pro, Watch Standard/Pro/Pro Max).
    * Validation that each tier has defined specs, color choices, and supported watch faces.
  - `tests/simulator.test.ts`:
    * Watch simulator widget logic (ECG calculation bounds, step increment limits, battery state toggles).

### 9.2 Acceptance & Quality Gates
- `npm run build` must compile with 0 TypeScript/Vite errors.
- `npm test` must run and pass 100% of tests.
- 3D Viewer must gracefully handle WebGL context creation and resize events without throwing runtime exceptions.

---

## 10. Boundaries & Operational Rules

### 10.1 Always Do
- Work strictly inside the designated workspace: `c:\Users\Admin\Documents\antigravity\agent-run-1`.
- Commit validated phase work to Git with clear semantic commit messages.
- Ensure all 3D assets render smoothly at 60 FPS on standard modern desktop and mobile browsers.
- Keep the light theme minimalist aesthetics strictly adhering to the soft purple/cyan palette (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`).

### 10.2 Ask First
- Introducing heavy external 3D model formats (`.glb` / `.gltf` > 10MB) that could degrade web load performance.
- Changing the agreed product taxonomy (Band: Standard/Pro; Watch: Standard/Pro/Pro Max).
- Adding backend APIs, database configurations, or server dependencies.

### 10.3 Never Do
- Never write application implementation code or tests directly during Phase 1 or Phase 2.
- Never write backend server code (this is strictly a client-side prototype).
- Never remove failing tests to claim pass status.

---

## 11. Success Criteria

1. **Specification Completeness:** Comprehensive specification covering Objective, Taxonomy, 3D Architecture, UI Design System, Client Cart/Checkout, Commands, Structure, and Testing.
2. **Taxonomy Fidelity:** Exactly reflects user requirements:
   - Band: Standard, Pro.
   - Smart Watch: Standard, Pro, Pro Max.
3. **3D Experience Definition:** Procedural 3D model with 360-degree rotation, 4 watch faces (Minimal, Neon, Chrono, Health), and 5 interactive simulated widgets (Heart Rate, Steps, Weather, Music, Battery).
4. **Visual Design Integrity:** Specified modern minimalist light theme with soft purple and cyan tones (`#F8F6FF`, `#E0F7FA`, `#7C3AED`, `#06B6D4`).
5. **Phase Gate Adherence:** Gated execution ending after Git commit of `docs/spec.md`, without unauthorized progression to Phase 2 or code writing.
