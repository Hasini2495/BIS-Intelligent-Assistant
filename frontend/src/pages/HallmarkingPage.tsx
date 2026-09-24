import { Gem, Info } from 'lucide-react';

export default function HallmarkingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">Hallmarking</h1>
        <p className="mt-1 text-sm text-slate-500">
          Explore hallmarking-related information.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <Gem className="h-6 w-6 text-slate-700" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            Hallmarking Information
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            This section can provide structured information about hallmarking,
            subject to authoritative BIS source availability.
          </p>

          <div className="mt-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <Info className="h-5 w-5 shrink-0 text-amber-700" />
            <p className="text-sm leading-6 text-amber-800">
              Demo interface. No official determination is made from this
              demonstration data.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}