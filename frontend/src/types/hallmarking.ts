import { Source } from './source';
import { ProcessStep, FaqItem } from './certification';

export interface HallmarkComponent {
  key: string;
  label: string;
  description: string;
}

export interface PurityGrade {
  karat: string;
  fineness: string;
  description?: string;
}

export interface HallmarkingInfo {
  id: string;
  overview: string;
  hallmarkComponents: HallmarkComponent[];
  purityGrades: PurityGrade[];
  process: ProcessStep[];
  consumerGuidance: string[];
  jewellerGuidance: string[];
  faqs: FaqItem[];
  relatedStandardIds: string[];
  relatedServiceIds: string[];
  sources: Source[];
  isDemo: boolean;
}
