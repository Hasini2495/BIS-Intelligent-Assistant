import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { laboratoriesFixture } from '@/mocks/fixtures/laboratories';

export default function LaboratoryDetailPage() {
  const { labId } = useParams();
  const lab = laboratoriesFixture.find((l) => l.id === labId) || laboratoriesFixture[0]!;

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      <PageHeader
        title={lab.name}
        description={`Authoritative testing facility under Bureau of Indian Standards, ${lab.region} Regional Network.`}
        breadcrumbs={[
          { label: 'Testing & Labs', href: '/testing' },
          { label: lab.name },
        ]}
        badge={
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            NABL Accredited
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Testing Capabilities &amp; Disciplines
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-bold text-[#063b73] block mb-1">Mechanical Testing</span>
                <p className="text-slate-600">Tensile strength, yield stress, elongation for steel bars, cement cubes, and pipes.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-bold text-[#063b73] block mb-1">Chemical &amp; Water Analysis</span>
                <p className="text-slate-600">Heavy metals, pH, turbidity, TDS, chlorides for drinking water (IS 10500).</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-bold text-[#063b73] block mb-1">Electrical Safety Testing</span>
                <p className="text-slate-600">High-voltage flashover, insulation resistance, wattage for household electronics and LEDs.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-bold text-[#063b73] block mb-1">Microbiological Assays</span>
                <p className="text-slate-600">Coliform and pathogen detection for packaged drinking water and food items.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Sample Submission Procedure
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <li>Submit test request electronically on the LIMS portal under your manufacturer or applicant ID.</li>
              <li>Ensure sample units are sealed according to Indian Standard sampling guidelines with proper chain of custody tags.</li>
              <li>Deliver samples to the reception counter with preliminary registration acknowledgment.</li>
              <li>Standard turnaround for physical tests is 7 working days; microbiological assays require 14 working days.</li>
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-xs space-y-3.5">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Facility Information
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#063b73] shrink-0 mt-0.5" />
              <span className="text-slate-600">Central Laboratory Campus, {lab.region} Region</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#063b73] shrink-0" />
              <span className="text-slate-600">+91 11 2323 0131</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#063b73] shrink-0" />
              <span className="text-slate-600">lab-{lab.id}@bis.gov.in</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-[#063b73] shrink-0" />
              <span className="text-slate-600">09:00 AM – 05:30 PM (Mon – Fri)</span>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href="https://bis.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#063b73] py-2 text-xs font-bold text-white hover:bg-[#0B4A8F] shadow-xs"
              >
                <span>Book Test on LIMS Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}