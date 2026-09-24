import { CircleHelp, MessageCircle, ShieldCheck } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">Help & Support</h1>
        <p className="mt-1 text-sm text-slate-500">
          Learn how to use the BIS Intelligent Assistant.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <CircleHelp className="h-7 w-7 text-slate-700" />
            <h2 className="mt-4 font-semibold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Find answers about using the assistant and exploring BIS data.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <MessageCircle className="h-7 w-7 text-slate-700" />
            <h2 className="mt-4 font-semibold text-slate-900">
              Feedback
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Share feedback about your experience with the application.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ShieldCheck className="h-7 w-7 text-slate-700" />
            <h2 className="mt-4 font-semibold text-slate-900">
              Trust & Sources
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Answers should be supported by available authoritative evidence.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}