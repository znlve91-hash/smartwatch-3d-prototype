# Task brief: T4

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persistence

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

## From tasks/todo.md: Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persistence

## Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persistence

**Description:** Implement client-side shopping cart state management (`CartContext`), slide-over cart drawer, quantity adjusters, selected color/face customization storage per item, discount coupon simulation (`NOVA10`), two-step simulated checkout modal with order confirmation receipt, toast notifications, and `localStorage` persistence.

**Acceptance Criteria:**
- [ ] `src/context/CartContext.jsx` manages cart state with actions: `addItem`, `removeItem`, `updateQuantity`, `applyCoupon`, and `clearCart`.
- [ ] Cart state automatically syncs with `localStorage` under `novawear_cart_v1` on changes and rehydrates on page load.
- [ ] `src/components/cart/CartDrawer.jsx` and `CartItemRow.jsx` display itemized cart entries with selected colorway and watch face, quantity controls, subtotal, discount, and tax calculation.
- [ ] Coupon code input validates promo codes (e.g. `NOVA10` gives 10% discount) with clear feedback.
- [ ] `src/components/cart/CheckoutModal.jsx` implements a 2-step simulated checkout:
  - Step 1: Customer shipping address, contact, and shipping method
  - Step 2: Simulated payment options (Credit Card, Apple Pay / Google Pay, Cash on Delivery)
  - Order Confirmation screen displaying order ID, summary, estimated delivery, and a "Continue Shopping" reset action.
- [ ] `src/components/common/Toast.jsx` provides non-blocking toast notifications when products are added to the cart or coupons applied.
- [ ] Full application orchestration verified in `src/App.jsx`.
- [ ] Unit tests in `tests/cart.test.jsx` cover cart operations, coupon calculation, checkout validation, and `localStorage` sync.

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task T1, Task T2, Task T3

---
