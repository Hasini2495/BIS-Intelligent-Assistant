import { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  FileCheck2,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

export default function CertificationSchemePage() {
  const { schemeId } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'process' | 'documents' | 'faqs'>('overview');

  const title =
    schemeId === 'fmcs'
      ? 'Foreign Manufacturers Certification (FMCS)'
      : schemeId === 'mscd'
        ? 'Management System Certification (MSCD)'
        : 'Product Certification (ISI Mark)';

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Page Header (Screen 12) */}
      <PageHeader
        title={title}
        description="Get your product certified as per Indian Standards under the Bureau of Indian Standards Act, 2016."
        breadcrumbs={[
          { label: 'Certification & Services', href: '/certification' },
          { label: title },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <a
              href="https://manakonline.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all"
            >
              <span>Apply Now</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        }
      />

      {/* Tabs Navigation (Reference Screen 12) */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-xs sm:text-sm font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'eligibility', label: 'Eligibility' },
            { id: 'process', label: 'Process & Stages' },
            { id: 'documents', label: 'Required Documents' },
            { id: 'faqs', label: 'FAQs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 border-b-2 font-bold transition-colors ${activeTab === tab.id
                  ? 'border-[#063b73] text-[#063b73]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 2-Column Layout (Reference Screen 12) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Scheme Information */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Scheme Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  The <strong>Product Certification Scheme (ISI Mark)</strong> is one of the largest certification programs in the world. It operates under Scheme-I of Schedule-II of the BIS (Conformity Assessment) Regulations, 2018. The presence of the ISI mark on a product is an assurance that it satisfies the required Indian Standard specification.
                </p>
              </div>

              {/* Key Benefits (Reference Screen 12) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Key Benefits
                </h3>
                <div className="space-y-3 text-xs sm:text-sm">
                  {[
                    'Assured product quality and safety for Indian consumers',
                    'Increases consumer confidence and market trust nationwide',
                    'Mandatory for certain critical products (electrical, cement, steel, toys)',
                    'Recognized across India by government procurement portals (GeM)',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-800">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application CTA */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#063b73]">
                    Ready to prepare your compliance documentation?
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Run the Compliance Validator to test your specifications before filing on Manakonline.
                  </p>
                </div>
                <Link
                  to="/compliance"
                  className="rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F] shadow-xs"
                >
                  Start Validation
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs sm:text-sm">
              <h3 className="text-sm font-bold text-slate-900">Who is Eligible to Apply?</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Any domestic or foreign manufacturer who produces goods in accordance with Indian Standards.</li>
                <li>The manufacturing unit must have in-house testing facilities and trained quality personnel.</li>
                <li>Production premises must comply with factory safety and environmental norms.</li>
              </ul>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Step-by-Step Licensing Procedure</h3>
              <div className="space-y-3">
                {[
                  { step: '1. Online Application', desc: 'Submit Form-I on the Manakonline portal with plant layout and test equipment details.' },
                  { step: '2. Preliminary Inspection', desc: 'A BIS auditing officer inspects manufacturing infrastructure and tests samples in factory.' },
                  { step: '3. Independent Lab Testing', desc: 'Sample collected during audit is tested at an accredited NABL / BIS lab.' },
                  { step: '4. Grant of License', desc: 'Upon verification of compliance, Certification of Manufacturing License (CM/L) is issued.' },
                ].map((s, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <p className="font-bold text-xs text-[#063b73]">{s.step}</p>
                    <p className="text-xs text-slate-600 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900">Documents Required for Submission</h3>
              {[
                'Factory registration certificate or SSI / MSME Udyam registration',
                'Manufacturing machinery and equipment inventory list',
                'In-house testing equipment calibration certificates',
                'Quality control personnel qualifications and appointment records',
                'Complete plant layout drawing indicating storage and test laboratory areas',
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <FileCheck2 className="h-4 w-4 text-[#063b73] shrink-0" />
                  <span className="font-medium text-slate-800">{doc}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-3">
              {[
                { q: 'Is ISI certification mandatory for all products?', a: 'No, it is voluntary for most products, but mandatory for over 400 products under Quality Control Orders (QCOs).' },
                { q: 'How long is the license valid?', a: 'Initial license is granted for 1 to 2 years, renewable up to 5 years subject to surveillance audits.' },
                { q: 'Can a trader apply for ISI mark?', a: 'No. The license is granted strictly to the actual manufacturing premises, not to trading entities.' },
              ].map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                  <p className="font-bold text-xs text-slate-900">{faq.q}</p>
                  <p className="text-xs text-slate-600 mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: ISI Emblem & Key Facts Card (Reference Screen 12) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center flex flex-col items-center">
            {/* The Stylized Official ISI Mark Logo Card */}
            <div className="mb-4 flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-sm">
              <div className="text-center font-black">
                <span className="text-4xl tracking-tighter text-slate-900 block font-serif">
                  ISI
                </span>
                <span className="text-[10px] text-slate-600 font-bold block border-t border-slate-900 mt-1 pt-0.5">
                  IS: 456
                </span>
                <span className="text-[9px] text-slate-500 font-mono block">
                  CM/L - 0000000
                </span>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-900">
              Standard Mark of Quality
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-5">
              Scheme-I • BIS Conformity Assessment
            </p>

            <div className="w-full space-y-2 text-left text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Validity:</span>
                <span className="font-bold text-slate-900">1 to 2 Years</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Filing Portal:</span>
                <span className="font-bold text-[#063b73]">Manakonline</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Processing Time:</span>
                <span className="font-bold text-slate-900">30 – 45 Days</span>
              </div>
            </div>

            <a
              href="https://manakonline.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#063b73] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all"
            >
              <span>Apply on e-BIS Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}