/**
 * Slide-Over Cart Drawer Component
 * Itemized wearable list, coupon code engine with NOVA10 feedback, free shipping bar, and checkout action
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { useState, useEffect, useContext } from 'react';
import {
  ShoppingBag,
  X,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  AlertCircle,
  Truck,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { CartContext, FREE_SHIPPING_THRESHOLD } from '../../context/CartContext.jsx';
import { CartItemRow } from './CartItemRow.jsx';
import { formatUSD } from '../../utils/formatters.js';

export function CartDrawer(props) {
  // Support both direct props and CartContext
  const cartCtx = useContext(CartContext);

  const isOpen = props.isOpen !== undefined ? props.isOpen : cartCtx?.isCartOpen || false;
  const onClose = props.onClose || cartCtx?.closeCart || (() => {});
  const onProceedToCheckout = props.onProceedToCheckout || cartCtx?.openCheckout || (() => {});

  const items = props.items ?? cartCtx?.items ?? [];
  const totalCount = props.totalCount ?? cartCtx?.totalCount ?? 0;
  const subtotal = props.subtotal ?? cartCtx?.subtotal ?? 0;
  const discountAmount = props.discountAmount ?? cartCtx?.discountAmount ?? 0;
  const discountedSubtotal = props.discountedSubtotal ?? Math.max(0, subtotal - discountAmount);
  const taxAmount = props.taxAmount ?? cartCtx?.taxAmount ?? 0;
  const shippingAmount = props.shippingAmount ?? cartCtx?.shippingAmount ?? 0;
  const grandTotal = props.grandTotal ?? cartCtx?.grandTotal ?? 0;

  const appliedCoupon = props.appliedCoupon ?? cartCtx?.appliedCoupon ?? null;
  const couponDiscountPercent = props.couponDiscountPercent ?? cartCtx?.couponDiscountPercent ?? 0;

  const onUpdateQuantity = props.onUpdateQuantity || cartCtx?.updateQuantity || (() => {});
  const onRemoveItem = props.onRemoveItem || cartCtx?.removeItem || (() => {});
  const onApplyCoupon = props.onApplyCoupon || cartCtx?.applyCoupon || (() => {});
  const onRemoveCoupon = props.onRemoveCoupon || cartCtx?.removeCoupon || (() => {});
  const onClearCart = props.onClearCart || cartCtx?.clearCart || (() => {});

  const [couponInput, setCouponInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    if (!couponInput.trim()) return;

    const result = onApplyCoupon(couponInput.trim());
    if (result && typeof result === 'object') {
      setFeedback(result);
    } else {
      // Fallback
      if (couponInput.trim().toUpperCase() === 'NOVA10') {
        setFeedback({ success: true, message: 'Coupon NOVA10 applied: 10% discount!' });
      } else {
        setFeedback({ success: false, message: 'Invalid promo code. Try "NOVA10" for 10% off.' });
      }
    }
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setCouponInput('');
    setFeedback(null);
  };

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const shippingProgress = Math.min(100, Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
      data-testid="cart-drawer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-purple-100 animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Your Cart</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} in your bag
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                title="Empty cart"
              >
                Clear Cart
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart drawer"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Tracker */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-purple-50/60 border-b border-purple-100/70 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-purple-900">
                <Truck className="w-3.5 h-3.5 text-purple-600" />
                {remainingForFreeShipping === 0 ? (
                  <span>🎉 You unlocked Free Standard Shipping!</span>
                ) : (
                  <span>
                    Add <strong className="text-purple-700">{formatUSD(remainingForFreeShipping)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-[10px] font-bold text-purple-700">{shippingProgress}%</span>
            </div>
            <div className="w-full bg-purple-200/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-xs">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Explore our procedural 3D wearable collection and find your perfect companion.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const catalogEl = document.getElementById('catalog');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Wearables</span>
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
            {/* Coupon Code Section */}
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-emerald-800">
                      {appliedCoupon} (-{couponDiscountPercent}%)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    aria-label="Remove coupon"
                    className="text-emerald-700 hover:text-emerald-900 text-xs font-bold p-1 hover:bg-emerald-100/70 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. NOVA10)"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`text-[11px] font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                    feedback.success
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {feedback.success ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/80 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatUSD(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Coupon Discount ({couponDiscountPercent}%)</span>
                  </span>
                  <span>-{formatUSD(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>{formatUSD(taxAmount)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingAmount === 0 ? 'FREE' : formatUSD(shippingAmount)}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>{formatUSD(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout CTA Button */}
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-extrabold text-sm shadow-md shadow-purple-500/25 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
