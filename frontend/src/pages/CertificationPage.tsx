import { Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const schemes = [
  {
    id: 'demo-scheme-1',
    title: 'Product Certification',
    description: 'Explore product certification information.',
  },
  {
    id: 'demo-scheme-2',
    title: 'Management System Certification',
    description: 'Explore management system certification information.',
  },
  {
    id: 'demo-scheme-3',
    title: 'Conformity Assessment',
    description: 'Explore conformity assessment information.',
  },
];

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Certification
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Explore certification schemes and related information.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-3">
          {schemes.map((scheme) => (
            <Link
              key={scheme.id}
              to={`/certification/${scheme.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
            >
              <Award className="h-7 w-7 text-slate-700" />
              <h2 className="mt-5 font-semibold text-slate-900">
                {scheme.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {scheme.description}
              </p>

              <div className="mt-5 flex items-center text-sm font-medium text-slate-700">
                View details
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}