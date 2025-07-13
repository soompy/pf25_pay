'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { Send, Search, Mail, Eye, EyeOff } from 'lucide-react';

/**
 * 컴포넌트 사용법 예시
 * 실제 프로젝트에서는 삭제하고 각 페이지에서 import하여 사용
 */
export function ComponentShowcase() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // 비동기 작업 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        공통 UI 컴포넌트 쇼케이스
      </h1>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Button 컴포넌트
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <Button variant="default">기본 버튼</Button>
          <Button variant="destructive">삭제 버튼</Button>
          <Button variant="outline">아웃라인</Button>
          <Button variant="ghost">고스트</Button>
          <Button variant="success">성공</Button>
          <Button variant="warning">경고</Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button size="sm">작은 버튼</Button>
          <Button size="default">기본 크기</Button>
          <Button size="lg">큰 버튼</Button>
          <Button size="xl">XL 버튼</Button>
        </div>

        <div className="space-y-2">
          <Button fullWidth leftIcon={<Send className="w-4 h-4" />}>
            아이콘이 있는 버튼
          </Button>
          <Button 
            fullWidth 
            loading={loading}
            onClick={handleSubmit}
          >
            로딩 버튼 테스트
          </Button>
        </div>
      </section>

      {/* Input Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Input 컴포넌트
        </h2>

        <div className="space-y-4">
          <Input
            placeholder="기본 입력 필드"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="이메일 주소"
            type="email"
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="유효한 이메일 주소를 입력하세요"
          />

          <Input
            placeholder="검색..."
            leftIcon={<Search className="w-4 h-4" />}
            size="lg"
          />

          <Input
            placeholder="비밀번호"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />

          <Input
            placeholder="에러가 있는 입력"
            variant="error"
            error="이 필드는 필수입니다"
          />

          <Input
            placeholder="성공한 입력"
            variant="success"
            helperText="올바른 형식입니다"
          />
        </div>
      </section>

      {/* 사용법 안내 */}
      <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          사용법
        </h3>
        <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
{`// 컴포넌트 import
import { Button, Input } from '@/components/ui';

// 사용 예시
<Button 
  variant="default" 
  size="lg" 
  loading={isLoading}
  leftIcon={<SendIcon />}
  onClick={handleClick}
>
  전송하기
</Button>

<Input
  type="email"
  placeholder="이메일 주소"
  leftIcon={<MailIcon />}
  error={errors.email}
  {...register('email')}
/>`}
        </pre>
      </section>
    </div>
  );
}