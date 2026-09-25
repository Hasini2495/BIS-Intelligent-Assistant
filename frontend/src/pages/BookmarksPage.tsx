import { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  Bookmark,
  Bot,
  CheckCircle2,
  FileText,
  Library,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { bookmarksService } from '@/services/bookmarksService';

interface SavedItem {
  id: string;
  type: 'standard' | 'answer' | 'document' | 'report';
  title: string;
  subtitle: string;
  savedOn: string;
  link: string;
}

const INITIAL_BOOKMARKS: SavedItem[] = [
  {
    id: 'b-1',
    type: 'standard',
    title: 'IS 456:2000',
    subtitle: 'Plain and Reinforced Concrete — Code of Practice',
    savedOn: 'Saved on 21 Sep 2026',
    link: '/standards/std-1',
  },
  {
    id: 'b-2',
    type: 'answer',
    title: 'What are the tests for LED bulb?',
    subtitle: 'AI Assistant Answer with citations to IS 16102 and CRS rules',
    savedOn: 'Saved on 20 Sep 2026',
    link: '/assistant?q=Which%20standard%20applies%20for%20LED%20bulb%3F',
  },
  {
    id: 'b-3',
    type: 'document',
    title: 'LED_Bulb_TestReport.pdf',
    subtitle: 'NABL Accredited Testing Report (Photometric & Electrical)',
    savedOn: 'Saved on 19 Sep 2026',
    link: '/documents',
  },
  {
    id: 'b-4',
    type: 'report',
    title: 'Validation Report — LED Bulb (9W)',
    subtitle: 'Mostly Compliant (7 of 10 requirements satisfied)',
    savedOn: 'Saved on 18 Sep 2026',
    link: '/compliance/result',
  },
  {
    id: 'b-5',
    type: 'standard',
    title: 'IS 302 (Part 1):2008',
    subtitle: 'Safety of Household and Similar Electrical Appliances',
    savedOn: 'Saved on 16 Sep 2026',
    link: '/standards/std-11',
  },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<SavedItem[]>(INITIAL_BOOKMARKS);
  const [activeTab, setActiveTab] = useState<'all' | 'standard' | 'answer' | 'document' | 'report'>('all');

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const data = await bookmarksService.getBookmarks();
        if (data && data.length > 0) {
          const mapped: SavedItem[] = data.map((b) => ({
            id: b.id,
            type: (b.itemType as any) || 'standard',
            title: b.title,
            subtitle: b.description || b.referenceNumber || 'Bureau of Indian Standards Item',
            savedOn: b.createdAt ? `Saved on ${new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` : 'Saved recently',
            link: b.link || '/standards/std-1'
          }));
          setBookmarks(mapped);
        }
      } catch {
        // Fallback to initial
      }
    }
    fetchBookmarks();
  }, []);

  const filteredBookmarks = useMemo(() => {
    if (activeTab === 'all') return bookmarks;
    return bookmarks.filter((b) => b.type === activeTab);
  }, [bookmarks, activeTab]);

  const handleRemove = async (id: string) => {
    try {
      await bookmarksService.removeBookmark(id);
    } catch {
      // ignore
    }
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const getIcon = (type: SavedItem['type']) => {
    switch (type) {
      case 'standard':
        return <Library className="h-5 w-5 text-[#063b73]" />;
      case 'answer':
        return <Bot className="h-5 w-5 text-purple-600" />;
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'report':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      {/* Page Header (Screen 13) */}
      <PageHeader
        title="Bookmarks & Saved Items"
        description="Your saved standards, AI answers, uploaded documents, and compliance reports."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Bookmarks' },
        ]}
      />

      {/* Filter Tabs (Reference Screen 13) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'standard', label: 'Standards' },
            { id: 'answer', label: 'AI Answers' },
            { id: 'document', label: 'Documents' },
            { id: 'report', label: 'Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id
                ? 'bg-[#063b73] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks List (Reference Screen 13) */}
      <div className="space-y-3">
        {filteredBookmarks.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                {getIcon(item.type)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {item.savedOn}
                  </span>
                </div>

                <h3 className="mt-1 text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#063b73] transition-colors truncate">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Link
                to={item.link}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-[#063b73] hover:text-white transition-all shadow-2xs"
              >
                <span>Open</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Remove from bookmarks"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredBookmarks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Bookmark className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-2 text-sm font-bold text-slate-800">
              No saved bookmarks in this category
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Bookmark standards, AI answers, or compliance reports to view them here later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
