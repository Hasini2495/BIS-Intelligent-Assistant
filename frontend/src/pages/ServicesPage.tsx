import { ArrowRight, BriefcaseBusiness, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 'demo-service-1',
    title: 'BIS Online Services',
    description: 'Explore available BIS service information.',
  },
  {
    id: 'demo-service-2',
    title: 'Consumer Services',
    description: 'Explore consumer-oriented BIS services.',
  },
  {
    id: 'demo-service-3',
    title: 'Industry Services',
    description: 'Explore services relevant to industries and MSMEs.',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">BIS Services</h1>
        <p className="mt-1 text-sm text-slate-500">
          Discover BIS services for consumers, industries and organizations.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <span className="text-sm text-slate-400">Search services...</span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/services/${service.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <BriefcaseBusiness className="h-7 w-7 text-slate-700" />

              <h2 className="mt-5 font-semibold text-slate-900">
                {service.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {service.description}
              </p>

              <div className="mt-5 flex items-center text-sm font-medium text-slate-700">
                Explore
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}