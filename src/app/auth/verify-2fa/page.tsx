'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function Verify2FAPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [trustDevice, setTrustDevice] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyTwoFactor, isLoading, error, tempCredentials, state } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect if no temp credentials (user didn't come from login)
    if (!tempCredentials && state !== 'requires-2fa') {
      router.push('/auth/login');
    }
  }, [tempCredentials, state, router]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    
    setCode(newCode);
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) return;
    
    await verifyTwoFactor({ code: fullCode, trustDevice });
    
    if (state === 'authenticated') {
      router.push('/');
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <button
          onClick={() => router.push('/auth/login')}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          로그인으로 돌아가기
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          2단계 인증
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          인증 앱에서 6자리 코드를 입력하세요
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p className="text-red-600 dark:text-red-400 text-sm">{error.message}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 6-digit Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            인증 코드
          </label>
          <div className="flex space-x-2 justify-center" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                whileFocus={{ scale: 1.05 }}
              />
            ))}
          </div>
        </div>

        {/* Trust Device Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="trustDevice"
            checked={trustDevice}
            onChange={(e) => setTrustDevice(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <label htmlFor="trustDevice" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            이 기기를 30일간 신뢰
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!isCodeComplete || isLoading}
          whileHover={{ scale: !isCodeComplete || isLoading ? 1 : 1.02 }}
          whileTap={{ scale: !isCodeComplete || isLoading ? 1 : 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              인증 중...
            </>
          ) : (
            '인증 완료'
          )}
        </motion.button>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>데모용 코드:</strong> 123456
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          실제 서비스에서는 Google Authenticator, Authy 등의 앱을 사용합니다
        </p>
      </div>

      {/* Resend Code */}
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          코드를 받지 못하셨나요? 다시 보내기
        </button>
      </div>
    </motion.div>
  );
}