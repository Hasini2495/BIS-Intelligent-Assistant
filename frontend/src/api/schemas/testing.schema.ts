import { z } from 'zod';
import { SourceSchema } from './sources.schema';
import { SourceRefSchema } from './certification.schema';


export const TestingRequirementSchema = z.object({
  id: z.string(),
  testName: z.string(),
  description: z.string().optional(),
  testType: z.enum(['mechanical', 'chemical', 'electrical', 'safety', 'performance', 'dimensional', 'environmental', 'other']),
  applicableProductCategories: z.array(z.string()),
  standardId: z.string().optional(),
  standardNumber: z.string().optional(),
  clause: z.string().optional(),
  method: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  sourceRef: SourceRefSchema.optional(),
  isDemo: z.boolean()
});

export const LaboratorySchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string().optional(),
  state: z.string().optional(),
  region: z.string().optional(),
  recognitionType: z.enum(['bis_recognized', 'nabl_accredited', 'in_house', 'unknown']).optional(),
  recognitionNumber: z.string().optional(),
  validUntil: z.string().optional(),
  scopes: z.array(z.string()),
  disciplines: z.array(z.string()),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional()
  }).optional(),
  sources: z.array(SourceSchema),
  isDemo: z.boolean(),
  dataDisclaimerKey: z.string()
});
