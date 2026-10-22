/**
 * Two-Step Simulated Checkout Modal Component
 * Step 1: Shipping Address & Speed
 * Step 2: Payment Simulation (Credit Card, One-Touch Pay, Cash on Delivery)
 * Step 3: Order Confirmation Receipt & Reset Action
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { useState, useEffect, useContext } from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Smartphone,
  Banknote,
  Calendar,
  Package,
} from 'lucide-react';
import { CartContext } from '../../context/CartContext.jsx';
import { formatUSD, formatDate } from '../../utils/formatters.js';
import { Badge } from '../common/Badge.jsx';

export function CheckoutModal(props) {
  const cartCtx = useContext(CartContext);

  const isOpen = props.isOpen !== undefined ? props.isOpen : cartCtx?.isCheckoutOpen || false;
  const onClose = props.onClose || cartCtx?.closeCheckout || (() => {});
  const onClearCart = props.onClearCart || cartCtx?.clearCart || (() => {});

  const items = props.items ?? cartCtx?.items ?? [];
  const subtotal = props.subtotal ?? cartCtx?.subtotal ?? 0;
  const discountAmount = props.discountAmount ?? cartCtx?.discountAmount ?? 0;
  const baseShipping = props.shippingAmount ?? cartCtx?.shippingAmount ?? 0;
  const taxAmount = props.taxAmount ?? cartCtx?.taxAmount ?? 0;
  const grandTotal = props.grandTotal ?? cartCtx?.grandTotal ?? 0;

  // Step state (supports controlled prop for testing or internal step state)
  const [internalStep, setInternalStep] = useState(1);
  const currentStep = props.step !== undefined ? props.step : internalStep;

  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    shippingSpeed: 'standard', // 'standard' | 'express'
  });
  const [shippingErrors, setShippingErrors] = useState({});

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'one-touch' | 'cod'
  const [cardForm, setCardForm] = useState({
    cardName: '',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '12/28',
    cvv: '888',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Order Confirmation State
  const [generatedOrderId, setGeneratedOrderId] = useState(
    props.orderId || `NW-2026-${Math.floor(100000 + Math.random() * 900000)}`
  );

  // Sync prop orderId if passed
  useEffect(() => {
    if (props.orderId) {
      setGeneratedOrderId(props.orderId);
    }
  }, [props.orderId]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (currentStep === 3) {
          handleFinishShopping();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, onClose]);

  // Validate Step 1
  const validateShipping = () => {
    const errors = {};
    if (!shippingForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!shippingForm.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingForm.email)) {
      errors.email = 'Valid email is required';
    }
    if (!shippingForm.address.trim()) errors.address = 'Street address is required';
    if (!shippingForm.city.trim()) errors.city = 'City is required';
    if (!shippingForm.zip.trim()) errors.zip = 'Postal code is required';

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e) => {
    e?.preventDefault();
    if (validateShipping()) {
      setInternalStep(2);
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newOrderId = `NW-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedOrderId(newOrderId);
      setInternalStep(3);
    }, 600);
  };

  const handleFinishShopping = () => {
    onClearCart();
    setInternalStep(1);
    setShippingForm({
      fullName: '',
      email: '',
      address: '',
      city: '',
      zip: '',
      country: 'United States',
      shippingSpeed: 'standard',
    });
    onClose();
  };

  // Calculate estimated delivery
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(
    estimatedDeliveryDate.getDate() + (shippingForm.shippingSpeed === 'express' ? 2 : 4)
  );

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Simulated Checkout"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={currentStep === 3 ? handleFinishShopping : onClose}
      data-testid="checkout-modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100/90 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/95">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {currentStep === 1 && 'Shipping Details'}
                {currentStep === 2 && 'Simulated Payment'}
                {currentStep === 3 && 'Order Confirmation'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentStep === 1 && 'Step 1 of 2 • Where should we send your order?'}
                {currentStep === 2 && 'Step 2 of 2 • Encrypted sandbox payment'}
                {currentStep === 3 && 'Order Placed • Receipt & tracking info'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={currentStep === 3 ? handleFinishShopping : onClose}
            aria-label="Close Checkout"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Indicator (for Step 1 and 2) */}
        {currentStep < 3 && (
          <div className="px-6 py-3 bg-purple-50/40 border-b border-purple-100/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {currentStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span className={currentStep === 1 ? 'text-purple-900' : 'text-slate-600'}>
                Shipping
              </span>
            </div>

            <div className="w-16 h-0.5 bg-slate-200" />

            <div className="flex items-center gap-2 font-bold">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 2
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <span className={currentStep === 2 ? 'text-purple-900' : 'text-slate-400'}>
                Payment
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* STEP 1: SHIPPING ADDRESS & SPEED */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={shippingForm.fullName}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, fullName: e.target.value })
                    }
                    placeholder="e.g. Alex Morgan"
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-white focus:outline-hidden ${
                      shippingErrors.fullName
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-purple-500'
                    }`}
                  />
                  {shippingErrors.fullName && (
                    <p className="text-[10px] font-semibold text-rose-500">
                      {shippingErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, email: e.target.value })
                    }
                    placeholder="alex.morgan@example.com"
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-white focus:outline-hidden ${
                      shippingErrors.email
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-purple-500'
                    }`}
                  />
                  {shippingErrors.email && (
                    <p className="text-[10px] font-semibold text-rose-500">
                      {shippingErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Shipping Address *</label>
                <input
                  type="text"
                  value={shippingForm.address}
                  onChange={(e) =>
                    setShippingForm({ ...shippingForm, address: e.target.value })
                  }
                  placeholder="Street address, apartment or suite"
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-white focus:outline-hidden ${
                    shippingErrors.address
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-200 focus:border-purple-500'
                  }`}
                />
                {shippingErrors.address && (
                  <p className="text-[10px] font-semibold text-rose-500">
                    {shippingErrors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City *</label>
                  <input
                    type="text"
                    value={shippingForm.city}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, city: e.target.value })
                    }
                    placeholder="San Francisco"
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-white focus:outline-hidden ${
                      shippingErrors.city
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-purple-500'
                    }`}
                  />
                  {shippingErrors.city && (
                    <p className="text-[10px] font-semibold text-rose-500">
                      {shippingErrors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Postal / Zip *</label>
                  <input
                    type="text"
                    value={shippingForm.zip}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, zip: e.target.value })
                    }
                    placeholder="94103"
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-white focus:outline-hidden ${
                      shippingErrors.zip
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-purple-500'
                    }`}
                  />
                  {shippingErrors.zip && (
                    <p className="text-[10px] font-semibold text-rose-500">
                      {shippingErrors.zip}
                    </p>
                  )}
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Country</label>
                  <select
                    value={shippingForm.country}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, country: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-purple-500 text-slate-800"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Japan">Japan</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
              </div>

              {/* Shipping Speed Selection */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold text-slate-700">Shipping Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      shippingForm.shippingSpeed === 'standard'
                        ? 'border-purple-500 bg-purple-50/40 ring-1 ring-purple-500'
                        : 'border-slate-200 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingForm.shippingSpeed === 'standard'}
                      onChange={() =>
                        setShippingForm({ ...shippingForm, shippingSpeed: 'standard' })
                      }
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>Standard Dispatch</span>
                        <span className="text-purple-700 font-extrabold">
                          {baseShipping === 0 ? 'FREE' : formatUSD(baseShipping)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Carbon-neutral delivery • 3-5 business days
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      shippingForm.shippingSpeed === 'express'
                        ? 'border-purple-500 bg-purple-50/40 ring-1 ring-purple-500'
                        : 'border-slate-200 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingForm.shippingSpeed === 'express'}
                      onChange={() =>
                        setShippingForm({ ...shippingForm, shippingSpeed: 'express' })
                      }
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>Priority Express</span>
                        <span className="text-purple-700 font-extrabold">+$25.00</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Next-flight expedited courier • 1-2 business days
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT SIMULATION */}
          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Payment Methods Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Choose Payment Option</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600 text-purple-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1 text-purple-600" />
                    <span className="text-xs">Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('one-touch')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'one-touch'
                        ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600 text-purple-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-1 text-purple-600" />
                    <span className="text-xs">Apple Pay / Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600 text-purple-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mb-1 text-purple-600" />
                    <span className="text-xs">Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Payment Method Details */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardForm.cardName || shippingForm.fullName || 'Alex Morgan'}
                      onChange={(e) => setCardForm({ ...cardForm, cardName: e.target.value })}
                      placeholder="Alex Morgan"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Card Number (Simulated)</label>
                    <input
                      type="text"
                      value={cardForm.cardNumber}
                      onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Expiration</label>
                      <input
                        type="text"
                        value={cardForm.expDate}
                        onChange={(e) => setCardForm({ ...cardForm, expDate: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">CVV</label>
                      <input
                        type="text"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'one-touch' && (
                <div className="p-5 rounded-2xl bg-slate-900 text-white text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-cyan-300">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">Biometric Fast Pay</h4>
                    <p className="text-xs text-slate-400">
                      Simulated one-touch payment authorized via Touch ID / Face ID.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-amber-600" />
                    <span>Pay On Arrival</span>
                  </div>
                  <p className="text-amber-800 text-[11px]">
                    You can pay safely via contactless card or cash when the courier delivers your wearable package.
                  </p>
                </div>
              )}

              {/* Order Amount Recap */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Total Amount Due</span>
                  <div className="text-base font-black text-slate-900">{formatUSD(grandTotal)}</div>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span>Shipping to: {shippingForm.city || 'San Francisco'}, {shippingForm.zip || '94103'}</span>
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInternalStep(1)}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Shipping</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Authorizing...</span>
                  ) : (
                    <>
                      <span>Complete Order</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION & RECEIPT */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Thank you for your order!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your wearable order has been confirmed and scheduled for assembly in our procedural studio.
                </p>
              </div>

              {/* Order Reference Box */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 max-w-md mx-auto grid grid-cols-2 gap-3 text-left text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Order ID
                  </span>
                  <div className="font-mono font-extrabold text-purple-700 text-sm">
                    {generatedOrderId}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Estimated Delivery
                  </span>
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>{formatDate(estimatedDeliveryDate)}</span>
                  </div>
                </div>

                <div className="col-span-2 border-t border-purple-100 pt-2 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-800">Delivering to: </span>
                  <span>{shippingForm.fullName || 'Alex Morgan'}</span> • <span>{shippingForm.address || 'Market St, San Francisco'}</span>
                </div>
              </div>

              {/* Itemized Order Receipt */}
              <div className="text-left space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Order Summary
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-white space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{item.name}</span>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>{item.color?.name || 'Color'}</span>
                          <span>•</span>
                          <span className="capitalize">{item.face || 'Face'}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatUSD((item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatUSD(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Discount</span>
                        <span>-{formatUSD(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{baseShipping === 0 ? 'FREE' : formatUSD(baseShipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span>{formatUSD(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                      <span>Total Paid</span>
                      <span>{formatUSD(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinishShopping}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
