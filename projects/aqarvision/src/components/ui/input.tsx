'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Text Input ─────────────────────────────────── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error, icon: Icon, iconRight: IconRight, prefix, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3.5 text-body-sm text-neutral-500 select-none pointer-events-none">
              {prefix}
            </span>
          )}
          {Icon && !prefix && (
            <Icon className="absolute left-3.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex h-11 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm',
              'placeholder:text-muted-foreground text-neutral-900',
              'transition-colors duration-150',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100',
              hasError
                ? 'border-error-600 focus-visible:ring-error-100'
                : 'border-input hover:border-neutral-400',
              (Icon || prefix) && 'pl-10',
              IconRight && 'pr-10',
              prefix && 'pl-14',
              className,
            )}
            {...props}
          />
          {IconRight && (
            <IconRight className="absolute right-3.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          )}
        </div>
        {(error || helper) && (
          <p className={cn('text-caption', hasError ? 'text-error-600' : 'text-neutral-500')}>
            {error ?? helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/* ─── Textarea ───────────────────────────────────── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helper, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full min-h-[120px] px-3.5 py-2.5 rounded-lg border text-sm bg-white',
            'placeholder:text-muted-foreground text-neutral-900 resize-vertical',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100',
            hasError
              ? 'border-error-600 focus-visible:ring-error-100'
              : 'border-input hover:border-neutral-400',
            className,
          )}
          {...props}
        />
        {(error || helper) && (
          <p className={cn('text-caption', hasError ? 'text-error-600' : 'text-neutral-500')}>
            {error ?? helper}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
