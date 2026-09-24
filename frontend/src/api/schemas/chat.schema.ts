import { z } from 'zod';
import { SourceSchema } from './sources.schema';
import { StandardReferenceSchema } from './standards.schema';

export const ChatRequestSchema = z.object({
  message: z.string(),
  conversationId: z.string().optional(),
  language: z.string(),
});

export const EvidenceSnippetSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  text: z.string(),
  standardNumber: z.string().optional(),
  section: z.string().optional(),
  clause: z.string().optional(),
  page: z.number().optional(),
  relevance: z.enum(['high', 'medium', 'low']),
  citationIndex: z.number(),
});

export const GroundedAnswerSchema = z.object({
  status: z.enum(['grounded', 'partially_grounded', 'insufficient_evidence']),
  answerMarkdown: z.string(),
  summary: z.string().optional(),
  relevantStandards: z.array(StandardReferenceSchema),
  whyRelevant: z.string().optional(),
  evidence: z.array(EvidenceSnippetSchema),
  sources: z.array(SourceSchema),
  relatedQuestions: z.array(z.string()),
  insufficientEvidence: z.object({
    reasonKey: z.enum(['no_match', 'low_relevance', 'out_of_scope', 'not_indexed']),
    searchedScopes: z.array(z.string()),
    suggestions: z.array(z.string()),
  }).optional(),
  disclaimerKeys: z.array(z.string()),
  generatedAt: z.string(),
  modelLabel: z.string().optional(),
  retrievalLatencyMs: z.number().optional(),
  totalLatencyMs: z.number().optional(),
  isDemoData: z.boolean(),
});

export const QueryAnalysisSchema = z.object({
  intent: z.enum(['standard_search', 'standard_recommendation', 'standard_explanation', 'standard_comparison', 'related_standards', 'certification', 'certification_process', 'hallmarking', 'testing', 'laboratory', 'bis_service', 'consumer_query', 'general_bis_info', 'out_of_scope', 'unknown']),
  intentConfidence: z.number().optional(),
  entities: z.array(z.object({
    type: z.enum(['product', 'material', 'industry', 'standard_number', 'scheme', 'service', 'test', 'laboratory', 'location']),
    value: z.string(),
    normalizedValue: z.string().optional(),
    confidence: z.number().optional()
  })),
  detectedLanguage: z.string(),
  rewrittenQuery: z.string().optional()
});

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  status: z.enum(['pending', 'streaming', 'complete', 'error', 'cancelled']),
  language: z.string(),
  createdAt: z.string(),
  analysis: QueryAnalysisSchema.optional(),
  answer: GroundedAnswerSchema.optional(),
  error: z.object({
    code: z.string(),
    messageKey: z.string()
  }).optional()
});

export const ChatResponseSchema = z.object({
  message: MessageSchema,
  conversationId: z.string(),
  conversationTitle: z.string()
});
