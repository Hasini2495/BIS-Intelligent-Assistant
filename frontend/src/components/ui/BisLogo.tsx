import React from 'react';
import { cn } from '@/lib/cn';

export interface BisLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'icon' | 'badge' | 'full' | 'header';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
}

export function BisLogo({
  variant = 'badge',
  size = 'md',
  inverted = false,
  className,
  ...props
}: BisLogoProps) {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  }[size];

  // The official BIS triangle mark
  const Emblem = (
    <svg
      viewBox="0 0 100 100"
      className={cn('shrink-0 select-none transition-transform', iconDimensions)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Outer rounded triangle */}
      <path
        d="M50 8 L90 78 A 8 8 0 0 1 83 90 L17 90 A 8 8 0 0 1 10 78 Z"
        fill={inverted ? '#FFFFFF' : '#0B3A75'}
      />
      {/* Inner stylized standards chevron structure */}
      <path
        d="M50 25 L73 68 L61 68 L50 47 L39 68 L27 68 Z"
        fill={inverted ? '#0B3A75' : '#FFFFFF'}
      />
      <circle
        cx="50"
        cy="76"
        r="5"
        fill={inverted ? '#0B3A75' : '#E8850C'}
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)} {...props}>
        {Emblem}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn('flex items-center gap-3.5', className)} {...props}>
        {Emblem}
        <div className="flex flex-col">
          <span
            className={cn(
              'font-semibold leading-tight font-indic',
              inverted ? 'text-blue-100' : 'text-[#063b73]',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg font-bold'
            )}
          >
            भारतीय मानक ब्यूरो
          </span>
          <span
            className={cn(
              'font-bold tracking-tight leading-tight',
              inverted ? 'text-white' : 'text-[#063b73]',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base font-extrabold',
              size === 'xl' && 'text-xl font-black'
            )}
          >
            Bureau of Indian Standards
          </span>
          <span
            className={cn(
              'text-[10px] tracking-wide font-medium',
              inverted ? 'text-blue-200/90' : 'text-slate-500'
            )}
          >
            Standards for a Better India
          </span>
        </div>
      </div>
    );
  }

  // Header / default badge variant
  return (
    <div className={cn('flex items-center gap-2.5', className)} {...props}>
      {Emblem}
      <div className="flex flex-col">
        <span
          className={cn(
            'font-bold tracking-tight leading-none',
            inverted ? 'text-white' : 'text-[#063b73]',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}
        >
          BIS AI ASSISTANT
        </span>
        <span
          className={cn(
            'text-[10px] leading-tight font-medium',
            inverted ? 'text-blue-200' : 'text-slate-500'
          )}
        >
          Smart Search. Trusted Info.
        </span>
      </div>
    </div>
  );
}
