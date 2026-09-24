import { UUID, ISODateString } from './common';

export type FeedbackRating = 'helpful' | 'not_helpful';
export type FeedbackReason = 'inaccurate' | 'missing_source' | 'incomplete' | 'wrong_standard' | 'hard_to_understand' | 'wrong_language' | 'other';

export interface Feedback {
  id?: UUID;
  messageId: UUID;
  conversationId: UUID;
  rating: FeedbackRating;
  reasons?: FeedbackReason[];
  comment?: string;
  submittedAt: ISODateString;
}
