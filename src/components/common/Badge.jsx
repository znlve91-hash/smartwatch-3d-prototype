/**
 * Reusable Badge Component for Wearable Categories, Tiers, and Status Indicators
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React from 'react';
import { TIER_LABELS } from '../../data/products.js';

export function Badge({
  category,
  tier,
  variant = 'combined',
  size = 'sm',
  children,
  className = '',
}) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 tracking-normal',
  };

  const getTierTheme = (t) => {
    switch (t) {
      case 'pro_max':
        return 'bg-gradient-to-r from-purple-100 via-purple-50 to-indigo-100 text-purple-900 border-purple-300/80 shadow-xs';
      case 'pro':
        return 'bg-cyan-50 text-cyan-900 border-cyan-200/90';
      case 'standard':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  let content = children;
  let variantClasses = '';

  if (variant === 'category') {
    content = children || (category === 'band' ? 'Smart Band' : 'Smart Watch');
    variantClasses = 'bg-purple-50 text-purple-800 border-purple-200/70 font-semibold';
  } else if (variant === 'tier') {
    const label = TIER_LABELS[tier] || tier || 'Standard';
    content = children || label;
    variantClasses = `${getTierTheme(tier)} font-semibold`;
  } else if (variant === 'combined') {
    const catLabel = category === 'band' ? 'BAND' : category === 'watch' ? 'WATCH' : (category || '').toUpperCase();
    const tierLabel = (TIER_LABELS[tier] || tier || 'STANDARD').toUpperCase();
    content = children || `${catLabel} • ${tierLabel}`;
    variantClasses = `${getTierTheme(tier)} font-bold`;
  } else if (variant === 'sale') {
    variantClasses = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
  } else if (variant === 'status') {
    variantClasses = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent font-semibold shadow-xs';
  } else {
    variantClasses = 'bg-white/80 text-slate-700 border-slate-200 font-medium';
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-medium uppercase rounded-full border transition-all ${sizeClasses[size] || sizeClasses.sm} ${variantClasses} ${className}`}
    >
      {content}
    </span>
  );
}

export default Badge;
