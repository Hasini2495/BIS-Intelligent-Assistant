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
  year: z.number().nullish(),
  reaffirmedYear: z.number().nullish(),
  revision: z.string().nullish(),
  description: z.string().nullish(),
  scope: z.string().nullish(),
  sectors: z.array(z.string()),
  categories: z.array(z.string()),
  icsCode: z.string().nullish(),
  language: z.string(),
  pageCount: z.number().nullish(),
  clauses: z.array(StandardClauseSchema),
  relatedStandards: z.array(StandardReferenceSchema.extend({
    relationship: z.enum(['references', 'referenced_by', 'supersedes', 'superseded_by', 'amendment', 'part_of', 'similar']),
    note: z.string().nullish()
  })),
  certificationRelevance: z.object({
    isCertifiable: z.boolean(),
    schemeIds: z.array(z.string()),
    isMandatory: z.boolean().nullish(),
    notes: z.string().nullish()
  }).nullish(),
  sourceDocumentId: z.string().nullish(),
  officialUrl: z.string().nullish(),
  isFullTextAvailable: z.boolean(),
  isDemo: z.boolean()
});

export const StandardsListResponseSchema = createPaginatedSchema(StandardSchema);
