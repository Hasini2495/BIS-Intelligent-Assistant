import { z } from 'zod';
import { SourceSchema } from './sources.schema';
import { TestingRequirementSchema } from './testing.schema';

export const SourceRefSchema = z.object({
  sourceId: z.string(),
  standardNumber: z.string().optional(),
  clause: z.string().optional(),
  page: z.number().optional()
});

export const ProcessStepSchema = z.object({
  order: z.number(),
  title: z.string(),
  description: z.string(),
  estimatedDuration: z.string().optional(),
  actor: z.enum(['applicant', 'bis', 'laboratory', 'third_party']),
  requiredDocumentIds: z.array(z.string()).optional(),
  sourceRef: SourceRefSchema.optional()
});

export const RequiredDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isMandatory: z.boolean(),
  format: z.string().optional(),
  sourceRef: SourceRefSchema.optional()
});

export const FaqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  sourceRef: SourceRefSchema.optional()
});

export const CertificationSchemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  description: z.string(),
  audience: z.array(z.enum(['industry', 'msme', 'foreign_manufacturer', 'consumer'])),
  isMandatoryForSomeProducts: z.boolean(),
  eligibility: z.array(z.string()),
  process: z.array(ProcessStepSchema),
  requiredDocuments: z.array(RequiredDocumentSchema),
  testingRequirements: z.array(TestingRequirementSchema),
  faqs: z.array(FaqItemSchema),
  relatedStandardIds: z.array(z.string()),
  sources: z.array(SourceSchema),
  officialUrl: z.string().optional(),
  isDemo: z.boolean()
});
