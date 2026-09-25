import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  FileCheck2,
  Library,
  Search,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BisLogo } from '@/components/ui/BisLogo';

export default function WelcomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/assistant');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f4f8fc] via-white to-[#f4f8fc] flex flex-col font-sans">
      {/* Top Government Portal Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xs shadow-xs">
        {/* Tricolor National Identity Bar */}
        <div className="h-1 w-full bg-linear-to-r from-[#FF9933] via-white to-[#128807]" />

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Official BIS Identity */}
          <Link to="/" className="flex items-center gap-3">
            <BisLogo variant="full" size="md" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); navigate('/standards'); }}
              className="hover:text-[#063b73] transition-colors"
            >
              About BIS
            </a>
            <Link to="/certification" className="hover:text-[#063b73] transition-colors">
              Services
            </Link>
            <Link to="/documents" className="hover:text-[#063b73] transition-colors">
              Resources
            </Link>
            <Link to="/feedback" className="hover:text-[#063b73] transition-colors">
              Contact & Feedback
            </Link>
          </nav>

          {/* Auth Actions & Dashboard Access */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#063b73] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#0B4A8F] transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        {/* Sub-banner: SIH 2026 & National Vision */}
        <div className="border-b border-slate-200 bg-[#e7f1fb]/50 py-2.5 px-4 text-center">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 flex-wrap text-xs text-slate-700">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#063b73]">
              <Sparkles className="h-3.5 w-3.5 text-[#E8850C]" />
              An Initiative for Smart India Hackathon 2026
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="font-semibold text-slate-600">
              National Standards Formulation &amp; Conformity Assessment Platform
            </span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <BisLogo variant="icon" size="xl" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#063b73]">
            BIS AI ASSISTANT
          </h1>
          <p className="mt-4 text-base sm:text-xl font-medium text-slate-600 max-w-2xl mx-auto">
            Your Intelligent Guide to Indian Standards and BIS Services
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="mt-8 mx-auto max-w-2xl flex items-center rounded-2xl bg-white p-2 shadow-lg border border-slate-200/90 focus-within:border-[#063b73] focus-within:ring-3 focus-within:ring-blue-100 transition-all"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about Indian Standards (e.g., What is IS 456?)..."
                className="w-full bg-transparent pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-6 py-3 text-sm font-bold text-white hover:bg-[#0B4A8F] transition-all shadow-sm shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* 3 Large Action Cards (from Reference 01) */}
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3 text-left">
            {/* Card 1: Search Standards */}
            <Link
              to="/standards"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#063b73]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#063b73] group-hover:bg-[#063b73] group-hover:text-white transition-colors">
                  <Library className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-[#063b73] transition-colors">
                  Search Standards
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Find &amp; explore authoritative Indian Standards across civil, electrical, food, and chemical domains.
                </p>
              </div>
              <div className="mt-5 flex items-center text-xs font-bold text-[#063b73]">
                <span>Explore catalogue</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card 2: Compliance Validator */}
            <Link
              to="/compliance"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-600/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Compliance Validator
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Check product compliance against technical specifications, test reports, and mandatory clause requirements.
                </p>
              </div>
              <div className="mt-5 flex items-center text-xs font-bold text-emerald-700">
                <span>Start validation</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card 3: Certification & Services */}
            <Link
              to="/certification"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-amber-600/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition-colors">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Certification &amp; Services
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Explore ISI Mark, Hallmarking, CRS, FMCS, and NABL laboratory networks with complete procedural guidelines.
                </p>
              </div>
              <div className="mt-5 flex items-center text-xs font-bold text-amber-700">
                <span>Explore schemes</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* Quick jump to Dashboard for authenticated/evaluator users */}
          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
            >
              <span>Go to Assistant Workspace / Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stats Bar (from Reference 01) */}
        <div className="border-t border-b border-slate-200 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              <div className="pt-4 sm:pt-0">
                <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-[#063b73]">
                  <Award className="h-6 w-6 text-[#E8850C]" />
                  <span>25,000+</span>
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Standards Formulated
                </p>
              </div>

              <div className="pt-4 sm:pt-0">
                <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-[#063b73]">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  <span>1,00,000+</span>
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Documents &amp; Sources
                </p>
              </div>

              <div className="pt-4 sm:pt-0">
                <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-[#063b73]">
                  <Users className="h-6 w-6 text-[#063b73]" />
                  <span>Trusted Nationwide</span>
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quality Standards. Safer Products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Official Government Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          Bureau of Indian Standards (BIS) • Manak Bhawan, 9 Bahadur Shah Zafar Marg, New Delhi 110002
        </p>
        <p className="mt-1 text-slate-400">
          Smart India Hackathon 2026 Initiative • Smart Search. Trusted Information. Safer India.
        </p>
      </footer>
    </div>
  );
}
