import { FlaskConical, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const labs = [
  {
    id: 'demo-lab-1',
    name: 'Demonstration Testing Laboratory A',
    location: 'Demo Location',
  },
  {
    id: 'demo-lab-2',
    name: 'Demonstration Testing Laboratory B',
    location: 'Demo Location',
  },
];

export default function TestingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Testing & Labs
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Explore testing and laboratory information.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <span className="text-sm text-slate-400">
            Search laboratories...
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {labs.map((lab) => (
            <Link
              key={lab.id}
              to={`/testing/labs/${lab.id}`}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
            >
              <FlaskConical className="h-7 w-7 text-slate-700" />
              <h2 className="mt-4 font-semibold text-slate-900">
                {lab.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {lab.location}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}