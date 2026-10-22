/**
 * Reactive Segmented Filter Component for Categories & Tiers
 * Filter by All, Smart Bands, Smart Watches and Tiers (Standard, Pro, Pro Max)
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React from 'react';
import { Filter, SlidersHorizontal, Search, RotateCcw, Activity, Watch } from 'lucide-react';
import { TIERS, TIER_LABELS } from '../../data/products.js';

export function ProductFilter({
  activeCategory = 'all',
  onCategoryChange = () => {},
  activeTier = 'all',
  onTierChange = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  activeSort = 'featured',
  onSortChange = () => {},
  totalCount,
  onResetFilters,
  className = '',
}) {
  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'band', label: 'Smart Bands' },
    { id: 'watch', label: 'Smart Watches' },
  ];

  // Derive available tiers based on selected category
  const availableTiers = React.useMemo(() => {
    let tierKeys = [];
    if (activeCategory === 'band') {
      tierKeys = TIERS.band; // ['standard', 'pro']
    } else if (activeCategory === 'watch') {
      tierKeys = TIERS.watch; // ['standard', 'pro', 'pro_max']
    } else {
      // All
      tierKeys = ['standard', 'pro', 'pro_max'];
    }

    return [
      { id: 'all', label: 'All Tiers' },
      ...tierKeys.map((k) => ({
        id: k,
        label: TIER_LABELS[k] || k,
      })),
    ];
  }, [activeCategory]);

  const handleCategorySelect = (catId) => {
    onCategoryChange(catId);
    // If switching to band and active tier is pro_max, fallback to 'all'
    if (catId === 'band' && activeTier === 'pro_max') {
      onTierChange('all');
    }
  };

  const isFiltered = activeCategory !== 'all' || activeTier !== 'all' || (searchQuery && searchQuery.trim() !== '');

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      onCategoryChange('all');
      onTierChange('all');
      if (onSearchChange) onSearchChange('');
    }
  };

  return (
    <div
      className={`bg-white/80 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-purple-100 shadow-xs space-y-4 ${className}`}
      data-testid="product-filter"
    >
      {/* Top Filter Controls: Category Segmented Bar & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Quick Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-300 focus:outline-hidden transition-all text-slate-800"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={activeSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium py-2 pl-3 pr-8 rounded-xl focus:outline-hidden focus:border-purple-300 transition-all cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset all active filters"
              className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl border border-slate-200 transition-all shrink-0 flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Tier Segmented Pills Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Tier:</span>
          </span>
          {availableTiers.map((t) => {
            const isActive = activeTier === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTierChange(t.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {typeof totalCount === 'number' && (
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-semibold">{totalCount}</strong> wearables
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductFilter;
