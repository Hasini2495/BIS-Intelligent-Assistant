import { useState, useMemo } from 'react';
import {
  ArrowRight,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { servicesFixture } from '@/mocks/fixtures/services';

export default function ServicesPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredServices = useMemo(() => {
    return servicesFixture.filter((service) => {
      if (selectedCategory !== 'All' && service.category !== selectedCategory) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          service.name.toLowerCase().includes(q) ||
          service.shortDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, selectedCategory]);

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      <PageHeader
        title="BIS Services & Citizen Engagement"
        description="Explore national standardization, conformity assessment, testing, training, and consumer protection services."
        breadcrumbs={[
          { label: 'Certification & Services', href: '/certification' },
          { label: 'BIS Services' },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search BIS services (e.g. Training, Consumer Complaints, Standards Formulation)..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#063b73] focus:bg-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#063b73] shrink-0"
        >
          <option value="All">All Categories</option>
          <option value="certification">Certification</option>
          <option value="standards">Standards Formulation</option>
          <option value="testing">Testing</option>
          <option value="consumer">Consumer Affairs</option>
          <option value="training">Training &amp; Clubs</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#063b73] uppercase tracking-wider">
                  {service.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {service.id.toUpperCase()}
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-[#063b73] transition-colors">
                {service.name}
              </h3>

              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                {service.shortDescription}. Comprehensive portal for stakeholders and regulatory compliance.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/services/${service.id}`}
                className="inline-flex items-center text-xs font-bold text-[#063b73] hover:underline"
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}