import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface StandardNumberProps {
  number: string;
  className?: string;
  copyable?: boolean;
}

export function StandardNumber({ number, className, copyable = true }: StandardNumberProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono font-bold tracking-tight text-slate-900 tabular-nums',
        className
      )}
    >
      <span>{number}</span>
      {copyable && (
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded-sm transition-colors"
          title="Copy standard number"
          aria-label={`Copy standard number ${number}`}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
    </span>
  );
}
