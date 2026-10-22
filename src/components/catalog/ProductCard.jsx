/**
 * Interactive Wearable Product Card Component
 * Pricing, Badges, Key Technical Specs, Color Swatches, "Try in 3D", and "Add to Cart"
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { useState } from 'react';
import { Box, ShoppingBag, Check, Battery, Droplets, Eye, Star, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';
import { formatUSD } from '../../utils/formatters.js';

export function ProductCard({
  product,
  onAddToCart = () => {},
  onTryIn3D = () => {},
  onSelectProduct = () => {},
  className = '',
}) {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleTryIn3D = (e) => {
    e.stopPropagation();
    onTryIn3D(product, selectedColor);
  };

  const handleColorClick = (e, color) => {
    e.stopPropagation();
    setSelectedColor(color);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className={`group relative bg-white rounded-3xl p-5 md:p-6 border border-purple-100/80 shadow-xs hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 flex flex-col justify-between cursor-pointer ${className}`}
      data-testid={`product-card-${product.id}`}
    >
      <div>
        {/* Top Header: Category/Tier Badges & Discount Pill */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge category={product.category} tier={product.tier} variant="combined" size="sm" />
          <div className="flex items-center gap-1.5">
            {product.isNew && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Visual Device Showcase Preview */}
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-[#F5F3FF] via-[#FAF8FF] to-white flex items-center justify-center p-4 overflow-hidden border border-purple-50 group-hover:border-purple-200/60 transition-colors">
          {/* Subtle Circular Radial Glow matching selected color */}
          <div
            className="absolute w-28 h-28 rounded-full blur-2xl opacity-40 transition-colors duration-500"
            style={{ backgroundColor: selectedColor?.hex || '#7C3AED' }}
          />

          {/* Procedural Graphic Device Silhouette */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`transition-all duration-300 shadow-md ${
                product.category === 'watch'
                  ? 'w-24 h-24 rounded-full border-4'
                  : 'w-14 h-28 rounded-3xl border-4'
              }`}
              style={{
                borderColor: selectedColor?.chassisHex || '#0F172A',
                backgroundColor: '#0F172A',
              }}
            >
              {/* Screen Face Content */}
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 rounded-full overflow-hidden bg-slate-950">
                <span
                  className="text-[10px] font-bold tracking-tight font-mono transition-colors"
                  style={{ color: selectedColor?.hex || '#06B6D4' }}
                >
                  10:24
                </span>
                <span className="text-[8px] text-slate-400 mt-0.5 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  {product.rating}
                </span>
              </div>
            </div>

            {/* Strap Representation */}
            <div
              className="w-10 h-3 rounded-b-md mt-0.5 transition-colors"
              style={{ backgroundColor: selectedColor?.strapHex || '#1E293B' }}
            />
          </div>

          {/* Quick "Try in 3D" Floating Pill on hover */}
          <button
            type="button"
            onClick={handleTryIn3D}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-purple-200/80 text-purple-700 text-[11px] font-bold shadow-xs hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5 z-20"
            title="Preview in 360° 3D Studio"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Try in 3D</span>
          </button>
        </div>

        {/* Title & Tagline */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-700 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Key Specs Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 font-medium">
            <Eye className="w-3 h-3 text-purple-500 shrink-0" />
            <span className="truncate max-w-[120px]">{product.specs.display}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 font-medium">
            <Battery className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>{product.specs.batteryLife}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 font-medium">
            <Droplets className="w-3 h-3 text-cyan-500 shrink-0" />
            <span>{product.specs.waterResistance}</span>
          </span>
        </div>

        {/* Colorway Swatches Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {selectedColor?.name || 'Color'}
            </span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((color) => {
                const isSelected = selectedColor?.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={(e) => handleColorClick(e, color)}
                    title={color.name}
                    aria-label={color.name}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      isSelected
                        ? 'ring-2 ring-purple-600 ring-offset-2 scale-110'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pricing & Cart Action Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Pricing Column */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900 tracking-tight">
              {formatUSD(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                {formatUSD(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {product.inStock ? 'In Stock • Ready to Ship' : 'Backorder'}
          </span>
        </div>

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-500/25 hover:shadow-md'
          }`}
          title="Add to Shopping Cart"
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
