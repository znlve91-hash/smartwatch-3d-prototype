/**
 * CartContext - Client-side Shopping Cart State & LocalStorage Persistence
 * Manages item additions, deduplication, quantity changes, voucher discounts,
 * totals calculations (subtotal, tax, free shipping over $100), and checkout state.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, ColorOption, OrderDetails, ProductCategory, ProductTier, WatchFaceId } from '../types';
import { safeStorage, STORAGE_KEYS } from '../utils/storage';

export const SHIPPING_THRESHOLD = 100;
export const STANDARD_SHIPPING_FEE = 15;
export const TAX_RATE = 0.08; // 8% standard simulated tax

export interface CouponDefinition {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // e.g. 0.10 for 10%, 50 for $50
  description: string;
}

export const VALID_COUPONS: Record<string, CouponDefinition> = {
  HORIZON10: {
    code: 'HORIZON10',
    type: 'percentage',
    value: 0.1,
    description: '10% off entire order',
  },
  SAVE20: {
    code: 'SAVE20',
    type: 'percentage',
    value: 0.2,
    description: '20% off entire order',
  },
  CYBER15: {
    code: 'CYBER15',
    type: 'percentage',
    value: 0.15,
    description: '15% cyber savings',
  },
  SMART50: {
    code: 'SMART50',
    type: 'fixed',
    value: 50,
    description: '$50 instant credit',
  },
  FREESHIP: {
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    description: 'Free standard shipping',
  },
};

/**
 * Creates a deterministic composite item ID based on hardware options.
 */
export function generateCartItemId(
  productId: string,
  chassisColorId: string,
  strapColorId: string,
  faceId: WatchFaceId | string
): string {
  return `${productId}__chassis_${chassisColorId}__strap_${strapColorId}__face_${faceId}`;
}

/**
 * Pure helper to add or increment item in cart list.
 */
export function addItemToCart(
  currentItems: CartItem[],
  itemInput: AddItemInput
): CartItem[] {
  const qty = itemInput.quantity && itemInput.quantity > 0 ? itemInput.quantity : 1;
  const id =
    itemInput.id ||
    generateCartItemId(
      itemInput.productId,
      itemInput.chassisColor.id,
      itemInput.strapColor.id,
      itemInput.selectedFace
    );

  const existingIdx = currentItems.findIndex((it) => it.id === id);
  if (existingIdx >= 0) {
    const updated = [...currentItems];
    updated[existingIdx] = {
      ...updated[existingIdx],
      quantity: updated[existingIdx].quantity + qty,
    };
    return updated;
  }

  const newItem: CartItem = {
    id,
    productId: itemInput.productId,
    name: itemInput.name,
    category: itemInput.category,
    tier: itemInput.tier,
    price: itemInput.price,
    quantity: qty,
    chassisColor: itemInput.chassisColor,
    strapColor: itemInput.strapColor,
    selectedFace: itemInput.selectedFace,
  };
  return [...currentItems, newItem];
}

/**
 * Pure helper to remove item from cart list.
 */
export function removeItemFromCart(
  currentItems: CartItem[],
  itemId: string
): CartItem[] {
  return currentItems.filter((it) => it.id !== itemId);
}

/**
 * Pure helper to update item quantity in cart list.
 */
export function updateItemQuantityInCart(
  currentItems: CartItem[],
  itemId: string,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeItemFromCart(currentItems, itemId);
  }
  return currentItems.map((it) =>
    it.id === itemId ? { ...it, quantity: Math.round(quantity) } : it
  );
}

export interface CartTotals {
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  estimatedTax: number;
  grandTotal: number;
  isFreeShipping: boolean;
  amountToFreeShipping: number;
}

/**
 * Pure calculation function for cart totals, discounts, shipping, and tax.
 */
