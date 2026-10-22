/**
 * Global Cart State Management & LocalStorage Persistence Context
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { createContext, useReducer, useEffect, useMemo, useState } from 'react';

export const STORAGE_KEY = 'novawear_cart_v1';
export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_FEE = 15;
export const TAX_RATE = 0.08;

export const VALID_COUPONS = {
  NOVA10: {
    code: 'NOVA10',
    discountPercent: 10,
    description: '10% discount on all items',
  },
  NOVA20: {
    code: 'NOVA20',
    discountPercent: 20,
    description: '20% VIP discount on all items',
  },
};

/**
 * Calculates cart totals including subtotal, discount, tax, and shipping.
 */
export function calculateCartTotals(items = [], discountPercent = 0) {
  const totalCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const rawSubtotal = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );
  const subtotal = Math.round(rawSubtotal * 100) / 100;

  const validPercent = typeof discountPercent === 'number' && discountPercent > 0 ? discountPercent : 0;
  const rawDiscount = subtotal * (validPercent / 100);
  const discountAmount = Math.round(rawDiscount * 100) / 100;
  const discountedSubtotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  const shippingAmount =
    subtotal === 0 ? 0 : discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

  const rawTax = discountedSubtotal * TAX_RATE;
  const taxAmount = Math.round(rawTax * 100) / 100;

  const grandTotal = Math.round((discountedSubtotal + shippingAmount + taxAmount) * 100) / 100;

  return {
    totalCount,
    subtotal,
    discountAmount,
    discountedSubtotal,
    shippingAmount,
    taxAmount,
    grandTotal,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  };
}

export const initialCartState = {
  items: [],
  appliedCoupon: null,
  couponDiscountPercent: 0,
  couponMessage: '',
  couponError: null,
};

