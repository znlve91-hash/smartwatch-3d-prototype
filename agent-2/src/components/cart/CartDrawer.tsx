import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  Trash2,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { CartItem } from '../../types';
import { useCart, calculateCartTotals, SHIPPING_THRESHOLD } from '../../context/CartContext';
import { CartItemRow } from './CartItemRow';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';

export interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onClearCart?: () => void;
  onCheckout?: () => void;
  onApplyCoupon?: (code: string) => { success: boolean; message: string };
  onRemoveCoupon?: () => void;
  appliedCoupon?: string | null;
  className?: string;
}

function useSafeCart() {
  try {
    return useCart();
  } catch {
    return null;
  }
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  items: propItems,
  onUpdateQuantity: propOnUpdateQuantity,
  onRemoveItem: propOnRemoveItem,
  onClearCart: propOnClearCart,
  onCheckout: propOnCheckout,
  onApplyCoupon: propOnApplyCoupon,
  onRemoveCoupon: propOnRemoveCoupon,
  appliedCoupon: propAppliedCoupon,
  className = '',
}) => {
  const cart = useSafeCart();

  const isOpen = propIsOpen !== undefined ? propIsOpen : (cart?.isCartOpen ?? false);
  const onClose = propOnClose || cart?.closeCart || (() => {});
  const items = propItems !== undefined ? propItems : (cart?.items ?? []);
  const onUpdateQuantity = propOnUpdateQuantity || cart?.updateQuantity || (() => {});
  const onRemoveItem = propOnRemoveItem || cart?.removeItem || (() => {});
  const onClearCart = propOnClearCart || cart?.clearCart || (() => {});
  const onCheckout = propOnCheckout || cart?.openCheckout || (() => {});
  const onApplyCoupon = propOnApplyCoupon || cart?.applyCoupon || (() => ({ success: false, message: '' }));
  const onRemoveCoupon = propOnRemoveCoupon || cart?.removeCoupon || (() => {});
  const appliedCoupon = propAppliedCoupon !== undefined ? propAppliedCoupon : (cart?.appliedCoupon ?? null);

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Calculate live totals
  const totals = calculateCartTotals(items, appliedCoupon);

  // Handle ESC key to close drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = onApplyCoupon(couponInput.trim());
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setCouponFeedback(null);
  };

  if (!isOpen) return null;

  const freeShippingProgress = Math.min(100, Math.round((totals.subtotal / SHIPPING_THRESHOLD) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md bg-white/95 backdrop-blur-xl border-l border-purple-100/80 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 ${className}`}
        >
          {/* 1. Header */}
          <div className="p-4 sm:p-6 border-b border-purple-100/80 flex items-center justify-between bg-white/60">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-100 text-[#7C3AED]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 id="cart-drawer-title" className="text-base sm:text-lg font-black text-slate-900">
                  Shopping Cart
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {totals.totalItemsCount} {totals.totalItemsCount === 1 ? 'device' : 'devices'} in bag
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-purple-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Free Shipping Progress Bar (if items exist) */}
          {items.length > 0 && (
            <div className="px-4 sm:px-6 py-3 bg-purple-50/50 border-b border-purple-100/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Truck className="w-3.5 h-3.5 text-[#7C3AED]" />
                  {totals.isFreeShipping ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Free Shipping Unlocked!
                    </span>
                  ) : (
                    <span>{`Add ${formatCurrency(totals.amountToFreeShipping)} for Free Shipping`}</span>
                  )}
                </span>
                <span className="font-semibold text-slate-500">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-purple-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 3. Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-purple-50 border border-purple-100 text-[#7C3AED] mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#06B6D4]" />
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6 leading-relaxed">
                  Explore our futuristic smartwatches and fitness bands. Customize finishes and preview in interactive 3D studio!
                </p>
                <Button onClick={onClose} variant="primary" size="md">
                  Explore Wearables
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 4. Voucher Code & Totals Footer (Only if items > 0) */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-purple-100/80 bg-white/80 space-y-4">
              {/* Promo Code Simulator */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span className="font-bold text-[#7C3AED]">{appliedCoupon}</span>
                      <span className="text-slate-500">applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-slate-400 hover:text-rose-600 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. HORIZON10)"
                      aria-label="Promo or Voucher Code"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] uppercase placeholder:normal-case"
                    />
                    <Button type="submit" variant="subtle" size="sm">
                      Apply
                    </Button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 text-xs border-t border-purple-100/60">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totals.subtotal)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-medium">
                    <span>{`Discount (${appliedCoupon})`}</span>
                    <span>{`-${formatCurrency(totals.discount)}`}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600">
                  <span>Standard Shipping</span>
                  <span>
                    {totals.isFreeShipping ? (
                      <span className="font-bold text-emerald-600 uppercase tracking-wider text-[11px]">
                        FREE
                      </span>
                    ) : (
                      formatCurrency(totals.shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimated Tax (8%)</span>
                  <span>{formatCurrency(totals.estimatedTax)}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-purple-100 text-sm font-black text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-lg text-[#7C3AED] font-black">
                    {formatCurrency(totals.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Actions: Checkout & Clear Cart */}
              <div className="space-y-2 pt-1">
                <Button
                  onClick={onCheckout}
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="shadow-lg shadow-purple-500/20"
                >
                  Proceed to Checkout
                </Button>

                <div className="flex items-center justify-between px-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Secure simulated checkout</span>
                  </div>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="hover:text-rose-500 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
