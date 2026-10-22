import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'violet'
  | 'cyan'
  | 'softCyan'
  | 'sale'
  | 'neutral'
  | 'outline';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  ariaLabel?: string;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  default: {
    container: 'bg-purple-50 text-[#7C3AED] border border-purple-200/80',
    dot: 'bg-[#7C3AED]',
  },
  violet: {
    container: 'bg-purple-100 text-[#7C3AED] border border-purple-200 shadow-sm shadow-purple-500/10',
    dot: 'bg-[#7C3AED]',
  },
  cyan: {
    container: 'bg-cyan-100 text-[#06B6D4] border border-cyan-200 shadow-sm shadow-cyan-500/10',
    dot: 'bg-[#06B6D4]',
  },
  softCyan: {
    container: 'bg-[#E0F7FA] text-[#0891B2] border border-cyan-200/60',
    dot: 'bg-[#0891B2]',
  },
  sale: {
    container: 'bg-rose-100 text-rose-600 border border-rose-200 shadow-sm shadow-rose-500/10',
    dot: 'bg-rose-500',
  },
  neutral: {
    container: 'bg-slate-100 text-slate-700 border border-slate-200',
    dot: 'bg-slate-400',
  },
  outline: {
    container: 'bg-transparent text-[#7C3AED] border border-purple-300',
    dot: 'bg-[#7C3AED]',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1.5',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3.5 py-1.5 gap-2',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  ariaLabel,
}) => {
  const selectedVariant = variantStyles[variant] || variantStyles.default;
  const selectedSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      role={ariaLabel ? 'status' : undefined}
      aria-label={ariaLabel}
      className={`inline-flex items-center font-medium rounded-full transition-colors whitespace-nowrap ${selectedVariant.container} ${selectedSize} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2 items-center justify-center">
          {pulse && (
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${selectedVariant.dot}`}
            />
          )}
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${selectedVariant.dot}`} />
        </span>
      )}
      {children}
    </span>
  );
};
