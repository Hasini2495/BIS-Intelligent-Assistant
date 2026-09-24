import { Clock3, MessageSquare, Search } from 'lucide-react';

const history = [
  {
    id: 1,
    title: 'Standards information query',
    date: 'Today',
  },
  {
    id: 2,
    title: 'Certification information',
    date: 'Yesterday',
  },
  {
    id: 3,
    title: 'Testing laboratory search',
    date: 'Earlier',
  },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">History</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review your recent assistant activity.
        </p>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <span className="text-sm text-slate-400">
            Search conversation history...
          </span>
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <MessageSquare className="h-5 w-5 text-slate-600" />
              </div>

              <div className="flex-1">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.date}</p>
              </div>

              <Clock3 className="h-4 w-4 text-slate-400" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}