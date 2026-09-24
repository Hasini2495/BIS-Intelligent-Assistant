import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function StandardDetailPage() {
  const { standardId } = useParams();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <Link
          to="/standards"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Standards
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-slate-500">{standardId}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Product Safety Standard
              </h1>
              <p className="mt-3 text-slate-600">
                Demonstration standard detail page.
              </p>
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              Demo Data
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <FileText className="h-5 w-5 text-slate-600" />
              <h2 className="mt-3 font-semibold text-slate-900">
                Document Information
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Document metadata can be displayed here.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <ShieldCheck className="h-5 w-5 text-slate-600" />
              <h2 className="mt-3 font-semibold text-slate-900">
                Requirements
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Verified requirements will appear here when authoritative
                evidence is available.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}