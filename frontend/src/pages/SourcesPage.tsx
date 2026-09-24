import { ExternalLink, FileText, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const sources = [
  {
    id: 'demo-source-1',
    title: 'BIS Reference Document',
    type: 'Reference',
  },
  {
    id: 'demo-source-2',
    title: 'Standards Information Source',
    type: 'Standard',
  },
  {
    id: 'demo-source-3',
    title: 'Certification Reference',
    type: 'Certification',
  },
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Documents & Sources
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review the evidence and documents used by the assistant.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <span className="text-sm text-slate-400">
            Search documents and sources...
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {sources.map((source) => (
            <Link
              key={source.id}
              to={`/sources/${source.id}`}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-slate-900">
                  {source.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Source type: {source.type}
                </p>
              </div>

              <ExternalLink className="h-5 w-5 text-slate-400" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}