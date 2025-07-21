'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary-600)] text-[var(--text-inverse)] hover:bg-[var(--color-primary-700)] focus-visible:ring-[var(--color-primary-500)]",
        destructive: "bg-[var(--color-error)] text-[var(--text-inverse)] hover:bg-red-700 focus-visible:ring-[var(--color-error)]",
        outline: "border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus-visible:ring-[var(--color-primary-500)]",
        secondary: "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] focus-visible:ring-[var(--color-gray-500)]",
        ghost: "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus-visible:ring-[var(--color-gray-500)]",
        link: "text-[var(--color-primary-600)] underline-offset-4 hover:underline focus-visible:ring-[var(--color-primary-500)]",
        success: "bg-[var(--color-success)] text-[var(--text-inverse)] hover:bg-[var(--color-primary-700)] focus-visible:ring-[var(--color-success)]",
        warning: "bg-[var(--color-warning)] text-[var(--text-inverse)] hover:bg-orange-700 focus-visible:ring-[var(--color-warning)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  customStyle?: React.CSSProperties;
  theme?: 'default' | 'custom';
  ref?: React.Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant, 
  size, 
  fullWidth,
  loading, 
  leftIcon, 
  rightIcon, 
  children, 
  disabled,
  customStyle,
  theme = 'default',
  style,
  ref,
  ...props 
}) => {
    const combinedStyle = theme === 'custom' 
      ? { ...customStyle, ...style }
      : style;

    const buttonClass = theme === 'custom'
      ? cn('custom-button', className)
      : cn(buttonVariants({ variant, size, fullWidth, className }));

    return (
      <button
        className={buttonClass}
        style={combinedStyle}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
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
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
};

Button.displayName = "Button";

export { Button, buttonVariants };