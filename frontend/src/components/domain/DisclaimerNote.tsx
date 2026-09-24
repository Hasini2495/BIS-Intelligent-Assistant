
import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from 'react-i18next';

export function DisclaimerNote({ className }: { className?: string }) {
  const { t } = useTranslation('common');

  return (
    <div
      className={cn(
        'rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-slate-600 flex items-start gap-3',
        className
      )}
    >
      <ShieldAlert className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold text-slate-800">
          {t('disclaimer.title', 'Official Notice & Guidance Disclaimer')}
        </p>
        <p className="text-slate-600 leading-relaxed">
          {t(
            'disclaimer.guidance',
            'This assistant provides informational guidance only and does not represent an official legal certification or binding determination by the Bureau of Indian Standards (BIS). For official licensing, certification, or legal conformity, please visit manakonline.in or bis.gov.in.'
          )}
        </p>
      </div>
    </div>
  );
}
