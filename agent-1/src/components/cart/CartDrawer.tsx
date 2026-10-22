import React, { useState } from 'react';
import type { CartItem } from '../../types';
import type { PromoCodeResult } from '../../hooks/useCart';
import { CartItemRow } from './CartItemRow';
import { Button } from '../common/Button';
import {
  ShoppingBag,
  X,
  Tag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discountCode: string | null;
  discountAmount: number;
  tax: number;
  shipping: number;
  total: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onApplyPromoCode: (code: string) => PromoCodeResult | void;
  onRemovePromoCode: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  items,
  totalItems,
  subtotal,
  discountCode,
  discountAmount,
  tax,
  shipping,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromoCode,
  onRemovePromoCode,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = onApplyPromoCode(promoInput.trim());
    if (result && !result.success) {
      setPromoFeedback({
        type: 'error',
        text: result.error || 'Invalid promo code. Try AURA10 or LAUNCH20.',
      });
    } else {
      setPromoFeedback({
        type: 'success',
        text: result?.message || `Promo code ${promoInput.toUpperCase()} applied!`,
      });
      setPromoInput('');
    }
  };

  const handleRemovePromo = () => {
    onRemovePromoCode();
    setPromoFeedback(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag drawer"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <aside className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-purple-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-purple-50/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Your Shopping Bag
                </h2>
                <span className="text-xs text-slate-500">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close cart"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content: Items or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Explore our next-gen titanium smartwatches and biometrics bands to customize your wearable.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onClose}
                  className="mt-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Explore Wearables</span>
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

          {/* Bottom Panel: Promo Code, Summary & Checkout CTA */}
          {items.length > 0 && (
            <div className="border-t border-purple-100 p-4 sm:p-5 bg-[#FAF9FF] space-y-4">
              {/* Promo Code Input Form */}
              <div>
                {discountCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-100/70 border border-purple-200 text-xs">
                    <div className="flex items-center gap-1.5 text-purple-900 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-purple-700" />
                      <span>Code {discountCode} Applied</span>
                      <span className="text-[11px] text-purple-600 font-normal">
                        (-${discountAmount.toFixed(2)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-xs font-bold text-purple-700 hover:text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value);
                            if (promoFeedback) setPromoFeedback(null);
                          }}
                          placeholder="Promo code (AURA10, LAUNCH20)"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 placeholder-slate-400 uppercase"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={!promoInput.trim()}
                      >
                        Apply
                      </Button>
                    </div>

                    {promoFeedback && (
                      <p
                        className={`text-[11px] flex items-center gap-1 mt-1 ${
                          promoFeedback.type === 'error'
                            ? 'text-rose-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {promoFeedback.type === 'error' ? (
                          <AlertCircle className="w-3 h-3 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                        )}
                        <span>{promoFeedback.text}</span>
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Order Breakdown Summary */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-purple-100/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({discountCode})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-600">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-purple-200/80 text-sm font-extrabold text-slate-900">
                  <span>Total</span>
                  <span className="text-purple-700 font-black">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>30-Day Risk-Free Returns &amp; 2-Year Warranty</span>
              </div>

              {/* Proceed to Checkout CTA */}
              <Button
                variant="primary"
                size="lg"
                onClick={onProceedToCheckout}
                className="w-full shadow-lg shadow-purple-500/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
