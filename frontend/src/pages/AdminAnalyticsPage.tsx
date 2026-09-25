import { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Calendar,
  Sparkles,
  TrendingUp,
  Users,
  Search
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { adminService, AdminAnalytics } from '@/services/adminService';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AdminAnalytics>({
    timeRange: '30d',
    totalQueries: 1230,
    uniqueUsers: 342,
    unresolvedQueries: 48,
    queryGrowthRate: 18.4,
    retrievalAccuracyPercentage: 96.1,
    averageLatencyMs: 142.0,
    dailyMetrics: [],
    topQueries: [
      { query: 'What is IS 456 concrete specification?', count: 18, standardNumber: 'IS 456:2000' },
      { query: 'Drinking water permissible limits in IS 10500', count: 12, standardNumber: 'IS 10500:2012' },
      { query: 'ISI mark product certification procedure', count: 9, standardNumber: 'Scheme-I' },
    ]
  });

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await adminService.getAnalytics(timeRange);
        if (data) {
          setAnalytics(data);
        }
      } catch {
        // Fallback
      }
    }
    loadAnalytics();
  }, [timeRange]);

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Page Header (Screen 20) */}
      <PageHeader
        title="Usage Analytics"
        description="Query distribution, user retention, retrieval accuracy, and feedback sentiment trends."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Usage Analytics' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#063b73] shadow-xs"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="year">Current Year</option>
            </select>
          </div>
        }
      />

      {/* 3 Top Stat Cards (Reference Screen 20) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Queries */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Queries ({timeRange})</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#063b73]">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{analytics.totalQueries}</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              +{analytics.queryGrowthRate}% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Total user inquiries processed</p>
        </div>

        {/* Unique Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Unique Users</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{analytics.uniqueUsers}</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              Active <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Distinct user accounts queried</p>
        </div>

        {/* Unresolved Queries */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Unresolved / Insufficient</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{analytics.unresolvedQueries}</span>
            <span className="text-[10px] font-bold text-slate-500">
              {analytics.retrievalAccuracyPercentage}% accuracy
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Average latency: {analytics.averageLatencyMs.toFixed(0)}ms</p>
        </div>
      </div>

      {/* Top Queried Standards List from Database */}
      {analytics.topQueries && analytics.topQueries.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-[#063b73]" />
            Most Frequently Queried Standards &amp; Questions ({timeRange})
          </h3>
          <div className="divide-y divide-slate-100">
            {analytics.topQueries.map((tq, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{tq.query}</span>
                  {tq.standardNumber && (
                    <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#063b73] border border-blue-200">
                      {tq.standardNumber}
                    </span>
                  )}
                </div>
                <span className="font-bold text-slate-500">{tq.count} inquiries</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2 Main Visualizations (Reference Screen 20) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Queries by Category Donut / Pie */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Queries by Category</h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribution of user inquiry topics</p>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="relative">
              <svg width="150" height="150" viewBox="0 0 36 36" className="transform -rotate-90">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#063b73"
                  strokeWidth="6"
                  strokeDasharray="37 100"
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#1E63C4"
                  strokeWidth="6"
                  strokeDasharray="24.6 100"
                  strokeDashoffset="-37"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#0E7A3C"
                  strokeWidth="6"
                  strokeDasharray="15.8 100"
                  strokeDashoffset="-61.6"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#E8850C"
                  strokeWidth="6"
                  strokeDasharray="10.5 100"
                  strokeDashoffset="-77.4"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#063b73]" />
              <span className="text-slate-600">Standards: <strong>42%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E63C4]" />
              <span className="text-slate-600">Certification: <strong>28%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <span className="text-slate-600">Compliance: <strong>18%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E8850C]" />
              <span className="text-slate-600">General / Labs: <strong>12%</strong></span>
            </div>
          </div>
        </div>

        {/* Feedback Trends Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Feedback Sentiment Trends</h3>
            <p className="text-xs text-slate-500 mt-0.5">Answer quality ratings submitted by users</p>
          </div>

          <div className="my-6">
            <svg viewBox="0 0 300 130" className="w-full h-32 overflow-visible">
              <rect x="20" y="20" width="16" height="90" rx="3" fill="#0E7A3C" />
              <rect x="38" y="70" width="16" height="40" rx="3" fill="#d97706" />
              <rect x="56" y="95" width="16" height="15" rx="3" fill="#dc2626" />

              <rect x="95" y="15" width="16" height="95" rx="3" fill="#0E7A3C" />
              <rect x="113" y="75" width="16" height="35" rx="3" fill="#d97706" />
              <rect x="131" y="100" width="16" height="10" rx="3" fill="#dc2626" />

              <rect x="170" y="10" width="16" height="100" rx="3" fill="#0E7A3C" />
              <rect x="188" y="80" width="16" height="30" rx="3" fill="#d97706" />
              <rect x="206" y="102" width="16" height="8" rx="3" fill="#dc2626" />

              <rect x="245" y="8" width="16" height="102" rx="3" fill="#0E7A3C" />
              <rect x="263" y="85" width="16" height="25" rx="3" fill="#d97706" />
              <rect x="281" y="104" width="16" height="6" rx="3" fill="#dc2626" />

              <line x1="0" y1="110" x2="300" y2="110" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-4 mt-1">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-600" /> Positive (91.4%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Neutral (6.2%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-red-600" /> Negative (2.4%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
