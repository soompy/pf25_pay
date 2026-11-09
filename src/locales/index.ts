import { ko } from './ko';
import { en } from './en';

export const translations = {
  ko,
  en,
};

export type Language = 'ko' | 'en';
export type TranslationSection = keyof typeof ko;
export type SectionTranslations<S extends TranslationSection> = (typeof ko)[S];
export type TranslationKey = keyof typeof ko.common | 
                            `common.${keyof typeof ko.common}` |
                            `homepage.${keyof typeof ko.homepage}` |
                            `auth.${keyof typeof ko.auth}` |
                            `dashboard.${keyof typeof ko.dashboard}`;

// Helper function to get nested translation value
export function getNestedTranslation(obj: unknown, path: string): string {
  let current: unknown = obj;
  for (const key of path.split('.')) {
    if (current === null || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' && current ? current : path;
}
