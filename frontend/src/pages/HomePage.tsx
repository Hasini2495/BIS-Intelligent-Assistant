import {
  ArrowRight,
  Bell,
  Bookmark,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileCheck2,
  Library,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { DemoDataBanner } from '@/components/domain/DemoDataBanner';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Demo notice banner */}
      <DemoDataBanner />

      {/* Page Header (Reference Screen 04) */}
      <PageHeader
        title="Welcome back, Pavan!"
        description="Here's your activity overview across Indian Standards, compliance validations, and BIS services."
        badge={
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#063b73] border border-blue-200">
            Student / Researcher Mode
          </span>
        }
        actions={
          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all"
          >
            <Sparkles className="h-4 w-4 text-[#E8850C]" />
            <span>Launch Assistant</span>
          </Link>
        }
      />

      {/* 4 Summary Stat Cards (Reference Screen 04) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Card 1: Recent Questions */}
        <Link
          to="/history"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Recent Questions</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063b73] group-hover:scale-110 transition-transform">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">12</span>
            <span className="text-[10px] font-semibold text-emerald-600">+3 this week</span>
          </div>
        </Link>

        {/* Card 2: Saved Standards */}
        <Link
          to="/bookmarks"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saved Standards</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform">
              <Bookmark className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">8</span>
            <span className="text-[10px] font-semibold text-slate-400">Bookmarked</span>
          </div>
        </Link>

        {/* Card 3: Validations */}
        <Link
          to="/compliance"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Validations</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 group-hover:scale-110 transition-transform">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">4</span>
            <span className="text-[10px] font-semibold text-emerald-600">3 Compliant</span>
          </div>
        </Link>

        {/* Card 4: Notifications */}
        <Link
          to="/notifications"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Notifications</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
              <Bell className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">3</span>
            <span className="text-[10px] font-semibold text-amber-600">Unread</span>
          </div>
        </Link>
      </div>

      {/* Quick Actions (Reference Screen 04) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => navigate('/assistant')}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-[#063b73] hover:shadow-sm transition-all text-left group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#063b73] group-hover:bg-[#063b73] group-hover:text-white transition-colors">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Ask AI Assistant
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Instant guidance
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/standards')}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-[#063b73] hover:shadow-sm transition-all text-left group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#063b73] group-hover:bg-[#063b73] group-hover:text-white transition-colors">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Search Standards
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Explore catalogue
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/compliance')}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-emerald-600 hover:shadow-sm transition-all text-left group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Validate Compliance
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Check product specs
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/certification')}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-amber-600 hover:shadow-sm transition-all text-left group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Explore Services
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ISI Mark &amp; Hallmark
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Lower Split Section: Recent Activity & Announcements (Reference Screen 04) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Activity
              </h3>
              <Link
                to="/history"
                className="inline-flex items-center text-xs font-semibold text-[#063b73] hover:underline"
              >
                <span>View all</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#063b73]">
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Search: Electric Vehicles
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Standards Search
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  3 hours ago
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Validation: LED Bulb (9W)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      IS 16102 (Part 1):2012
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Yesterday
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Viewed: IS 456:2000
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Plain and Reinforced Concrete
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  2 days ago
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/history"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#063b73]"
            >
              <span>Review your full search &amp; chat history</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Announcements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Announcements &amp; Bulletins
              </h3>
              <Link
                to="/notifications"
                className="inline-flex items-center text-xs font-semibold text-[#063b73] hover:underline"
              >
                <span>All notices</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#063b73]">
                    New Standard Edition
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="h-3 w-3" />
                    20 Sep 2026
                  </span>
                </div>
                <h4 className="mt-1.5 text-xs font-bold text-slate-900">
                  New edition of IS 875 (Part 1) published
                </h4>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                  Code of Practice for Design Loads (Dead Loads) revised with updated unit weights of modern construction materials.
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    Hackathon Milestone
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="h-3 w-3" />
                    18 Sep 2026
                  </span>
                </div>
                <h4 className="mt-1.5 text-xs font-bold text-slate-900">
                  Smart India Hackathon 2026 submissions open
                </h4>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                  BIS Intelligent Assistant evaluation round begins. Verify mock pipelines and groundedness evaluation criteria.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/notifications"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#063b73]"
            >
              <span>View all circulars and regulatory updates</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}