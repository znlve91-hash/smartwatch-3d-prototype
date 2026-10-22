import React, { useState, useEffect } from 'react';
import type { Product, ProductCategory, ColorOption, WatchFaceId } from '../../types';
import { products } from '../../data/products';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { X, Sparkles, ShoppingBag, Check, Minus, ShieldCheck } from 'lucide-react';

export interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ProductCategory;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, color: ColorOption, face: WatchFaceId) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'watch',
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(initialCategory);

  // Sync initialCategory when opened
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const compareProducts = products.filter((p) => p.category === activeCategory);

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-white/95 backdrop-blur-2xl rounded-3xl border border-purple-200/80 shadow-2xl flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50/50 via-white to-cyan-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 id="compare-modal-title" className="text-lg font-bold text-slate-900">
                Wearable Hardware Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Side-by-side technical breakdown across chassis materials, displays, sensors, and endurance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Category Toggle inside Modal */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveCategory('band')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeCategory === 'band'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Smart Bands (2)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('watch')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeCategory === 'watch'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Smart Watches (3)
              </button>
            </div>

            <button
              type="button"
              aria-label="Close comparison"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Comparison Content Table */}
        <div className="overflow-x-auto overflow-y-auto p-6">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-purple-100">
                <th className="py-4 px-4 w-44 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Feature / Spec
                </th>
                {compareProducts.map((product) => (
                  <th key={product.id} className="py-4 px-4 align-top">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
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
                          <span className="text-[10px] text-cyan-700 font-bold uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {product.name}
                      </h4>
                      <p className="text-xl font-extrabold text-purple-700">
                        ${product.price}
                      </p>
                      <div className="pt-2 flex flex-col gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            onSelectProduct?.(product);
                            onClose();
                          }}
                        >
                          <Sparkles className="w-3 h-3 text-cyan-600" />
                          <span>Configure in 3D</span>
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            onAddToCart?.(product, product.colors[0], product.defaultFace);
                          }}
                        >
                          <ShoppingBag className="w-3 h-3 text-white" />
                          <span>Add to Bag</span>
                        </Button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 text-xs text-slate-700">
              {/* Display */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  Display
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 font-medium">
                    {p.specs.display}
                  </td>
                ))}
              </tr>

              {/* Case Material */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  Case Material
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4">
                    {p.specs.caseMaterial}
                  </td>
                ))}
              </tr>

              {/* Strap Material */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  Strap Material
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4">
                    {p.specs.strapMaterial}
                  </td>
                ))}
              </tr>

              {/* Battery Life */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  Battery Life
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 font-semibold text-purple-700">
                    {p.specs.batteryLife}
                  </td>
                ))}
              </tr>

              {/* Water Resistance */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  Water Resistance
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4">
                    {p.specs.waterResistance}
                  </td>
                ))}
              </tr>

              {/* Sensors */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  Sensors
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4">
                    <ul className="space-y-1">
                      {p.specs.sensors.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-cyan-600 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Connectivity */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  Connectivity
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4">
                    {p.specs.connectivity.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Weight & Dimensions */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  Weight & Size
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4">
                    {p.specs.weight} &bull; {p.specs.dimensions}
                  </td>
                ))}
              </tr>

              {/* Key Features */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  Key Highlights
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4">
                    <ul className="space-y-1">
                      {p.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Bottom Banner */}
        <div className="px-6 py-3 bg-purple-50/60 border-t border-purple-100 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2-Year International Warranty included on all wearable devices.</span>
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
