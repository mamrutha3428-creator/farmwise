import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, LanguageConfig, getLanguage } from '../locales/languages';
import { getTranslation } from '../locales/translations';

interface I18nContextType {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  isRtl: boolean;
  currentLangConfig: LanguageConfig;
  supportedLanguages: LanguageConfig[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('farmwise_lang') || 'en';
  });

  const currentLangConfig = getLanguage(language);
  const isRtl = currentLangConfig.rtl;

  useEffect(() => {
    localStorage.setItem('farmwise_lang', language);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  const setLanguage = (code: string) => {
    setLanguageState(code);
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRtl,
        currentLangConfig,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
