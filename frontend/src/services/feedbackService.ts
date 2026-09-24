import { apiClient } from '@/api/client';
import { FeedbackRequestSchema } from '@/api/schemas/feedback.schema';
import { Feedback } from '@/types/feedback';

export const feedbackService = {
  async submit(feedback: Feedback): Promise<void> {
    const payload = FeedbackRequestSchema.parse(feedback);
    await apiClient.post('/feedback', payload);
  }
};
