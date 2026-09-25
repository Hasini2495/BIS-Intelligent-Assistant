import { useState, useMemo } from 'react';
import {
  Bookmark,
  ChevronRight,
  Library,
  Search,
  Sparkles,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { standardsFixture } from '@/mocks/fixtures/standards';
import { StandardNumber } from '@/components/domain/StandardNumber';

export default function StandardsPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Filter logic
  const filteredStandards = useMemo(() => {
    return standardsFixture.filter((std) => {
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const match =
          std.standardNumber.toLowerCase().includes(q) ||
          std.title.toLowerCase().includes(q) ||
          std.sectors.some((s) => s.toLowerCase().includes(q)) ||
          std.categories.some((c) => c.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Category filter
      if (selectedCategory !== 'All') {
        const hasCategory =
          std.sectors.includes(selectedCategory) ||
          std.categories.includes(selectedCategory);
        if (!hasCategory) return false;
      }

      // Status filter
      if (selectedStatus !== 'All') {
        if (std.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
      }

      // Year filter
      if (selectedYear !== 'All') {
        const yr = std.year || 2000;
        if (selectedYear === '2020+' && yr < 2020) return false;
        if (selectedYear === '2010-2019' && (yr < 2010 || yr > 2019)) return false;
        if (selectedYear === '2000-2009' && (yr < 2000 || yr > 2009)) return false;
        if (selectedYear === 'before2000' && yr >= 2000) return false;
      }

      // Language filter
      if (selectedLanguage !== 'All') {
        if (selectedLanguage === 'English' && std.language !== 'en') return false;
        if (selectedLanguage === 'Hindi' && std.language !== 'hi') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'standardNumber') return a.standardNumber.localeCompare(b.standardNumber);
      if (sortBy === 'year') return (b.year || 0) - (a.year || 0);
      return 0; // relevance
    });
  }, [query, selectedCategory, selectedStatus, selectedYear, selectedLanguage, sortBy]);

  const toggleBookmark = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header (Screen 06) */}
      <PageHeader
        title="Standards Search"
        description="Find and explore Indian Standards across civil engineering, electronics, food, textiles, and chemicals."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Standards Search' },
        ]}
        actions={
          <Link
            to="/assistant?q=Find%20standards"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#E8850C]" />
            <span>Ask AI to Recommend Standard</span>
          </Link>
        }
      />

      {/* Search Input Bar (Screen 06) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by standard number, title, product or keyword (e.g. IS 456, Concrete, LED)..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            className="h-11 rounded-xl bg-[#063b73] px-6 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all shrink-0"
          >
            Search
          </button>
        </form>

        {/* Filters Row (Screen 06) */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Category */}
          <div>
            <label htmlFor="filter-category" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-[#063b73]"
            >
              <option value="All">All Categories</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Electronics & IT">Electronics &amp; IT</option>
              <option value="Structural Engineering">Structural Engineering</option>
              <option value="Food & Agriculture">Food &amp; Agriculture</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="filter-status" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-[#063b73]"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="reaffirmed">Reaffirmed</option>
              <option value="superseded">Superseded</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label htmlFor="filter-year" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Year
            </label>
            <select
              id="filter-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-[#063b73]"
            >
              <option value="All">All Years</option>
              <option value="2020+">2020 and later</option>
              <option value="2010-2019">2010 – 2019</option>
              <option value="2000-2009">2000 – 2009</option>
              <option value="before2000">Before 2000</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label htmlFor="filter-lang" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Language
            </label>
            <select
              id="filter-lang"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-[#063b73]"
            >
              <option value="All">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header: Count & Sort */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs sm:text-sm font-bold text-slate-700">
          <span className="text-[#063b73]">{filteredStandards.length}</span> results found
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#063b73]"
          >
            <option value="relevance">Relevance</option>
            <option value="standardNumber">Standard Number</option>
            <option value="year">Year (Newest)</option>
          </select>
        </div>
      </div>

      {/* Standards Result Cards List (Screen 06) */}
      <div className="space-y-3.5">
        {filteredStandards.map((std) => {
          const isSaved = savedIds.has(std.id);

          return (
            <div
              key={std.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#063b73] group-hover:bg-[#063b73] group-hover:text-white transition-colors">
                  <Library className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <StandardNumber number={std.standardNumber} className="text-sm text-[#063b73]" />
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      {std.status.toUpperCase()}
                    </span>
                    {std.sectors[0] && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {std.sectors[0]}
                      </span>
                    )}
                    {std.year && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        Year: {std.year}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1.5 text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#063b73] transition-colors leading-snug">
                    {std.title}
                  </h3>

                  {std.scope && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                      {std.scope}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleBookmark(std.id)}
                  className={`rounded-lg p-2 transition-colors ${isSaved
                      ? 'bg-blue-50 text-[#063b73]'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                  title={isSaved ? 'Remove bookmark' : 'Bookmark standard'}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                <Link
                  to={`/standards/${std.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-[#063b73] hover:text-white transition-all shadow-2xs"
                >
                  <span>View</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredStandards.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Library className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-800">
              No matching Indian Standards found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find standards matching "{query}". Try clearing filters or searching for terms like "Concrete", "LED", or "Water".
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCategory('All');
                setSelectedStatus('All');
                setSelectedYear('All');
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0B4A8F]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}