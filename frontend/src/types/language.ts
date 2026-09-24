export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn' | 'gu' | 'or' | 'pa' | 'ur';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  script: string;
  isSupported: boolean;
  supportsAnswers: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', script: 'Latin', isSupported: true, supportsAnswers: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', script: 'Devanagari', isSupported: true, supportsAnswers: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', script: 'Telugu', isSupported: true, supportsAnswers: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', script: 'Tamil', isSupported: true, supportsAnswers: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr', script: 'Kannada', isSupported: true, supportsAnswers: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr', script: 'Malayalam', isSupported: true, supportsAnswers: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', script: 'Devanagari', isSupported: true, supportsAnswers: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', script: 'Bengali', isSupported: true, supportsAnswers: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr', script: 'Gujarati', isSupported: true, supportsAnswers: false },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', direction: 'ltr', script: 'Odia', isSupported: true, supportsAnswers: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', script: 'Gurmukhi', isSupported: true, supportsAnswers: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', script: 'Arabic', isSupported: true, supportsAnswers: false }
];
