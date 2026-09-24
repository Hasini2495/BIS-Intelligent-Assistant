import { z } from 'zod';
import { createPaginatedSchema } from './common.schema';

export const StandardReferenceSchema = z.object({
  id: z.string(),
  standardNumber: z.string(),
  title: z.string(),
  status: z.enum(['active', 'reaffirmed', 'superseded', 'withdrawn', 'draft', 'unknown'])
});

const StandardClauseSchemaBase = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  text: z.string().optional(),
  page: z.number().optional()
});

export type StandardClauseSchemaType = z.infer<typeof StandardClauseSchemaBase> & {
  children?: StandardClauseSchemaType[];
};

export const StandardClauseSchema: z.ZodType<StandardClauseSchemaType> = StandardClauseSchemaBase.extend({
  children: z.lazy(() => z.array(StandardClauseSchema).optional())
});

export const StandardSchema = StandardReferenceSchema.extend({
  year: z.number().optional(),
  reaffirmedYear: z.number().optional(),
  revision: z.string().optional(),
  description: z.string().optional(),
  scope: z.string().optional(),
  sectors: z.array(z.string()),
  categories: z.array(z.string()),
  icsCode: z.string().optional(),
  language: z.string(),
  pageCount: z.number().optional(),
  clauses: z.array(StandardClauseSchema),
  relatedStandards: z.array(StandardReferenceSchema.extend({
    relationship: z.enum(['references', 'referenced_by', 'supersedes', 'superseded_by', 'amendment', 'part_of', 'similar']),
    note: z.string().optional()
  })),
  certificationRelevance: z.object({
    isCertifiable: z.boolean(),
    schemeIds: z.array(z.string()),
    isMandatory: z.boolean().optional(),
    notes: z.string().optional()
  }).optional(),
  sourceDocumentId: z.string().optional(),
  officialUrl: z.string().optional(),
  isFullTextAvailable: z.boolean(),
  isDemo: z.boolean()
});

export const StandardsListResponseSchema = createPaginatedSchema(StandardSchema);
