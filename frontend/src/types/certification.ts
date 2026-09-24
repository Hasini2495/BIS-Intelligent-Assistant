import { UUID } from './common';
import { Source } from './source';
import { TestingRequirement } from './testing';

export interface SourceRef {
  sourceId: UUID;
  standardNumber?: string;
  clause?: string;
  page?: number;
}

export interface ProcessStep {
  order: number;
  title: string;
  description: string;
  estimatedDuration?: string;
  actor: 'applicant' | 'bis' | 'laboratory' | 'third_party';
  requiredDocumentIds?: string[];
  sourceRef?: SourceRef;
}

export interface RequiredDocument {
  id: string;
  name: string;
  description?: string;
  isMandatory: boolean;
  format?: string;
  sourceRef?: SourceRef;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sourceRef?: SourceRef;
}

export interface CertificationScheme {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  audience: ('industry' | 'msme' | 'foreign_manufacturer' | 'consumer')[];
  isMandatoryForSomeProducts: boolean;
  eligibility: string[];
  process: ProcessStep[];
  requiredDocuments: RequiredDocument[];
  testingRequirements: TestingRequirement[];
  faqs: FaqItem[];
  relatedStandardIds: string[];
  sources: Source[];
  officialUrl?: string;
  isDemo: boolean;
}
