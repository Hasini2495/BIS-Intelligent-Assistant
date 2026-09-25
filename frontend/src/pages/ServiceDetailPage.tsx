import { CheckCircle2, ExternalLink } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { servicesFixture } from '@/mocks/fixtures/services';

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const service = servicesFixture.find((s) => s.id === serviceId) || servicesFixture[0]!;

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      <PageHeader
        title={service.name}
        description={service.shortDescription}
        breadcrumbs={[
          { label: 'BIS Services', href: '/services' },
          { label: service.name },
        ]}
        badge={
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#063b73] border border-blue-200">
            {service.category.toUpperCase()}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Service Scope &amp; Target Beneficiaries
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              This service facilitates seamless interaction between the Bureau of Indian Standards and its stakeholders, including domestic manufacturing industries, consumer protection organizations, and academic institutions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Key Process Steps
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Online Registration', desc: 'Create citizen or enterprise profile on the official BIS portal.' },
                { title: 'Document Verification', desc: 'Submit statutory licenses, PAN, and technical standards compliance records.' },
                { title: 'Officer Assessment', desc: 'Review by designated technical committee or regional directorate.' },
                { title: 'Resolution & Issuance', desc: 'Download digitally signed clearance certificate or grievance report.' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-slate-900">{step.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-xs space-y-3">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Access Service
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Access the official online service desk to register applications or file grievances.
            </p>
            <a
              href="https://bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#063b73] py-2.5 text-xs font-bold text-white hover:bg-[#0B4A8F] shadow-xs"
            >
              <span>Launch Official Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}