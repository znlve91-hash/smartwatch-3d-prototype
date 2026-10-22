import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React, { useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import {
  generateCartItemId,
  calculateCartTotals,
  VALID_COUPONS,
  SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  TAX_RATE,
  CartProvider,
  useCart,
  CartContextType,
} from '../src/context/CartContext';
import { CartItem, ColorOption, OrderDetails, Product } from '../src/types';
import { PRODUCTS } from '../src/data/products';
import { safeStorage, STORAGE_KEYS } from '../src/utils/storage';

const h = React.createElement;

// Test fixtures
const sampleProduct = PRODUCTS[0]; // PulseBand 2 ($49)
const watchProduct = PRODUCTS[2]; // Horizon Watch SE ($179)
const proMaxProduct = PRODUCTS[4]; // Horizon Watch Pro Max ($449)

const sampleChassis1: ColorOption = sampleProduct.chassisColors[0];
const sampleChassis2: ColorOption = sampleProduct.chassisColors[1];
const sampleStrap1: ColorOption = sampleProduct.strapColors[0];
const sampleStrap2: ColorOption = sampleProduct.strapColors[1];

describe('Cart Calculations & Pure Logic', () => {
  it('should generate deterministic unique composite keys', () => {
    const key1 = generateCartItemId(sampleProduct.id, sampleChassis1.id, sampleStrap1.id, 'minimal');
    const key2 = generateCartItemId(sampleProduct.id, sampleChassis1.id, sampleStrap1.id, 'minimal');
    const key3 = generateCartItemId(sampleProduct.id, sampleChassis2.id, sampleStrap1.id, 'minimal');
    const key4 = generateCartItemId(sampleProduct.id, sampleChassis1.id, sampleStrap2.id, 'minimal');
    const key5 = generateCartItemId(sampleProduct.id, sampleChassis1.id, sampleStrap1.id, 'neon');

    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
    expect(key1).not.toBe(key4);
    expect(key1).not.toBe(key5);
    expect(key1).toContain(sampleProduct.id);
  });

  it('should return zero totals for an empty cart', () => {
    const totals = calculateCartTotals([]);
    expect(totals.totalItemsCount).toBe(0);
    expect(totals.subtotal).toBe(0);
    expect(totals.discount).toBe(0);
    expect(totals.shippingFee).toBe(0);
    expect(totals.estimatedTax).toBe(0);
    expect(totals.grandTotal).toBe(0);
    expect(totals.isFreeShipping).toBe(false);
    expect(totals.amountToFreeShipping).toBe(SHIPPING_THRESHOLD);
  });

  it('should calculate subtotal, shipping fee, and tax for orders under $100', () => {
    const item: CartItem = {
      id: generateCartItemId(sampleProduct.id, sampleChassis1.id, sampleStrap1.id, 'minimal'),
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: 49,
      quantity: 1,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    };

    const totals = calculateCartTotals([item]);
    expect(totals.totalItemsCount).toBe(1);
    expect(totals.subtotal).toBe(49);
    expect(totals.isFreeShipping).toBe(false);
    expect(totals.shippingFee).toBe(STANDARD_SHIPPING_FEE);
    expect(totals.amountToFreeShipping).toBe(51);

    // Tax is 8% of $49 = $3.92
    const expectedTax = Number((49 * TAX_RATE).toFixed(2));
    expect(totals.estimatedTax).toBe(expectedTax);

    // Grand total = 49 + 15 + 3.92 = 67.92
    expect(totals.grandTotal).toBe(Number((49 + STANDARD_SHIPPING_FEE + expectedTax).toFixed(2)));
  });

  it('should provide free shipping when subtotal exceeds or equals $100', () => {
    const item: CartItem = {
      id: generateCartItemId(watchProduct.id, watchProduct.chassisColors[0].id, watchProduct.strapColors[0].id, 'minimal'),
      productId: watchProduct.id,
      name: watchProduct.name,
      category: watchProduct.category,
      tier: watchProduct.tier,
      price: 179,
      quantity: 1,
      chassisColor: watchProduct.chassisColors[0],
      strapColor: watchProduct.strapColors[0],
      selectedFace: 'minimal',
    };

    const totals = calculateCartTotals([item]);
    expect(totals.subtotal).toBe(179);
    expect(totals.isFreeShipping).toBe(true);
    expect(totals.shippingFee).toBe(0);
    expect(totals.amountToFreeShipping).toBe(0);

    const expectedTax = Number((179 * TAX_RATE).toFixed(2));
    expect(totals.estimatedTax).toBe(expectedTax);
    expect(totals.grandTotal).toBe(Number((179 + expectedTax).toFixed(2)));
  });

  it('should apply percentage coupon discounts correctly', () => {
    const item: CartItem = {
      id: 'item-1',
      productId: watchProduct.id,
      name: watchProduct.name,
      category: watchProduct.category,
      tier: watchProduct.tier,
      price: 200,
      quantity: 1,
      chassisColor: watchProduct.chassisColors[0],
      strapColor: watchProduct.strapColors[0],
      selectedFace: 'minimal',
    };

    // HORIZON10 = 10% discount
    const totals10 = calculateCartTotals([item], 'HORIZON10');
    expect(totals10.subtotal).toBe(200);
    expect(totals10.discount).toBe(20);
    // Tax is 8% of (200 - 20) = 8% of 180 = 14.40
    expect(totals10.estimatedTax).toBe(14.4);
    expect(totals10.grandTotal).toBe(194.4);

    // SAVE20 = 20% discount
    const totals20 = calculateCartTotals([item], 'SAVE20');
    expect(totals20.discount).toBe(40);
    // Tax is 8% of 160 = 12.80
    expect(totals20.estimatedTax).toBe(12.8);
    expect(totals20.grandTotal).toBe(172.8);
  });

  it('should apply fixed amount discount coupon (SMART50)', () => {
    const item: CartItem = {
      id: 'item-1',
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: 150,
      quantity: 1,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    };

    const totals = calculateCartTotals([item], 'SMART50');
    expect(totals.subtotal).toBe(150);
    expect(totals.discount).toBe(50);
    // Tax is 8% of (150 - 50 = 100) = 8.00
    expect(totals.estimatedTax).toBe(8);
    expect(totals.grandTotal).toBe(108);
  });

  it('should apply FREESHIP coupon to waive shipping on orders under $100', () => {
    const item: CartItem = {
      id: 'item-1',
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: 49,
      quantity: 1,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    };

    const totals = calculateCartTotals([item], 'FREESHIP');
    expect(totals.subtotal).toBe(49);
    expect(totals.shippingFee).toBe(0);
    expect(totals.isFreeShipping).toBe(true);
  });

  it('should ignore invalid coupon codes gracefully', () => {
    const item: CartItem = {
      id: 'item-1',
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: 50,
      quantity: 1,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    };

    const totals = calculateCartTotals([item], 'INVALID_CODE_123');
    expect(totals.discount).toBe(0);
  });
});

describe('Cart State Operations & Deduplication', () => {
  it('should add a new customized item with quantity 1 if not specified', async () => {
    const { addItemToCart } = await import('../src/context/CartContext');
    const initialItems: CartItem[] = [];

    const items = addItemToCart(initialItems, {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    });

    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(1);
    expect(items[0].productId).toBe(sampleProduct.id);
    expect(items[0].chassisColor.id).toBe(sampleChassis1.id);
    expect(items[0].strapColor.id).toBe(sampleStrap1.id);
    expect(items[0].selectedFace).toBe('minimal');
  });

  it('should deduplicate and increment quantity when exact same configuration is added', async () => {
    const { addItemToCart } = await import('../src/context/CartContext');
    let items: CartItem[] = [];

    // Add first time
    items = addItemToCart(items, {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
      quantity: 1,
    });

    // Add exact same configuration with quantity 2
    items = addItemToCart(items, {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
      quantity: 2,
    });

    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(3);
  });

  it('should create separate line items when chassis, strap, or watch face differ', async () => {
    const { addItemToCart } = await import('../src/context/CartContext');
    let items: CartItem[] = [];

    // Base item: Chassis 1, Strap 1, Minimal face
    items = addItemToCart(items, {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    });

    // Different strap
    items = addItemToCart(items, {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap2,
      selectedFace: 'minimal',
    });

    // Different chassis
    items = addItemToCart(items, {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis2,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    });

    // Different watch face
    items = addItemToCart(items, {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'neon',
    });

    expect(items.length).toBe(4);
    expect(items[0].strapColor.id).toBe(sampleStrap1.id);
    expect(items[1].strapColor.id).toBe(sampleStrap2.id);
    expect(items[2].chassisColor.id).toBe(sampleChassis2.id);
    expect(items[3].selectedFace).toBe('neon');
  });

  it('should update item quantity accurately', async () => {
    const { addItemToCart, updateItemQuantityInCart } = await import('../src/context/CartContext');
    const items = addItemToCart([], {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
      quantity: 1,
    });

    const itemId = items[0].id;
    const updated = updateItemQuantityInCart(items, itemId, 5);
    expect(updated[0].quantity).toBe(5);
  });

  it('should remove item when quantity is updated to zero or negative', async () => {
    const { addItemToCart, updateItemQuantityInCart } = await import('../src/context/CartContext');
    const items = addItemToCart([], {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
      quantity: 2,
    });

    const itemId = items[0].id;
    const updatedZero = updateItemQuantityInCart(items, itemId, 0);
    expect(updatedZero.length).toBe(0);

    const updatedNegative = updateItemQuantityInCart(items, itemId, -3);
    expect(updatedNegative.length).toBe(0);
  });

  it('should remove item by ID', async () => {
    const { addItemToCart, removeItemFromCart } = await import('../src/context/CartContext');
    let items = addItemToCart([], {
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    });

    items = addItemToCart(items, {
      productId: watchProduct.id,
      name: watchProduct.name,
      category: watchProduct.category,
      tier: watchProduct.tier,
      price: watchProduct.price,
      chassisColor: watchProduct.chassisColors[0],
      strapColor: watchProduct.strapColors[0],
      selectedFace: 'chrono',
    });

    expect(items.length).toBe(2);
    const toRemoveId = items[0].id;

    const remaining = removeItemFromCart(items, toRemoveId);
    expect(remaining.length).toBe(1);
    expect(remaining[0].productId).toBe(watchProduct.id);
  });
});

describe('LocalStorage Synchronization', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  afterEach(() => {
    safeStorage.clear();
  });

  it('should persist and retrieve cart items using safeStorage under antigravity_smartwatch_cart_v1', () => {
    expect(STORAGE_KEYS.CART).toBe('antigravity_smartwatch_cart_v1');

    const sampleItem: CartItem = {
      id: generateCartItemId(sampleProduct.id, sampleChassis1.id, sampleStrap1.id, 'minimal'),
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      quantity: 2,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    };

    // Save
    safeStorage.setItem(STORAGE_KEYS.CART, [sampleItem]);

    // Retrieve
    const retrieved = safeStorage.getItem<CartItem[]>(STORAGE_KEYS.CART, []);
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].id).toBe(sampleItem.id);
    expect(retrieved[0].quantity).toBe(2);

    // Remove
    safeStorage.removeItem(STORAGE_KEYS.CART);
    const afterRemoval = safeStorage.getItem<CartItem[]>(STORAGE_KEYS.CART, []);
    expect(afterRemoval).toEqual([]);
  });
});

