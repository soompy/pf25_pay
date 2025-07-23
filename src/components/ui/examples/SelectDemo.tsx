'use client';

import React, { useState } from 'react';
import { Select, MultiSelect, SelectOption } from '@/components/ui/atoms/Select';
import { User, CreditCard } from 'lucide-react';

export const SelectDemo: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Country options with flags
  const countryOptions: SelectOption[] = [
    { value: 'kr', label: '대한민국', icon: <span className="text-lg">🇰🇷</span> },
    { value: 'us', label: '미국', icon: <span className="text-lg">🇺🇸</span> },
    { value: 'jp', label: '일본', icon: <span className="text-lg">🇯🇵</span> },
    { value: 'cn', label: '중국', icon: <span className="text-lg">🇨🇳</span> },
    { value: 'de', label: '독일', icon: <span className="text-lg">🇩🇪</span> },
    { value: 'fr', label: '프랑스', icon: <span className="text-lg">🇫🇷</span> },
  ];

  // Card options with icons
  const cardOptions: SelectOption[] = [
    { 
      value: 'visa', 
      label: 'Visa **** 4532', 
      icon: <CreditCard className="w-4 h-4 text-blue-600" /> 
    },
    { 
      value: 'mastercard', 
      label: 'Mastercard **** 8765', 
      icon: <CreditCard className="w-4 h-4 text-red-600" /> 
    },
    { 
      value: 'amex', 
      label: 'American Express **** 1234', 
      icon: <CreditCard className="w-4 h-4 text-green-600" /> 
    },
    { 
      value: 'discover', 
      label: 'Discover **** 9876', 
      icon: <CreditCard className="w-4 h-4 text-orange-600" />,
      disabled: true
    },
  ];

  // Category options
  const categoryOptions: SelectOption[] = [
    { value: 'food', label: '음식', icon: <span className="text-lg">🍽️</span> },
    { value: 'transport', label: '교통', icon: <span className="text-lg">🚗</span> },
    { value: 'shopping', label: '쇼핑', icon: <span className="text-lg">🛍️</span> },
    { value: 'entertainment', label: '엔터테인먼트', icon: <span className="text-lg">🎬</span> },
    { value: 'healthcare', label: '의료', icon: <span className="text-lg">⚕️</span> },
    { value: 'education', label: '교육', icon: <span className="text-lg">📚</span> },
    { value: 'utilities', label: '공과금', icon: <span className="text-lg">⚡</span> },
    { value: 'travel', label: '여행', icon: <span className="text-lg">✈️</span> },
  ];

  // User options
  const userOptions: SelectOption[] = [
    { 
      value: 'john', 
      label: 'John Doe', 
      icon: <User className="w-4 h-4 text-blue-500" /> 
    },
    { 
      value: 'jane', 
      label: 'Jane Smith', 
      icon: <User className="w-4 h-4 text-purple-500" /> 
    },
    { 
      value: 'bob', 
      label: 'Bob Johnson', 
      icon: <User className="w-4 h-4 text-green-500" /> 
    },
    { 
      value: 'alice', 
      label: 'Alice Brown', 
      icon: <User className="w-4 h-4 text-pink-500" /> 
    },
    { 
      value: 'charlie', 
      label: 'Charlie Wilson', 
      icon: <User className="w-4 h-4 text-orange-500" /> 
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          커스텀 셀렉트 컴포넌트
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          SafePay에서 사용할 수 있는 다양한 스타일의 셀렉트 박스들
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Select */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-primary)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              기본 셀렉트
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  국가 선택
                </label>
                <Select
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder="국가를 선택하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  결제 카드 (Large)
                </label>
                <Select
                  options={cardOptions}
                  value={selectedCard}
                  onChange={setSelectedCard}
                  placeholder="카드를 선택하세요"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Variant Styles */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-primary)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              다양한 스타일
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Outline 스타일
                </label>
                <Select
                  options={countryOptions}
                  placeholder="국가를 선택하세요"
                  variant="outline"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Filled 스타일 (Small)
                </label>
                <Select
                  options={cardOptions}
                  placeholder="카드를 선택하세요"
                  variant="filled"
                  size="sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  에러 상태
                </label>
                <Select
                  options={countryOptions}
                  placeholder="필수 선택"
                  error={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Multi Select */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-primary)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              다중 선택
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  카테고리 선택 (최대 3개)
                </label>
                <MultiSelect
                  options={categoryOptions}
                  values={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="카테고리를 선택하세요"
                  maxSelected={3}
                />
                {selectedCategories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCategories.map(value => {
                      const option = categoryOptions.find(opt => opt.value === value);
                      return option ? (
                        <span
                          key={value}
                          className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] rounded-full text-xs"
                        >
                          {option.icon}
                          <span className="ml-1">{option.label}</span>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Multi Select */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-primary)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              고급 다중 선택
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  사용자 선택
                </label>
                <MultiSelect
                  options={userOptions}
                  values={selectedUsers}
                  onChange={setSelectedUsers}
                  placeholder="사용자를 선택하세요"
                  variant="outline"
                />
                {selectedUsers.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-[var(--text-secondary)]">
                      선택된 사용자 ({selectedUsers.length}명):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedUsers.map(value => {
                        const option = userOptions.find(opt => opt.value === value);
                        return option ? (
                          <span
                            key={value}
                            className="inline-flex items-center px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded text-xs"
                          >
                            {option.icon}
                            <span className="ml-1">{option.label}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Information */}
      <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          사용법
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">기본 사용법:</h4>
            <pre className="bg-[var(--bg-primary)] p-3 rounded-lg text-[var(--text-secondary)] overflow-x-auto">
{`<Select
  options={options}
  value={value}
  onChange={setValue}
  placeholder="선택하세요"
  size="md" // sm, md, lg
  variant="default" // default, outline, filled
/>`}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">다중 선택:</h4>
            <pre className="bg-[var(--bg-primary)] p-3 rounded-lg text-[var(--text-secondary)] overflow-x-auto">
{`<MultiSelect
  options={options}
  values={values}
  onChange={setValues}
  maxSelected={3}
  placeholder="선택하세요"
/>`}
            </pre>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold text-[var(--text-primary)] mb-2">특징:</h4>
          <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1">
            <li>키보드 네비게이션 지원 (화살표, Enter, Escape)</li>
            <li>아이콘 지원 및 커스텀 옵션 스타일링</li>
            <li>다크모드 완전 지원</li>
            <li>애니메이션 효과 (Framer Motion)</li>
            <li>접근성 준수 (ARIA 지원)</li>
            <li>반응형 디자인</li>
          </ul>
        </div>
      </div>
    </div>
  );
};