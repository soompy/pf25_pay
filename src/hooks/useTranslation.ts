'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales';

/**
 * Hook for getting translations for a specific page/section
 * Usage: const { t, translations: pageTranslations } = useTranslation('homepage');
 */
export function useTranslation(section: keyof typeof translations.ko) {
  const { language, t: globalT, getTranslations } = useLanguage();
  
  const pageTranslations = getTranslations(section);
  
  // Section-specific translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    return globalT(`${section}.${key}`, params);
  };

  return {
    t,
    translations: pageTranslations,
    language,
  };
}

/**
 * Hook for getting common translations (navigation, buttons, etc.)
 * Usage: const { t } = useCommonTranslation();
 */
export function useCommonTranslation() {
  const { t: globalT, language, getTranslations } = useLanguage();
  
  const commonTranslations = getTranslations('common');
  
  // Common translation function (no section prefix needed)
  const t = (key: string, params?: Record<string, string | number>): string => {
    return globalT(key, params);
  };

  return {
    t,
    translations: commonTranslations,
    language,
  };
}

/**
 * Hook for getting navigation-specific translations
 * Usage: const { nav } = useNavTranslation();
 */
export function useNavTranslation() {
  const { getTranslations, language } = useLanguage();
  const commonTranslations = getTranslations('common');
  
  return {
    nav: commonTranslations.nav,
    theme: commonTranslations.theme,
    language: commonTranslations.language,
    currentLang: language,
  };
}

/**
 * Hook for getting form validation translations
 * Usage: const { validation } = useValidationTranslation();
 */
export function useValidationTranslation() {
  const { getTranslations } = useLanguage();
  const authTranslations = getTranslations('auth');
  const commonTranslations = getTranslations('common');
  
  return {
    validation: authTranslations.validation,
    errors: commonTranslations.errors,
  };
}