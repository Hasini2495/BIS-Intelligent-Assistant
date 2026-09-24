
import { FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Source } from '@/types/source';

export function SourceBadge({
  source,
  onClick,
  className,
}: {
  source: Source;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left',
        className
      )}
    >
      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
      <span className="truncate max-w-[200px]">{source.title || source.documentName}</span>
      {source.clause && <span className="text-slate-400 font-mono text-[11px]">Cl. {source.clause}</span>}
      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 ml-0.5" />
    </button>
  );
}
