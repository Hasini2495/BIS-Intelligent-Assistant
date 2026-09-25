import {
  ChevronRight,
  FlaskConical,
  Gem,
  Globe2,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

interface SchemeCard {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: typeof ShieldCheck;
  color: string;
  link: string;
}

const SCHEMES: SchemeCard[] = [
  {
    id: 'isi-mark',
    title: 'Product Certification (ISI Mark)',
    badge: 'ISI Mark',
    description:
      'Third-party quality assurance scheme granting licence to use the standard ISI Mark on compliant domestic products.',
    icon: ShieldCheck,
    color: 'text-[#063b73] bg-blue-50',
    link: '/certification/isi-mark',
  },
  {
    id: 'hallmarking',
    title: 'Hallmarking Scheme',
    badge: 'Gold, Silver, Platinum',
    description:
      'Accurate determination and official recording of the proportionate content of precious metal in gold and silver jewellery.',
    icon: Gem,
    color: 'text-amber-700 bg-amber-50',
    link: '/hallmarking',
  },
  {
    id: 'testing-labs',
    title: 'Testing Laboratories Network',
    badge: 'NABL Accredited',
    description:
      'Accredited state-of-the-art BIS laboratory network conducting physical, chemical, and microbiological testing.',
    icon: FlaskConical,
    color: 'text-purple-700 bg-purple-50',
    link: '/testing',
  },
  {
    id: 'fmcs',
    title: 'Foreign Manufacturers Certification',
    badge: 'FMCS Scheme',
    description:
      'Grant of BIS licence to overseas manufacturers producing goods for importation into the Indian marketplace.',
    icon: Globe2,
    color: 'text-sky-700 bg-sky-50',
    link: '/certification/fmcs',
  },
  {
    id: 'mscd',
    title: 'Management System Certification',
    badge: 'ISO Standards',
    description:
      'Certification schemes for ISO 9001 (Quality), ISO 14001 (Environment), ISO 22000 (Food Safety), and Occupational Health.',
    icon: Settings2,
    color: 'text-indigo-700 bg-indigo-50',
    link: '/certification/mscd',
  },
  {
    id: 'bis-care',
    title: 'BIS Care App & Consumer Grievances',
    badge: 'Consumer Portal',
    description:
      'Official mobile and web platform for citizens to verify HUID, authenticate ISI licenses, and lodge product grievances.',
    icon: Smartphone,
    color: 'text-emerald-700 bg-emerald-50',
    link: '/services/srv-6',
  },
];

export default function CertificationPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Page Header (Screen 11) */}
      <PageHeader
        title="Certification & Services"
        description="Explore BIS certification schemes and related quality assurance services."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Certification & Services' },
        ]}
        actions={
          <Link
            to="/assistant?q=How%20to%20get%20BIS%20certification"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#E8850C]" />
            <span>Ask AI Certification Guide</span>
          </Link>
        }
      />

      {/* 6 Schemes Grid (Reference Screen 11) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SCHEMES.map((scheme) => {
          const Icon = scheme.icon;

          return (
            <div
              key={scheme.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#063b73]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${scheme.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {scheme.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-[#063b73] transition-colors">
                  {scheme.title}
                </h3>

                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={scheme.link}
                  className="inline-flex items-center text-xs font-bold text-[#063b73] hover:underline"
                >
                  <span>Learn More</span>
                  <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => navigate(`/assistant?q=Procedure%20for%20${encodeURIComponent(scheme.title)}`)}
                  className="text-[11px] font-medium text-slate-400 hover:text-slate-700"
                >
                  Ask AI
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Support Banner */}
      <div className="rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50 via-white to-blue-50/50 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#063b73]">
            Need help choosing the right scheme for your product?
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Use the Compliance Validator or chat with our assistant to identify whether ISI Mark, CRS, or FMCS applies.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/compliance"
            className="rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F] shadow-xs"
          >
            Launch Validator
          </Link>
          <Link
            to="/assistant"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            Ask Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}