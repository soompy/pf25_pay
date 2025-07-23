'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Sun, 
  Moon, 
  Check,
  Settings
} from 'lucide-react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { Button } from '../atoms/Button';

interface ThemeSwitcherProps {
  showCustomizer?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dropdown' | 'inline' | 'modal';
}

const themes = [
  { 
    id: 'light' as Theme, 
    name: '라이트', 
    icon: Sun, 
    preview: 'bg-white border-gray-200',
    description: '밝고 깔끔한 테마'
  },
  { 
    id: 'dark' as Theme, 
    name: '다크', 
    icon: Moon, 
    preview: 'bg-gray-900 border-gray-700',
    description: '어둡고 편안한 테마'
  },
];

const customColorPresets = [
  {
    name: '오렌지 테마',
    colors: {
      '--color-primary-500': '#f97316',
      '--color-primary-600': '#ea580c',
      '--color-primary-700': '#c2410c',
    }
  },
  {
    name: '핑크 테마',
    colors: {
      '--color-primary-500': '#ec4899',
      '--color-primary-600': '#db2777',
      '--color-primary-700': '#be185d',
    }
  },
  {
    name: '인디고 테마',
    colors: {
      '--color-primary-500': '#6366f1',
      '--color-primary-600': '#4f46e5',
      '--color-primary-700': '#4338ca',
    }
  },
];

export function ThemeSwitcher({ 
  showCustomizer = false, 
  size = 'md',
  variant = 'dropdown' 
}: ThemeSwitcherProps) {
  const { theme, setTheme, applyCustomTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#22c55e');

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    if (variant === 'dropdown') {
      setIsOpen(false);
    }
  };

  const handleCustomColorApply = () => {
    applyCustomTheme({
      '--color-primary-500': customColor,
      '--color-primary-600': adjustBrightness(customColor, -20),
      '--color-primary-700': adjustBrightness(customColor, -40),
    });
    setShowColorPicker(false);
  };

  const applyPreset = (preset: typeof customColorPresets[0]) => {
    applyCustomTheme(preset.colors);
  };

  // 색상 밝기 조절 함수
  function adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <button
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              className={`p-2 rounded-lg border-2 transition-all ${
                theme === themeOption.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              title={themeOption.description}
            >
              <Icon className={`w-4 h-4 ${
                theme === themeOption.id 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`} />
            </button>
          );
        })}
      </div>
    );
  }

  // 간단한 토글 버튼으로 변경
  if (variant === 'dropdown') {
    return (
      <button
        onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
        className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Palette className="w-4 h-4 mr-2" />
        테마
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-[var(--bg-primary)] rounded-xl shadow-xl border border-[var(--border-primary)] z-50"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                테마 선택
              </h3>

              {/* 기본 테마들 */}
              <div className="space-y-2 mb-6">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  return (
                    <motion.button
                      key={themeOption.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeChange(themeOption.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        theme === themeOption.id
                          ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                          : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg border-2 ${themeOption.preview}`} />
                        <div className="text-left">
                          <p className="font-medium text-[var(--text-primary)]">
                            {themeOption.name}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {themeOption.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                        {theme === themeOption.id && (
                          <Check className="w-4 h-4 text-[var(--color-primary-600)]" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* 커스터마이저 */}
              {showCustomizer && (
                <div className="border-t border-[var(--border-primary)] pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-[var(--text-primary)]">
                      커스텀 테마
                    </h4>
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 프리셋 색상들 */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {customColorPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => applyPreset(preset)}
                        className="text-xs p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        title={preset.name}
                      >
                        <div 
                          className="w-full h-4 rounded mb-1"
                          style={{ backgroundColor: preset.colors['--color-primary-500'] }}
                        />
                        {preset.name}
                      </button>
                    ))}
                  </div>

                  {/* 커스텀 색상 피커 */}
                  <AnimatePresence>
                    {showColorPicker && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-8 h-8 rounded border border-[var(--border-primary)]"
                          />
                          <input
                            type="text"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-[var(--border-primary)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
                            placeholder="#22c55e"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={handleCustomColorApply}
                          className="w-full"
                        >
                          적용
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default ThemeSwitcher;