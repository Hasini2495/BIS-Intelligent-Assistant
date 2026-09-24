import { ArrowRight, Bot, FileSearch, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              BIS Intelligent Assistant
            </p>
            <p className="text-xs text-slate-500">
              Standards & Services
            </p>
          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Demo Mode
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Bureau of Indian Standards
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Your intelligent assistant for BIS information
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Explore standards, certification, hallmarking, testing and BIS
            services through one unified assistant.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Bot className="h-4 w-4" />
              Ask BIS
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/standards"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FileSearch className="h-4 w-4" />
              Explore Standards
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <Link
            to="/assistant"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Bot className="h-6 w-6 text-slate-700" />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Ask BIS
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ask questions and explore BIS information through the assistant.
            </p>
          </Link>

          <Link
            to="/standards"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <FileSearch className="h-6 w-6 text-slate-700" />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Standards Explorer
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Browse and inspect standards using the available demo catalogue.
            </p>
          </Link>

          <Link
            to="/certification"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <ShieldCheck className="h-6 w-6 text-slate-700" />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Certification
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore certification-related information and services.
            </p>
          </Link>
        </div>

        {/* Demo notice */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-900">
            Demo data notice
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            This interface currently uses demonstration data. It is intended
            for guidance and prototype evaluation and should not be treated
            as an official BIS determination.
          </p>
        </div>
      </section>
    </div>
  );
}