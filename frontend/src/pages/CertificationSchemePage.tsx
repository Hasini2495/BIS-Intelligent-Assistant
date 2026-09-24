import { ArrowLeft, Award, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function CertificationSchemePage() {
  const { schemeId } = useParams();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <Link
          to="/certification"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Certification
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Award className="h-8 w-8 text-slate-700" />

          <p className="mt-5 font-mono text-xs text-slate-500">{schemeId}</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Certification Scheme
          </h1>

          <p className="mt-3 text-slate-600">
            Demonstration certification scheme details.
          </p>

          <div className="mt-8 space-y-3">
            {[
              'Scheme overview',
              'Eligibility information',
              'Required documentation',
              'Assessment information',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg bg-slate-50 p-4"
              >
                <CheckCircle2 className="h-5 w-5 text-slate-600" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}