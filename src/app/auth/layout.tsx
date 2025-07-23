'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ui/molecules/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/molecules/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { state, user } = useAuthStore();
  const { t } = useTranslation('auth');
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to home
    if (state === 'authenticated' && user) {
      router.push('/');
    }
  }, [state, user, router]);

  // Don't render auth forms for authenticated users
  if (state === 'authenticated' && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* SafePay Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SafePay
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('common.secureAuth') || 'Secure payment authentication'}
            </p>
          </div>

          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex flex-col items-center space-y-4">
            {/* Language and Theme Switchers */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher variant="inline" size="sm" />
              <ThemeSwitcher variant="dropdown" size="sm" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('common.enterpriseSecurity') || 'Protected by enterprise-grade security'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}