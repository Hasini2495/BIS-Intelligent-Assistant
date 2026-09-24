import { FileSearch, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const standards = [
  {
    id: 'demo-001',
    number: 'BIS/DEMO/001',
    title: 'Product Safety Standard',
    category: 'Safety',
    status: 'Demo',
  },
  {
    id: 'demo-002',
    number: 'BIS/DEMO/002',
    title: 'Quality Requirements',
    category: 'Quality',
    status: 'Demo',
  },
  {
    id: 'demo-003',
    number: 'BIS/DEMO/003',
    title: 'Testing Requirements',
    category: 'Testing',
    status: 'Demo',
  },
];

export default function StandardsPage() {
  const [query, setQuery] = useState('');

  const filtered = standards.filter((item) =>
    `${item.number} ${item.title} ${item.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Standards Explorer
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Search and explore standards.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search standards..."
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((standard) => (
            <Link
              key={standard.id}
              to={`/standards/${standard.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <FileSearch className="h-5 w-5 text-slate-600" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {standard.number}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
                      {standard.status}
                    </span>
                  </div>

                  <h2 className="mt-2 font-semibold text-slate-900">
                    {standard.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Category: {standard.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="font-medium text-slate-900">
                No standards found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search term.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}