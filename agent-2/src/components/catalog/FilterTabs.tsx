import React from 'react';
import { ProductCategory, ProductTier, Product } from '../../types';
import { formatTierName } from '../../utils/formatters';

export type AvailableTierOption = ProductTier | 'all';

export interface FilterCounts {
  total?: number;
  band?: number;
  watch?: number;
  standard?: number;
  pro?: number;
  pro_max?: number;
  [key: string]: number | undefined;
}

export interface FilterTabsProps {
  selectedCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
  selectedTier: AvailableTierOption;
  onTierChange: (tier: AvailableTierOption) => void;
  counts?: FilterCounts;
  className?: string;
}

/**
 * Returns available tiers for the selected category.
 * Band only supports standard and pro.
 * Watch supports standard, pro, and pro_max.
 * All supports all tiers.
 */
export function getAvailableTiersForCategory(category: ProductCategory | 'all'): AvailableTierOption[] {
  if (category === 'band') {
    return ['all', 'standard', 'pro'];
  }
  return ['all', 'standard', 'pro', 'pro_max'];
}

/**
 * Filters a list of products by category and hardware tier.
 */
export function filterProducts(
  productsList: Product[],
  category: ProductCategory | 'all',
  tier: AvailableTierOption
): Product[] {
  return productsList.filter((product) => {
    const matchCategory = category === 'all' || product.category === category;
    const matchTier = tier === 'all' || product.tier === tier;
    return matchCategory && matchTier;
  });
}

const CATEGORY_OPTIONS: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Devices' },
  { id: 'band', label: 'Fitness Bands' },
  { id: 'watch', label: 'Smart Watches' },
];

export const FilterTabs: React.FC<FilterTabsProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedTier,
  onTierChange,
  counts,
  className = '',
}) => {
  const availableTiers = getAvailableTiersForCategory(selectedCategory);

  const handleCategorySelect = (cat: ProductCategory | 'all') => {
    onCategoryChange(cat);
    // If the currently selected tier is not available in the new category, reset to 'all'
    const nextAvailableTiers = getAvailableTiersForCategory(cat);
    if (!nextAvailableTiers.includes(selectedTier)) {
      onTierChange('all');
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100/80 shadow-sm">
          {CATEGORY_OPTIONS.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const countValue = counts
              ? cat.id === 'all'
                ? counts.total
                : counts[cat.id]
              : undefined;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/60'
                }`}
              >
                <span>{cat.label}</span>
                {typeof countValue === 'number' && (
                  <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100/70 text-[#7C3AED]'
                    }`}
                  >
                    {countValue}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Available hardware tier quick filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100/80 shadow-sm">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Tier:
          </span>
          {availableTiers.map((t) => {
            const isTierActive = selectedTier === t;
            const tierLabel = t === 'all' ? 'All Tiers' : formatTierName(t);

            return (
              <button
                key={t}
                onClick={() => onTierChange(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 select-none ${
                  isTierActive
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-sm shadow-purple-500/20'
                    : 'text-slate-600 hover:text-[#7C3AED] hover:bg-purple-50/60'
                }`}
              >
                {tierLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
