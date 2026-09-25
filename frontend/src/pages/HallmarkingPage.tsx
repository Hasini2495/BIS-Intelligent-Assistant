import { useState } from 'react';
import {
  CheckCircle2,
  QrCode,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { BisLogo } from '@/components/ui/BisLogo';
import { hallmarkingService, HallmarkingVerificationResult } from '@/services/hallmarkingService';

const GOLD_PURITY_GRADES = [
  { karat: '24K', fineness: '995', label: '24 Karat (99.5% Pure)', use: 'Investment gold bars and coins' },
  { karat: '23K', fineness: '958', label: '23 Karat (95.8% Pure)', use: 'Custom fine jewellery' },
  { karat: '22K', fineness: '916', label: '22 Karat (91.6% Pure)', use: 'Most common Indian bridal jewellery' },
  { karat: '20K', fineness: '833', label: '20 Karat (83.3% Pure)', use: 'Traditional studded jewellery' },
  { karat: '18K', fineness: '750', label: '18 Karat (75.0% Pure)', use: 'Diamond and gemstone studded jewellery' },
  { karat: '14K', fineness: '585', label: '14 Karat (58.5% Pure)', use: 'Contemporary everyday lightweight jewellery' },
];

export default function HallmarkingPage() {
  const [huidQuery, setHuidQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<HallmarkingVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);

  const handleVerifyHuid = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormatError(null);
    setVerificationResult(null);

    const query = huidQuery.trim().toUpperCase();
    if (!query) {
      setFormatError('Please enter a 6-character HUID number.');
      return;
    }

    if (query.length !== 6 || !/^[A-Z0-9]{6}$/.test(query)) {
      setFormatError('Invalid HUID format. HUID must be exactly 6 alphanumeric characters (e.g., BJ9281, AB1234).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await hallmarkingService.verifyHuid(query);
      setVerificationResult(res);
    } catch {
      setFormatError('Unable to connect to the Hallmarking verification service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Hallmarking of Precious Metals"
        description="Assurance of purity and fineness of gold and silver jewellery under the Bureau of Indian Standards Act, 2016."
        breadcrumbs={[
          { label: 'Certification & Services', href: '/certification' },
          { label: 'Hallmarking' },
        ]}
        actions={
          <Link
            to="/assistant?q=What%20is%20HUID%20in%20gold%20hallmarking%3F"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#E8850C]" />
            <span>Ask AI about Hallmarking</span>
          </Link>
        }
      />

      {/* 3 Components of BIS Hallmark Banner */}
      <div className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50/80 via-white to-amber-50/40 p-6 sm:p-7 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          3 Mandatory Marks on Genuine Hallmarked Gold Jewellery
        </h2>
        <p className="text-xs text-slate-600 mb-5">
          As per BIS guidelines, every piece of hallmarked gold jewellery sold in India must laser-engrave these three distinct symbols:
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Mark 1 */}
          <div className="rounded-xl border border-amber-200/80 bg-white p-4 shadow-2xs text-center flex flex-col items-center">
            <div className="h-14 flex items-center justify-center">
              <BisLogo variant="icon" size="md" />
            </div>
            <span className="text-xs font-bold text-slate-900 mt-2">1. BIS Standard Mark</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              The official triangle emblem of Bureau of Indian Standards
            </p>
          </div>

          {/* Mark 2 */}
          <div className="rounded-xl border border-amber-200/80 bg-white p-4 shadow-2xs text-center flex flex-col items-center">
            <div className="h-14 flex items-center justify-center font-black text-2xl text-amber-700 tracking-wide font-mono">
              22K916
            </div>
            <span className="text-xs font-bold text-slate-900 mt-2">2. Purity &amp; Fineness</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Specifies the exact karat and parts per thousand fineness
            </p>
          </div>

          {/* Mark 3 */}
          <div className="rounded-xl border border-amber-200/80 bg-white p-4 shadow-2xs text-center flex flex-col items-center">
            <div className="h-14 flex items-center justify-center font-mono font-bold text-lg text-slate-800 bg-slate-100 rounded-lg px-3 tracking-widest border border-dashed border-slate-300">
              BJ9281
            </div>
            <span className="text-xs font-bold text-slate-900 mt-2">3. 6-Digit HUID</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Unique Alphanumeric identification assigned by the assaying lab
            </p>
          </div>
        </div>
      </div>

      {/* Real HUID Verification */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Verify Hallmark (HUID) Online
            </h3>
            <p className="text-xs text-slate-500">
              Enter the 6-character laser-engraved HUID number to verify authenticity in the central registry (e.g. try sample <strong>BJ9281</strong> or <strong>KL4829</strong>).
            </p>
          </div>
        </div>

        {formatError && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <div>{formatError}</div>
          </div>
        )}

        <form onSubmit={handleVerifyHuid} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            maxLength={6}
            value={huidQuery}
            onChange={(e) => setHuidQuery(e.target.value.toUpperCase())}
            placeholder="e.g. BJ9281"
            className="h-11 w-full sm:w-80 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-mono uppercase tracking-widest text-slate-900 outline-none focus:border-[#063b73] focus:bg-white"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#063b73] px-6 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{isLoading ? 'Verifying Registry...' : 'Verify HUID'}</span>
          </button>
        </form>

        {verificationResult && (
          <div className="mt-5 space-y-3">
            {verificationResult.isOfficiallyVerified ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 text-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>Authentic BIS Hallmarked Article Verified</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-slate-700">
                  <div className="bg-white/80 rounded-lg p-2.5 border border-emerald-100">
                    <span className="text-[11px] text-slate-500 block">Article Type</span>
                    <strong className="text-slate-900">{verificationResult.articleType}</strong>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2.5 border border-emerald-100">
                    <span className="text-[11px] text-slate-500 block">Certified Purity &amp; Fineness</span>
                    <strong className="text-amber-800">{verificationResult.purity}</strong>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2.5 border border-emerald-100">
                    <span className="text-[11px] text-slate-500 block">Assaying &amp; Hallmarking Centre</span>
                    <span className="text-slate-800">{verificationResult.ahcCenter}</span>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2.5 border border-emerald-100">
                    <span className="text-[11px] text-slate-500 block">Certified Jeweller</span>
                    <span className="text-slate-800">{verificationResult.jewellerName}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Hallmarked On: {verificationResult.hallmarkingDate} • HUID: {verificationResult.huid}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs space-y-2 text-slate-700">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Valid HUID Format Recognized</span>
                </div>
                <p>{verificationResult.message}</p>
                <p className="text-[11px] text-slate-500">
                  HUID "{verificationResult.huid}" is syntactically valid per BIS IS 1417:2016. Direct verification records from offline AHCs are synced periodically.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gold Karat Purity Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Permissible Gold Hallmarking Standards &amp; Fineness
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GOLD_PURITY_GRADES.map((grade) => (
            <div
              key={grade.karat}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 hover:border-amber-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-amber-700">
                  {grade.karat}
                </span>
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs font-mono font-bold text-slate-700">
                  {grade.fineness}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-slate-800">{grade.label}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">{grade.use}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}