import { z } from 'zod';
import { SourceSchema } from './sources.schema';
import { ProcessStepSchema } from './certification.schema';
import { createPaginatedSchema } from './common.schema';

export const BISServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['certification', 'standards', 'testing', 'hallmarking', 'licensing', 'consumer', 'training', 'other']),
  shortDescription: z.string(),
  description: z.string().optional(),
  audience: z.array(z.enum(['industry', 'msme', 'startup', 'consumer', 'student', 'researcher'])),
  howToAvail: z.array(ProcessStepSchema).optional(),
  relatedServiceIds: z.array(z.string()),
  relatedStandardIds: z.array(z.string()),
  officialUrl: z.string().optional(),
  sources: z.array(SourceSchema),
  isDemo: z.boolean()
});

export const ServicesListResponseSchema = createPaginatedSchema(BISServiceSchema);
