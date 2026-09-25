import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileText,
  Loader2,
  Shield,
  UploadCloud,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

const STEPS = [
  { id: 1, label: 'Product' },
  { id: 2, label: 'Select Standard' },
  { id: 3, label: 'Requirements' },
  { id: 4, label: 'Upload Evidence' },
  { id: 5, label: 'Validate' },
];

export default function ComplianceValidatorPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [productName, setProductName] = useState('LED Bulb (9W)');
  const [category, setCategory] = useState('Electrical Appliances');
  const [description, setDescription] = useState(
    'Self-ballasted LED lamp for indoor domestic lighting with B22d cap base.'
  );

  const [selectedStandard, setSelectedStandard] = useState('IS 16102 (Part 1):2012');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'LED_Bulb_TestReport.pdf',
    'Product_Datasheet.pdf',
  ]);
  const [isValidating, setIsValidating] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Step 5: trigger validation animation and redirect to Result (Screen 09)
      setIsValidating(true);
      setTimeout(() => {
        setIsValidating(false);
        navigate('/compliance/result');
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Page Header (Screen 08) */}
      <PageHeader
        title="Compliance Validator"
        description="Verify product compliance against mandatory Indian Standards and technical specifications."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Compliance Validator' },
        ]}
      />

      {/* 5-Step Progress Wizard Bar (Reference Screen 08) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center mx-auto text-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                          ? 'bg-[#063b73] text-white ring-4 ring-blue-100'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                  </div>
                  <span
                    className={`mt-1.5 text-[11px] font-bold ${isCurrent
                        ? 'text-[#063b73]'
                        : isCompleted
                          ? 'text-emerald-700'
                          : 'text-slate-400'
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-full mx-2 ${step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Form Card (Reference Screen 08) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        {/* Step 1: Product / Service Information */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Product / Service Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide core specifications of the product undergoing compliance audit.
              </p>
            </div>

            <div>
              <label htmlFor="comp-prod-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product / Service Name <span className="text-red-500">*</span>
              </label>
              <input
                id="comp-prod-name"
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. LED Bulb (9W)"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 outline-none focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="comp-prod-cat" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="comp-prod-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 outline-none focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="Electrical Appliances">Electrical Appliances</option>
                <option value="Civil & Construction">Civil &amp; Construction</option>
                <option value="Electronics & IT Goods">Electronics &amp; IT Goods</option>
                <option value="Food & Beverages">Food &amp; Beverages</option>
                <option value="Mechanical & Automotive">Mechanical &amp; Automotive</option>
              </select>
            </div>

            <div>
              <label htmlFor="comp-prod-desc" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description &amp; Intended Usage
              </label>
              <textarea
                id="comp-prod-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe product characteristics, rated wattage, voltage, intended operational environment..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 outline-none focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        )}

        {/* Step 2: Select Standard */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Select Applicable Indian Standard
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the standard governing your product category or let the assistant recommend one.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  code: 'IS 16102 (Part 1):2012',
                  title: 'Self-Ballasted LED Lamps for General Lighting Services — Safety',
                  recommended: true,
                },
                {
                  code: 'IS 16102 (Part 2):2012',
                  title: 'Self-Ballasted LED Lamps — Performance Requirements',
                  recommended: false,
                },
                {
                  code: 'IS 302 (Part 1):2008',
                  title: 'Safety of Household and Similar Electrical Appliances',
                  recommended: false,
                },
              ].map((std) => (
                <div
                  key={std.code}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedStandard(std.code)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedStandard(std.code);
                    }
                  }}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedStandard === std.code
                      ? 'border-[#063b73] bg-blue-50/50 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <input
                    id={`standard-radio-${std.code.replace(/[^a-zA-Z0-9]/g, '-')}`}
                    type="radio"
                    name="standard"
                    aria-label={`${std.code}: ${std.title}`}
                    checked={selectedStandard === std.code}
                    onChange={() => setSelectedStandard(std.code)}
                    className="mt-1 text-[#063b73] focus:ring-[#063b73]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{std.code}</span>
                      {std.recommended && (
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{std.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Requirements */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Mandatory Requirements for {selectedStandard}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review the 5 major compliance checkpoints that will be evaluated.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">Clause 5.1: Power Consumption Tolerance</span>
                  <p className="text-slate-500">Active power consumed shall not exceed rated wattage by &gt;10%.</p>
                </div>
                <span className="font-semibold text-emerald-600">Mandatory</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">Clause 5.2: Initial Luminous Flux</span>
                  <p className="text-slate-500">Must deliver at least 90% of rated lumens.</p>
                </div>
                <span className="font-semibold text-emerald-600">Mandatory</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">Clause 6.1: High Voltage Insulation Safety</span>
                  <p className="text-slate-500">Protection against accidental electric shock contact.</p>
                </div>
                <span className="font-semibold text-emerald-600">Critical</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">Clause 7.2: Marking &amp; Labelling</span>
                  <p className="text-slate-500">Legible brand name, rated voltage, wattage, and BIS CRS logo.</p>
                </div>
                <span className="font-semibold text-emerald-600">Mandatory</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Upload Evidence */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Upload Test Reports &amp; Evidence
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Attach lab test reports, product datasheets, and certification images.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
              <p className="mt-2 text-xs sm:text-sm font-bold text-slate-700">
                Drag and drop test reports or browse files
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports PDF, JPG, PNG up to 25 MB
              </p>
              <button
                type="button"
                onClick={() => setUploadedFiles((prev) => [...prev, 'Lab_Safety_Certificate.pdf'])}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                + Add Sample Document
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">Attached Documents:</p>
              {uploadedFiles.map((file, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#063b73]" />
                    <span className="font-semibold text-slate-800">{file}</span>
                  </div>
                  <span className="text-emerald-600 font-semibold">Ready</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Validate */}
        {currentStep === 5 && (
          <div className="space-y-5 text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#063b73]">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Ready to Run Compliance Audit
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                The assistant will extract clauses from <strong>{selectedStandard}</strong>, compare evidence from your uploaded documents, and generate a requirement-level compliance determination.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-w-sm mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Product:</span>
                <span className="font-bold text-slate-800">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Standard:</span>
                <span className="font-bold text-slate-800">{selectedStandard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Evidence Files:</span>
                <span className="font-bold text-slate-800">{uploadedFiles.length} attached</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions (Cancel, Back, Next / Validate) */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isValidating}
            className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] transition-all disabled:opacity-50"
          >
            {isValidating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Validating Requirements...</span>
              </>
            ) : currentStep === 5 ? (
              <>
                <span>Run Validation Audit</span>
                <FileCheck2 className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