describe('Cart UI Component: CartItemRow', () => {
  it('should render item name, price, swatches, and quantity controls', async () => {
    const { CartItemRow } = await import('../src/components/cart/CartItemRow');

    const sampleItem: CartItem = {
      id: 'test-item-1',
      productId: sampleProduct.id,
      name: 'PulseBand 2',
      category: 'band',
      tier: 'standard',
      price: 49,
      quantity: 2,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    };

    const onUpdateQuantity = vi.fn();
    const onRemove = vi.fn();

    const html = renderToString(
      h(CartItemRow, {
        item: sampleItem,
        onUpdateQuantity,
        onRemove,
      })
    );

    expect(html).toContain('PulseBand 2');
    expect(html).toContain('$49'); // Unit price
    expect(html).toContain('$98'); // Total line item price 49 * 2
    expect(html).toContain('2'); // Quantity
    expect(html).toContain(sampleChassis1.name); // Chassis swatch name
    expect(html).toContain(sampleStrap1.name); // Strap swatch name
    expect(html).toContain('Minimal'); // Watch face
  });
});

describe('Cart UI Component: CartDrawer', () => {
  it('should render empty cart state when no items are present', async () => {
    const { CartDrawer } = await import('../src/components/cart/CartDrawer');

    const html = renderToString(
      h(CartDrawer, {
        isOpen: true,
        onClose: vi.fn(),
        items: [],
      })
    );

    expect(html).toContain('Shopping Cart');
    expect(html).toContain('empty');
    expect(html).toContain('Explore');
  });

  it('should render items, free shipping progress, totals, and checkout button when items exist', async () => {
    const { CartDrawer } = await import('../src/components/cart/CartDrawer');

    const sampleItem: CartItem = {
      id: 'test-item-1',
      productId: watchProduct.id,
      name: watchProduct.name,
      category: watchProduct.category,
      tier: watchProduct.tier,
      price: 179,
      quantity: 1,
      chassisColor: watchProduct.chassisColors[0],
      strapColor: watchProduct.strapColors[0],
      selectedFace: 'minimal',
    };

    const html = renderToString(
      h(CartDrawer, {
        isOpen: true,
        onClose: vi.fn(),
        items: [sampleItem],
        onCheckout: vi.fn(),
      })
    );

    expect(html).toContain('Horizon Watch SE');
    expect(html).toContain('$179');
    expect(html).toContain('Free'); // Free shipping unlocked because 179 >= 100
    expect(html).toContain('Proceed to Checkout');
  });
});

