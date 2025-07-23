'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

// We'll create the schema dynamically with translations
const createRegisterSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  name: z.string().min(2, t('validation.nameRequired')),
  email: z.string().email(t('validation.emailInvalid')),
  password: z.string()
    .min(8, t('validation.passwordTooShort'))
    .regex(/(?=.*[a-z])/, t('validation.passwordLowercase') || '소문자를 포함해야 합니다')
    .regex(/(?=.*[A-Z])/, t('validation.passwordUppercase') || '대문자를 포함해야 합니다')
    .regex(/(?=.*\d)/, t('validation.passwordNumber') || '숫자를 포함해야 합니다'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val, t('validation.termsRequired')),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('validation.passwordMismatch'),
  path: ['confirmPassword'],
});

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error } = useAuthStore();
  const { t } = useTranslation('auth');
  const router = useRouter();

  const registerSchema = createRegisterSchema(t);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const passwordRequirements = [
    { test: password?.length >= 8, label: t('validation.password8Chars') || '8자 이상' },
    { test: /(?=.*[a-z])/.test(password || ''), label: t('validation.passwordLowercase') || '소문자 포함' },
    { test: /(?=.*[A-Z])/.test(password || ''), label: t('validation.passwordUppercase') || '대문자 포함' },
    { test: /(?=.*\d)/.test(password || ''), label: t('validation.passwordNumber') || '숫자 포함' },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data);
    router.push('/auth/login?message=registration-success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t('signup.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {t('signup.subtitle')}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('signup.name')}
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder={t('signup.namePlaceholder') || '홍길동'}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('signup.email')}
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('signup.password')}
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
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
          
          {/* Password Requirements */}
          {password && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-2 gap-1 text-xs">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    {req.test ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-red-500" />
                    )}
                    <span className={req.test ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('signup.confirmPassword')}
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
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
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Acceptance */}
        <div>
          <label className="flex items-start space-x-2">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 mt-0.5"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <Link href="/terms" className="text-green-600 hover:text-green-500 dark:text-green-400">{t('signup.terms.termsOfService')}</Link>
              {t('signup.terms.and')}
              <Link href="/privacy" className="text-green-600 hover:text-green-500 dark:text-green-400">{t('signup.terms.privacyPolicy')}</Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.acceptTerms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('signup.creatingAccount') || '계정 생성 중...'}
            </>
          ) : (
            t('signup.signupButton')
          )}
        </motion.button>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('signup.hasAccount')}{' '}
          <Link
            href="/auth/login"
            className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
          >
            {t('signup.loginLink')}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}