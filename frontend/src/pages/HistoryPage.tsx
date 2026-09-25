import { useState, useMemo } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  History as HistoryIcon,
  MessageSquare,
  Search,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

interface ActivityItem {
  id: string;
  category: 'question' | 'search' | 'standard' | 'validation';
  actionPrefix: string;
  title: string;
  timestamp: string;
  link: string;
}

const INITIAL_HISTORY: ActivityItem[] = [
  {
    id: 'h-1',
    category: 'question',
    actionPrefix: 'Question',
    title: 'What is IS 456?',
    timestamp: '20 Sep 2026, 10:30 PM',
    link: '/assistant?q=What%20is%20IS%20456%3F',
  },
  {
    id: 'h-2',
    category: 'search',
    actionPrefix: 'Search',
    title: 'Electric Vehicles',
    timestamp: '19 Sep 2026, 4:15 PM',
    link: '/standards?q=Electric%20Vehicles',
  },
  {
    id: 'h-3',
    category: 'standard',
    actionPrefix: 'Viewed',
    title: 'IS 302 (Part 1)',
    timestamp: '18 Sep 2026, 11:20 AM',
    link: '/standards/std-11',
  },
  {
    id: 'h-4',
    category: 'validation',
    actionPrefix: 'Validation',
    title: 'LED Bulb (9W)',
    timestamp: '17 Sep 2026, 3:45 PM',
    link: '/compliance/result',
  },
  {
    id: 'h-5',
    category: 'search',
    actionPrefix: 'Search',
    title: 'Cement standards',
    timestamp: '16 Sep 2026, 1:10 PM',
    link: '/standards?q=Cement',
  },
  {
    id: 'h-6',
    category: 'standard',
    actionPrefix: 'Viewed',
    title: 'IS 456:2000 Plain and Reinforced Concrete',
    timestamp: '15 Sep 2026, 2:40 PM',
    link: '/standards/std-1',
  },
];

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<ActivityItem[]>(INITIAL_HISTORY);
  const [activeFilter, setActiveFilter] = useState<'all' | 'question' | 'search' | 'standard' | 'validation'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    return historyItems.filter((item) => {
      if (activeFilter !== 'all' && item.category !== activeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.actionPrefix.toLowerCase().includes(q);
      }
      return true;
    });
  }, [historyItems, activeFilter, searchQuery]);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your local activity history?')) {
      setHistoryItems([]);
    }
  };

  const getCategoryIcon = (category: ActivityItem['category']) => {
    switch (category) {
      case 'question':
        return <MessageSquare className="h-4 w-4 text-[#063b73]" />;
      case 'search':
        return <Search className="h-4 w-4 text-blue-600" />;
      case 'standard':
        return <Eye className="h-4 w-4 text-amber-600" />;
      case 'validation':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      {/* Page Header (Screen 14) */}
      <PageHeader
        title="History"
        description="Your recent search queries, standard lookups, and compliance validation activity."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'History' },
        ]}
        actions={
          historyItems.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors shadow-xs"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear History</span>
            </button>
          )
        }
      />

      {/* Search Input & Filter Pills (Reference Screen 14) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history by keyword or standard..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'question', label: 'Questions' },
            { id: 'search', label: 'Searches' },
            { id: 'standard', label: 'Standards Viewed' },
            { id: 'validation', label: 'Validations' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id as typeof activeFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeFilter === pill.id
                  ? 'bg-[#063b73] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Timeline List (Reference Screen 14) */}
      <div className="space-y-3">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                {getCategoryIcon(item.category)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                    {item.actionPrefix}:
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#063b73] transition-colors truncate">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                  <Clock className="h-3 w-3" />
                  <span>{item.timestamp}</span>
                </p>
              </div>
            </div>

            <Link
              to={item.link}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-[#063b73] hover:text-white transition-all shadow-2xs shrink-0"
            >
              <span>Revisit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}

        {filteredHistory.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <HistoryIcon className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-2 text-sm font-bold text-slate-800">
              No activity records found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Your searches, questions, and viewed standards will automatically be logged here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}