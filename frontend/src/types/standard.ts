import { UUID } from './common';
import { LanguageCode } from './language';

export type StandardStatus = 'active' | 'reaffirmed' | 'superseded' | 'withdrawn' | 'draft' | 'unknown';

export interface StandardReference {
  id: UUID;
  standardNumber: string;
  title: string;
  status: StandardStatus;
}

export type RelationshipType = 'references' | 'referenced_by' | 'supersedes' | 'superseded_by' | 'amendment' | 'part_of' | 'similar';

export type RelatedStandard = StandardReference & {
  relationship: RelationshipType;
  note?: string;
};

export interface StandardClause {
  id: string;
  number: string;
  title: string;
  text?: string;
  page?: number;
  children?: StandardClause[];
}

export interface CertificationRelevance {
  isCertifiable: boolean;
  schemeIds: string[];
  isMandatory?: boolean;
  notes?: string;
}

export type Standard = StandardReference & {
  year?: number;
  reaffirmedYear?: number;
  revision?: string;
  description?: string;
  scope?: string;
  sectors: string[];
  categories: string[];
  icsCode?: string;
  language: LanguageCode;
  pageCount?: number;
  clauses: StandardClause[];
  relatedStandards: RelatedStandard[];
  certificationRelevance?: CertificationRelevance;
  sourceDocumentId?: UUID;
  officialUrl?: string;
  isFullTextAvailable: boolean;
  isDemo: boolean;
};
