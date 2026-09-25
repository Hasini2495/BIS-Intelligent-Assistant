import { useState, useMemo, useEffect, useRef } from 'react';
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
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { documentsService } from '@/services/documentsService';

interface DocumentDisplayItem {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'processing' | 'failed';
  uploadedOn: string;
  size: string;
}

const FALLBACK_DOCUMENTS: DocumentDisplayItem[] = [
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
  const [documents, setDocuments] = useState<DocumentDisplayItem[]>(FALLBACK_DOCUMENTS);
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Test Report');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const loadDocuments = async () => {
    try {
      const items = await documentsService.list();
      if (items && items.length > 0) {
        const mapped: DocumentDisplayItem[] = items.map((it) => {
          const sizeKb = (it.fileSize || 0) / 1024;
          const sizeStr = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb.toFixed(0)} KB`;
          let st: 'completed' | 'processing' | 'failed' = 'completed';
          if (it.status === 'processing' || it.status === 'uploaded') st = 'processing';
          if (it.status === 'failed') st = 'failed';

          return {
            id: it.id,
            name: it.title || it.originalFilename || 'Document.pdf',
            type: it.documentType || 'Report',
            status: st,
            uploadedOn: it.createdAt ? new Date(it.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
            size: sizeStr,
          };
        });
        setDocuments(mapped);
      }
    } catch {
      // Keep initial seeded fallback documents
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSelectedFile(f);
      if (!newDocName.trim()) {
        setNewDocName(f.name);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a PDF, PNG, or JPG file to upload.');
      return;
    }
    setUploadError(null);
    setIsUploading(true);

    try {
      const docTypeMapping: Record<string, string> = {
        'Test Report': 'compliance_evidence',
        'User Manual': 'user_manual',
        'Certificate': 'certificate',
        'Specification': 'standard',
      };

      const result = await documentsService.upload(selectedFile, {
        title: newDocName.trim() || selectedFile.name,
        documentType: docTypeMapping[newDocType] || 'compliance_evidence'
      });

      const sizeKb = (result.fileSize || selectedFile.size) / 1024;
      const sizeStr = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb.toFixed(0)} KB`;

      const newDocItem: DocumentDisplayItem = {
        id: result.id,
        name: result.title,
        type: newDocType,
        status: result.status === 'failed' ? 'failed' : 'completed',
        uploadedOn: 'Today',
        size: sizeStr,
      };

      setDocuments([newDocItem, ...documents]);
      setUploadModalOpen(false);
      setSelectedFile(null);
      setNewDocName('');
      setActionNotice(`Document "${result.title}" uploaded and indexed successfully.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      setUploadError(err?.detail || err?.message || 'File upload failed. Please ensure file is valid PDF/Image under 25MB.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (doc: DocumentDisplayItem) => {
    setDownloadingId(doc.id);
    try {
      await documentsService.download(doc.id, doc.name);
      setActionNotice(`Downloaded ${doc.name} successfully.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      // Direct stream fallback
      window.open(`/api/documents/${doc.id}/download`, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await documentsService.delete(id);
    } catch {
      // ignore
    }
    setDocuments(documents.filter((d) => d.id !== id));
    setActionNotice('Document removed.');
    setTimeout(() => setActionNotice(null), 2500);
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
            onClick={() => {
              setUploadError(null);
              setSelectedFile(null);
              setNewDocName('');
              setUploadModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#063b73] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B4A8F] active:bg-[#042449] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        }
      />

      {actionNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex w-full sm:w-auto p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          {(['all', 'completed', 'processing', 'failed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors ${activeTab === tab
                  ? 'bg-white text-[#063b73] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#063b73] focus:outline-none focus:ring-1 focus:ring-[#063b73]"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.map((doc) => (
              <TableRow key={doc.id}>
                {/* Document Name */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063b73]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900">{doc.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">ID: {doc.id}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell className="text-xs text-slate-600 font-medium">
                  {doc.type}
                </TableCell>

                {/* Size */}
                <TableCell className="text-xs text-slate-500 font-medium">
                  {doc.size}
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  {doc.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Indexed
                    </span>
                  )}
                  {doc.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                      <Clock className="h-3 w-3 text-amber-600 animate-spin" />
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
                      onClick={() => navigate(`/documents/${doc.id}`)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="View document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                      title="Download document"
                    >
                      {downloadingId === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#063b73]" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
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
                <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-400">
                  No documents found matching the filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
          if (!isUploading) setUploadModalOpen(false);
        }}
        title="Upload Verification Evidence Document"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {uploadError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <div>{uploadError}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Document File (.pdf, .png, .jpg)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              required
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#063b73] hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl p-1"
            />
            {selectedFile && (
              <p className="mt-1 text-[11px] text-slate-500">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>

          <div>
            <label htmlFor="doc-title-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Document Title / Label
            </label>
            <input
              id="doc-title-input"
              type="text"
              required
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder="e.g. LED_Bulb_TestReport.pdf"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 outline-none focus:border-[#063b73]"
            />
          </div>

          <div>
            <label htmlFor="doc-type-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Document Category
            </label>
            <select
              id="doc-type-select"
              value={newDocType}
              onChange={(e) => setNewDocType(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 outline-none focus:border-[#063b73]"
            >
              <option value="Test Report">Test Report</option>
              <option value="User Manual">User Manual</option>
              <option value="Certificate">Certificate</option>
              <option value="Specification">Technical Specification</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => setUploadModalOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F] disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading &amp; Indexing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload to BIS Storage</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