export function calculateCartTotals(
  items: CartItem[],
  couponCode?: string | null
): CartTotals {
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0 || subtotal === 0) {
    return {
      totalItemsCount: 0,
      subtotal: 0,
      discount: 0,
      shippingFee: 0,
      estimatedTax: 0,
      grandTotal: 0,
      isFreeShipping: false,
      amountToFreeShipping: SHIPPING_THRESHOLD,
    };
  }

  // Calculate discount
  let discount = 0;
  let forceFreeShipping = false;

  if (couponCode) {
    const coupon = VALID_COUPONS[couponCode.trim().toUpperCase()];
    if (coupon) {
      if (coupon.type === 'percentage') {
        discount = Number((subtotal * coupon.value).toFixed(2));
      } else if (coupon.type === 'fixed') {
        discount = Math.min(subtotal, coupon.value);
      } else if (coupon.type === 'free_shipping') {
        forceFreeShipping = true;
      }
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);

  // Free shipping over $100 or with FREESHIP coupon
  const qualifiesForFreeShipping = taxableAmount >= SHIPPING_THRESHOLD || subtotal >= SHIPPING_THRESHOLD || forceFreeShipping;
  const shippingFee = qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountToFreeShipping = qualifiesForFreeShipping ? 0 : Math.max(0, SHIPPING_THRESHOLD - subtotal);

  // Estimated tax (8%)
  const estimatedTax = Number((taxableAmount * TAX_RATE).toFixed(2));

  // Grand total
  const grandTotal = Number((taxableAmount + shippingFee + estimatedTax).toFixed(2));

  return {
    totalItemsCount,
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    shippingFee,
    estimatedTax,
    grandTotal,
    isFreeShipping: shippingFee === 0,
    amountToFreeShipping: Number(amountToFreeShipping.toFixed(2)),
  };
}

export interface AddItemInput {
  productId: string;
  name: string;
  category: ProductCategory;
  tier: ProductTier;
  price: number;
  chassisColor: ColorOption;
  strapColor: ColorOption;
  selectedFace: WatchFaceId;
  quantity?: number;
  id?: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Coupon handling
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Computed totals
  totals: CartTotals;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  estimatedTax: number;
  grandTotal: number;
  isFreeShipping: boolean;
  amountToFreeShipping: number;

  // UI state for drawer and checkout modal
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openCart: () => void;
  closeCart: () => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openCheckout: () => void;
  closeCheckout: () => void;
  lastOrder: OrderDetails | null;
  setLastOrder: React.Dispatch<React.SetStateAction<OrderDetails | null>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export interface CartProviderProps {
  children: React.ReactNode;
  initialItems?: CartItem[];
  initialCoupon?: string | null;
}

export const CartProvider: React.FC<CartProviderProps> = ({
  children,
  initialItems,
  initialCoupon = null,
}) => {
  // Initialize state from storage or passed initialItems
  const [items, setItems] = useState<CartItem[]>(() => {
    if (initialItems !== undefined) {
      return initialItems;
    }
    return safeStorage.getItem<CartItem[]>(STORAGE_KEYS.CART, []);
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(initialCoupon);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  // Synchronize items with LocalStorage
  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.CART, items);
  }, [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const openCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const addItem = useCallback((itemInput: AddItemInput) => {
    setItems((prev) => addItemToCart(prev, itemInput));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => removeItemFromCart(prev, itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prev) => updateItemQuantityInCart(prev, itemId, quantity));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    safeStorage.removeItem(STORAGE_KEYS.CART);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (VALID_COUPONS[normalized]) {
      setAppliedCoupon(normalized);
      return { success: true, message: `Coupon "${normalized}" applied successfully!` };
    }
    return { success: false, message: `Invalid coupon code "${code}".` };
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Totals
  const totals = useMemo(
    () => calculateCartTotals(items, appliedCoupon),
    [items, appliedCoupon]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      totals,
      totalItemsCount: totals.totalItemsCount,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingFee: totals.shippingFee,
      estimatedTax: totals.estimatedTax,
      grandTotal: totals.grandTotal,
      isFreeShipping: totals.isFreeShipping,
      amountToFreeShipping: totals.amountToFreeShipping,
      isCartOpen,
      setIsCartOpen,
      openCart,
      closeCart,
      isCheckoutOpen,
      setIsCheckoutOpen,
      openCheckout,
      closeCheckout,
      lastOrder,
      setLastOrder,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      totals,
      isCartOpen,
      openCart,
      closeCart,
      isCheckoutOpen,
      openCheckout,
      closeCheckout,
      lastOrder,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
