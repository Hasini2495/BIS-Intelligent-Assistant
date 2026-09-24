import { z } from 'zod';
import { createPaginatedSchema } from './common.schema';

export const ConversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  language: z.string(),
  messageCount: z.number(),
  lastMessagePreview: z.string().optional(),
  isArchived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const ConversationsListResponseSchema = createPaginatedSchema(ConversationSchema);