describe('Checkout Component: CheckoutModal', () => {
  it('should render step 1 with shipping inputs, payment options, and order summary', async () => {
    const { CheckoutModal } = await import('../src/components/cart/CheckoutModal');

    const sampleItem: CartItem = {
      id: 'test-item-1',
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: sampleProduct.price,
      quantity: 1,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    };

    const html = renderToString(
      h(CheckoutModal, {
        isOpen: true,
        onClose: vi.fn(),
        items: [sampleItem],
        step: 1,
      })
    );

    expect(html).toContain('Simulated Checkout');
    expect(html).toContain('Full Name');
    expect(html).toContain('Email');
    expect(html).toContain('Street Address');
    expect(html).toContain('Apple Pay');
    expect(html).toContain('Credit Card');
    expect(html).toContain('Cash on Delivery');
  });

  it('should render step 2 with order confirmation, unique order ID, and delivery estimate', async () => {
    const { CheckoutModal } = await import('../src/components/cart/CheckoutModal');

    const sampleOrder: OrderDetails = {
      orderId: 'ORD-2026-98765',
      customerName: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      address: '742 Evergreen Terrace, Springfield, OR',
      items: [
        {
          id: 'test-item-1',
          productId: sampleProduct.id,
          name: sampleProduct.name,
          category: sampleProduct.category,
          tier: sampleProduct.tier,
          price: sampleProduct.price,
          quantity: 1,
          chassisColor: sampleChassis1,
          strapColor: sampleStrap1,
          selectedFace: 'minimal',
        },
      ],
      subtotal: 49,
      shipping: 15,
      discount: 0,
      total: 67.92,
      createdAt: '2026-10-22T12:00:00.000Z',
    };

    const html = renderToString(
      h(CheckoutModal, {
        isOpen: true,
        onClose: vi.fn(),
        items: [],
        step: 2,
        completedOrder: sampleOrder,
      })
    );

    expect(html).toContain('Order Confirmed');
    expect(html).toContain('ORD-2026-98765');
    expect(html).toContain('Alex Rivera');
    expect(html).toContain('alex.rivera@example.com');
    expect(html).toContain('Estimated Delivery');
    expect(html).toContain('Continue Shopping');
  });
});

