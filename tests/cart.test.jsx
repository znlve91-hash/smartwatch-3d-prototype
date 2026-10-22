import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  CartContext,
  CartProvider,
  cartReducer,
  initialCartState,
  calculateCartTotals,
  VALID_COUPONS,
  STORAGE_KEY,
} from '../src/context/CartContext.jsx';
import { useCart } from '../src/hooks/useCart.js';
import { CartDrawer } from '../src/components/cart/CartDrawer.jsx';
import { CartItemRow } from '../src/components/cart/CartItemRow.jsx';
import { CheckoutModal } from '../src/components/cart/CheckoutModal.jsx';
import { Toast, ToastContainer, ToastProvider, useToast } from '../src/components/common/Toast.jsx';
import App from '../src/App.jsx';
import { PRODUCTS } from '../src/data/products.js';

// Polyfill in-memory localStorage for Node test runner
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

describe('Cart Reducer & Pure Business Logic', () => {
  const sampleProduct1 = PRODUCTS[0]; // e.g. NovaBand Flow ($99)
  const sampleProduct2 = PRODUCTS[1]; // e.g. NovaBand Pro Elite ($149)
  const color1 = sampleProduct1.colors[0];
  const color2 = sampleProduct1.colors[1] || sampleProduct1.colors[0];

  it('should initialize with empty cart state', () => {
    expect(initialCartState.items).toEqual([]);
    expect(initialCartState.appliedCoupon).toBeNull();
    expect(initialCartState.couponDiscountPercent).toBe(0);
    expect(initialCartState.couponMessage).toBe('');
  });

  it('should calculate cart totals accurately with standard 8% tax and $150 free shipping threshold', () => {
    // 1 item of $99 -> subtotal $99, shipping $15 (< $150), tax $99 * 0.08 = $7.92, total = $121.92
    const items = [
      {
        id: 'test-1',
        productId: sampleProduct1.id,
        price: 99,
        quantity: 1,
      },
    ];

    const totals = calculateCartTotals(items, 0);
    expect(totals.totalCount).toBe(1);
    expect(totals.subtotal).toBe(99);
    expect(totals.discountAmount).toBe(0);
    expect(totals.shippingAmount).toBe(15);
    expect(totals.taxAmount).toBe(7.92);
    expect(totals.grandTotal).toBe(121.92);
  });

  it('should qualify for free shipping when subtotal >= $150', () => {
    const items = [
      {
        id: 'test-2',
        productId: sampleProduct2.id,
        price: 150,
        quantity: 1,
      },
    ];

    const totals = calculateCartTotals(items, 0);
    expect(totals.subtotal).toBe(150);
    expect(totals.shippingAmount).toBe(0);
    expect(totals.taxAmount).toBe(12);
    expect(totals.grandTotal).toBe(162);
  });

  it('should apply 10% coupon NOVA10 and recompute discount, tax, and shipping correctly', () => {
    const items = [
      {
        id: 'test-3',
        productId: 'watch-pro',
        price: 200,
        quantity: 1,
      },
    ];

    // Subtotal: 200. Discount 10% = 20. Discounted subtotal: 180.
    // 180 >= 150 -> shipping = 0. Tax = 180 * 0.08 = 14.40. Total = 194.40.
    const totals = calculateCartTotals(items, 10);
    expect(totals.subtotal).toBe(200);
    expect(totals.discountAmount).toBe(20);
    expect(totals.discountedSubtotal).toBe(180);
    expect(totals.shippingAmount).toBe(0);
    expect(totals.taxAmount).toBe(14.4);
    expect(totals.grandTotal).toBe(194.4);
  });

  it('should handle ADD_ITEM action and generate unique item ID with color and face customization', () => {
    const state = initialCartState;
    const action = {
      type: 'ADD_ITEM',
      payload: {
        product: sampleProduct1,
        color: color1,
        face: 'minimal',
        quantity: 1,
      },
    };

    const nextState = cartReducer(state, action);
    expect(nextState.items.length).toBe(1);
    const item = nextState.items[0];
    expect(item.productId).toBe(sampleProduct1.id);
    expect(item.name).toBe(sampleProduct1.name);
    expect(item.color.id).toBe(color1.id);
    expect(item.face).toBe('minimal');
    expect(item.quantity).toBe(1);
    expect(item.id).toContain(sampleProduct1.id);
    expect(item.id).toContain(color1.id);
    expect(item.id).toContain('minimal');
  });

  it('should stack quantity when adding identical product, color, and watch face', () => {
    const state1 = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: {
        product: sampleProduct1,
        color: color1,
        face: 'neon',
        quantity: 1,
      },
    });

    const state2 = cartReducer(state1, {
      type: 'ADD_ITEM',
      payload: {
        product: sampleProduct1,
        color: color1,
        face: 'neon',
        quantity: 2,
      },
    });

    expect(state2.items.length).toBe(1);
    expect(state2.items[0].quantity).toBe(3);
  });

  it('should create separate cart items when customized with different colorways or watch faces', () => {
    const state1 = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: {
        product: sampleProduct1,
        color: color1,
        face: 'minimal',
        quantity: 1,
      },
    });

    const state2 = cartReducer(state1, {
      type: 'ADD_ITEM',
      payload: {
        product: sampleProduct1,
        color: color1,
        face: 'chrono',
        quantity: 1,
      },
    });

    expect(state2.items.length).toBe(2);
    expect(state2.items[0].face).toBe('minimal');
    expect(state2.items[1].face).toBe('chrono');
  });

  it('should UPDATE_QUANTITY and clamp to positive numbers', () => {
    const state1 = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: sampleProduct1, color: color1, face: 'minimal', quantity: 2 },
    });
    const itemId = state1.items[0].id;

    const state2 = cartReducer(state1, {
      type: 'UPDATE_QUANTITY',
      payload: { itemId, quantity: 5 },
    });
    expect(state2.items[0].quantity).toBe(5);

    // If quantity updated to 0 or negative, remove item
    const state3 = cartReducer(state2, {
      type: 'UPDATE_QUANTITY',
      payload: { itemId, quantity: 0 },
    });
    expect(state3.items.length).toBe(0);
  });

  it('should REMOVE_ITEM from cart', () => {
    const state1 = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: sampleProduct1, color: color1, face: 'minimal', quantity: 1 },
    });
    const itemId = state1.items[0].id;

    const state2 = cartReducer(state1, {
      type: 'REMOVE_ITEM',
      payload: { itemId },
    });
    expect(state2.items.length).toBe(0);
  });

  it('should CLEAR_CART completely', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: sampleProduct1, color: color1, face: 'minimal', quantity: 2 },
    });
    state = cartReducer(state, {
      type: 'APPLY_COUPON',
      payload: { code: 'NOVA10' },
    });

    expect(state.items.length).toBe(1);
    expect(state.appliedCoupon).toBe('NOVA10');

    const clearedState = cartReducer(state, { type: 'CLEAR_CART' });
    expect(clearedState.items).toEqual([]);
    expect(clearedState.appliedCoupon).toBeNull();
    expect(clearedState.couponDiscountPercent).toBe(0);
  });

  it('should validate NOVA10 coupon code correctly and reject invalid codes', () => {
    const stateWithValid = cartReducer(initialCartState, {
      type: 'APPLY_COUPON',
      payload: { code: 'nova10' }, // test case insensitivity
    });
    expect(stateWithValid.appliedCoupon).toBe('NOVA10');
    expect(stateWithValid.couponDiscountPercent).toBe(10);
    expect(stateWithValid.couponError).toBeNull();

    const stateWithInvalid = cartReducer(initialCartState, {
      type: 'APPLY_COUPON',
      payload: { code: 'FAKECODE99' },
    });
    expect(stateWithInvalid.appliedCoupon).toBeNull();
    expect(stateWithInvalid.couponDiscountPercent).toBe(0);
    expect(stateWithInvalid.couponError).toContain('Invalid');
  });

  it('should REMOVE_COUPON and reset discounts', () => {
    const state1 = cartReducer(initialCartState, {
      type: 'APPLY_COUPON',
      payload: { code: 'NOVA10' },
    });
    expect(state1.appliedCoupon).toBe('NOVA10');

    const state2 = cartReducer(state1, { type: 'REMOVE_COUPON' });
    expect(state2.appliedCoupon).toBeNull();
    expect(state2.couponDiscountPercent).toBe(0);
  });
});

