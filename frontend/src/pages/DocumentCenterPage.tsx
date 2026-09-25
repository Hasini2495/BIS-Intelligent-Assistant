import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'processing' | 'failed';
  uploadedOn: string;
  size: string;
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'LED_Bulb_TestReport.pdf',
    type: 'Test Report',
    status: 'completed',
    uploadedOn: '20 Sep 2026',
    size: '2.4 MB',
  },
  {
    id: 'doc-2',
    name: 'Product_Manual.pdf',
    type: 'User Manual',
    status: 'processing',
    uploadedOn: '19 Sep 2026',
    size: '1.1 MB',
  },
  {
    id: 'doc-3',
    name: 'Certificate_ISI.pdf',
    type: 'Certificate',
    status: 'completed',
    uploadedOn: '18 Sep 2026',
    size: '480 KB',
  },
  {
    id: 'doc-4',
    name: 'Technical_Specs.pdf',
    type: 'Specification',
    status: 'completed',
    uploadedOn: '15 Sep 2026',
    size: '3.8 MB',
  },
  {
    id: 'doc-5',
    name: 'Raw_Batch_Test_Scan.png',
    type: 'Test Report',
    status: 'failed',
    uploadedOn: '12 Sep 2026',
    size: '1.9 MB',
  },
];

export default function DocumentCenterPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Test Report');

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (activeTab !== 'all' && doc.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return doc.name.toLowerCase().includes(q) || doc.type.toLowerCase().includes(q);
      }
      return true;
    });
  }, [documents, activeTab, searchQuery]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      type: newDocType,
      status: 'completed',
      uploadedOn: 'Today',
      size: '1.5 MB',
    };

    setDocuments([newDoc, ...documents]);
    setNewDocName('');
    setUploadModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Page Header (Screen 10) */}
      <PageHeader
        title="Document Center"
        description="Manage your uploaded documents, test reports, and compliance records."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Document Center' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        }
      />

      {/* Filter Tabs & Search Bar (Reference Screen 10) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Documents', count: documents.length },
              {
                id: 'processing',
                label: 'Processing',
                count: documents.filter((d) => d.status === 'processing').length,
              },
              {
                id: 'completed',
                label: 'Completed',
                count: documents.filter((d) => d.status === 'completed').length,
              },
              {
                id: 'failed',
                label: 'Failed',
                count: documents.filter((d) => d.status === 'failed').length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id
                    ? 'bg-[#063b73] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Documents Table (Reference Screen 10) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5">Document Name</TableHead>
              <TableHead className="w-1/6">Type</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6">Uploaded On</TableHead>
              <TableHead className="w-1/12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.map((doc) => (
              <TableRow key={doc.id}>
                {/* Name */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#063b73]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {doc.size}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell className="text-xs font-semibold text-slate-700">
                  {doc.type}
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  {doc.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Completed
                    </span>
                  )}
                  {doc.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#063b73] border border-blue-200">
                      <Clock className="h-3 w-3 text-[#063b73] animate-spin" />
                      Processing
                    </span>
                  )}
                  {doc.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                      <XCircle className="h-3 w-3 text-red-600" />
                      Failed
                    </span>
                  )}
                </TableCell>

                {/* Date */}
                <TableCell className="text-xs text-slate-500 font-medium">
                  {doc.uploadedOn}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => alert(`Previewing document: ${doc.name}`)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="View document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading: ${doc.name}`)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Download document"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredDocs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                  No documents found matching current filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Upload Document Modal (Screen 10) */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Document"
        description="Add a new test report, certificate, or product specification to your document repository."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label htmlFor="doc-upload-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Document Title / Filename <span className="text-red-500">*</span>
            </label>
            <input
              id="doc-upload-title"
              type="text"
              required
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder="e.g. Concrete_Compression_Report_2026.pdf"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#063b73] focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="doc-upload-type" className="block text-xs font-semibold text-slate-700 mb-1">
              Document Type
            </label>
            <select
              id="doc-upload-type"
              value={newDocType}
              onChange={(e) => setNewDocType(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#063b73] focus:bg-white"
            >
              <option value="Test Report">Test Report</option>
              <option value="User Manual">User Manual</option>
              <option value="Certificate">Certificate</option>
              <option value="Specification">Technical Specification</option>
              <option value="Standard Reference">Standard Reference</option>
            </select>
          </div>

          <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center bg-slate-50">
            <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-1 text-xs font-semibold text-slate-700">
              Drag file here or click to browse
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              PDF, DOCX, PNG up to 25 MB
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#063b73] px-5 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F]"
            >
              Upload Document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
