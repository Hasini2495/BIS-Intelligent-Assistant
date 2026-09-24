
import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from 'react-i18next';

export function DemoDataBanner({ className }: { className?: string }) {
  const { t } = useTranslation('common');

  return (
    <div
      className={cn(
        'w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-800 flex items-center justify-between gap-2',
        className
      )}
      role="alert"
    >
      <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="font-semibold">{t('demo.banner', 'Demo Environment')}:</span>
        <span className="text-amber-700">
          {t('demo.notice', 'Demonstration data for SIH 2026. Official BIS decisions and certifications require direct verification from the official BIS portal.')}
        </span>
      </div>
    </div>
  );
}
