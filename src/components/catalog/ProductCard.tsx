import React from 'react';
import {
  Battery,
  Droplets,
  Eye,
  Sparkles,
  Star,
  Check,
  ArrowLeftRight,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, formatRating, formatTierName } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useViewer } from '../../context/ViewerContext';

export interface ProductCardProps {
  product: Product;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
  disableCompare?: boolean;
  onPreviewIn3D?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

function useSafeViewer() {
  try {
    return useViewer();
  } catch {
    return null;
  }
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isCompared = false,
  onToggleCompare,
  disableCompare = false,
  onPreviewIn3D,
  onAddToCart,
  className = '',
}) => {
  const viewer = useSafeViewer();
  const isCurrentlyActiveInViewer = viewer?.selectedProductId === product.id;

  const handlePreviewIn3D = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (viewer?.setSelectedProductId) {
      viewer.setSelectedProductId(product.id);
    }
    if (onPreviewIn3D) {
      onPreviewIn3D(product);
    }
  };

  const handleToggleCompare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(product);
    }
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Determine badge style
  const getBadgeVariant = () => {
    if (product.badge === 'Sale') return 'sale';
    if (product.badge === 'Flagship') return 'violet';
    if (product.badge === 'Best Value') return 'softCyan';
    if (product.tier === 'pro_max') return 'violet';
    if (product.tier === 'pro') return 'cyan';
    return 'neutral';
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl bg-white/90 backdrop-blur-md border transition-all duration-300 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 ${
        isCurrentlyActiveInViewer
          ? 'border-[#7C3AED] ring-2 ring-purple-400/30'
          : 'border-purple-100/80 hover:border-purple-300'
      } ${className}`}
    >
      {/* Top Meta: Badges & Compare Toggle */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center flex-wrap gap-1.5">
          {product.badge && (
            <Badge variant={getBadgeVariant()} size="sm" dot>
              {product.badge}
            </Badge>
          )}
          <Badge variant="neutral" size="sm">
            {formatTierName(product.tier)}
          </Badge>
        </div>

        {/* Compare Checkbox / Button */}
        <button
          type="button"
          onClick={handleToggleCompare}
          disabled={disableCompare && !isCompared}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all select-none ${
            isCompared
              ? 'bg-[#7C3AED] text-white shadow-sm'
              : disableCompare
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
              : 'text-slate-500 hover:text-[#7C3AED] bg-purple-50/60 hover:bg-purple-100/80'
          }`}
          aria-label={isCompared ? `Remove ${product.name} from comparison` : `Compare ${product.name}`}
          aria-pressed={isCompared}
        >
          {isCompared ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Compared</span>
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Compare</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Product Showcase Placeholder / Active 3D Badge */}
      <div className="relative flex flex-col items-center justify-center py-6 px-4 mb-4 rounded-2xl bg-gradient-to-b from-[#F8F6FF] to-white/60 border border-purple-50 group-hover:border-purple-100 transition-colors">
        {/* Device Icon Graphic Representation */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-2">
          {/* Subtle glowing backdrop halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7C3AED]/10 to-[#06B6D4]/15 blur-lg group-hover:scale-110 transition-transform" />
          <div
            className={`relative flex items-center justify-center w-20 h-20 rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-105 ${
              product.category === 'band'
                ? 'w-12 h-20 rounded-full border-2 border-slate-700/60 bg-slate-900/90'
                : 'w-20 h-20 rounded-3xl border-2 border-slate-700/60 bg-slate-900/90'
            }`}
          >
            <div className="flex flex-col items-center text-center p-1">
              <span className="text-[10px] font-black tracking-widest text-[#06B6D4]">
                {product.category.toUpperCase()}
              </span>
              <span className="text-[9px] font-bold text-slate-300">
                {product.tier.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {isCurrentlyActiveInViewer && (
          <div className="absolute top-2 right-2">
            <Badge variant="violet" size="sm" dot pulse>
              Live in 3D
            </Badge>
          </div>
        )}

        {/* Rating and review counter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-bold text-slate-800">{formatRating(product.rating)}</span>
          <span className="text-slate-400">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Product Details Header */}
      <div className="flex flex-col mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed min-h-[32px]">
          {product.tagline}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-xl font-black text-slate-900">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs font-semibold line-through text-slate-400">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          {product.originalPrice && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              Save {formatCurrency(product.originalPrice - product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Key Spec Pills (Battery, Water Resistance, Display) */}
      <div className="grid grid-cols-1 gap-2 mb-4 p-3 rounded-2xl bg-purple-50/40 border border-purple-100/50 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="font-medium text-slate-800 truncate" title={product.specs.display}>
            {product.specs.display}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <Battery className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
            <span className="truncate">{product.specs.batteryLife}</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-700 shrink-0 font-medium">
            <Droplets className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>{product.specs.waterResistance}</span>
          </div>
        </div>
      </div>

      {/* Color Swatches (Chassis & Straps) */}
      <div className="flex items-center justify-between gap-2 mb-5 px-1 py-1 text-xs">
        {/* Chassis swatches */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400">Chassis:</span>
          <div className="flex items-center -space-x-1">
            {product.chassisColors.map((color) => (
              <span
                key={color.id}
                title={`${color.name} (${color.hex})`}
                className="inline-block w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200 transition-transform hover:scale-125 hover:z-10"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Strap swatches */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400">Straps:</span>
          <div className="flex items-center -space-x-1">
            {product.strapColors.map((color) => (
              <span
                key={color.id}
                title={`${color.name} (${color.hex})`}
                className="inline-block w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200 transition-transform hover:scale-125 hover:z-10"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions: Preview in 3D & Quick Add */}
      <div className="flex items-center gap-2 pt-2 border-t border-purple-100/60">
        <Button
          onClick={handlePreviewIn3D}
          variant={isCurrentlyActiveInViewer ? 'cyan' : 'primary'}
          size="sm"
          fullWidth
          icon={isCurrentlyActiveInViewer ? <CheckCircle2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          className="shadow-sm"
        >
          {isCurrentlyActiveInViewer ? 'Viewing in 3D' : 'Preview in 3D'}
        </Button>

        {onAddToCart && (
          <Button
            onClick={handleAddToCart}
            variant="outline"
            size="sm"
            aria-label={`Add ${product.name} to cart`}
            className="px-3"
          >
            Add
          </Button>
        )}
      </div>
    </div>
  );
};
