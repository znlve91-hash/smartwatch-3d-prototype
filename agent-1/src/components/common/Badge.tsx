import React from 'react';

export interface BadgeProps {
  variant?: 'purple' | 'cyan' | 'neutral' | 'success' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'purple',
  size = 'sm',
  children,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  }[size];

  const variantClasses = {
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60 font-semibold',
    cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-200/60 font-semibold',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/80 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold',
    outline: 'bg-transparent text-slate-600 border border-slate-200 font-medium',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full tracking-wide transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
