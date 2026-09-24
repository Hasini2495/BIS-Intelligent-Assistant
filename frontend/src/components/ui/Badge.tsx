import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium rounded-full px-2.5 py-0.5 text-xs transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700 border border-slate-200',
        primary: 'bg-blue-50 text-blue-700 border border-blue-200',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        danger: 'bg-rose-50 text-rose-700 border border-rose-200',
        info: 'bg-sky-50 text-sky-700 border border-sky-200',
        navy: 'bg-[#14367A] text-white border border-[#0F2A5E]',
        purple: 'bg-purple-50 text-purple-700 border border-purple-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-0.5',
            variant === 'success' && 'bg-emerald-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'danger' && 'bg-rose-500',
            variant === 'primary' && 'bg-blue-500',
            variant === 'default' && 'bg-slate-400',
            (!variant || variant === 'info') && 'bg-sky-500'
          )}
        />
      )}
      {children}
    </div>
  );
}
