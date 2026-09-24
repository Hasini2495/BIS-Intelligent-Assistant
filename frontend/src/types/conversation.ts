import { UUID, ISODateString } from './common';
import { LanguageCode } from './language';

export interface Conversation {
  id: UUID;
  title: string;
  language: LanguageCode;
  messageCount: number;
  lastMessagePreview?: string;
  isArchived: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
