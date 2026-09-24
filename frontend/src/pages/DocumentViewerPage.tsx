import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function DocumentViewerPage() {
  const { documentId } = useParams();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <Link
          to="/sources"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sources
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-slate-700" />
              <div>
                <h1 className="font-semibold text-slate-900">
                  Document Viewer
                </h1>
                <p className="font-mono text-xs text-slate-500">
                  {documentId}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>

          <div className="min-h-[500px] p-8">
            <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
              <div className="h-5 w-2/3 rounded bg-slate-100" />
              <div className="mt-6 space-y-3">
                <div className="h-3 rounded bg-slate-100" />
                <div className="h-3 rounded bg-slate-100" />
                <div className="h-3 w-5/6 rounded bg-slate-100" />
              </div>

              <div className="mt-10 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                Document preview is currently using demonstration content.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}