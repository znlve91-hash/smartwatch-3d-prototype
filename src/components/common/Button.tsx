import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'cyan'
  | 'outline'
  | 'ghost'
  | 'subtle';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 focus-visible:ring-purple-400',
  secondary:
    'bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-95 focus-visible:ring-slate-400',
  cyan:
    'bg-[#06B6D4] hover:bg-[#0891B2] text-white shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 focus-visible:ring-cyan-400',
  outline:
    'bg-white/80 hover:bg-purple-50 text-[#7C3AED] border border-purple-300 hover:border-[#7C3AED] shadow-sm active:scale-95 focus-visible:ring-purple-400',
  ghost:
    'bg-transparent hover:bg-purple-50/80 text-slate-700 hover:text-[#7C3AED] active:scale-95 focus-visible:ring-purple-300',
  subtle:
    'bg-purple-50 hover:bg-purple-100 text-[#7C3AED] active:scale-95 focus-visible:ring-purple-300',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'text-xs px-2.5 py-1 gap-1.5',
  sm: 'text-xs px-3.5 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-6 py-3 gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
  ...rest
}) => {
  const isDisabled = disabled || isLoading;
  const selectedVariant = variantStyles[variant] || variantStyles.primary;
  const selectedSize = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${selectedVariant} ${selectedSize} ${
        fullWidth ? 'w-full' : ''
      } ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="inline-flex shrink-0">{icon}</span>
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className="inline-flex shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};
