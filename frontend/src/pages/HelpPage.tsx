import { CircleHelp, ExternalLink, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

export default function HelpPage() {
  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      <PageHeader
        title="Help & Support"
        description="Learn how to search Indian Standards, run automated compliance checks, and verify certifications."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Help & Support' },
        ]}
      />

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#063b73]">
              <CircleHelp className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-bold text-slate-900 text-base">
              Assistant User Guide
            </h2>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Understand grounded citations, how evidence snippets are mapped to clauses, and how to verify standard numbers.
            </p>
          </div>
          <Link
            to="/assistant"
            className="mt-5 text-xs font-bold text-[#063b73] hover:underline"
          >
            Launch AI Assistant →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-bold text-slate-900 text-base">
              Share Feedback
            </h2>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Report an incorrect standard citation, missing clause, or suggest features for upcoming iterations.
            </p>
          </div>
          <Link
            to="/feedback"
            className="mt-5 text-xs font-bold text-emerald-700 hover:underline"
          >
            Submit Feedback Form →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-bold text-slate-900 text-base">
              Trust &amp; Official Sources
            </h2>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Answers are extracted from official Gazette notifications and technical standards published by BIS.
            </p>
          </div>
          <a
            href="https://bis.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
          >
            <span>Official BIS Portal</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}