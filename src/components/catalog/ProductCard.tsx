import React, { useState } from 'react';
import type { Product, ColorOption, WatchFaceId } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Sparkles, ShoppingBag, Battery, Droplets, Monitor, Check } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  onPreview3D?: (product: Product) => void;
  onAddToCart?: (product: Product, color: ColorOption, face: WatchFaceId) => void;
  onCompare?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPreview3D,
  onAddToCart,
  onCompare,
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.colors.find((c) => c.id === product.defaultColorId) || product.colors[0]
  );

  const formatTier = (tier: string) => {
    switch (tier) {
      case 'pro_max':
        return 'Pro Max';
      case 'pro':
        return 'Pro';
      case 'standard':
      default:
        return 'Standard';
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <article className="glass-card glass-card-hover rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden border border-purple-100/70 hover:border-purple-300/80 hover:shadow-xl">
      {/* Top Header: Tier Badge & Discount & Pricing */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant={
                product.tier === 'pro_max'
                  ? 'cyan'
                  : product.tier === 'pro'
                  ? 'purple'
                  : 'neutral'
              }
              size="sm"
            >
              {formatTier(product.tier)}
            </Badge>

            {product.isNew && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xs">
                New
              </span>
            )}
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                ${product.price}
              </span>
            </div>
            {discountPercent && (
              <span className="text-[10px] font-semibold text-emerald-600 block">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Visual Preview Stage with Dynamic Hardware Silhouette */}
        <div className="relative w-full h-48 sm:h-52 rounded-2xl bg-gradient-to-br from-[#F8F6FF] via-[#F1EFFF]/80 to-[#E0F7FA]/40 p-4 mb-4 flex flex-col items-center justify-center border border-purple-100/40 group-hover:bg-gradient-to-br group-hover:from-purple-50/60 group-hover:to-cyan-50/60 transition-colors overflow-hidden">
          {/* Hardware category subtle watermark */}
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {product.category === 'band' ? 'Smart Band' : 'Smart Watch'}
          </span>

          {/* Interactive Hardware Silhouette */}
          <div className="relative flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-105">
            {product.modelType === 'band_capsule' ? (
              // Band Capsule Silhouette
              <div className="relative flex items-center justify-center">
                {/* Band Strap Loop */}
                <div
                  className="w-20 h-32 rounded-[28px] border-[6px] shadow-md transition-colors duration-300 flex items-center justify-center"
                  style={{ borderColor: selectedColor.strapHex }}
                >
                  {/* Capsule Screen */}
                  <div
                    className="w-10 h-24 rounded-2xl border-2 shadow-inner transition-colors duration-300 flex flex-col items-center justify-between p-2"
                    style={{
                      backgroundColor: selectedColor.caseHex,
                      borderColor: '#0F172A',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-white tracking-wider">
                      10:09
                    </span>
                    <div className="w-3 h-0.5 rounded-full bg-slate-600" />
                  </div>
                </div>
              </div>
            ) : product.modelType === 'watch_round' ? (
              // Round Watch Silhouette
              <div className="relative flex items-center justify-center">
                {/* Vertical Straps Top/Bottom */}
                <div
                  className="absolute w-8 h-36 rounded-md shadow-sm transition-colors duration-300 -z-0"
                  style={{ backgroundColor: selectedColor.strapHex }}
                />
                {/* Round Case Chassis */}
                <div
                  className="relative z-10 w-24 h-24 rounded-full border-4 shadow-lg transition-colors duration-300 flex items-center justify-center"
                  style={{
                    backgroundColor: selectedColor.caseHex,
                    borderColor: '#1E293B',
                  }}
                >
                  {/* Digital Crown dial on right */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-md bg-slate-400 border border-slate-600" />
                  {/* Inner Screen */}
                  <div className="w-18 h-18 rounded-full bg-slate-950 flex flex-col items-center justify-center p-2 text-center shadow-inner">
                    <span className="text-[10px] font-mono font-bold text-cyan-300">
                      10:09
                    </span>
                    <span className="text-[8px] font-sans text-purple-300">72 BPM</span>
                  </div>
                </div>
              </div>
            ) : (
              // Watch Squircle (Pro Max)
              <div className="relative flex items-center justify-center">
                {/* Rugged Strap */}
                <div
                  className="absolute w-10 h-36 rounded-lg shadow-sm transition-colors duration-300 -z-0"
                  style={{ backgroundColor: selectedColor.strapHex }}
                />
                {/* Squircle Titanium Case */}
                <div
                  className="relative z-10 w-24 h-28 rounded-2xl border-4 shadow-xl transition-colors duration-300 flex items-center justify-center"
                  style={{
                    backgroundColor: selectedColor.caseHex,
                    borderColor: '#334155',
                  }}
                >
                  <div className="absolute -right-2 top-6 w-2 h-5 rounded-r bg-amber-600 border border-slate-700" />
                  {/* Display Screen */}
                  <div className="w-18 h-22 rounded-xl bg-slate-950 flex flex-col items-center justify-between p-2 shadow-inner">
                    <div className="flex items-center justify-between w-full text-[8px] text-cyan-400 font-mono">
                      <span>49mm</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white tracking-wider">
                      10:09
                    </span>
                    <span className="text-[8px] font-semibold text-purple-300">
                      2000 NITS
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Color Name Pill */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-xs text-[10px] font-medium text-slate-700 whitespace-nowrap">
            {selectedColor.name}
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
          {product.tagline}
        </p>

        {/* Color Swatches */}
        <div className="mt-4 pt-3 border-t border-purple-100/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Finishes ({product.colors.length})
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {product.colors.map((color) => {
              const isSelected = selectedColor.id === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  aria-label={`Select color ${color.name}`}
                  aria-selected={isSelected}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-all relative flex items-center justify-center p-0.5 ${
                    isSelected
                      ? 'ring-2 ring-purple-600 ring-offset-2 scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && (
                    <Check className="w-3 h-3 text-white drop-shadow-md" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Specifications Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-slate-600 bg-white/60 rounded-xl p-2.5 border border-purple-100/50 text-[11px]">
          <div className="flex items-center gap-1.5 truncate">
            <Battery className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="truncate" title={product.specs.batteryLife}>
              {product.specs.batteryLife}
            </span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Droplets className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span className="truncate" title={product.specs.waterResistance}>
              {product.specs.waterResistance}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: 3D Studio & Add to Bag */}
      <div className="mt-5 pt-3 border-t border-purple-100/60 flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onPreview3D?.(product)}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>3D Studio</span>
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onAddToCart?.(product, selectedColor, product.defaultFace)}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-white" />
          <span>Add to Bag</span>
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