/**
 * Cart State Reducer
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case 'REHYDRATE': {
      const payload = action.payload || {};
      const rehydratedItems = Array.isArray(payload.items) ? payload.items : [];
      const coupon = payload.appliedCoupon && VALID_COUPONS[payload.appliedCoupon]
        ? VALID_COUPONS[payload.appliedCoupon]
        : null;

      return {
        ...state,
        items: rehydratedItems,
        appliedCoupon: coupon ? coupon.code : null,
        couponDiscountPercent: coupon ? coupon.discountPercent : 0,
        couponMessage: coupon ? `Coupon ${coupon.code} active` : '',
        couponError: null,
      };
    }

    case 'ADD_ITEM': {
      const { product, color, face, quantity = 1 } = action.payload;
      if (!product) return state;

      const selectedColor =
        color || (product.colors && product.colors[0]) || {
          id: 'default',
          name: 'Standard',
          hex: '#1E293B',
          chassisHex: '#0F172A',
          strapHex: '#1E293B',
        };

      const selectedFace =
        typeof face === 'string' ? face : product.defaultWatchFace || 'minimal';

      const itemId = `${product.id}-${selectedColor.id}-${selectedFace}`;
      const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

      const existingIndex = state.items.findIndex((item) => item.id === itemId);

      let updatedItems;
      if (existingIndex >= 0) {
        updatedItems = state.items.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + qtyToAdd;
            return {
              ...item,
              quantity: newQty,
              lineTotal: Math.round(item.price * newQty * 100) / 100,
            };
          }
          return item;
        });
      } else {
        const newItem = {
          id: itemId,
          productId: product.id,
          product,
          name: product.name,
          category: product.category,
          tier: product.tier,
          price: product.price,
          originalPrice: product.originalPrice,
          color: selectedColor,
          face: selectedFace,
          quantity: qtyToAdd,
          lineTotal: Math.round(product.price * qtyToAdd * 100) / 100,
        };
        updatedItems = [...state.items, newItem];
      }

      return {
        ...state,
        items: updatedItems,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      const targetQty = parseInt(quantity, 10);

      if (targetQty <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== itemId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity: targetQty,
              lineTotal: Math.round(item.price * targetQty * 100) / 100,
            };
          }
          return item;
        }),
      };
    }

    case 'REMOVE_ITEM': {
      const { itemId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== itemId),
      };
    }

    case 'APPLY_COUPON': {
      const rawCode = (action.payload?.code || '').trim().toUpperCase();
      const matched = VALID_COUPONS[rawCode];

      if (matched) {
        return {
          ...state,
          appliedCoupon: matched.code,
          couponDiscountPercent: matched.discountPercent,
          couponMessage: `Coupon ${matched.code} applied: ${matched.discountPercent}% discount!`,
          couponError: null,
        };
      }

      return {
        ...state,
        couponError: `Invalid promo code "${action.payload?.code || ''}". Try "NOVA10" for 10% off.`,
      };
    }

    case 'REMOVE_COUPON': {
      return {
        ...state,
        appliedCoupon: null,
        couponDiscountPercent: 0,
        couponMessage: '',
        couponError: null,
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        appliedCoupon: null,
        couponDiscountPercent: 0,
        couponMessage: '',
        couponError: null,
      };
    }

    default:
      return state;
  }
}

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Read initial state from localStorage if available
  const [state, dispatch] = useReducer(cartReducer, initialCartState, (defaultInitial) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const coupon = parsed.appliedCoupon && VALID_COUPONS[parsed.appliedCoupon]
            ? VALID_COUPONS[parsed.appliedCoupon]
            : null;
          return {
            ...defaultInitial,
            items: Array.isArray(parsed.items) ? parsed.items : [],
            appliedCoupon: coupon ? coupon.code : null,
            couponDiscountPercent: coupon ? coupon.discountPercent : 0,
            couponMessage: coupon ? `Coupon ${coupon.code} active` : '',
          };
        }
      }
    } catch (e) {
      console.warn('Failed to rehydrate cart from localStorage:', e);
    }
    return defaultInitial;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync state mutations to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const serialized = JSON.stringify({
          items: state.items,
          appliedCoupon: state.appliedCoupon,
          couponDiscountPercent: state.couponDiscountPercent,
        });
        window.localStorage.setItem(STORAGE_KEY, serialized);
      }
    } catch (e) {
      console.warn('Failed to serialize cart to localStorage:', e);
    }
  }, [state.items, state.appliedCoupon, state.couponDiscountPercent]);

  // Derived calculations
  const totals = useMemo(() => {
    return calculateCartTotals(state.items, state.couponDiscountPercent);
  }, [state.items, state.couponDiscountPercent]);

  // Action dispatches
  const addItem = (product, color, face, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, color, face, quantity },
    });
  };

  const removeItem = (itemId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { itemId },
    });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { itemId, quantity },
    });
  };

  const applyCoupon = (code) => {
    const rawCode = (code || '').trim().toUpperCase();
    const matched = VALID_COUPONS[rawCode];

    dispatch({
      type: 'APPLY_COUPON',
      payload: { code },
    });

    if (matched) {
      return {
        success: true,
        message: `Coupon ${matched.code} applied: ${matched.discountPercent}% discount!`,
      };
    }
    return {
      success: false,
      message: `Invalid promo code "${code}". Try "NOVA10" for 10% off.`,
    };
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const contextValue = {
    // State & derived totals
    items: state.items,
    appliedCoupon: state.appliedCoupon,
    couponDiscountPercent: state.couponDiscountPercent,
    couponMessage: state.couponMessage,
    couponError: state.couponError,
    totalCount: totals.totalCount,
    subtotal: totals.subtotal,
    discountAmount: totals.discountAmount,
    discountedSubtotal: totals.discountedSubtotal,
    shippingAmount: totals.shippingAmount,
    taxAmount: totals.taxAmount,
    grandTotal: totals.grandTotal,
    freeShippingThreshold: totals.freeShippingThreshold,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,

    // UI Drawer & Modal State
    isCartOpen,
    setIsCartOpen,
    openCart,
    closeCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    openCheckout,
    closeCheckout,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
