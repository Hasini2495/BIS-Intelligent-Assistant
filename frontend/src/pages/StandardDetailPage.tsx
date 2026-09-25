import { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { standardsFixture } from '@/mocks/fixtures/standards';
import { StandardNumber } from '@/components/domain/StandardNumber';
import { Modal } from '@/components/ui/Modal';
import { documentsService } from '@/services/documentsService';

export default function StandardDetailPage() {
  const { standardId } = useParams();

  // Find standard or fallback to IS 456:2000
  const standard =
    standardsFixture.find((s) => s.id === standardId || s.standardNumber === standardId) ||
    standardsFixture[0]!;

  const [activeTab, setActiveTab] = useState<'overview' | 'clauses' | 'related' | 'downloads'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [openClauseId, setOpenClauseId] = useState<string | null>('c-1');
  const [shareNotice, setShareNotice] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const toggleClause = (id: string) => {
    setOpenClauseId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header with Breadcrumbs (Screen 07) */}
      <PageHeader
        title={standard.standardNumber}
        description={standard.title}
        breadcrumbs={[
          { label: 'Standards', href: '/standards' },
          { label: standard.standardNumber },
        ]}
        badge={
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            {standard.status.toUpperCase()}
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors ${isSaved ? 'text-[#063b73] border-[#063b73]' : 'text-slate-700'
                }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-[#063b73]' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShareNotice(true);
                setTimeout(() => setShareNotice(false), 2500);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>{shareNotice ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        }
      />

      {/* Metadata Badges Bar (Screen 07) */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-3.5 border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[#063b73] border border-blue-200/60">
          {standard.sectors[0] || 'Civil Engineering'}
        </span>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
          Indian Standard (IS)
        </span>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
          Year: {standard.year || 2000}
        </span>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
          Language: English
        </span>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
          Revision: {standard.revision || '4'}
        </span>
      </div>

      {/* Main Tabs Navigation (Screen 07) */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-xs sm:text-sm font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'clauses', label: `Clauses (${standard.clauses.length})` },
            { id: 'related', label: `Related Standards (${standard.relatedStandards.length})` },
            { id: 'downloads', label: 'Downloads & Sources' },
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

      {/* Tab Content & Split Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Main Details Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Scope Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Scope
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {standard.scope}
                </p>
              </div>

              {/* Key Information Box (Screen 07) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Key Information
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      ICS Number
                    </span>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900 font-mono">
                      {standard.icsCode || '91.100.30'}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Pages
                    </span>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                      {standard.pageCount || 114}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Latest Revision
                    </span>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                      Rev {standard.revision || '4'}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Reaffirmed
                    </span>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                      {standard.reaffirmedYear || 2019}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certification & Compliance Applicability */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Conformity &amp; Certification Applicability
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This standard is certifiable under the <strong>Product Certification Scheme (ISI Mark)</strong>. Manufacturers of products governed by this standard must establish quality assurance protocols and submit factory test records to BIS.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    to="/compliance"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Run Compliance Validator</span>
                  </Link>
                  <Link
                    to="/certification"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
                  >
                    <span>View Certification Scheme</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Clauses Tab */}
          {activeTab === 'clauses' && (
            <div className="space-y-3">
              {standard.clauses.map((clause) => {
                const isOpen = openClauseId === clause.id;
                return (
                  <div
                    key={clause.id}
                    className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleClause(clause.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#063b73]">
                          {clause.number}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {clause.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50/50">
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {clause.text || 'Official clause text registered in Indian Standard document.'}
                        </p>
                        {clause.page && (
                          <p className="mt-2 text-[11px] text-slate-400 font-mono">
                            Page {clause.page} in official PDF
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Related Standards Tab */}
          {activeTab === 'related' && (
            <div className="space-y-3">
              {standard.relatedStandards.map((rel) => (
                <div
                  key={rel.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <StandardNumber number={rel.standardNumber} className="text-xs text-[#063b73]" />
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {rel.relationship.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {rel.title}
                    </p>
                    {rel.note && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {rel.note}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/standards/${rel.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-[#063b73] hover:text-white transition-colors"
                  >
                    <span>View</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Downloads Tab */}
          {activeTab === 'downloads' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Official Sources &amp; PDF Downloads
              </h3>
              <p className="text-xs text-slate-600">
                Indian Standards are maintained under the BIS Act, 2016. Electronic versions can be accessed directly through the official standards portal.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setPdfModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0B4A8F]"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview Full Text in Viewer</span>
                </button>
                <a
                  href={standard.officialUrl || 'https://standardsbis.bsbedge.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Official BIS Portal</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Document Preview Card (Screen 07) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center flex flex-col items-center">
            {/* Document Thumbnail Preview */}
            <div className="relative mb-5 flex h-48 w-36 flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-slate-50 p-4 shadow-inner">
              <div className="w-full text-center">
                <span className="font-bold text-[9px] text-[#063b73] uppercase tracking-wider block">
                  BUREAU OF INDIAN STANDARDS
                </span>
                <span className="text-[8px] text-slate-400 block mt-0.5">
                  MANAK BHAWAN, NEW DELHI
                </span>
              </div>

              <div className="my-auto">
                <span className="font-mono text-xs font-black text-[#063b73] block">
                  {standard.standardNumber}
                </span>
                <span className="text-[9px] text-slate-600 font-medium block mt-1 line-clamp-2 px-1">
                  {standard.title}
                </span>
              </div>

              <div className="w-full text-right text-[8px] text-slate-400 font-mono">
                Price Group 12
              </div>
            </div>

            <p className="text-xs font-bold text-slate-800">
              Official Indian Standard Document
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 mb-4">
              Format: PDF • {standard.pageCount || 114} Pages
            </p>

            {/* Action Buttons (Screen 07) */}
            <div className="w-full space-y-2.5">
              <button
                type="button"
                onClick={() => setPdfModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#063b73] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all"
              >
                <Eye className="h-4 w-4" />
                <span>View Official PDF</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await documentsService.download('doc-1', `${standard.standardNumber}.pdf`);
                    setDownloadNotice(`Downloaded ${standard.standardNumber} document package.`);
                    setTimeout(() => setDownloadNotice(null), 3500);
                  } catch {
                    window.open('/api/documents/doc-1/download', '_blank');
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
              >
                <Download className="h-4 w-4 text-slate-500" />
                <span>Download Standard</span>
              </button>
            </div>
            {downloadNotice && (
              <p className="mt-2 text-center text-[11px] font-semibold text-emerald-600">{downloadNotice}</p>
            )}
          </div>

          {/* Quick AI Ask Link */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <h4 className="text-xs font-bold text-[#063b73]">
              Need clause explanation?
            </h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Ask BIS AI Assistant to interpret specific requirements or compare this standard with international equivalents.
            </p>
            <Link
              to={`/assistant?q=Explain%20${encodeURIComponent(standard.standardNumber)}`}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#063b73] hover:underline"
            >
              <span>Ask assistant about this standard</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* PDF Document Viewer Modal */}
      <Modal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title={`${standard.standardNumber} — Official Document Viewer`}
        description={standard.title}
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-[#063b73]" />
            <h4 className="mt-3 text-sm font-bold text-slate-900">
              Indian Standard: {standard.standardNumber}
            </h4>
            <p className="mt-1 text-xs text-slate-600 max-w-md mx-auto">
              {standard.scope}
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 text-left text-xs text-slate-700 space-y-2">
              <p className="font-bold text-[#063b73]">Clause 1. Scope:</p>
              <p>1.1 This standard applies to structural plain and reinforced concrete designed in accordance with limit state principles.</p>
              <p className="font-bold text-[#063b73] pt-2">Clause 5. Materials:</p>
              <p>5.1 Cement: Cement shall comply with IS 269, IS 8112, or IS 12269.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPdfModalOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await documentsService.download('doc-1', `${standard.standardNumber}.pdf`);
                } catch {
                  window.open('/api/documents/doc-1/download', '_blank');
                }
                setPdfModalOpen(false);
              }}
              className="rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F]"
            >
              Download PDF
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}