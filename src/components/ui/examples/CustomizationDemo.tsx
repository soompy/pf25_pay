'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { ThemeSwitcher } from '../molecules/ThemeSwitcher';
import { useStyleOverride, useButtonStyles, useCardStyles } from '@/hooks/useStyleOverride';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Palette, Sparkles, Code2, Eye } from 'lucide-react';

/**
 * CSS 커스터마이징 방법들을 보여주는 데모 컴포넌트
 */
export function CustomizationDemo() {
  const [customButtonColor, setCustomButtonColor] = useState('#22c55e');
  const [showCode, setShowCode] = useState(false);

  // 1. 기본 Button 컴포넌트 사용
  const basicButton = <Button>기본 버튼</Button>;

  // 2. Props로 스타일 커스터마이징
  const propsButton = (
    <Button 
      variant="outline" 
      size="lg"
      className="border-2 hover:shadow-lg"
    >
      Props 커스터마이징
    </Button>
  );

  // 3. CSS Variables 활용
  const variablesButton = (
    <Button 
      theme="custom"
      style={{
        '--color-primary-500': customButtonColor,
        '--color-primary-600': adjustBrightness(customButtonColor, -20),
        '--color-primary-700': adjustBrightness(customButtonColor, -40),
      } as React.CSSProperties}
    >
      CSS Variables 버튼
    </Button>
  );

  // 4. useStyleOverride Hook 사용
  const { className: overrideClassName, style: overrideStyle } = useStyleOverride({
    baseClasses: 'px-6 py-3 rounded-xl font-semibold transition-all duration-300',
    conditionalClasses: {
      'bg-gradient-to-r from-purple-500 to-pink-500': true,
      'text-white': true,
      'hover:from-purple-600 hover:to-pink-600': true,
      'transform hover:scale-105': true,
      'shadow-lg hover:shadow-xl': true,
    },
    customClasses: 'animate-pulse-soft',
  });

  // 5. useButtonStyles Hook 사용
  const { className: buttonStylesClassName } = useButtonStyles({
    customClasses: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1',
    conditionalClasses: {
      'ring-4 ring-emerald-200': true,
    },
  });

  // 6. useCardStyles Hook 사용
  const { className: cardClassName } = useCardStyles({
    customClasses: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-700',
    conditionalClasses: {
      'hover:scale-[1.02]': true,
      'transition-transform duration-300': true,
    },
  });

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

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background-primary p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* 헤더 */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-text-primary flex items-center justify-center gap-3">
              <Palette className="w-10 h-10 text-primary-500" />
              CSS 커스터마이징 가이드
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              SafePay UI 컴포넌트를 다양한 방법으로 커스터마이징하는 방법을 알아보세요
            </p>
            
            {/* 테마 스위처 */}
            <div className="flex justify-center">
              <ThemeSwitcher showCustomizer variant="dropdown" />
            </div>
          </div>

          {/* 커스터마이징 방법들 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 1. 기본 사용법 */}
            <div className={cardClassName}>
              <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                1. 기본 사용법
              </h3>
              <p className="text-text-secondary mb-4">
                추가 설정 없이 바로 사용 가능한 기본 스타일
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {basicButton}
                <Button variant="outline">아웃라인</Button>
                <Button variant="ghost">고스트</Button>
              </div>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`<Button>기본 버튼</Button>
<Button variant="outline">아웃라인</Button>
<Button variant="ghost">고스트</Button>`}
              </pre>
            </div>

            {/* 2. Props 커스터마이징 */}
            <div className={cardClassName}>
              <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary-500" />
                2. Props 커스터마이징
              </h3>
              <p className="text-text-secondary mb-4">
                컴포넌트 Props와 className을 활용한 스타일링
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {propsButton}
                <Button size="sm" className="bg-red-500 hover:bg-red-600">
                  커스텀 클래스
                </Button>
              </div>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`<Button 
  variant="outline" 
  size="lg"
  className="border-2 hover:shadow-lg"
>
  Props 커스터마이징
</Button>`}
              </pre>
            </div>

            {/* 3. CSS Variables */}
            <div className={cardClassName}>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                3. CSS Variables 활용
              </h3>
              <p className="text-text-secondary mb-4">
                CSS Variables로 동적 테마 변경
              </p>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-text-primary">색상:</label>
                  <input
                    type="color"
                    value={customButtonColor}
                    onChange={(e) => setCustomButtonColor(e.target.value)}
                    className="w-8 h-8 rounded border"
                  />
                  <span className="text-xs text-text-tertiary">{customButtonColor}</span>
                </div>
                {variablesButton}
              </div>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`<Button 
  theme="custom"
  style={{
    '--color-primary-500': '${customButtonColor}',
  }}
>
  CSS Variables 버튼
</Button>`}
              </pre>
            </div>

            {/* 4. useStyleOverride Hook */}
            <div className={cardClassName}>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                4. useStyleOverride Hook
              </h3>
              <p className="text-text-secondary mb-4">
                복잡한 스타일 조합을 위한 전용 Hook
              </p>
              <div className="mb-4">
                <button 
                  className={overrideClassName}
                  style={overrideStyle}
                >
                  고급 커스터마이징
                </button>
              </div>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`const { className, style } = useStyleOverride({
  baseClasses: 'px-6 py-3 rounded-xl',
  conditionalClasses: {
    'bg-gradient-to-r from-purple-500 to-pink-500': true,
    'hover:scale-105': true,
  },
});`}
              </pre>
            </div>

            {/* 5. 전용 Hook 사용 */}
            <div className={cardClassName}>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                5. 컴포넌트별 전용 Hook
              </h3>
              <p className="text-text-secondary mb-4">
                useButtonStyles, useCardStyles 등 전용 Hook 활용
              </p>
              <div className="mb-4">
                <button className={buttonStylesClassName}>
                  전용 Hook 버튼
                </button>
              </div>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`const { className } = useButtonStyles({
  customClasses: 'bg-emerald-500 hover:bg-emerald-600',
  conditionalClasses: {
    'ring-4 ring-emerald-200': true,
  },
});`}
              </pre>
            </div>

            {/* 6. 테마 시스템 */}
            <div className={cardClassName}>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                6. 전역 테마 시스템
              </h3>
              <p className="text-text-secondary mb-4">
                라이트/다크 모드 및 컬러 테마 전환
              </p>
              <div className="space-y-3">
                <ThemeSwitcher variant="inline" />
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-primary-500 rounded" title="Primary Color" />
                  <div className="w-4 h-4 bg-background-secondary rounded border" title="Background" />
                  <div className="w-4 h-4 border rounded" style={{ backgroundColor: 'var(--text-primary)' }} title="Text Color" />
                </div>
              </div>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`// ThemeProvider로 감싸기
<ThemeProvider>
  <ThemeSwitcher showCustomizer />
</ThemeProvider>`}
              </pre>
            </div>

          </div>

          {/* 추가 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
            <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-500" />
              커스터마이징 팁
            </h3>
            <ul className="space-y-2 text-text-secondary">
              <li>• <strong>className 우선순위:</strong> 나중에 오는 클래스가 우선 적용됩니다</li>
              <li>• <strong>CSS Variables:</strong> 런타임에 동적으로 값을 변경할 수 있습니다</li>
              <li>• <strong>Tailwind Merge:</strong> cn() 함수로 중복 클래스를 자동으로 제거합니다</li>
              <li>• <strong>테마 일관성:</strong> 전역 CSS Variables를 사용하여 일관된 디자인을 유지하세요</li>
              <li>• <strong>성능:</strong> useMemo를 사용하여 스타일 계산을 최적화합니다</li>
            </ul>
          </div>

        </div>
      </div>
    </ThemeProvider>
  );
}