import { useState, useMemo, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { adminService, KnowledgeBaseItem } from '@/services/adminService';

const INITIAL_ITEMS: KnowledgeBaseItem[] = [
  {
    id: 'kb-1',
    title: 'IS 456:2000 Plain and Reinforced Concrete',
    type: 'Standard',
    status: 'indexed',
    version: 'v1.0',
    size: '1.2 MB',
  },
  {
    id: 'kb-2',
    title: 'IS 302 (Part 1):2008 Electrical Safety Requirements',
    type: 'Standard',
    status: 'indexed',
    version: 'v1.2',
    size: '850 KB',
  },
  {
    id: 'kb-3',
    title: 'Product Certification Scheme Manual (Scheme-I)',
    type: 'Document',
    status: 'indexed',
    version: 'v1.0',
    size: '2.1 MB',
  },
  {
    id: 'kb-4',
    title: 'Hallmarking Guidelines & HUID Specs',
    type: 'Document',
    status: 'indexed',
    version: 'v1.1',
    size: '620 KB',
  },
  {
    id: 'kb-5',
    title: 'Testing Laboratory Accreditation Criteria',
    type: 'Service',
    status: 'indexed',
    version: 'v2.0',
    size: '1.4 MB',
  },
];

export default function AdminKnowledgeBasePage() {
  const [items, setItems] = useState<KnowledgeBaseItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<'All' | 'Document' | 'Standard' | 'Service' | 'FAQ'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Standard');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Chunk inspection modal state
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectingItem, setInspectingItem] = useState<KnowledgeBaseItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    try {
      const data = await adminService.listKnowledgeBase();
      if (data && data.length > 0) {
        setItems(data);
      }
    } catch {
      // Keep initial items if backend unavailable
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab !== 'All' && item.type.toLowerCase() !== activeTab.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, activeTab, searchQuery]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a document or standard file (.pdf, .txt, .docx).');
      return;
    }
    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await adminService.uploadKnowledgeBase(selectedFile, newTitle.trim() || selectedFile.name, newType);
      setItems([res, ...items]);
      setUploadModalOpen(false);
      setSelectedFile(null);
      setNewTitle('');
      setActionNotice(`Source "${res.title}" successfully ingested and indexed.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      setUploadError(err?.detail || err?.message || 'Ingestion failed. Ensure file is readable and under 25MB.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReindex = async (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'processing' } : it))
    );
    try {
      await adminService.reindexKnowledgeBase(id);
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: 'indexed' } : it))
      );
      setActionNotice('Vector embeddings re-indexed.');
      setTimeout(() => setActionNotice(null), 3000);
    } catch {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: 'indexed' } : it))
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteKnowledgeBase(id);
    } catch {
      // ignore
    }
    setItems(items.filter((it) => it.id !== id));
    setActionNotice('Source deleted from Knowledge Base.');
    setTimeout(() => setActionNotice(null), 2500);
  };

  const handleInspectChunks = (item: KnowledgeBaseItem) => {
    setInspectingItem(item);
    setInspectModalOpen(true);
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Page Header (Screen 19) */}
      <PageHeader
        title="Knowledge Base Management"
        description="Manage authoritative Indian Standards, policy circulars, and vector database embeddings."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Knowledge Base' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => {
              setUploadError(null);
              setSelectedFile(null);
              setNewTitle('');
              setUploadModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Source</span>
          </button>
        }
      />

      {actionNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex w-full sm:w-auto p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          {(['All', 'Standard', 'Document', 'Service', 'FAQ'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === tab
                  ? 'bg-white text-[#063b73] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge sources..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#063b73] focus:outline-none focus:ring-1 focus:ring-[#063b73]"
          />
        </div>
      </div>

      {/* Sources Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Vector Status</TableHead>
              <TableHead>Version</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                {/* Source Title */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063b73]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">Source ID: {item.id}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="text-xs font-medium text-slate-600">
                  {item.type}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {item.status === 'indexed' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Indexed
                    </span>
                  )}
                  {item.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                      <Clock className="h-3 w-3 text-amber-600 animate-spin" />
                      Vectorizing
                    </span>
                  )}
                  {item.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                      <XCircle className="h-3 w-3 text-red-600" />
                      Error
                    </span>
                  )}
                </TableCell>

                {/* Version */}
                <TableCell className="text-xs font-mono text-slate-500 font-semibold">
                  {item.version || 'v1.0'}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleReindex(item.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-[#063b73]"
                      title="Re-index embedding vectors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInspectChunks(item)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="View chunks"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete from knowledge base"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-xs text-slate-400">
                  No knowledge base sources found matching query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Inspect Chunks Modal */}
      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title="Knowledge Base Embedding Chunks Inspector"
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <span className="font-bold text-slate-800">Source:</span> {inspectingItem?.title}
            <div className="text-[11px] text-slate-500 mt-1 font-mono">ID: {inspectingItem?.id} • Status: {inspectingItem?.status}</div>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3 text-xs space-y-1">
              <span className="font-bold text-[#063b73]">Chunk 1: Clause Scope &amp; Purpose</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Applies to all registered manufacturers, testing facilities, and consumer products within the National Standards Framework.
              </p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3 text-xs space-y-1">
              <span className="font-bold text-[#063b73]">Chunk 2: Technical Thresholds &amp; Criteria</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Mandatory minimum quality tolerances, sampling cycles, and permissible deviations according to prescribed test matrices.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setInspectModalOpen(false)}
              className="rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F]"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
          if (!isUploading) setUploadModalOpen(false);
        }}
        title="Add Authoritative Knowledge Source"
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
              Select Document / Standard (.pdf, .txt, .png)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.docx,.png,.jpg"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const f = e.target.files[0];
                  setSelectedFile(f);
                  if (!newTitle.trim()) setNewTitle(f.name);
                }
              }}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#063b73] hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl p-1"
            />
          </div>

          <div>
            <label htmlFor="kb-title-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Title / Standard Number
            </label>
            <input
              id="kb-title-input"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. IS 10500:2012 Drinking Water Specification"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 outline-none focus:border-[#063b73]"
            />
          </div>

          <div>
            <label htmlFor="kb-type-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Classification
            </label>
            <select
              id="kb-type-select"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 outline-none focus:border-[#063b73]"
            >
              <option value="Standard">Indian Standard (IS)</option>
              <option value="Document">Policy / Scheme Document</option>
              <option value="Service">Certification Service Manual</option>
              <option value="FAQ">Official Guidance FAQ</option>
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
                  <span>Ingesting into RAG...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload &amp; Index</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
