'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCommonTranslation } from '@/hooks/useTranslation';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function LanguageSwitcher({ 
  variant = 'dropdown', 
  size = 'md',
  showLabel = false 
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const { t, translations } = useCommonTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ] as const;

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode: 'ko' | 'en') => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              ${sizeClasses[size]} rounded-lg font-medium transition-all duration-200
              ${language === lang.code 
                ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border-2 border-[var(--color-primary-300)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }
            `}
          >
            <span className="flex items-center space-x-1">
              <span>{lang.flag}</span>
              {showLabel && <span>{lang.name}</span>}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${sizeClasses[size]} rounded-lg font-medium transition-all duration-200
          flex items-center space-x-2 
          text-[var(--text-secondary)] hover:text-[var(--text-primary)] 
          hover:bg-[var(--bg-tertiary)]
          border border-transparent hover:border-[var(--border-primary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]
        `}
        aria-label="Language selector"
      >
        <Globe className={iconSizes[size]} />
        {showLabel && (
          <>
            <span>{currentLanguage?.name}</span>
            <ChevronDown className={`${iconSizes[size]} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
        {!showLabel && (
          <ChevronDown className={`${iconSizes[size]} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-20 min-w-[180px] 
                         bg-[var(--bg-primary)] border border-[var(--border-primary)] 
                         rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <div className="flex items-center space-x-2">
                  <Languages className="w-4 h-4 text-[var(--color-primary-600)]" />
                  <span className="font-medium text-[var(--text-primary)]">
                    {translations.settingsNav.language}
                  </span>
                </div>
              </div>

              {/* Language Options */}
              <div className="py-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`
                      w-full px-4 py-3 text-left transition-all duration-150
                      flex items-center justify-between
                      hover:bg-[var(--bg-tertiary)]
                      ${language === lang.code 
                        ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-r-3 border-[var(--color-primary-500)]'
                        : 'text-[var(--text-primary)]'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </div>
                    
                    {language === lang.code && (
                      <div className="w-2 h-2 bg-[var(--color-primary-500)] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <p className="text-xs text-[var(--text-tertiary)]">
                  {translations.language.korean} / {translations.language.english}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}