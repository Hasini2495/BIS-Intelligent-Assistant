import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { EvidenceStatus } from '@/types/chat';

export function GroundednessBadge({
  status,
  className,
}: {
  status: EvidenceStatus;
  className?: string;
}) {
  if (status === 'grounded') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200',
          className
        )}
      >
        <ShieldCheck aria-hidden="true" focusable="false" className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Grounded in BIS Sources</span>
      </span>
    );
  }

  if (status === 'partially_grounded') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200',
          className
        )}
      >
        <ShieldCheck aria-hidden="true" focusable="false" className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>Partially Grounded</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200',
        className
      )}
    >
      <AlertTriangle aria-hidden="true" focusable="false" className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span>Insufficient BIS Evidence</span>
    </span>
  );
}