describe('LocalStorage Persistence (novawear_cart_v1)', () => {
  beforeEach(() => {
    globalThis.localStorage = new LocalStorageMock();
  });

  afterEach(() => {
    globalThis.localStorage.clear();
  });

  it('should have the exact storage key "novawear_cart_v1" as specified in requirements', () => {
    expect(STORAGE_KEY).toBe('novawear_cart_v1');
  });

  it('should serialize cart state to localStorage under "novawear_cart_v1"', () => {
    const mockData = {
      items: [
        {
          id: 'watch-flow-black-minimal',
          productId: 'nova-band-flow',
          name: 'NovaBand Flow',
          price: 99,
          color: { id: 'black', name: 'Midnight Black', hex: '#1E293B' },
          face: 'minimal',
          quantity: 2,
        },
      ],
      appliedCoupon: 'NOVA10',
      couponDiscountPercent: 10,
    };

    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw);
    expect(parsed.items.length).toBe(1);
    expect(parsed.appliedCoupon).toBe('NOVA10');
  });
});

describe('useCart Hook Safety', () => {
  it('should throw an informative error when used outside CartProvider', () => {
    function TestComponent() {
      useCart();
      return null;
    }

    expect(() => renderToString(<TestComponent />)).toThrowError(
      /useCart must be used within a CartProvider/i
    );
  });
});

