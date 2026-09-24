import { UUID, ISODateString, RelevanceLevel } from './common';
import { LanguageCode } from './language';
import { Source } from './source';
import { StandardReference } from './standard';

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error' | 'cancelled';
export type QueryIntent = 'standard_search' | 'standard_recommendation' | 'standard_explanation' | 'standard_comparison' | 'related_standards' | 'certification' | 'certification_process' | 'hallmarking' | 'testing' | 'laboratory' | 'bis_service' | 'consumer_query' | 'general_bis_info' | 'out_of_scope' | 'unknown';
export type EntityType = 'product' | 'material' | 'industry' | 'standard_number' | 'scheme' | 'service' | 'test' | 'laboratory' | 'location';

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  normalizedValue?: string;
  confidence?: number;
}

export interface QueryAnalysis {
  intent: QueryIntent;
  intentConfidence?: number;
  entities: ExtractedEntity[];
  detectedLanguage: LanguageCode;
  rewrittenQuery?: string;
}

export type EvidenceStatus = 'grounded' | 'partially_grounded' | 'insufficient_evidence';

export interface EvidenceSnippet {
  id: UUID;
  sourceId: UUID;
  text: string;
  standardNumber?: string;
  section?: string;
  clause?: string;
  page?: number;
  relevance: RelevanceLevel;
  citationIndex: number;
}

export interface GroundedAnswer {
  status: EvidenceStatus;
  answerMarkdown: string;
  summary?: string;
  relevantStandards: StandardReference[];
  whyRelevant?: string;
  evidence: EvidenceSnippet[];
  sources: Source[];
  relatedQuestions: string[];
  insufficientEvidence?: {
    reasonKey: 'no_match' | 'low_relevance' | 'out_of_scope' | 'not_indexed';
    searchedScopes: string[];
    suggestions: string[];
  };
  disclaimerKeys: string[];
  generatedAt: ISODateString;
  modelLabel?: string;
  retrievalLatencyMs?: number;
  totalLatencyMs?: number;
  isDemoData: boolean;
}

export interface Message {
  id: UUID;
  conversationId: UUID;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  language: LanguageCode;
  createdAt: ISODateString;
  analysis?: QueryAnalysis;
  answer?: GroundedAnswer;
  error?: {
    code: string;
    messageKey: string;
  };
}

export interface ChatRequest {
  message: string;
  conversationId?: UUID;
  language: LanguageCode;
}

export interface ChatResponse {
  message: Message;
  conversationId: UUID;
  conversationTitle: string;
}
