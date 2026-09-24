import { z } from 'zod';

export function createPaginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    hasMore: z.boolean(),
  });
}

export const ApiErrorSchema = z.object({
  code: z.string(),
  messageKey: z.string(),
  detail: z.string().optional(),
  correlationId: z.string().optional(),
});
