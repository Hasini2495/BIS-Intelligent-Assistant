import { useState, useEffect } from 'react';
import { Download, FileText, Printer, CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { documentsFixture } from '@/mocks/fixtures/documents';
import { documentsService } from '@/services/documentsService';

export default function DocumentViewerPage() {
  const { documentId } = useParams();
  const [docTitle, setDocTitle] = useState('Bureau of Indian Standards Document');
  const [docType, setDocType] = useState('Standard');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    async function loadDoc() {
      if (!documentId) return;
      try {
        const d = await documentsService.getById(documentId);
        if (d && d.title) {
          setDocTitle(d.title);
          setDocType(d.documentType || 'Document');
        }
      } catch {
        const fixture = documentsFixture.find((d) => d.id === documentId);
        if (fixture) {
          setDocTitle(fixture.title);
          setDocType(fixture.documentType);
        }
      }
    }
    loadDoc();
  }, [documentId]);

  const handleDownload = async () => {
    if (!documentId) return;
    setIsDownloading(true);
    try {
      await documentsService.download(documentId, `${docTitle}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      window.open(`/api/documents/${documentId}/download`, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      <PageHeader
        title={docTitle}
        description={`Authoritative ${docType.replace('_', ' ')} issued under Bureau of Indian Standards.`}
        breadcrumbs={[
          { label: 'Document Center', href: '/documents' },
          { label: docTitle },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F] shadow-xs disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
          </div>
        }
      />

      {downloadSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Document PDF downloaded successfully!
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063b73]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{docTitle}</h2>
              <p className="text-xs text-slate-400 font-mono">Document ID: {documentId}</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            Official Source
          </span>
        </div>

        <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
          <div className="text-center py-4 border-b border-slate-100 font-sans not-italic">
            <h3 className="font-black text-lg text-[#063b73] uppercase tracking-wider">
              BUREAU OF INDIAN STANDARDS
            </h3>
            <p className="text-xs text-slate-500">Government of India • Ministry of Consumer Affairs</p>
          </div>

          <p className="pt-2 font-bold font-sans text-[#063b73]">
            1. Scope and Legal Jurisdiction:
          </p>
          <p>
            This document outlines official technical specifications, sampling guidelines, and regulatory enforcement procedures established under the Bureau of Indian Standards Act, 2016. All provisions contained herein are registered in the National Gazette and enforceable across all territories of India.
          </p>

          <p className="font-bold font-sans text-[#063b73] pt-2">
            2. Compliance and Conformance Testing:
          </p>
          <p>
            Manufacturers and testing laboratories must adhere strictly to the limits, tolerances, and calibration cycles prescribed in Schedule II. Non-conformance shall trigger reinspection protocols in accordance with the BIS (Conformity Assessment) Regulations.
          </p>
        </div>
      </div>
    </div>
  );
}