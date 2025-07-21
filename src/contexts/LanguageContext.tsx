'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, getNestedTranslation } from '@/locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getTranslations: (section: keyof typeof translations.ko) => any;
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
  const getTranslations = (section: keyof typeof translations.ko) => {
    return translations[language][section];
  };

  // Main translation function with nested key support and interpolation
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation: string;

    // Check if key contains section prefix (e.g., "homepage.hero.title")
    if (key.includes('.')) {
      const [section, ...keyPath] = key.split('.');
      const sectionTranslations = translations[language][section as keyof typeof translations.ko];
      
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