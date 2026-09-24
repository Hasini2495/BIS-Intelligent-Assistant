import { z } from 'zod';

export const FeedbackSchema = z.object({
  id: z.string().optional(),
  messageId: z.string(),
  conversationId: z.string(),
  rating: z.enum(['helpful', 'not_helpful']),
  reasons: z.array(z.enum(['inaccurate', 'missing_source', 'incomplete', 'wrong_standard', 'hard_to_understand', 'wrong_language', 'other'])).optional(),
  comment: z.string().optional(),
  submittedAt: z.string()
});

export const FeedbackRequestSchema = FeedbackSchema.omit({ id: true, submittedAt: true });
