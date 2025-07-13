'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'blue' | 'emerald' | 'purple';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: Record<string, string>;
  setCustomColors: (colors: Record<string, string>) => void;
  applyCustomTheme: (colors: Record<string, string>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [customColors, setCustomColors] = useState<Record<string, string>>({});

  // 테마 적용 함수
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // 기존 테마 클래스 제거
    root.classList.remove('dark');
    root.removeAttribute('data-theme');

    // 새 테마 적용
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (newTheme !== 'light') {
      root.setAttribute('data-theme', newTheme);
    }

    // 로컬 스토리지에 저장
    localStorage.setItem('theme', newTheme);
  };

  // 커스텀 색상 적용 함수
  const applyCustomTheme = (colors: Record<string, string>) => {
    const root = document.documentElement;
    
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    setCustomColors(colors);
    localStorage.setItem('customColors', JSON.stringify(colors));
  };

  // 테마 변경 함수
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // 초기 테마 로드
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedCustomColors = localStorage.getItem('customColors');

    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }

    if (savedCustomColors) {
      try {
        const parsedColors = JSON.parse(savedCustomColors);
        applyCustomTheme(parsedColors);
      } catch (error) {
        console.warn('Failed to parse custom colors from localStorage');
      }
    }
  }, []);

  const value: ThemeContextType = {
    theme,
    setTheme: handleSetTheme,
    customColors,
    setCustomColors,
    applyCustomTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}