/**
 * Product Detail & 3D Interactive Comparison Modal Component
 * Dedicated 3D Viewer, Deep-Dive Specifications Table, Color/Face Customizers & Add to Cart
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Check,
  ShieldCheck,
  Battery,
  Droplets,
  Eye,
  Activity,
  Plus,
  Minus,
  Box,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react';
import { WatchViewer3D } from '../3d/WatchViewer3D.jsx';
import { Badge } from '../common/Badge.jsx';
import { formatUSD } from '../../utils/formatters.js';
import { WATCH_FACES } from '../../data/watchFaces.js';

export function ProductDetailModal({
  isOpen = false,
  product = null,
  initialColor = null,
  onClose = () => {},
  onAddToCart = () => {},
  className = '',
}) {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState(
    initialColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null)
  );
  const [selectedFace, setSelectedFace] = useState(product.defaultWatchFace || 'minimal');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Sync state if product or initialColor changes
  useEffect(() => {
    if (product) {
      setSelectedColor(
        initialColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null)
      );
      setSelectedFace(product.defaultWatchFace || 'minimal');
      setQuantity(1);
    }
  }, [product, initialColor]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedFace, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const modelGeometry = product.preset3d?.geometry || product.category || 'watch';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      className={`fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200 ${className}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white rounded-3xl md:rounded-[32px] shadow-2xl border border-purple-100/80 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Sticky Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Badge category={product.category} tier={product.tier} variant="combined" size="sm" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Deep-Dive Showcase
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all focus:outline-hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Dedicated 3D Viewer */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-3xl overflow-hidden border border-purple-100 bg-gradient-to-b from-[#F5F2FF] to-[#FAF8FF] p-2 relative shadow-inner">
                <WatchViewer3D
                  modelType={modelGeometry}
                  tier={product.tier}
                  color={selectedColor}
                  activeFace={selectedFace}
                  onColorChange={setSelectedColor}
                  onFaceChange={setSelectedFace}
                  showControls={false}
                  className="h-[380px] sm:h-[440px] md:h-[480px] rounded-2xl"
                />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-[11px] font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 pointer-events-auto">
                    <Compass className="w-3.5 h-3.5 text-purple-600" />
                    <span>360° Live Procedural Model</span>
                  </span>
                </div>
              </div>

              {/* Watch Face Quick Customizer */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Select Dynamic Watch Face</span>
                  </span>
                  <span className="text-[11px] font-semibold text-purple-700 capitalize">
                    {selectedFace} Face
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WATCH_FACES.map((face) => {
                    const isFaceSelected = selectedFace === face.id;
                    return (
                      <button
                        key={face.id}
                        type="button"
                        onClick={() => setSelectedFace(face.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isFaceSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{face.name}</div>
                        <div className={`text-[10px] truncate ${isFaceSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                          {face.tagline}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Title, Colorways, Pricing, Add to Cart */}
            <div className="lg:col-span-5 space-y-6">
              {/* Product Info */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-purple-700 leading-snug">
                  {product.tagline}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} customer reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Customizer */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    Colorway
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedColor?.name || 'Default'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full border transition-all ${
                          isSelected
                            ? 'ring-2 ring-purple-600 ring-offset-2 scale-110 shadow-sm'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Pricing & Stock Status */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {formatUSD(product.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatUSD(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock • Dispatches in 24h</span>
                  </span>
                  <span className="text-slate-500 font-medium">Free Expedited Shipping</span>
                </div>
              </div>

              {/* Quantity & Add to Cart Controls */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Modifier */}
                  <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-all"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-all"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-6 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart ({quantity})</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart • {formatUSD(product.price * quantity)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Deep-Dive Technical Specifications Table */}
          <div className="pt-8 border-t border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <span>Technical Specifications</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Verified Procedural Hardware Profile
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Specs Table */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 divide-y divide-slate-100 text-xs">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-slate-500 font-medium">Display</span>
                  <span className="text-slate-900 font-bold text-right">{product.specs.display}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-slate-500 font-medium">Battery Endurance</span>
                  <span className="text-slate-900 font-bold text-right">{product.specs.batteryLife}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-slate-500 font-medium">Water Resistance</span>
                  <span className="text-slate-900 font-bold text-right">{product.specs.waterResistance}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-slate-500 font-medium">Weight</span>
                  <span className="text-slate-900 font-bold text-right">{product.specs.weight}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-slate-500 font-medium">Connectivity</span>
                  <span className="text-slate-900 font-bold text-right">{product.specs.connectivity}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-slate-500 font-medium">Casing Material</span>
                  <span className="text-slate-900 font-bold text-right">{product.specs.casingMaterial}</span>
                </div>
              </div>

              {/* Sensors & Highlights List */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-purple-600" />
                    <span>Integrated Sensor Array</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {product.specs.sensors.map((sensor, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-purple-200/70 text-slate-700 shadow-2xs"
                      >
                        {sensor}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-50/40 border border-cyan-100 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Signature Features</span>
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
