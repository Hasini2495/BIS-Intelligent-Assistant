import {
  ArrowUpRight,
  Clock,
  FileText,
  MessageSquare,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Page Header (Screen 18) */}
      <PageHeader
        title="Admin Dashboard"
        description="System overview, document ingestion queue, and user activity analytics."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Dashboard' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/knowledge-base"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              Knowledge Base
            </Link>
            <Link
              to="/admin/analytics"
              className="rounded-xl bg-[#063b73] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F] shadow-xs"
            >
              Usage Analytics
            </Link>
          </div>
        }
      />

      {/* 4 Admin Stat Cards (Reference Screen 18) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#063b73]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">124</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              +14% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Active participants</p>
        </div>

        {/* Documents */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Documents</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">1,250</span>
            <span className="text-[10px] font-bold text-slate-400">Indexed</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Standards &amp; manuals</p>
        </div>

        {/* Ingestion Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ingestion Queue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">56</span>
            <span className="text-[10px] font-bold text-amber-600">Pending</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Vector chunking pipeline</p>
        </div>

        {/* Open Feedback */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Open Feedback</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">23</span>
            <span className="text-[10px] font-bold text-slate-400">Tickets</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">User accuracy reports</p>
        </div>
      </div>

      {/* 3 Visualizations (Reference Screen 18) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Growth Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">User Growth</h3>
            <p className="text-xs text-slate-500 mt-0.5">Platform adoption trend</p>
          </div>

          {/* SVG Line / Area chart */}
          <div className="my-6">
            <svg viewBox="0 0 300 120" className="w-full h-28 overflow-visible">
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#063b73" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#063b73" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Gridlines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              {/* Area */}
              <polygon
                points="0,110 0,95 60,80 120,70 180,45 240,35 300,15 300,110"
                fill="url(#growthGradient)"
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke="#063b73"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,95 60,80 120,70 180,45 240,35 300,15"
              />
              {/* Points */}
              <circle cx="180" cy="45" r="3.5" fill="#E8850C" />
              <circle cx="300" cy="15" r="4" fill="#063b73" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            Active verified users increased by <strong>+32%</strong> over the past quarter.
          </div>
        </div>

        {/* Top Queries Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Top Queries</h3>
            <p className="text-xs text-slate-500 mt-0.5">Most searched topics &amp; standards</p>
          </div>

          {/* SVG Bar Chart */}
          <div className="my-6">
            <svg viewBox="0 0 300 120" className="w-full h-28 overflow-visible">
              {/* Bars */}
              <rect x="20" y="20" width="28" height="90" rx="4" fill="#063b73" />
              <rect x="80" y="40" width="28" height="70" rx="4" fill="#1E63C4" />
              <rect x="140" y="30" width="28" height="80" rx="4" fill="#0E7A3C" />
              <rect x="200" y="55" width="28" height="55" rx="4" fill="#E8850C" />
              <rect x="260" y="65" width="28" height="45" rx="4" fill="#6D28D9" />
              {/* Baseline */}
              <line x1="0" y1="110" x2="300" y2="110" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold px-2 mt-1">
              <span>Concrete</span>
              <span>Water</span>
              <span>LED/CRS</span>
              <span>Gold</span>
              <span>Pipes</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            <strong>IS 456 (Concrete)</strong> leads query volume with 420 requests.
          </div>
        </div>

        {/* Document Status Donut Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Document Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">RAG Knowledge Ingestion</p>
          </div>

          <div className="my-4 flex items-center justify-center">
            {/* SVG Donut */}
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 36 36" className="transform -rotate-90">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                {/* Indexed: 78% (emerald) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#0E7A3C"
                  strokeWidth="4"
                  strokeDasharray="68.6 100"
                  strokeDashoffset="0"
                />
                {/* Processing: 14% (blue) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#063b73"
                  strokeWidth="4"
                  strokeDasharray="12.3 100"
                  strokeDashoffset="-68.6"
                />
                {/* Failed: 8% (red) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#dc2626"
                  strokeWidth="4"
                  strokeDasharray="7 100"
                  strokeDashoffset="-80.9"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black text-slate-900">78%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Indexed</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Indexed
              </span>
              <span className="font-bold text-slate-900">975 (78%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-[#063b73]" />
                Processing
              </span>
              <span className="font-bold text-slate-900">175 (14%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Failed
              </span>
              <span className="font-bold text-slate-900">100 (8%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
