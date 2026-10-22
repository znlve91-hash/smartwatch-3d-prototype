import React, { useState } from 'react';
import type { CartItem } from '../../types';
import { Button } from '../common/Button';
import {
  X,
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Banknote,
  PackageCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOrder: () => void;
  items: CartItem[];
  subtotal: number;
  discountCode?: string | null;
  discountAmount?: number;
  tax: number;
  shipping: number;
  total: number;
}

export type CheckoutStep = 'shipping' | 'payment' | 'confirmation';
export type PaymentMethod = 'credit_card' | 'apple_pay' | 'cod';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onCompleteOrder,
  items,
  subtotal,
  discountCode,
  discountAmount = 0,
  tax,
  shipping,
  total,
}) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');

  // Shipping Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  // Generated Order Information
  const [orderId, setOrderId] = useState<string>('');

  if (!isOpen) return null;

  const validateShipping = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!address.trim()) errors.address = 'Street address is required';
    if (!city.trim()) errors.city = 'City is required';

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = (): boolean => {
    if (paymentMethod !== 'credit_card') return true;

    const errors: Record<string, string> = {};
    const sanitizedCard = cardNumber.replace(/\s+/g, '');
    if (!sanitizedCard || sanitizedCard.length < 15) {
      errors.cardNumber = 'Please enter a valid 15 or 16-digit card number';
    }
    if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry.trim())) {
      errors.expiry = 'Expiry must be in MM/YY format';
    }
    if (!cvv.trim() || cvv.trim().length < 3) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep('payment');
    }
  };

  const generateOrderId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `AURA-${result}`;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      const generated = generateOrderId();
      setOrderId(generated);
      setStep('confirmation');
    }
  };

  const handleFinishAndReset = () => {
    onCompleteOrder();
    onClose();
    // Reset steps for next checkout
    setStep('shipping');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Checkout Dialog"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50/70 via-white to-purple-50/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm shadow-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                AURA Secure Checkout
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {step === 'shipping' && 'Shipping Information'}
                {step === 'payment' && 'Payment Method'}
                {step === 'confirmation' && 'Order Confirmation'}
              </h2>
            </div>
          </div>

          {step !== 'confirmation' && (
            <button
              type="button"
              aria-label="Close checkout"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Tracker */}
        {step !== 'confirmation' && (
          <div className="px-6 pt-4 pb-2 bg-slate-50/60 border-b border-purple-100/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 'shipping'
                    ? 'bg-purple-600 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                1
              </span>
              <span className={`font-semibold ${step === 'shipping' ? 'text-purple-700' : 'text-slate-700'}`}>
                Shipping
              </span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-purple-200" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 'payment'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </span>
              <span className={`font-semibold ${step === 'payment' ? 'text-purple-700' : 'text-slate-400'}`}>
                Payment
              </span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <span className="font-semibold text-slate-400">Confirmation</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* ========================================================= */}
          {/* STEP 1: SHIPPING FORM */}
          {/* ========================================================= */}
          {step === 'shipping' && (
            <form onSubmit={handleContinueToPayment} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (shippingErrors.name) setShippingErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g., Jane Doe"
                  className="w-full px-3.5 py-2.5 text-sm bg-purple-50/40 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800"
                />
                {shippingErrors.name && (
                  <p className="text-xs text-rose-500 mt-1">{shippingErrors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (shippingErrors.email) setShippingErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="e.g., jane@aura.test"
                  className="w-full px-3.5 py-2.5 text-sm bg-purple-50/40 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800"
                />
                {shippingErrors.email && (
                  <p className="text-xs text-rose-500 mt-1">{shippingErrors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (shippingErrors.address) setShippingErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  placeholder="e.g., 100 Silicon Way"
                  className="w-full px-3.5 py-2.5 text-sm bg-purple-50/40 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800"
                />
                {shippingErrors.address && (
                  <p className="text-xs text-rose-500 mt-1">{shippingErrors.address}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (shippingErrors.city) setShippingErrors((prev) => ({ ...prev, city: '' }));
                  }}
                  placeholder="e.g., San Francisco"
                  className="w-full px-3.5 py-2.5 text-sm bg-purple-50/40 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800"
                />
                {shippingErrors.city && (
                  <p className="text-xs text-rose-500 mt-1">{shippingErrors.city}</p>
                )}
              </div>

              {/* Order Mini-Recap */}
              <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-xs text-slate-600">
                <span>Total Due (inc. 8% tax &amp; free shipping):</span>
                <span className="font-bold text-slate-900 text-sm">${total.toFixed(2)}</span>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg shadow-purple-500/20"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 2: PAYMENT METHOD */}
          {/* ========================================================= */}
          {step === 'payment' && (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Payment Methods Selection */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                    paymentMethod === 'credit_card'
                      ? 'border-purple-600 bg-purple-50/80 text-purple-700 shadow-sm ring-1 ring-purple-500'
                      : 'border-slate-200 hover:border-purple-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                    paymentMethod === 'apple_pay'
                      ? 'border-purple-600 bg-purple-50/80 text-purple-700 shadow-sm ring-1 ring-purple-500'
                      : 'border-slate-200 hover:border-purple-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-slate-900" />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                    paymentMethod === 'cod'
                      ? 'border-purple-600 bg-purple-50/80 text-purple-700 shadow-sm ring-1 ring-purple-500'
                      : 'border-slate-200 hover:border-purple-200 text-slate-600'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span>Cash on Delivery</span>
                </button>
              </div>

              {/* Credit Card Input Form */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-3 p-4 bg-purple-50/30 rounded-2xl border border-purple-100">
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                    >
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        setCardNumber(e.target.value);
                        if (paymentErrors.cardNumber) {
                          setPaymentErrors((prev) => ({ ...prev, cardNumber: '' }));
                        }
                      }}
                      placeholder="4111 2222 3333 4444"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 font-mono"
                    />
                    {paymentErrors.cardNumber && (
                      <p className="text-xs text-rose-500 mt-1">{paymentErrors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="expiry"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                      >
                        Expiry
                      </label>
                      <input
                        id="expiry"
                        type="text"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => {
                          setExpiry(e.target.value);
                          if (paymentErrors.expiry) {
                            setPaymentErrors((prev) => ({ ...prev, expiry: '' }));
                          }
                        }}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 font-mono"
                      />
                      {paymentErrors.expiry && (
                        <p className="text-xs text-rose-500 mt-1">{paymentErrors.expiry}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                      >
                        CVV / CVC
                      </label>
                      <input
                        id="cvv"
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => {
                          setCvv(e.target.value);
                          if (paymentErrors.cvv) {
                            setPaymentErrors((prev) => ({ ...prev, cvv: '' }));
                          }
                        }}
                        placeholder="123"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 font-mono"
                      />
                      {paymentErrors.cvv && (
                        <p className="text-xs text-rose-500 mt-1">{paymentErrors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-5 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <Smartphone className="w-8 h-8 mx-auto text-slate-900" />
                  <p className="text-xs text-slate-600 font-medium">
                    Simulated biometric authentication: Touch ID / Face ID will be requested upon clicking Place Order.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-5 text-center bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                  <Banknote className="w-8 h-8 mx-auto text-emerald-600" />
                  <p className="text-xs text-emerald-800 font-medium">
                    Pay upon physical delivery. Exact cash or courier mobile terminal accepted.
                  </p>
                </div>
              )}

              {/* Order Total recap */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
                <span>Shipping to: {name} ({city})</span>
                <span className="font-extrabold text-purple-700 text-sm">${total.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep('shipping')}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1 shadow-lg shadow-purple-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order</span>
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 3: ORDER CONFIRMATION */}
          {/* ========================================================= */}
          {step === 'confirmation' && (
            <div className="text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">Order Confirmed!</h3>
                <p className="text-xs text-slate-500">
                  Thank you for joining the AURA ecosystem. We have dispatched your confirmation receipt to{' '}
                  <span className="font-bold text-slate-700">{email}</span>.
                </p>
              </div>

              {/* Generated Order ID Pill */}
              <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-200/80 flex items-center justify-between max-w-sm mx-auto">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Order Reference ID
                  </span>
                  <span
                    data-testid="checkout-order-id"
                    className="font-mono text-base font-extrabold text-purple-700 tracking-wider"
                  >
                    {orderId}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <PackageCheck className="w-3 h-3" />
                  <span>Confirmed</span>
                </div>
              </div>

              {/* Simulated Dispatch Timeline */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <span>Simulated Delivery Telemetry</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                    ✓ Verified
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800 font-bold animate-pulse">
                    Preparing
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-400">
                    Dispatched
                  </div>
                </div>
              </div>

              {/* Summary Recap Box */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-800 pb-1 border-b border-slate-200">
                  <span>Delivery Address</span>
                  <span>Amount Paid</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-900">{name}</p>
                    <p>{address}</p>
                    <p>{city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-extrabold text-purple-700">
                      ${total.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium">Free Express Delivery</p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleFinishAndReset}
                className="w-full shadow-lg shadow-purple-500/20"
              >
                <span>Continue Shopping</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