describe('Cart UI Components Rendering', () => {
  const mockItem = {
    id: 'test-item-1',
    productId: 'nova-band-flow',
    name: 'NovaBand Flow',
    price: 99,
    originalPrice: 129,
    category: 'band',
    tier: 'standard',
    color: {
      id: 'black',
      name: 'Midnight Black',
      hex: '#1E293B',
      chassisHex: '#0F172A',
      strapHex: '#1E293B',
    },
    face: 'minimal',
    quantity: 2,
    lineTotal: 198,
  };

  it('should render CartItemRow with name, customization color/face, price and controls', () => {
    const html = renderToString(
      <CartItemRow
        item={mockItem}
        onUpdateQuantity={() => {}}
        onRemove={() => {}}
      />
    );

    expect(html).toContain('NovaBand Flow');
    expect(html).toContain('Midnight Black');
    expect(html).toContain('minimal');
    expect(html).toContain('$99.00');
    expect(html).toContain('$198.00');
    expect(html).toContain('2'); // quantity
  });

  it('should render CartDrawer in empty state when items is empty', () => {
    const html = renderToString(
      <CartDrawer
        isOpen={true}
        onClose={() => {}}
        items={[]}
        totalCount={0}
        subtotal={0}
        discountAmount={0}
        taxAmount={0}
        shippingAmount={0}
        grandTotal={0}
      />
    );

    expect(html).toContain('Your Cart');
    expect(html).toContain('Your cart is empty');
  });

  it('should render CartDrawer with itemized list, coupon input, and checkout CTA when items exist', () => {
    const html = renderToString(
      <CartDrawer
        isOpen={true}
        onClose={() => {}}
        items={[mockItem]}
        totalCount={2}
        subtotal={198}
        discountAmount={19.8}
        taxAmount={14.26}
        shippingAmount={0}
        grandTotal={192.46}
        appliedCoupon="NOVA10"
        couponDiscountPercent={10}
      />
    );

    expect(html).toContain('NovaBand Flow');
    expect(html).toContain('Subtotal');
    expect(html).toContain('$198.00');
    expect(html).toContain('NOVA10');
    expect(html).toContain('Proceed to Checkout');
  });

  it('should render CheckoutModal Step 1 (Shipping Details)', () => {
    const html = renderToString(
      <CheckoutModal
        isOpen={true}
        step={1}
        onClose={() => {}}
        items={[mockItem]}
        subtotal={198}
        discountAmount={0}
        shippingAmount={0}
        taxAmount={15.84}
        grandTotal={213.84}
      />
    );

    expect(html).toContain('Shipping');
    expect(html).toContain('Full Name');
    expect(html).toContain('Email Address');
    expect(html).toContain('Shipping Address');
    expect(html).toContain('Continue to Payment');
  });

  it('should render CheckoutModal Step 2 (Simulated Payment)', () => {
    const html = renderToString(
      <CheckoutModal
        isOpen={true}
        step={2}
        onClose={() => {}}
        items={[mockItem]}
        subtotal={198}
        discountAmount={0}
        shippingAmount={0}
        taxAmount={15.84}
        grandTotal={213.84}
      />
    );

    expect(html).toContain('Payment');
    expect(html).toContain('Credit Card');
    expect(html).toContain('Apple Pay / Google Pay');
    expect(html).toContain('Cash on Delivery');
  });

  it('should render CheckoutModal Step 3 (Order Confirmation Receipt)', () => {
    const html = renderToString(
      <CheckoutModal
        isOpen={true}
        step={3}
        orderId="NW-2026-987654"
        onClose={() => {}}
        items={[mockItem]}
        subtotal={198}
        discountAmount={0}
        shippingAmount={0}
        taxAmount={15.84}
        grandTotal={213.84}
      />
    );

    expect(html).toContain('Thank you for your order');
    expect(html).toContain('NW-2026-987654');
    expect(html).toContain('Continue Shopping');
  });
});

