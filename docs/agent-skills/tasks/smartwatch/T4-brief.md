# Task brief: T4

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: **Task T4**: Client-side Cart, LocalStorage Persistence & Multi-Step S

- **Task T4**: Client-side Cart, LocalStorage Persistence & Multi-Step Simulated Checkout

## From tasks/todo.md: Task T4: Client-side Cart, LocalStorage Persistence & Multi-Step Simulated Checkout

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
