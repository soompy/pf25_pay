'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth';
import { ArrowLeft, Loader2, Mail, Eye, EyeOff } from 'lucide-react';

const requestSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
});

const resetSchema = z.object({
  password: z.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/(?=.*[a-z])/, '소문자를 포함해야 합니다')
    .regex(/(?=.*[A-Z])/, '대문자를 포함해야 합니다')
    .regex(/(?=.*\d)/, '숫자를 포함해야 합니다'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type RequestFormData = z.infer<typeof requestSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

function ResetPasswordContent() {
  const [step, setStep] = useState<'request' | 'sent' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { requestPasswordReset, resetPassword, isLoading, error } = useAuthStore();
  const router = useRouter();

  // If token is present, show reset form
  useState(() => {
    if (token) {
      setStep('reset');
    }
  });

  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onRequestSubmit = async (data: RequestFormData) => {
    await requestPasswordReset(data);
    setEmail(data.email);
    setStep('sent');
  };

  const onResetSubmit = async (data: ResetFormData) => {
    if (!token) return;
    
    await resetPassword({
      token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    
    router.push('/auth/login?message=password-reset-success');
  };

  if (step === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            이메일을 확인하세요
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <span className="font-medium">{email}</span>로<br />
            비밀번호 재설정 링크를 보내드렸습니다
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              이메일이 도착하지 않았나요?<br />
              스팸 폴더를 확인하거나 몇 분 후 다시 시도해주세요
            </p>
          </div>

          <button
            onClick={() => onRequestSubmit({ email })}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                재전송 중...
              </>
            ) : (
              '이메일 재전송'
            )}
          </button>

          <Link
            href="/auth/login"
            className="block w-full text-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </motion.div>
    );
  }

  if (step === 'reset' && token) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            새 비밀번호 설정
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            안전한 새 비밀번호를 설정하세요
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

        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              새 비밀번호
            </label>
            <div className="relative">
              <input
                {...resetForm.register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {resetForm.formState.errors.password && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {resetForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                {...resetForm.register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {resetForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                비밀번호 변경 중...
              </>
            ) : (
              '비밀번호 변경'
            )}
          </motion.button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <Link
          href="/auth/login"
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          로그인으로 돌아가기
        </Link>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          비밀번호 찾기
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다
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

      <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이메일 주소
          </label>
          <input
            {...requestForm.register('email')}
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="your@email.com"
          />
          {requestForm.formState.errors.email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {requestForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              전송 중...
            </>
          ) : (
            '재설정 링크 보내기'
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          계정이 기억났나요?{' '}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            로그인
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}