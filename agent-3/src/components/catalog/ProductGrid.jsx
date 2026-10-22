/**
 * Responsive Product Catalog Grid Component
 * Renders Product Cards, Count Summary, and Filter Empty State
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React from 'react';
import { Sparkles, RotateCcw, Box } from 'lucide-react';
import { ProductCard } from './ProductCard.jsx';

export function ProductGrid({
  products = [],
  onAddToCart = () => {},
  onTryIn3D = () => {},
  onSelectProduct = () => {},
  onResetFilters = () => {},
  className = '',
}) {
  const count = products.length;

  return (
    <div className={`space-y-6 ${className}`} data-testid="product-grid">
      {/* Product Grid Header / Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Wearable Collection</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
            {count}
          </span>
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          {`Showing ${count} ${count === 1 ? 'Wearable' : 'Wearables'}`}
        </span>
      </div>

      {/* When Empty */}
      {count === 0 ? (
        <div className="py-20 px-6 rounded-3xl bg-white/70 backdrop-blur-md border border-purple-100 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
            <Box className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 text-base">
              No wearables found
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              We couldn't find any products matching your active category, tier, or search query.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        /* Responsive Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onTryIn3D={onTryIn3D}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
