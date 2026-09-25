import { useState, useMemo } from 'react';
import {
  ChevronRight,
  FlaskConical,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { laboratoriesFixture } from '@/mocks/fixtures/laboratories';

export default function TestingPage() {
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filteredLabs = useMemo(() => {
    return laboratoriesFixture.filter((lab) => {
      if (selectedRegion !== 'All' && lab.region !== selectedRegion) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return lab.name.toLowerCase().includes(q) || lab.region.toLowerCase().includes(q);
      }
      return true;
    });
  }, [query, selectedRegion]);

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Testing & Laboratories Network"
        description="Search accredited Central, Regional, and Branch Testing Laboratories of the Bureau of Indian Standards."
        breadcrumbs={[
          { label: 'Certification & Services', href: '/certification' },
          { label: 'Testing & Labs' },
        ]}
        actions={
          <Link
            to="/assistant?q=Find%20testing%20laboratories%20for%20concrete"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#E8850C]" />
            <span>Ask AI to Locate Lab</span>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search laboratory name or location (Delhi, Mumbai, Chennai)..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#063b73] focus:bg-white"
          />
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#063b73] shrink-0"
        >
          <option value="All">All Regions</option>
          <option value="North">Northern Region</option>
          <option value="West">Western Region</option>
          <option value="South">Southern Region</option>
          <option value="East">Eastern Region</option>
          <option value="Central">Central Region</option>
        </select>
      </div>

      {/* Laboratories Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredLabs.map((lab) => (
          <div
            key={lab.id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#063b73] border border-blue-200">
                  {lab.region} Region
                </span>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  NABL Accredited
                </span>
              </div>

              <h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#063b73] transition-colors">
                {lab.name}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Regional Testing Facility, BIS Branch Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Disciplines: Chemical, Mechanical, Electrical</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/testing/labs/${lab.id}`}
                className="inline-flex items-center text-xs font-bold text-[#063b73] hover:underline"
              >
                <span>View Lab Capabilities</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Link>

              <span className="text-[11px] text-slate-400 font-mono">
                {lab.id.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}