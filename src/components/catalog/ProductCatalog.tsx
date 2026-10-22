import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, X, Sparkles, Filter, Layers } from 'lucide-react';
import { ProductCategory, Product } from '../../types';
import { PRODUCTS } from '../../data/products';
import { FilterTabs, filterProducts, AvailableTierOption } from './FilterTabs';
import { ProductCard } from './ProductCard';
import { ComparisonModal } from './ComparisonModal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useViewer } from '../../context/ViewerContext';

export interface ProductCatalogProps {
  onPreviewIn3D?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  initialCategory?: ProductCategory | 'all';
  initialTier?: AvailableTierOption;
  className?: string;
}

function useSafeViewer() {
  try {
    return useViewer();
  } catch {
    return null;
  }
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onPreviewIn3D,
  onAddToCart,
  initialCategory = 'all',
  initialTier = 'all',
  className = '',
}) => {
  const viewer = useSafeViewer();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(
    initialCategory
  );
  const [selectedTier, setSelectedTier] = useState<AvailableTierOption>(initialTier);

  // Comparison state (up to 3 product IDs)
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return filterProducts(PRODUCTS, selectedCategory, selectedTier);
  }, [selectedCategory, selectedTier]);

  // Dynamic device counts for filter badges
  const counts = useMemo(() => {
    const total = PRODUCTS.length;
    const band = PRODUCTS.filter((p) => p.category === 'band').length;
    const watch = PRODUCTS.filter((p) => p.category === 'watch').length;
    return { total, band, watch };
  }, []);

  // Comparison toggle handler
  const handleToggleCompare = (product: Product) => {
    setComparedProductIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      if (prev.length >= 3) {
        // Limit to 3 items
        return prev;
      }
      return [...prev, product.id];
    });
  };

  const handleRemoveCompared = (productId: string) => {
    setComparedProductIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleClearCompared = () => {
    setComparedProductIds([]);
  };

  const comparedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => comparedProductIds.includes(p.id));
  }, [comparedProductIds]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedTier('all');
  };

  const handlePreview = (product: Product) => {
    if (viewer?.setSelectedProductId) {
      viewer.setSelectedProductId(product.id);
    }
    if (onPreviewIn3D) {
      onPreviewIn3D(product);
    }
  };

  return (
    <section id="catalog" className={`w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="violet" size="sm" dot>
              Hardware Catalog
            </Badge>
            <span className="text-xs text-slate-400 font-medium">5 Distinct Tiers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Explore All Models
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Choose from sleek fitness trackers to rugged 100m expedition smartwatches. Preview each in interactive 3D studio.
          </p>
        </div>

        {/* Quick Compare Indicator if items selected */}
        {comparedProductIds.length > 0 && (
          <Button
            onClick={() => setIsCompareModalOpen(true)}
            variant="outline"
            size="sm"
            icon={<ArrowLeftRight className="w-4 h-4 text-[#7C3AED]" />}
          >
            {`Compare (${comparedProductIds.length}/3)`}
          </Button>
        )}
      </div>

      {/* Filter Tabs Bar */}
      <div className="mb-8">
        <FilterTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
          counts={counts}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/70 backdrop-blur-md rounded-3xl border border-purple-100 my-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No devices found</h3>
          <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
            No devices currently match your selected filters. Try broadening your category or tier selection.
          </p>
          <Button onClick={handleResetFilters} variant="primary" size="sm">
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const isCompared = comparedProductIds.includes(product.id);
            const disableCompare = comparedProductIds.length >= 3 && !isCompared;

            return (
              <ProductCard
                key={product.id}
                product={product}
                isCompared={isCompared}
                disableCompare={disableCompare}
                onToggleCompare={handleToggleCompare}
                onPreviewIn3D={handlePreview}
                onAddToCart={onAddToCart}
              />
            );
          })}
        </div>
      )}

      {/* Floating Comparison Bottom Dock */}
      {comparedProductIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-white/95 backdrop-blur-md border border-purple-200/80 rounded-full shadow-2xl p-2.5 sm:px-4 sm:py-3 animate-in slide-in-from-bottom duration-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-700 hidden sm:inline whitespace-nowrap">
              Compare:
            </span>
            {comparedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-medium text-slate-800 shrink-0"
              >
                <span className="truncate max-w-[120px]">{p.name}</span>
                <button
                  onClick={() => handleRemoveCompared(p.id)}
                  className="text-slate-400 hover:text-rose-500 p-0.5 rounded-full"
                  aria-label={`Remove ${p.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClearCompared}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Clear
            </button>
            <Button
              onClick={() => setIsCompareModalOpen(true)}
              variant="primary"
              size="sm"
              icon={<ArrowLeftRight className="w-3.5 h-3.5" />}
            >
              {`Compare (${comparedProductIds.length}/3)`}
            </Button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={comparedProducts}
        onRemoveProduct={handleRemoveCompared}
        onClearAll={handleClearCompared}
        onPreviewIn3D={(id) => {
          setIsCompareModalOpen(false);
          const p = PRODUCTS.find((x) => x.id === id);
          if (p) handlePreview(p);
        }}
      />
    </section>
  );
};
