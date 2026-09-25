import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  Database,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'Standard' | 'Document' | 'Service' | 'FAQ';
  status: 'indexed' | 'processing' | 'failed';
  version: string;
}

const INITIAL_ITEMS: KnowledgeItem[] = [
  {
    id: 'kb-1',
    title: 'IS 456:2000 Plain and Reinforced Concrete',
    type: 'Standard',
    status: 'indexed',
    version: 'v1.0',
  },
  {
    id: 'kb-2',
    title: 'IS 302 (Part 1):2008 Electrical Safety',
    type: 'Standard',
    status: 'indexed',
    version: 'v1.2',
  },
  {
    id: 'kb-3',
    title: 'Product Certification Scheme Manual',
    type: 'Document',
    status: 'processing',
    version: 'v1.0',
  },
  {
    id: 'kb-4',
    title: 'Hallmarking Guidelines & HUID Specs',
    type: 'Document',
    status: 'indexed',
    version: 'v1.1',
  },
  {
    id: 'kb-5',
    title: 'Foreign Manufacturers Certification (FMCS) FAQ',
    type: 'FAQ',
    status: 'failed',
    version: 'v1.0',
  },
  {
    id: 'kb-6',
    title: 'Testing Laboratory Accreditation Criteria',
    type: 'Service',
    status: 'indexed',
    version: 'v2.0',
  },
];

export default function AdminKnowledgeBasePage() {
  const [items, setItems] = useState<KnowledgeItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<'All' | 'Document' | 'Standard' | 'Service' | 'FAQ'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<KnowledgeItem['type']>('Standard');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab !== 'All' && item.type !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, activeTab, searchQuery]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      title: newTitle,
      type: newType,
      status: 'indexed',
      version: 'v1.0',
    };

    setItems([newItem, ...items]);
    setNewTitle('');
    setUploadModalOpen(false);
  };

  const handleReindex = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'processing' } : it))
    );
    setTimeout(() => {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: 'indexed' } : it))
      );
    }, 1200);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
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
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Source</span>
          </button>
        }
      />

      {/* Filter Tabs & Search (Reference Screen 19) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'All', label: 'All' },
              { id: 'Document', label: 'Documents' },
              { id: 'Standard', label: 'Standards' },
              { id: 'Service', label: 'Services' },
              { id: 'FAQ', label: 'FAQs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id
                    ? 'bg-[#063b73] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                {tab.label}
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
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-[#063b73] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Knowledge Base Table (Reference Screen 19) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5">Title</TableHead>
              <TableHead className="w-1/6">Type</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6">Version</TableHead>
              <TableHead className="w-1/6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                {/* Title */}
                <TableCell className="font-bold text-slate-900 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <Database className="h-4 w-4 text-[#063b73] shrink-0" />
                    <span>{item.title}</span>
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell className="text-xs font-semibold text-slate-600">
                  {item.type}
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  {item.status === 'indexed' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Indexed
                    </span>
                  )}
                  {item.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#063b73] border border-blue-200">
                      <Clock className="h-3 w-3 text-[#063b73] animate-spin" />
                      Processing
                    </span>
                  )}
                  {item.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                      <XCircle className="h-3 w-3 text-red-600" />
                      Failed
                    </span>
                  )}
                </TableCell>

                {/* Version */}
                <TableCell className="text-xs font-mono text-slate-500 font-semibold">
                  {item.version}
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
                      onClick={() => alert(`Inspecting chunks for: ${item.title}`)}
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
          </TableBody>
        </Table>
      </div>

      {/* Upload Source Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Knowledge Source"
        description="Ingest a new Indian Standard, guideline manual, or FAQ into the retrieval index."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label htmlFor="kb-source-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Source Title <span className="text-red-500">*</span>
            </label>
            <input
              id="kb-source-title"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. IS 1893:2016 Seismic Design Code"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#063b73]"
            />
          </div>

          <div>
            <label htmlFor="kb-source-type" className="block text-xs font-semibold text-slate-700 mb-1">
              Source Type
            </label>
            <select
              id="kb-source-type"
              value={newType}
              onChange={(e) => setNewType(e.target.value as KnowledgeItem['type'])}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#063b73]"
            >
              <option value="Standard">Indian Standard (IS)</option>
              <option value="Document">Regulatory Document / Scheme</option>
              <option value="Service">Service Procedure</option>
              <option value="FAQ">Official FAQs</option>
            </select>
          </div>

          <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center bg-slate-50">
            <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-1 text-xs font-semibold text-slate-700">
              Drag file here or click to browse
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
              Upload &amp; Index
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
