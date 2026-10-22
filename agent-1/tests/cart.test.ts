// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, renderHook, act, cleanup } from '@testing-library/react';
import { getItem, setItem, removeItem, clearStorage } from '../src/utils/storage';
import { useCart } from '../src/hooks/useCart';
import { CartItemRow } from '../src/components/cart/CartItemRow';
import { CartDrawer } from '../src/components/cart/CartDrawer';
import { CheckoutModal } from '../src/components/cart/CheckoutModal';
import { products } from '../src/data/products';
import type { CartItem, Product, ColorOption, WatchFaceId } from '../src/types';

const h = React.createElement;

const mockProductA: Product = products[0]; // Aura Band Standard ($49)
const mockProductB: Product = products[4]; // Horizon Watch Pro Max ($399)

describe('Task T4: Cart, Storage & Simulated Checkout Test Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Storage Abstraction (src/utils/storage.ts)', () => {
    it('returns fallback value if key does not exist', () => {
      const fallback = { items: [] };
      const result = getItem('non_existent_key', fallback);
      expect(result).toEqual(fallback);
    });

    it('stores and retrieves JSON serialized data correctly', () => {
      const testData = { userId: 'u123', tags: ['titanium', 'ecg'] };
      const success = setItem('aura_test_key', testData);
      expect(success).toBe(true);

      const retrieved = getItem('aura_test_key', null);
      expect(retrieved).toEqual(testData);
    });

    it('removes item from storage', () => {
      setItem('aura_temp_key', 'temp-value');
      expect(getItem('aura_temp_key', null)).toBe('temp-value');

      removeItem('aura_temp_key');
      expect(getItem('aura_temp_key', null)).toBeNull();
    });

    it('handles and recovers from corrupted JSON in localStorage gracefully', () => {
      window.localStorage.setItem('corrupted_key', '{"bad-json: definitely not valid');
      const fallback = { fallback: true };

      // Should not throw and should return fallback
      const result = getItem('corrupted_key', fallback);
      expect(result).toEqual(fallback);
    });

    it('survives quota or security errors when setItem throws', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const success = setItem('quota_key', { data: 'test' });
      expect(success).toBe(false);

      setItemSpy.mockRestore();
    });
  });

  describe('useCart Hook State Management (src/hooks/useCart.ts)', () => {
    it('initializes with default empty cart state', () => {
      const { result } = renderHook(() => useCart());

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.subtotal).toBe(0);
      expect(result.current.tax).toBe(0);
      expect(result.current.shipping).toBe(0);
      expect(result.current.total).toBe(0);
      expect(result.current.discountCode).toBeNull();
      expect(result.current.discountPercentage).toBe(0);
    });

    it('adds item to cart with composite ID: ${product.id}-${color.id}-${face}', () => {
      const { result } = renderHook(() => useCart());
      const color: ColorOption = mockProductA.colors[0];
      const face: WatchFaceId = 'minimal';

      act(() => {
        result.current.addItem(mockProductA, color, face);
      });

      expect(result.current.items).toHaveLength(1);
      const expectedId = `${mockProductA.id}-${color.id}-${face}`;
      expect(result.current.items[0].id).toBe(expectedId);
      expect(result.current.items[0].productId).toBe(mockProductA.id);
      expect(result.current.items[0].name).toBe(mockProductA.name);
      expect(result.current.items[0].price).toBe(mockProductA.price);
      expect(result.current.items[0].quantity).toBe(1);
      expect(result.current.items[0].selectedColor).toEqual(color);
      expect(result.current.items[0].selectedFace).toBe(face);
      expect(result.current.totalItems).toBe(1);
      expect(result.current.subtotal).toBe(mockProductA.price);
    });

    it('deduplicates variants: adding the identical product, color, and face increments quantity', () => {
      const { result } = renderHook(() => useCart());
      const color = mockProductA.colors[0];
      const face: WatchFaceId = 'minimal';

      act(() => {
        result.current.addItem(mockProductA, color, face);
      });
      act(() => {
        result.current.addItem(mockProductA, color, face, 2);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(3);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.subtotal).toBe(mockProductA.price * 3);
    });

    it('treats different color or watch face selections as distinct line items', () => {
      const { result } = renderHook(() => useCart());
      const color1 = mockProductA.colors[0];
      const color2 = mockProductA.colors[1];

      act(() => {
        result.current.addItem(mockProductA, color1, 'minimal');
      });
      act(() => {
        result.current.addItem(mockProductA, color2, 'minimal');
      });
      act(() => {
        result.current.addItem(mockProductA, color1, 'neon');
      });

      expect(result.current.items).toHaveLength(3);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.subtotal).toBe(mockProductA.price * 3);
    });

    it('updates quantity of an item and removes item when quantity reaches 0', () => {
      const { result } = renderHook(() => useCart());
      const color = mockProductA.colors[0];
      const face: WatchFaceId = 'minimal';
      const itemId = `${mockProductA.id}-${color.id}-${face}`;

      act(() => {
        result.current.addItem(mockProductA, color, face, 2);
      });
      expect(result.current.items[0].quantity).toBe(2);

      // Increment
      act(() => {
        result.current.updateQuantity(itemId, 4);
      });
      expect(result.current.items[0].quantity).toBe(4);
      expect(result.current.totalItems).toBe(4);

      // Decrement to 1
      act(() => {
        result.current.updateQuantity(itemId, 1);
      });
      expect(result.current.items[0].quantity).toBe(1);

      // Decrement to 0 triggers auto-removal
      act(() => {
        result.current.updateQuantity(itemId, 0);
      });
      expect(result.current.items).toHaveLength(0);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });

    it('removes item explicitly with removeItem', () => {
      const { result } = renderHook(() => useCart());
      const colorA = mockProductA.colors[0];
      const colorB = mockProductB.colors[0];

      act(() => {
        result.current.addItem(mockProductA, colorA, 'minimal');
        result.current.addItem(mockProductB, colorB, 'chrono');
      });

      expect(result.current.items).toHaveLength(2);
      const removeId = `${mockProductA.id}-${colorA.id}-minimal`;

      act(() => {
        result.current.removeItem(removeId);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].productId).toBe(mockProductB.id);
      expect(result.current.subtotal).toBe(mockProductB.price);
    });

    it('clears all items and resets promo discount with clearCart', () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addItem(mockProductA, mockProductA.colors[0], 'minimal');
        result.current.applyPromoCode('AURA10');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.discountCode).toBe('AURA10');

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.discountCode).toBeNull();
      expect(result.current.discountPercentage).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });

    it('evaluates promo code AURA10 for 10% discount', () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addItem(mockProductB, mockProductB.colors[0], 'chrono', 1); // $399
      });

      act(() => {
        const res = result.current.applyPromoCode('AURA10');
        expect(res.success).toBe(true);
      });

      expect(result.current.discountCode).toBe('AURA10');
      expect(result.current.discountPercentage).toBe(0.1);
      expect(result.current.discountAmount).toBeCloseTo(39.9, 2);

      // Subtotal: 399
      // Discounted: 359.10
      // Tax at 8%: 359.10 * 0.08 = 28.728 -> 28.73
      // Total: 359.10 + 28.73 = 387.83
      expect(result.current.tax).toBeCloseTo(28.73, 1);
      expect(result.current.total).toBeCloseTo(387.83, 1);
    });

    it('evaluates promo code LAUNCH20 for 20% discount', () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addItem(mockProductA, mockProductA.colors[0], 'minimal', 2); // $49 * 2 = $98
      });

      act(() => {
        const res = result.current.applyPromoCode('LAUNCH20');
        expect(res.success).toBe(true);
      });

      expect(result.current.discountCode).toBe('LAUNCH20');
      expect(result.current.discountPercentage).toBe(0.2);
      expect(result.current.discountAmount).toBeCloseTo(19.6, 2);

      // Subtotal: 98
      // Discounted: 78.4
      // Tax at 8%: 78.4 * 0.08 = 6.27
      // Total: 78.4 + 6.27 = 84.67
      expect(result.current.tax).toBeCloseTo(6.27, 2);
      expect(result.current.total).toBeCloseTo(84.67, 2);
    });

    it('rejects invalid promo codes with error message', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        const res = result.current.applyPromoCode('FAKE99');
        expect(res.success).toBe(false);
        expect(res.error).toBeDefined();
      });

      expect(result.current.discountCode).toBeNull();
      expect(result.current.discountPercentage).toBe(0);
      expect(result.current.discountAmount).toBe(0);
    });

    it('allows removing an active promo code', () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addItem(mockProductA, mockProductA.colors[0], 'minimal');
        result.current.applyPromoCode('AURA10');
      });

      expect(result.current.discountCode).toBe('AURA10');

      act(() => {
        result.current.removePromoCode();
      });

      expect(result.current.discountCode).toBeNull();
      expect(result.current.discountPercentage).toBe(0);
      expect(result.current.discountAmount).toBe(0);
    });

    it('persists cart changes to localStorage key aura_cart_v1', () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addItem(mockProductA, mockProductA.colors[0], 'minimal', 2);
      });

      const raw = window.localStorage.getItem('aura_cart_v1');
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed.items).toHaveLength(1);
      expect(parsed.items[0].quantity).toBe(2);
    });

    it('restores stored cart state from localStorage on initialization', () => {
      const initialItem: CartItem = {
        id: `${mockProductA.id}-${mockProductA.colors[0].id}-minimal`,
        productId: mockProductA.id,
        name: mockProductA.name,
        category: mockProductA.category,
        tier: mockProductA.tier,
        price: mockProductA.price,
        quantity: 3,
        selectedColor: mockProductA.colors[0],
        selectedFace: 'minimal',
      };

      window.localStorage.setItem(
        'aura_cart_v1',
        JSON.stringify({
          items: [initialItem],
          discountCode: 'AURA10',
          discountPercentage: 0.1,
          taxRate: 0.08,
          shippingCost: 0,
        })
      );

      const { result } = renderHook(() => useCart());

      expect(result.current.items).toHaveLength(1);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.discountCode).toBe('AURA10');
      expect(result.current.discountPercentage).toBe(0.1);
    });

    it('recovers safely when aura_cart_v1 in localStorage is corrupted', () => {
      window.localStorage.setItem('aura_cart_v1', '{corrupt json...');
      const { result } = renderHook(() => useCart());

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
    });
  });

  describe('Cart UI Components (CartItemRow, CartDrawer, CheckoutModal)', () => {
    const sampleItem: CartItem = {
      id: 'item-1',
      productId: mockProductA.id,
      name: mockProductA.name,
      category: mockProductA.category,
      tier: mockProductA.tier,
      price: mockProductA.price,
      quantity: 2,
      selectedColor: mockProductA.colors[0],
      selectedFace: 'minimal',
    };

    it('CartItemRow renders item details, steppers, and triggers quantity/remove callbacks', () => {
      const onUpdateQty = vi.fn();
      const onRemove = vi.fn();

      render(
        h(CartItemRow, {
          item: sampleItem,
          onUpdateQuantity: onUpdateQty,
          onRemove: onRemove,
        })
      );

      // Name and price
      expect(screen.getByText(mockProductA.name)).toBeDefined();
      expect(screen.getByText(`$${mockProductA.price * 2}`)).toBeDefined();

      // Color and face tags
      expect(screen.getByText(sampleItem.selectedColor.name)).toBeDefined();
      expect(screen.getByText(/minimal/i)).toBeDefined();

      // Quantity stepper buttons
      const decBtn = screen.getByRole('button', { name: /decrease quantity/i });
      const incBtn = screen.getByRole('button', { name: /increase quantity/i });
      const removeBtn = screen.getByRole('button', { name: /remove item/i });

      fireEvent.click(incBtn);
      expect(onUpdateQty).toHaveBeenCalledWith('item-1', 3);

      fireEvent.click(decBtn);
      expect(onUpdateQty).toHaveBeenCalledWith('item-1', 1);

      fireEvent.click(removeBtn);
      expect(onRemove).toHaveBeenCalledWith('item-1');
    });

    it('CartDrawer renders empty state when cart has no items', () => {
      const onClose = vi.fn();
      const onProceed = vi.fn();

      render(
        h(CartDrawer, {
          isOpen: true,
          onClose: onClose,
          onProceedToCheckout: onProceed,
          items: [],
          totalItems: 0,
          subtotal: 0,
          discountCode: null,
          discountAmount: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          onUpdateQuantity: vi.fn(),
          onRemoveItem: vi.fn(),
          onApplyPromoCode: vi.fn(),
          onRemovePromoCode: vi.fn(),
        })
      );

      expect(screen.getByText(/Your bag is empty/i)).toBeDefined();
      const continueBtn = screen.getByRole('button', { name: /explore wearables/i });
      fireEvent.click(continueBtn);
      expect(onClose).toHaveBeenCalled();
    });

    it('CartDrawer renders items, summary, promo input, and triggers checkout', () => {
      const onProceed = vi.fn();
      const onApplyPromo = vi.fn().mockReturnValue({ success: true });
      const onRemovePromo = vi.fn();

      render(
        h(CartDrawer, {
          isOpen: true,
          onClose: vi.fn(),
          onProceedToCheckout: onProceed,
          items: [sampleItem],
          totalItems: 2,
          subtotal: 98,
          discountCode: null,
          discountAmount: 0,
          tax: 7.84,
          shipping: 0,
          total: 105.84,
          onUpdateQuantity: vi.fn(),
          onRemoveItem: vi.fn(),
          onApplyPromoCode: onApplyPromo,
          onRemovePromoCode: onRemovePromo,
        })
      );

      // Renders item
      expect(screen.getByText(mockProductA.name)).toBeDefined();
      expect(screen.getByText('$98.00')).toBeDefined(); // subtotal
      expect(screen.getByText('FREE')).toBeDefined(); // shipping
      expect(screen.getByText('$105.84')).toBeDefined(); // total

      // Promo input
      const promoInput = screen.getByPlaceholderText(/promo code/i);
      const applyBtn = screen.getByRole('button', { name: /apply/i });

      fireEvent.change(promoInput, { target: { value: 'AURA10' } });
      fireEvent.click(applyBtn);
      expect(onApplyPromo).toHaveBeenCalledWith('AURA10');

      // Proceed to checkout CTA
      const checkoutBtn = screen.getByRole('button', { name: /proceed to checkout/i });
      fireEvent.click(checkoutBtn);
      expect(onProceed).toHaveBeenCalledTimes(1);
    });

    it('CheckoutModal step progression: Shipping -> Payment -> Order Confirmation', () => {
      const onComplete = vi.fn();
      const onClose = vi.fn();

      render(
        h(CheckoutModal, {
          isOpen: true,
          onClose: onClose,
          onCompleteOrder: onComplete,
          items: [sampleItem],
          subtotal: 98,
          discountCode: 'AURA10',
          discountAmount: 9.8,
          tax: 7.06,
          shipping: 0,
          total: 95.26,
        })
      );

      // STEP 1: Shipping Details
      expect(screen.getByText(/Shipping Information/i)).toBeDefined();

      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const addressInput = screen.getByLabelText(/street address/i);
      const cityInput = screen.getByLabelText(/city/i);

      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(emailInput, { target: { value: 'jane@aura.test' } });
      fireEvent.change(addressInput, { target: { value: '100 Silicon Way' } });
      fireEvent.change(cityInput, { target: { value: 'San Francisco' } });

      const nextToPaymentBtn = screen.getByRole('button', { name: /continue to payment/i });
      fireEvent.click(nextToPaymentBtn);

      // STEP 2: Payment Method
      expect(screen.getByText(/Payment Method/i)).toBeDefined();
      expect(screen.getByText(/Credit Card/i)).toBeDefined();
      expect(screen.getByText(/Apple Pay/i)).toBeDefined();
      expect(screen.getByText(/Cash on Delivery/i)).toBeDefined();

      // Fill mock credit card details
      const cardNumberInput = screen.getByLabelText(/card number/i);
      const expiryInput = screen.getByLabelText(/expiry/i);
      const cvvInput = screen.getByLabelText(/cvv|cvc/i);

      fireEvent.change(cardNumberInput, { target: { value: '4111 2222 3333 4444' } });
      fireEvent.change(expiryInput, { target: { value: '12/28' } });
      fireEvent.change(cvvInput, { target: { value: '123' } });

      const placeOrderBtn = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderBtn);

      // STEP 3: Order Confirmation
      expect(screen.getByText(/Order Confirmed/i)).toBeDefined();
      // Verifies generated Order ID format AURA-XXXXXX
      const orderIdEl = screen.getByTestId('checkout-order-id');
      expect(orderIdEl.textContent).toMatch(/^AURA-[A-Z0-9]{6}$/);

      // Verifies order summary recap
      expect(screen.getByText('Jane Doe')).toBeDefined();
      expect(screen.getByText(/100 Silicon Way/i)).toBeDefined();
      expect(screen.getByText(/San Francisco/i)).toBeDefined();
      expect(screen.getByText('$95.26')).toBeDefined();

      // Continue Shopping CTA
      const continueShoppingBtn = screen.getByRole('button', { name: /continue shopping/i });
      fireEvent.click(continueShoppingBtn);

      // onCompleteOrder should have been called to clear cart
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });
});
