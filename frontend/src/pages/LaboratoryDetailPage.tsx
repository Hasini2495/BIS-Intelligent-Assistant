import { ArrowLeft, FlaskConical, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function LaboratoryDetailPage() {
  const { labId } = useParams();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <Link
          to="/testing"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Testing & Labs
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <FlaskConical className="h-8 w-8 text-slate-700" />

          <p className="mt-5 font-mono text-xs text-slate-500">{labId}</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Demonstration Testing Laboratory
          </h1>

          <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            Demo Location
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-900">
              Laboratory Information
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Authoritative laboratory details can be displayed here when
              verified source data is available.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}