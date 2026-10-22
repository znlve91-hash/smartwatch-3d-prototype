# Task brief: T4

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: **Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persist

- **Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persistence**
  - Build resilient localStorage abstraction (`src/utils/storage.ts`) and cart management hook (`useCart`).
  - Implement slide-over `CartDrawer` with quantity adjustments, item removal, and promo code engine (`AURA10`, `LAUNCH20`).
  - Implement multi-step `CheckoutModal` (Shipping -> Simulated Payment -> Order Confirmation with tracking ID).
  - Author comprehensive cart unit tests in `tests/cart.test.ts`.
  - Final integration verification across all test suites and production build.

## From tasks/todo.md: Task T4: Client-Side Cart, Simulated Checkout & LocalStorage Persistence

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
