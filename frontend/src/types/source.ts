import { UUID, ISODateString, RelevanceLevel } from './common';

export type SourceType = 'indian_standard' | 'scheme_document' | 'guideline' | 'faq' | 'circular' | 'web_page' | 'demo_dataset';

export interface Source {
  id: UUID;
  citationIndex: number;
  title: string;
  documentId: UUID;
  documentName: string;
  sourceType: SourceType;
  standardNumber?: string;
  section?: string;
  clause?: string;
  page?: number;
  version?: string;
  authority: string;
  publicationDate?: ISODateString;
  lastIndexedAt?: ISODateString;
  url?: string;
  isOfficial: boolean;
  isDemo: boolean;
  relevance: RelevanceLevel;
  relevanceScore?: number;
  excerpt?: string;
}

export type DocumentIndexStatus = 'indexed' | 'processing' | 'failed' | 'not_indexed';

export interface DocumentSection {
  id: string;
  number: string;
  title: string;
  content?: string;
  page?: number;
  children?: DocumentSection[];
}

export interface Document {
  id: UUID;
  title: string;
  documentType: SourceType;
  standardNumber?: string;
  version?: string;
  authority: string;
  publicationDate?: ISODateString;
  lastIndexedAt?: ISODateString;
  indexStatus: DocumentIndexStatus;
  pageCount?: number;
  sectionCount?: number;
  url?: string;
  isFullTextAvailable: boolean;
  isDemo: boolean;
  sections?: DocumentSection[];
}
