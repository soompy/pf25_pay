'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StyleOverrideOptions {
  // 기본 클래스 이름들
  baseClasses?: string;
  // 조건부 클래스들
  conditionalClasses?: Record<string, boolean>;
  // 사용자 정의 클래스
  customClasses?: string;
  // 인라인 스타일
  inlineStyles?: React.CSSProperties;
  // 테마별 클래스 오버라이드
  themeOverrides?: Record<string, string>;
  // 반응형 클래스
  responsiveClasses?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}

export function useStyleOverride(options: StyleOverrideOptions) {
  const {
    baseClasses = '',
    conditionalClasses = {},
    customClasses = '',
    inlineStyles = {},
    themeOverrides = {},
    responsiveClasses = {},
  } = options;

  const computedClasses = useMemo(() => {
    const classes: string[] = [];

    // 기본 클래스 추가
    if (baseClasses) {
      classes.push(baseClasses);
    }

    // 조건부 클래스 추가
    Object.entries(conditionalClasses).forEach(([className, condition]) => {
      if (condition) {
        classes.push(className);
      }
    });

    // 반응형 클래스 추가
    Object.entries(responsiveClasses).forEach(([breakpoint, className]) => {
      if (className) {
        const prefix = breakpoint === 'sm' ? 'sm:' : 
                      breakpoint === 'md' ? 'md:' :
                      breakpoint === 'lg' ? 'lg:' : 
                      breakpoint === 'xl' ? 'xl:' : '';
        classes.push(`${prefix}${className}`);
      }
    });

    // 테마 오버라이드 적용
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (themeOverrides[currentTheme]) {
      classes.push(themeOverrides[currentTheme]);
    }

    // 사용자 정의 클래스 추가 (우선순위 높음)
    if (customClasses) {
      classes.push(customClasses);
    }

    return cn(...classes);
  }, [baseClasses, conditionalClasses, customClasses, themeOverrides, responsiveClasses]);

  const computedStyles = useMemo(() => {
    return { ...inlineStyles };
  }, [inlineStyles]);

  return {
    className: computedClasses,
    style: computedStyles,
  };
}

// 특정 컴포넌트를 위한 헬퍼 훅들
export function useButtonStyles(overrides: Partial<StyleOverrideOptions> = {}) {
  return useStyleOverride({
    baseClasses: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
    ...overrides,
  });
}

export function useCardStyles(overrides: Partial<StyleOverrideOptions> = {}) {
  return useStyleOverride({
    baseClasses: 'rounded-xl border bg-background-primary text-text-primary shadow-sm',
    ...overrides,
  });
}

export function useInputStyles(overrides: Partial<StyleOverrideOptions> = {}) {
  return useStyleOverride({
    baseClasses: 'flex w-full rounded-lg border border-border-primary bg-background-primary px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus disabled:cursor-not-allowed disabled:opacity-50',
    ...overrides,
  });
}

// 다크모드 감지 훅
export function useDarkMode() {
  const isDark = typeof window !== 'undefined' && 
    (document.documentElement.classList.contains('dark') || 
     document.documentElement.getAttribute('data-theme') === 'dark');
  
  return isDark;
}

// 현재 테마 감지 훅
export function useCurrentTheme() {
  if (typeof window === 'undefined') return 'light';
  
  const themeAttr = document.documentElement.getAttribute('data-theme');
  const hasLightClass = document.documentElement.classList.contains('light');
  const hasDarkClass = document.documentElement.classList.contains('dark');
  
  if (themeAttr) return themeAttr;
  if (hasDarkClass) return 'dark';
  if (hasLightClass) return 'light';
  
  return 'light';
}