import { z } from 'zod';

export const SourceSchema = z.object({
  id: z.string(),
  citationIndex: z.number(),
  title: z.string(),
  documentId: z.string(),
  documentName: z.string(),
  sourceType: z.enum(['indian_standard', 'scheme_document', 'guideline', 'faq', 'circular', 'web_page', 'demo_dataset']),
  standardNumber: z.string().nullish(),
  section: z.string().nullish(),
  clause: z.string().nullish(),
  page: z.number().nullish(),
  version: z.string().nullish(),
  authority: z.string(),
  publicationDate: z.string().nullish(),
  lastIndexedAt: z.string().nullish(),
  url: z.string().nullish(),
  isOfficial: z.boolean(),
  isDemo: z.boolean(),
  relevance: z.enum(['high', 'medium', 'low']),
  relevanceScore: z.number().nullish(),
  excerpt: z.string().nullish()
});

const DocumentSectionSchemaBase = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  content: z.string().optional(),
  page: z.number().optional()
});

export type DocumentSectionSchemaType = z.infer<typeof DocumentSectionSchemaBase> & {
  children?: DocumentSectionSchemaType[];
};

export const DocumentSectionSchema: z.ZodType<DocumentSectionSchemaType> = DocumentSectionSchemaBase.extend({
  children: z.lazy(() => z.array(DocumentSectionSchema).optional())
});

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  documentType: z.enum(['indian_standard', 'scheme_document', 'guideline', 'faq', 'circular', 'web_page', 'demo_dataset']),
  standardNumber: z.string().optional(),
  version: z.string().optional(),
  authority: z.string(),
  publicationDate: z.string().optional(),
  lastIndexedAt: z.string().optional(),
  indexStatus: z.enum(['indexed', 'processing', 'failed', 'not_indexed']),
  pageCount: z.number().optional(),
  sectionCount: z.number().optional(),
  url: z.string().optional(),
  isFullTextAvailable: z.boolean(),
  isDemo: z.boolean(),
  sections: z.array(DocumentSectionSchema).optional()
});
