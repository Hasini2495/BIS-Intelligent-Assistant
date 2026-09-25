import { z } from 'zod';
import { SourceSchema } from './sources.schema';
import { StandardReferenceSchema } from './standards.schema';

export const ChatRequestSchema = z.object({
  message: z.string(),
  conversationId: z.string().nullish(),
  language: z.string(),
});

export const EvidenceSnippetSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  text: z.string(),
  standardNumber: z.string().nullish(),
  section: z.string().nullish(),
  clause: z.string().nullish(),
  page: z.number().nullish(),
  relevance: z.enum(['high', 'medium', 'low']),
  citationIndex: z.number(),
});

export const GroundedAnswerSchema = z.object({
  status: z.enum(['grounded', 'partially_grounded', 'insufficient_evidence']),
  answerMarkdown: z.string(),
  summary: z.string().nullish(),
  relevantStandards: z.array(StandardReferenceSchema),
  whyRelevant: z.string().nullish(),
  evidence: z.array(EvidenceSnippetSchema),
  sources: z.array(SourceSchema),
  relatedQuestions: z.array(z.string()),
  insufficientEvidence: z.object({
    reasonKey: z.enum(['no_match', 'low_relevance', 'out_of_scope', 'not_indexed']),
    searchedScopes: z.array(z.string()),
    suggestions: z.array(z.string()),
  }).nullish(),
  disclaimerKeys: z.array(z.string()),
  generatedAt: z.string(),
  modelLabel: z.string().nullish(),
  retrievalLatencyMs: z.number().nullish(),
  totalLatencyMs: z.number().nullish(),
  isDemoData: z.boolean(),
});

export const QueryAnalysisSchema = z.object({
  intent: z.enum(['standard_search', 'standard_recommendation', 'standard_explanation', 'standard_comparison', 'related_standards', 'certification', 'certification_process', 'hallmarking', 'testing', 'laboratory', 'bis_service', 'consumer_query', 'general_bis_info', 'out_of_scope', 'unknown']),
  intentConfidence: z.number().nullish(),
  entities: z.array(z.object({
    type: z.enum(['product', 'material', 'industry', 'standard_number', 'scheme', 'service', 'test', 'laboratory', 'location']),
    value: z.string(),
    normalizedValue: z.string().nullish(),
    confidence: z.number().nullish()
  })),
  detectedLanguage: z.string(),
  rewrittenQuery: z.string().nullish()
});

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  status: z.enum(['pending', 'streaming', 'complete', 'error', 'cancelled']),
  language: z.string(),
  createdAt: z.string(),
  analysis: QueryAnalysisSchema.nullish(),
  answer: GroundedAnswerSchema.nullish(),
  error: z.object({
    code: z.string(),
    messageKey: z.string()
  }).nullish()
});

export const ChatResponseSchema = z.object({
  message: MessageSchema,
  conversationId: z.string(),
  conversationTitle: z.string()
});
