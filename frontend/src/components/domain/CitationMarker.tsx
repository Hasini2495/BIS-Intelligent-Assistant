
import { cn } from '@/lib/cn';

export function CitationMarker({
  index,
  onClick,
  className,
}: {
  index: number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center px-1.5 py-0.2 mx-0.5 rounded text-[11px] font-mono font-bold text-blue-700 bg-blue-100/70 hover:bg-blue-200 border border-blue-200 transition-colors select-none align-super cursor-pointer',
        className
      )}
      title={`Citation [${index}]`}
      aria-label={`Citation reference ${index}`}
    >
      [{index}]
    </button>
  );
}
