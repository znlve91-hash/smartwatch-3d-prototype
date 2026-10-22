import { useState, useEffect, useCallback, useMemo } from 'react';
import { getItem, setItem } from '../utils/storage';
import type { CartItem, CartState, Product, ColorOption, WatchFaceId } from '../types';

export const CART_STORAGE_KEY = 'aura_cart_v1';
export const DEFAULT_TAX_RATE = 0.08;
export const DEFAULT_SHIPPING_COST = 0;

export interface PromoCodeResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UseCartReturn {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discountCode: string | null;
  discountPercentage: number;
  discountAmount: number;
  taxRate: number;
  tax: number;
  shipping: number;
  total: number;
  addItem: (
    product: Product,
    color: ColorOption,
    face: WatchFaceId,
    quantity?: number
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => PromoCodeResult;
  removePromoCode: () => void;
}

const defaultCartState: CartState = {
  items: [],
  discountCode: null,
  discountPercentage: 0,
  taxRate: DEFAULT_TAX_RATE,
  shippingCost: DEFAULT_SHIPPING_COST,
};

export const useCart = (): UseCartReturn => {
  // Initialize from storage with fallback recovery
  const [cartState, setCartState] = useState<CartState>(() => {
    const saved = getItem<CartState | null>(CART_STORAGE_KEY, null);
    if (!saved || !Array.isArray(saved.items)) {
      return defaultCartState;
    }
    return {
      items: saved.items,
      discountCode: saved.discountCode ?? null,
      discountPercentage: typeof saved.discountPercentage === 'number' ? saved.discountPercentage : 0,
      taxRate: typeof saved.taxRate === 'number' ? saved.taxRate : DEFAULT_TAX_RATE,
      shippingCost: typeof saved.shippingCost === 'number' ? saved.shippingCost : DEFAULT_SHIPPING_COST,
    };
  });

  // Sync to localStorage whenever cartState changes
  useEffect(() => {
    setItem(CART_STORAGE_KEY, cartState);
  }, [cartState]);

  // Derived calculations
  const totalItems = useMemo(() => {
    return cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartState.items]);

  const subtotal = useMemo(() => {
    const raw = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Math.round(raw * 100) / 100;
  }, [cartState.items]);

  const discountAmount = useMemo(() => {
    if (!cartState.discountCode || cartState.discountPercentage <= 0) return 0;
    return Math.round(subtotal * cartState.discountPercentage * 100) / 100;
  }, [subtotal, cartState.discountCode, cartState.discountPercentage]);

  const discountedSubtotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const tax = useMemo(() => {
    if (subtotal <= 0) return 0;
    return Math.round(discountedSubtotal * cartState.taxRate * 100) / 100;
  }, [discountedSubtotal, cartState.taxRate, subtotal]);

  const shipping = cartState.shippingCost;

  const total = useMemo(() => {
    if (subtotal <= 0) return 0;
    return Math.max(0, Math.round((discountedSubtotal + tax + shipping) * 100) / 100);
  }, [discountedSubtotal, tax, shipping, subtotal]);

  // Cart operations
  const addItem = useCallback(
    (product: Product, color: ColorOption, face: WatchFaceId, quantity = 1) => {
      if (quantity <= 0) return;

      const compositeId = `${product.id}-${color.id}-${face}`;

      setCartState((prev) => {
        const existingIndex = prev.items.findIndex((i) => i.id === compositeId);

        if (existingIndex > -1) {
          const updatedItems = [...prev.items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + quantity,
          };
          return { ...prev, items: updatedItems };
        }

        const newItem: CartItem = {
          id: compositeId,
          productId: product.id,
          name: product.name,
          category: product.category,
          tier: product.tier,
          price: product.price,
          quantity,
          selectedColor: color,
          selectedFace: face,
        };

        return { ...prev, items: [...prev.items, newItem] };
      });
    },
    []
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartState((prev) => {
      if (quantity <= 0) {
        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
        };
      }

      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCartState({
      ...defaultCartState,
      items: [],
      discountCode: null,
      discountPercentage: 0,
    });
  }, []);

  const applyPromoCode = useCallback((code: string): PromoCodeResult => {
    const normalized = code.trim().toUpperCase();

    if (normalized === 'AURA10') {
      setCartState((prev) => ({
        ...prev,
        discountCode: 'AURA10',
        discountPercentage: 0.1,
      }));
      return {
        success: true,
        message: 'AURA10 applied: 10% discount on entire bag!',
      };
    }

    if (normalized === 'LAUNCH20') {
      setCartState((prev) => ({
        ...prev,
        discountCode: 'LAUNCH20',
        discountPercentage: 0.2,
      }));
      return {
        success: true,
        message: 'LAUNCH20 applied: 20% launch discount on entire bag!',
      };
    }

    return {
      success: false,
      error: 'Invalid promo code. Try AURA10 or LAUNCH20.',
    };
  }, []);

  const removePromoCode = useCallback(() => {
    setCartState((prev) => ({
      ...prev,
      discountCode: null,
      discountPercentage: 0,
    }));
  }, []);

  return {
    items: cartState.items,
    totalItems,
    subtotal,
    discountCode: cartState.discountCode,
    discountPercentage: cartState.discountPercentage,
    discountAmount,
    taxRate: cartState.taxRate,
    tax,
    shipping,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
  };
};

export default useCart;
