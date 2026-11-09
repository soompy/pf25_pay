'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  translations,
  Language,
  getNestedTranslation,
  TranslationSection,
  SectionTranslations,
} from '@/locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getTranslations: <S extends TranslationSection>(section: S) => SectionTranslations<S>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('safepay-language') as Language;
    if (savedLanguage && ['ko', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('safepay-language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Get translations for a specific section
  // Every language pack shares the Korean pack's shape, so results are typed against it.
  const getTranslations = <S extends TranslationSection>(section: S): SectionTranslations<S> => {
    return translations[language][section] as SectionTranslations<S>;
  };

  // Main translation function with nested key support and interpolation
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation: string;

    // Check if key contains section prefix (e.g., "homepage.hero.title")
    if (key.includes('.')) {
      const [section, ...keyPath] = key.split('.');
      const sectionTranslations = translations[language][section as TranslationSection];
      
      if (sectionTranslations) {
        translation = getNestedTranslation(sectionTranslations, keyPath.join('.'));
      } else {
        translation = key;
      }
    } else {
      // Fallback to common section for simple keys
      translation = getNestedTranslation(translations[language].common, key) || key;
    }

    // Handle parameter interpolation
    if (params && typeof translation === 'string') {
      return Object.entries(params).reduce((text, [key, value]) => {
        return text.replace(`{{${key}}}`, String(value));
      }, translation);
    }

    return translation;
  };

  const value = {
    language,
    setLanguage,
    t,
    getTranslations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}