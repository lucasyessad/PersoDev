'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

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
            className={[
              'w-full h-11 px-3.5 py-2.5 rounded-md border text-body-md bg-white',
              'placeholder:text-neutral-400 text-neutral-900',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-600',
              'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
              hasError
                ? 'border-error-600 focus:ring-error-100'
                : 'border-neutral-300 hover:border-neutral-400',
              Icon || prefix ? 'pl-10' : '',
              IconRight ? 'pr-10' : '',
              prefix ? 'pl-14' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {IconRight && (
            <IconRight className="absolute right-3.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          )}
        </div>
        {(error || helper) && (
          <p className={['text-caption', hasError ? 'text-error-600' : 'text-neutral-500'].join(' ')}>
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
          className={[
            'w-full min-h-[120px] px-3.5 py-2.5 rounded-md border text-body-md bg-white',
            'placeholder:text-neutral-400 text-neutral-900 resize-vertical',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-3 focus:ring-primary-100 focus:border-primary-600',
            'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
            hasError
              ? 'border-error-600 focus:ring-error-100'
              : 'border-neutral-300 hover:border-neutral-400',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {(error || helper) && (
          <p className={['text-caption', hasError ? 'text-error-600' : 'text-neutral-500'].join(' ')}>
            {error ?? helper}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
