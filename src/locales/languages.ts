export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  region: 'Indian' | 'International';
  rtl: boolean;
  voiceCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  // Indian Languages
  { code: 'en', name: 'English', nativeName: 'English', region: 'Indian', rtl: false, voiceCode: 'en-US' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Indian', rtl: false, voiceCode: 'te-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'Indian', rtl: false, voiceCode: 'hi-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Indian', rtl: false, voiceCode: 'ta-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Indian', rtl: false, voiceCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Indian', rtl: false, voiceCode: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Indian', rtl: false, voiceCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'Indian', rtl: false, voiceCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Indian', rtl: false, voiceCode: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Indian', rtl: false, voiceCode: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Indian', rtl: false, voiceCode: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Indian', rtl: false, voiceCode: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Indian', rtl: true, voiceCode: 'ur-PK' },

  // International Languages
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'International', rtl: false, voiceCode: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'International', rtl: false, voiceCode: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'International', rtl: false, voiceCode: 'de-DE' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'International', rtl: true, voiceCode: 'ar-SA' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'International', rtl: false, voiceCode: 'pt-BR' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', region: 'International', rtl: false, voiceCode: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'International', rtl: false, voiceCode: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'International', rtl: false, voiceCode: 'ko-KR' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'International', rtl: false, voiceCode: 'ru-RU' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'International', rtl: false, voiceCode: 'id-ID' },
];

export function getLanguage(code: string): LanguageConfig {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}
