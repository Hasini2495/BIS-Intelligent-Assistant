import { UUID, ISODateString } from './common';
import { LanguageCode } from './language';

export type UserRole = 'guest' | 'user' | 'admin';
export type UserType = 'industry' | 'msme' | 'startup' | 'consumer' | 'student' | 'researcher' | 'other';

export interface UserPreferences {
  interfaceLanguage: LanguageCode;
  answerLanguage: LanguageCode;
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact';
  showSources: boolean;
  showRelatedQuestions: boolean;
  showIntent: boolean;
  fontScale: 90 | 100 | 115 | 130;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface User {
  id: UUID;
  name: string;
  email?: string;
  role: UserRole;
  organization?: string;
  userType?: UserType;
  preferences: UserPreferences;
  createdAt: ISODateString;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  interfaceLanguage: 'en',
  answerLanguage: 'en',
  theme: 'system',
  density: 'comfortable',
  showSources: true,
  showRelatedQuestions: true,
  showIntent: false,
  fontScale: 100,
  reducedMotion: false,
  highContrast: false,
};
