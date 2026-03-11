import { HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'premium' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  error:   'bg-error-100 text-error-600',
  premium: 'bg-accent-100 text-accent-600',
  info:    'bg-info-100 text-info-600',
};

export function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps & { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={[
        'inline-flex items-center h-[26px] px-2.5 rounded-full text-caption font-semibold whitespace-nowrap',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
