import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60';

    const variants = {
      primary:
        'bg-brand-accent text-white hover:bg-brand-accent-hover shadow-sm border border-brand-accent/20',
      secondary:
        'bg-white text-brand-text hover:bg-brand-bg border border-brand-border shadow-sm',
      outline:
        'bg-transparent text-brand-text border border-brand-border hover:border-brand-text hover:bg-brand-bg',
      ghost:
        'bg-transparent text-brand-muted hover:text-brand-text hover:bg-brand-bg',
      danger:
        'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-red-500/20',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs rounded-full gap-1.5',
      md: 'px-5 py-2.5 text-xs rounded-full gap-2 font-bold tracking-wider uppercase',
      lg: 'px-7 py-3.5 text-xs sm:text-sm rounded-full gap-2.5 font-bold tracking-widest uppercase',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(baseStyles, variants[variant], sizes[size], className)
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
