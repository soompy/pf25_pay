'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Trash2, 
  ChevronRight,
  Settings as SettingsIcon 
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { user, state } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (state !== 'authenticated' || !user) {
      router.push('/auth/login');
    }
  }, [state, user, router]);

  if (state !== 'authenticated' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const settingsNavItems = [
    {
      id: 'profile',
      label: 'Profile',
      href: '/settings',
      icon: User,
      description: 'Manage your personal information'
    },
    {
      id: 'security',
      label: 'Security',
      href: '/settings/security',
      icon: Shield,
      description: 'Password, 2FA, and security settings'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      href: '/settings/notifications',
      icon: Bell,
      description: 'Email and push notification preferences'
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      href: '/settings/danger',
      icon: Trash2,
      description: 'Delete account and data management'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-80"
          >
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <span className="font-medium text-gray-900 dark:text-white">Navigation</span>
                <ChevronRight 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isMobileMenuOpen ? 'rotate-90' : ''
                  }`} 
                />
              </button>
            </div>

            {/* Navigation Menu */}
            <div className={`space-y-2 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              {settingsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block p-4 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } border`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-800/50'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${
                          isActive
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {item.label}
                        </p>
                        <p className={`text-sm ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Account Type</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {user.role}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Security</span>
                <span className={`font-medium ${
                  user.twoFactorEnabled 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {user.twoFactorEnabled ? 'High' : 'Medium'}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}