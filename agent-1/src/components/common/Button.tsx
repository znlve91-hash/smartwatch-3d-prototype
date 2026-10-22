import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-base px-6 py-3 rounded-2xl gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/25 hover:from-purple-700 hover:to-indigo-700 hover:shadow-md hover:shadow-purple-500/35 border border-purple-500/20',
    secondary:
      'bg-purple-50 text-purple-700 border border-purple-200/60 hover:bg-purple-100 hover:border-purple-300',
    outline:
      'border border-slate-200 bg-white/70 text-slate-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/50 backdrop-blur-sm',
    ghost:
      'text-slate-600 hover:text-purple-700 hover:bg-purple-50/80',
    pill:
      'rounded-full px-4 py-1.5 text-xs font-semibold bg-white/90 text-slate-700 border border-slate-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/60 shadow-sm',
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
