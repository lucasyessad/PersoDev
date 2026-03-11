'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'premium';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-white text-neutral-900 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50',
  ghost:     'bg-transparent text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100',
  danger:    'bg-error-600 text-white hover:bg-red-700 active:bg-red-800',
  premium:   'bg-primary-900 text-accent-400 hover:bg-primary-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-body-sm font-semibold rounded-md',
  md: 'h-11 px-5 text-body-md font-semibold rounded-md',
  lg: 'h-13 px-7 text-body-md font-semibold rounded-md',
  xl: 'h-14 px-8 text-heading-sm font-semibold rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center gap-2 transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-200 focus-visible:ring-offset-1',
          'active:scale-[0.98]',
          variantClasses[variant],
          sizeClasses[size],
          isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
