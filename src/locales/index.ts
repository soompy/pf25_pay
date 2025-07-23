import { ko } from './ko';
import { en } from './en';

export const translations = {
  ko,
  en,
};

export type Language = 'ko' | 'en';
export type TranslationKey = keyof typeof ko.common | 
                            `common.${keyof typeof ko.common}` |
                            `homepage.${keyof typeof ko.homepage}` |
                            `auth.${keyof typeof ko.auth}` |
                            `dashboard.${keyof typeof ko.dashboard}`;

// Helper function to get nested translation value
export function getNestedTranslation(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}