describe('Full Application: App Orchestration', () => {
  it('should render App with Navbar, Hero 3D Studio, Customizer Bar, Catalog, and Footer', async () => {
    const { App } = await import('../src/App');

    const html = renderToString(h(App, null));

    expect(html).toContain('HORIZON');
    expect(html).toContain('3D Studio');
    expect(html).toContain('Add Customized to Cart');
    expect(html).toContain('Hardware Catalog');
    expect(html).toContain('Explore All Models');
    expect(html).toContain('All rights reserved');
  });
});

describe('Cart Context & Helper Edge Cases', () => {
  it('should throw error when useCart is used outside CartProvider', async () => {
    const { useCart } = await import('../src/context/CartContext');

    const Consumer = () => {
      useCart();
      return null;
    };

    expect(() => renderToString(h(Consumer, null))).toThrow(
      'useCart must be used within a CartProvider'
    );
  });

  it('should generate valid order ID format with year and prefix', async () => {
    const { generateOrderId } = await import('../src/components/cart/CheckoutModal');
    const orderId = generateOrderId();
    const currentYear = new Date().getFullYear();

    expect(orderId).toMatch(new RegExp(`^ORD-${currentYear}-\\d{5}$`));
  });

  it('should compute future estimated delivery date correctly', async () => {
    const { getEstimatedDeliveryDate } = await import('../src/components/cart/CheckoutModal');
    const delivery = getEstimatedDeliveryDate(5);
    expect(typeof delivery).toBe('string');
    expect(delivery.length).toBeGreaterThan(0);
  });

  it('should render CartDrawer with active coupon badge and free shipping badge', async () => {
    const { CartDrawer } = await import('../src/components/cart/CartDrawer');

    const sampleItem: CartItem = {
      id: 'test-item-coupon',
      productId: watchProduct.id,
      name: watchProduct.name,
      category: watchProduct.category,
      tier: watchProduct.tier,
      price: 200,
      quantity: 1,
      chassisColor: watchProduct.chassisColors[0],
      strapColor: watchProduct.strapColors[0],
      selectedFace: 'minimal',
    };

    const html = renderToString(
      h(CartDrawer, {
        isOpen: true,
        items: [sampleItem],
        appliedCoupon: 'HORIZON10',
      })
    );

    expect(html).toContain('HORIZON10');
    expect(html).toContain('Discount (HORIZON10)');
    expect(html).toContain('-$20');
    expect(html).toContain('Free Shipping Unlocked');
  });

  it('should render CartDrawer under $100 with shipping fee and amount to free shipping message', async () => {
    const { CartDrawer } = await import('../src/components/cart/CartDrawer');

    const sampleItem: CartItem = {
      id: 'test-item-cheap',
      productId: sampleProduct.id,
      name: sampleProduct.name,
      category: sampleProduct.category,
      tier: sampleProduct.tier,
      price: 49,
      quantity: 1,
      chassisColor: sampleChassis1,
      strapColor: sampleStrap1,
      selectedFace: 'minimal',
    };

    const html = renderToString(
      h(CartDrawer, {
        isOpen: true,
        items: [sampleItem],
      })
    );

    expect(html).toContain('Add $51 for Free Shipping');
    expect(html).toContain('$15'); // Standard shipping fee
  });
});






