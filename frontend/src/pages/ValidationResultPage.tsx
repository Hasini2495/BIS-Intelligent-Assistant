import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { documentsService } from '@/services/documentsService';

interface ComplianceItem {
  id: string;
  requirement: string;
  status: 'matched' | 'needs_review' | 'not_satisfied' | 'insufficient_evidence';
  evidence: string;
  sourceClause: string;
  remarks: string;
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: 'req-1',
    requirement: 'Power consumption',
    status: 'matched',
    evidence: 'spec.pdf',
    sourceClause: 'Clause 5.1',
    remarks: 'Compliant (Measured 8.8W within ±10% limit)',
  },
  {
    id: 'req-2',
    requirement: 'Luminous Flux',
    status: 'matched',
    evidence: 'lab_report.pdf',
    sourceClause: 'Clause 5.2',
    remarks: 'Compliant (Delivered 820 lm vs 800 lm rated)',
  },
  {
    id: 'req-3',
    requirement: 'Color rendering index (CRI)',
    status: 'needs_review',
    evidence: 'image.png',
    sourceClause: 'Clause 5.3',
    remarks: 'Verify data (Reported CRI 79.2 vs minimum 80.0 requirement)',
  },
  {
    id: 'req-4',
    requirement: 'Safety requirements',
    status: 'not_satisfied',
    evidence: 'test.pdf',
    sourceClause: 'Clause 6.1',
    remarks: 'Missing test report (High voltage flashover test pending in lab)',
  },
  {
    id: 'req-5',
    requirement: 'Marking and labelling',
    status: 'matched',
    evidence: 'view.pdf',
    sourceClause: 'Clause 7.2',
    remarks: 'Compliant (Brand name, rated voltage, wattage, and BIS logo present)',
  },
  {
    id: 'req-6',
    requirement: 'Insulation resistance',
    status: 'matched',
    evidence: 'spec.pdf',
    sourceClause: 'Clause 8.1',
    remarks: 'Compliant (> 4.5 Megohms observed vs 4.0 Megohm threshold)',
  },
  {
    id: 'req-7',
    requirement: 'Mechanical cap strength',
    status: 'matched',
    evidence: 'lab_report.pdf',
    sourceClause: 'Clause 9.1',
    remarks: 'Compliant (Base torque test withstands required 3 N·m)',
  },
];

export default function ValidationResultPage() {
  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Page Header (Screen 09) */}
      <PageHeader
        title="Validation Result"
        description="Overall compliance status and requirement-level verification audit for your product."
        breadcrumbs={[
          { label: 'Compliance Validator', href: '/compliance' },
          { label: 'Validation Result' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              to="/compliance"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>New Audit</span>
            </Link>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
          </div>
        }
      />

      {/* Overall Status Banner Card (Reference Screen 09) */}
      <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50/80 via-white to-emerald-50/40 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800 tracking-wide uppercase">
                  Mostly Compliant
                </span>
                <span className="text-xs font-bold text-slate-600">
                  7 of 10 requirements satisfied
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600 font-medium">
                <div>
                  Product: <strong className="text-slate-900 font-bold">LED Bulb (9W)</strong>
                </div>
                <div>
                  Standard: <strong className="text-[#063b73] font-bold">IS 16102 (Part 1):2012</strong>
                </div>
                <div>
                  Validated: <strong className="text-slate-900 font-bold">21 Sep 2026</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="rounded-xl border border-emerald-300 bg-emerald-100/60 px-3 py-1.5 text-xs font-bold text-emerald-800">
              Audit ID: #VAL-2026-0921
            </span>
          </div>
        </div>
      </div>

      {/* Requirements Verification Table (Reference Screen 09) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Requirement-Level Evaluation Summary
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Standard: IS 16102 (Part 1):2012
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Requirement</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6">Evidence</TableHead>
              <TableHead className="w-1/6">Source-Clause</TableHead>
              <TableHead className="w-1/3">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMPLIANCE_ITEMS.map((item) => {
              return (
                <TableRow key={item.id}>
                  {/* Requirement */}
                  <TableCell className="font-bold text-slate-900 text-xs sm:text-sm">
                    {item.requirement}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    {item.status === 'matched' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Matched
                      </span>
                    )}
                    {item.status === 'needs_review' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        Needs Review
                      </span>
                    )}
                    {item.status === 'not_satisfied' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                        <XCircle className="h-3 w-3 text-red-600" />
                        Not Satisfied
                      </span>
                    )}
                    {item.status === 'insufficient_evidence' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
                        <Clock className="h-3 w-3 text-slate-500" />
                        Insufficient
                      </span>
                    )}
                  </TableCell>

                  {/* Evidence File */}
                  <TableCell>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await documentsService.download('doc-1', item.evidence);
                        } catch {
                          window.open('/api/documents/doc-1/download', '_blank');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#063b73] hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      <span>{item.evidence}</span>
                    </button>
                  </TableCell>

                  {/* Source Clause */}
                  <TableCell className="font-semibold text-slate-700 text-xs">
                    {item.sourceClause}
                  </TableCell>

                  {/* Remarks */}
                  <TableCell className="text-xs text-slate-600 leading-relaxed">
                    {item.remarks}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Action Guidance & Next Steps */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Next Steps for Full Certification
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Resolve the 1 failed requirement (Clause 6.1 test report) and submit to BIS accredited lab.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/testing"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            Find Testing Labs
          </Link>
          <Link
            to="/certification"
            className="rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F] shadow-xs"
          >
            Apply for Certification
          </Link>
        </div>
      </div>
    </div>
  );
}
