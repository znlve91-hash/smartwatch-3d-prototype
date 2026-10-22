import React, { useState, useMemo } from 'react';
import type { Product, ProductCategory, ProductTier, ColorOption, WatchFaceId } from '../../types';
import { ProductCard } from './ProductCard';
import { TierFilter } from './TierFilter';
import { Button } from '../common/Button';
import { Search, SlidersHorizontal, Scale, ArrowUpDown, Sparkles, RotateCcw } from 'lucide-react';

export interface ProductCatalogProps {
  products?: Product[];
  onPreview3D?: (product: Product) => void;
  onAddToCart?: (product: Product, color: ColorOption, face: WatchFaceId) => void;
  onOpenCompare?: (category?: ProductCategory) => void;
}

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'rating';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products = [],
  onPreview3D,
  onAddToCart,
  onOpenCompare,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<ProductTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Tier filter
        if (selectedTier !== 'all' && product.tier !== selectedTier) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(query);
          const matchTagline = product.tagline.toLowerCase().includes(query);
          const matchDesc = product.description.toLowerCase().includes(query);
          const matchFeatures = product.features.some((f) => f.toLowerCase().includes(query));
          const matchSpecs =
            product.specs.caseMaterial.toLowerCase().includes(query) ||
            product.specs.display.toLowerCase().includes(query) ||
            product.specs.sensors.some((s) => s.toLowerCase().includes(query));

          if (!matchName && !matchTagline && !matchDesc && !matchFeatures && !matchSpecs) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'featured':
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [products, selectedCategory, selectedTier, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedTier('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="catalog" className="w-full py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-3 border border-purple-200/50">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Full Wearable Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Explore AURA Wearables
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-xl">
              Choose between featherweight active fitness bands and aerospace-grade sapphire smart watches with medical diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => onOpenCompare?.(selectedCategory === 'all' ? undefined : selectedCategory)}
              className="flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-purple-600" />
              <span>Compare All Models</span>
            </Button>
          </div>
        </div>

        {/* Filter Toolbar: Category Tabs, Search, Tier Filter, Sorting */}
        <div className="glass-card rounded-3xl p-4 sm:p-5 mb-8 border border-purple-100/70 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div
              role="tablist"
              aria-label="Filter products by category"
              className="inline-flex p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60"
            >
              <button
                role="tab"
                type="button"
                aria-selected={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all select-none ${
                  selectedCategory === 'all'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({products.length})
              </button>
              <button
                role="tab"
                type="button"
                aria-selected={selectedCategory === 'band'}
                onClick={() => setSelectedCategory('band')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all select-none ${
                  selectedCategory === 'band'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Smart Bands (2)
              </button>
              <button
                role="tab"
                type="button"
                aria-selected={selectedCategory === 'watch'}
                onClick={() => setSelectedCategory('watch')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all select-none ${
                  selectedCategory === 'watch'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Smart Watches (3)
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wearables, features, specs..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-slate-800 placeholder-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Sub-Filters: Tier Pills & Sort Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-purple-100/60">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tier:
              </span>
              <TierFilter activeTier={selectedTier} onSelectTier={setSelectedTier} />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label
                htmlFor="sort-select"
                className="text-xs font-semibold text-slate-500 flex items-center gap-1"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-purple-600" />
                <span>Sort by:</span>
              </label>
              <select
                id="sort-select"
                aria-label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer shadow-xs"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
          <span>
            Showing {filteredProducts.length} of {products.length} wearables
          </span>
          {(selectedCategory !== 'all' || selectedTier !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPreview3D={onPreview3D}
                onAddToCart={onAddToCart}
                onCompare={() => onOpenCompare?.(product.category)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="glass-card rounded-3xl p-12 text-center border border-purple-100 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No matching wearables found
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              No devices match your current filter selections. Try clearing your search term or selecting another tier.
            </p>
            <Button variant="primary" size="md" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
