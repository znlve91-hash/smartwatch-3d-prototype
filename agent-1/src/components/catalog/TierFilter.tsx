import React from 'react';
import type { ProductTier } from '../../types';

export interface TierFilterProps {
  activeTier: ProductTier | 'all';
  onSelectTier: (tier: ProductTier | 'all') => void;
  className?: string;
}

interface TierOption {
  id: ProductTier | 'all';
  label: string;
}

const TIER_OPTIONS: TierOption[] = [
  { id: 'all', label: 'All Tiers' },
  { id: 'standard', label: 'Standard' },
  { id: 'pro', label: 'Pro' },
  { id: 'pro_max', label: 'Pro Max' },
];

export const TierFilter: React.FC<TierFilterProps> = ({
  activeTier,
  onSelectTier,
  className = '',
}) => {
  return (
    <div
      role="group"
      aria-label="Filter by product tier"
      className={`inline-flex items-center p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-purple-100/80 shadow-sm gap-1 ${className}`}
    >
      {TIER_OPTIONS.map((option) => {
        const isActive = activeTier === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectTier(option.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 select-none ${
              isActive
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/25 scale-[1.02]'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default TierFilter;
