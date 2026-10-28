import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'outline' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const base =
    'inline-flex items-center text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full select-none';

  const variants = {
    default: 'bg-white/10 text-white border border-white/10',
    accent: 'bg-brand-accent/15 text-brand-accent border border-brand-accent/30',
    outline: 'bg-transparent text-brand-muted border border-brand-border',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))}>
      {children}
    </span>
  );
};