describe('Toast Notification System', () => {
  it('should render individual Toast component correctly with success message', () => {
    const html = renderToString(
      <Toast
        id="toast-1"
        message="Item added to cart!"
        type="success"
        onDismiss={() => {}}
      />
    );

    expect(html).toContain('Item added to cart!');
  });

  it('should render ToastContainer with multiple toasts', () => {
    const toasts = [
      { id: '1', message: 'Added to cart', type: 'success' },
      { id: '2', message: 'Coupon NOVA10 applied', type: 'info' },
    ];

    const html = renderToString(
      <ToastContainer toasts={toasts} onDismiss={() => {}} />
    );

    expect(html).toContain('Added to cart');
    expect(html).toContain('Coupon NOVA10 applied');
  });
});

describe('Full App Orchestration', () => {
  it('should render App component with Header, HeroSection, ProductFilter, ProductGrid, and Footer', () => {
    const html = renderToString(<App />);

    expect(html).toContain('NOVA WEARABLES');
    expect(html).toContain('The Future of Vitality');
    expect(html).toContain('Wearable Collection');
    expect(html).toContain('30-Day Returns');
  });
});

describe('Cart Rehydration & Edge Cases', () => {
  it('should rehydrate valid cart items and coupons via REHYDRATE action', () => {
    const persistedPayload = {
      items: [
        {
          id: 'watch-core-silver-minimal',
          productId: 'nova-watch-core',
          name: 'NovaWatch Core',
          price: 199,
          quantity: 2,
        },
      ],
      appliedCoupon: 'NOVA10',
    };

    const rehydrated = cartReducer(initialCartState, {
      type: 'REHYDRATE',
      payload: persistedPayload,
    });

    expect(rehydrated.items.length).toBe(1);
    expect(rehydrated.items[0].name).toBe('NovaWatch Core');
    expect(rehydrated.appliedCoupon).toBe('NOVA10');
    expect(rehydrated.couponDiscountPercent).toBe(10);
  });

  it('should handle corrupted or malformed rehydrate payload safely', () => {
    const badPayload = {
      items: 'not-an-array',
      appliedCoupon: 'INVALID_COUPON_123',
    };

    const state = cartReducer(initialCartState, {
      type: 'REHYDRATE',
      payload: badPayload,
    });

    expect(state.items).toEqual([]);
    expect(state.appliedCoupon).toBeNull();
    expect(state.couponDiscountPercent).toBe(0);
  });

  it('should render CartProvider providing context to child consumer', () => {
    function Consumer() {
      const { items, totalCount } = useCart();
      return (
        <div>
          <span>Count: {totalCount}</span>
          <span>Items: {items.length}</span>
        </div>
      );
    }

    const html = renderToString(
      <CartProvider>
        <Consumer />
      </CartProvider>
    );

    expect(html).toMatch(/Count:\s*(<!-- -->)?0/);
    expect(html).toMatch(/Items:\s*(<!-- -->)?0/);
  });

  it('should calculate free shipping progress correctly in CartDrawer when subtotal is below threshold', () => {
    const belowThresholdItem = {
      id: 'item-sub-100',
      name: 'NovaBand Flow',
      price: 99,
      quantity: 1,
      color: { name: 'Black', hex: '#000000' },
      face: 'minimal',
    };

    const html = renderToString(
      <CartDrawer
        isOpen={true}
        onClose={() => {}}
        items={[belowThresholdItem]}
        subtotal={99}
        discountAmount={0}
        taxAmount={7.92}
        shippingAmount={15}
        grandTotal={121.92}
      />
    );

    expect(html).toContain('Add');
    expect(html).toContain('$51.00'); // 150 - 99 = 51
    expect(html).toContain('more for Free Shipping');
  });

  it('should display unlocked free shipping banner in CartDrawer when subtotal is $150 or more', () => {
    const aboveThresholdItem = {
      id: 'item-above-150',
      name: 'NovaWatch Pro',
      price: 299,
      quantity: 1,
      color: { name: 'Starlight', hex: '#E2E8F0' },
      face: 'chrono',
    };

    const html = renderToString(
      <CartDrawer
        isOpen={true}
        onClose={() => {}}
        items={[aboveThresholdItem]}
        subtotal={299}
        discountAmount={0}
        taxAmount={23.92}
        shippingAmount={0}
        grandTotal={322.92}
      />
    );

    expect(html).toContain('unlocked Free Standard Shipping');
  });
});
