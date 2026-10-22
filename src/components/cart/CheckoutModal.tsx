import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Lock,
  CreditCard,
  Truck,
  Calendar,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  MapPin,
  Smartphone,
} from 'lucide-react';
import { CartItem, OrderDetails } from '../../types';
import { useCart, calculateCartTotals } from '../../context/CartContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export type PaymentMethod = 'apple_pay' | 'credit_card' | 'cod';

export interface CheckoutModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CartItem[];
  appliedCoupon?: string | null;
  onOrderComplete?: (order: OrderDetails) => void;
  step?: 1 | 2;
  completedOrder?: OrderDetails | null;
  className?: string;
}

export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${year}-${randomNum}`;
}

export function getEstimatedDeliveryDate(daysToAdd: number = 4): string {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return formatDate(date);
}

function useSafeCart() {
  try {
    return useCart();
  } catch {
    return null;
  }
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  items: propItems,
  appliedCoupon: propAppliedCoupon,
  onOrderComplete: propOnOrderComplete,
  step: propStep = 1,
  completedOrder: propCompletedOrder = null,
  className = '',
}) => {
  const cart = useSafeCart();

  const isOpen = propIsOpen !== undefined ? propIsOpen : (cart?.isCheckoutOpen ?? false);
  const onClose = propOnClose || cart?.closeCheckout || (() => {});
  const items = propItems !== undefined ? propItems : (cart?.items ?? []);
  const appliedCoupon = propAppliedCoupon !== undefined ? propAppliedCoupon : (cart?.appliedCoupon ?? null);

  const [currentStep, setCurrentStep] = useState<1 | 2>(propStep);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(propCompletedOrder);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple_pay');

  // Credit Card mock fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Form Validation & Submitting
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync props when opening or resetting
  useEffect(() => {
    if (propStep) setCurrentStep(propStep);
    if (propCompletedOrder) setCompletedOrder(propCompletedOrder);
  }, [propStep, propCompletedOrder, isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const totals = calculateCartTotals(items, appliedCoupon);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!address.trim()) errs.address = 'Street address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!zipCode.trim()) errs.zipCode = 'Postal / ZIP code is required';

    if (paymentMethod === 'credit_card') {
      if (!cardNumber.trim()) errs.cardNumber = 'Card number is required';
      if (!cardExp.trim()) errs.cardExp = 'Expiry date is required';
      if (!cardCvc.trim()) errs.cardCvc = 'CVC is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate fast processing
    setTimeout(() => {
      const order: OrderDetails = {
        orderId: generateOrderId(),
        customerName: fullName.trim(),
        email: email.trim(),
        address: `${address.trim()}, ${city.trim()}, ${zipCode.trim()}, ${country}`,
        items: [...items],
        subtotal: totals.subtotal,
        shipping: totals.shippingFee,
        discount: totals.discount,
        total: totals.grandTotal,
        createdAt: new Date().toISOString(),
      };

      setCompletedOrder(order);
      setCurrentStep(2);
      setIsSubmitting(false);

      if (cart) {
        cart.setLastOrder(order);
        cart.clearCart();
      }

      if (propOnOrderComplete) {
        propOnOrderComplete(order);
      }
    }, 450);
  };

  const handleResetAndClose = () => {
    setCurrentStep(1);
    setCompletedOrder(null);
    setFullName('');
    setEmail('');
    setAddress('');
    setCity('');
    setZipCode('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={currentStep === 2 ? handleResetAndClose : onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto ${className}`}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-purple-100/80 flex items-center justify-between bg-gradient-to-r from-purple-50/70 via-white to-cyan-50/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] text-white shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 id="checkout-modal-title" className="text-base font-black text-slate-900">
                Simulated Checkout
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {currentStep === 1 ? 'Step 1 of 2: Shipping & Payment' : 'Step 2 of 2: Order Confirmed'}
              </span>
            </div>
          </div>

          <button
            onClick={currentStep === 2 ? handleResetAndClose : onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Shipping and Payment Form */}
        {currentStep === 1 && (
          <form onSubmit={handlePlaceOrder} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Shipping Details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-[#7C3AED]" />
                    <h4 className="text-sm font-bold text-slate-900">Customer & Shipping Info</h4>
                  </div>

                  <div className="space-y-3">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="checkout-name" className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                          errors.fullName ? 'border-rose-400 ring-1 ring-rose-300' : 'border-purple-200'
                        } focus:outline-none focus:ring-2 focus:ring-[#7C3AED]`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="checkout-email" className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. alex.rivera@example.com"
                        className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                          errors.email ? 'border-rose-400 ring-1 ring-rose-300' : 'border-purple-200'
                        } focus:outline-none focus:ring-2 focus:ring-[#7C3AED]`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Street Address */}
                    <div>
                      <label htmlFor="checkout-address" className="block text-xs font-semibold text-slate-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 742 Evergreen Terrace"
                        className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                          errors.address ? 'border-rose-400 ring-1 ring-rose-300' : 'border-purple-200'
                        } focus:outline-none focus:ring-2 focus:ring-[#7C3AED]`}
                      />
                      {errors.address && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>
                      )}
                    </div>

                    {/* City & ZIP Code Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="checkout-city" className="block text-xs font-semibold text-slate-700 mb-1">
                          City *
                        </label>
                        <input
                          id="checkout-city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Springfield"
                          className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                            errors.city ? 'border-rose-400 ring-1 ring-rose-300' : 'border-purple-200'
                          } focus:outline-none focus:ring-2 focus:ring-[#7C3AED]`}
                        />
                        {errors.city && (
                          <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="checkout-zip" className="block text-xs font-semibold text-slate-700 mb-1">
                          Postal / ZIP Code *
                        </label>
                        <input
                          id="checkout-zip"
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="e.g. 97477"
                          className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                            errors.zipCode ? 'border-rose-400 ring-1 ring-rose-300' : 'border-purple-200'
                          } focus:outline-none focus:ring-2 focus:ring-[#7C3AED]`}
                        />
                        {errors.zipCode && (
                          <p className="text-[11px] text-rose-500 mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Simulated Payment Options */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-[#7C3AED]" />
                    <h4 className="text-sm font-bold text-slate-900">Simulated Payment Method</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 mb-3">
                    {/* Apple Pay */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'apple_pay'
                          ? 'border-[#7C3AED] bg-purple-50/80 ring-2 ring-purple-400/20 text-[#7C3AED]'
                          : 'border-purple-100 hover:border-purple-200 bg-white text-slate-700'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 mb-1 text-slate-900" />
                      <span className="text-xs font-bold">Apple Pay</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Instant 1-Click</span>
                    </button>

                    {/* Credit Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-[#7C3AED] bg-purple-50/80 ring-2 ring-purple-400/20 text-[#7C3AED]'
                          : 'border-purple-100 hover:border-purple-200 bg-white text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mb-1 text-slate-900" />
                      <span className="text-xs font-bold">Credit Card</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Visa / Mastercard</span>
                    </button>

                    {/* COD */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#7C3AED] bg-purple-50/80 ring-2 ring-purple-400/20 text-[#7C3AED]'
                          : 'border-purple-100 hover:border-purple-200 bg-white text-slate-700'
                      }`}
                    >
                      <Truck className="w-5 h-5 mb-1 text-slate-900" />
                      <span className="text-xs font-bold">Cash on Delivery</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Pay on arrival</span>
                    </button>
                  </div>

                  {/* Credit Card extra inputs */}
                  {paymentMethod === 'credit_card' && (
                    <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-2.5 animate-in fade-in">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-purple-200 bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-purple-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            CVC
                          </label>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-purple-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary & Place Order */}
              <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-purple-50/40 border border-purple-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Order Summary</h4>

                  {/* Items mini list */}
                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="font-bold text-slate-800 truncate">{item.name}</span>
                          <span className="text-[11px] text-slate-500">
                            Qty: {item.quantity} • {item.chassisColor.name}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1.5 pt-3 border-t border-purple-200/60 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
                    </div>

                    {totals.discount > 0 && (
                      <div className="flex items-center justify-between text-emerald-600 font-medium">
                        <span>Discount ({appliedCoupon})</span>
                        <span>-{formatCurrency(totals.discount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Shipping</span>
                      <span>
                        {totals.isFreeShipping ? (
                          <span className="font-bold text-emerald-600 uppercase text-[11px]">FREE</span>
                        ) : (
                          formatCurrency(totals.shippingFee)
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Estimated Tax (8%)</span>
                      <span>{formatCurrency(totals.estimatedTax)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-purple-200 text-sm font-black text-slate-900">
                      <span>Total</span>
                      <span className="text-lg text-[#7C3AED] font-black">
                        {formatCurrency(totals.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isSubmitting}
                    icon={<Lock className="w-4 h-4" />}
                    className="shadow-lg shadow-purple-500/25"
                  >
                    Place Order ({formatCurrency(totals.grandTotal)})
                  </Button>

                  <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-slate-400 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Safe client-side simulation. No real charges.</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: Order Confirmation Screen */}
        {currentStep === 2 && completedOrder && (
          <div className="p-6 sm:p-8 text-center space-y-6">
            {/* Glowing Success Icon */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-white" />
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Order Confirmed!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-slate-800">{completedOrder.customerName}</span>! Your wearable order has been successfully placed in our interactive simulation.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-purple-50/60 border border-purple-100 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-purple-200/60">
                <span className="text-slate-500 font-medium">Order Reference ID:</span>
                <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                  {completedOrder.orderId}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Estimated Delivery:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                  {getEstimatedDeliveryDate(4)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Shipping Address:</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]" title={completedOrder.address}>
                  {completedOrder.address}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Confirmation Email:</span>
                <span className="font-medium text-slate-800">{completedOrder.email}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-200/60 text-sm font-bold">
                <span className="text-slate-900">Total Paid:</span>
                <span className="text-[#7C3AED] font-black">{formatCurrency(completedOrder.total)}</span>
              </div>
            </div>

            {/* Back to store CTA */}
            <div className="pt-2 max-w-xs mx-auto">
              <Button
                onClick={handleResetAndClose}
                variant="primary"
                size="md"
                fullWidth
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
