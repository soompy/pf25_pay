'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Home, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft,
  QrCode,
  Clock,
  Settings,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Shield,
  Wallet,
  History,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { ThemeSwitcher } from '@/components/ui/molecules/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/molecules/LanguageSwitcher';
import { FloatingActionButton } from '@/components/ui/molecules/FloatingActionButton';

interface SidebarProps {
  children: React.ReactNode;
}

export function DashboardSidebar({ children }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { t } = useTranslation('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: t('title'),
      icon: Home,
      href: '/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'cards',
      label: t('cards.title'),
      icon: CreditCard,
      href: '/cards',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'send',
      label: t('quickActions.sendMoney'),
      icon: ArrowUpRight,
      href: '/send',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'request',
      label: t('quickActions.requestMoney'),
      icon: ArrowDownLeft,
      href: '/request',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      id: 'scan',
      label: t('quickActions.scanQr'),
      icon: QrCode,
      href: '/scan',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      id: 'transactions',
      label: t('recentTransactions.title'),
      icon: History,
      href: '/transactions',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20'
    },
  ];

  const bottomMenuItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      href: '/help',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20'
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-[var(--text-primary)]">SafePay</h1>
                <p className="text-xs text-[var(--text-secondary)]">Finance Dashboard</p>
              </div>
            )}
          </div>
          
          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-[var(--border-primary)]">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          {user?.avatar ? (
            <Image 
              src={user.avatar} 
              alt={user.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--color-primary-200)]"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] rounded-full flex items-center justify-center ring-2 ring-[var(--color-primary-200)]">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          {!isCollapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <button
              key={item.id}
              onClick={() => {
                router.push(item.href);
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                ${active 
                  ? `${item.bgColor} ${item.color} shadow-sm` 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'flex-shrink-0'}`} />
              {!isCollapsed && (
                <span className="font-medium text-sm truncate">{item.label}</span>
              )}
              {!isCollapsed && active && (
                <div className="w-2 h-2 bg-current rounded-full ml-auto" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[var(--border-primary)] p-4 space-y-4">
        {/* Theme & Language Switchers */}
        {!isCollapsed && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Preferences</span>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher variant="inline" size="sm" />
            </div>
            <ThemeSwitcher variant="dropdown" size="sm" />
          </div>
        )}

        {/* Bottom Menu Items */}
        <div className="space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.href);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                  ${active 
                    ? `${item.bgColor} ${item.color}` 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }
                  ${isCollapsed ? 'justify-center px-2' : ''}
                `}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'flex-shrink-0'}`} />
                {!isCollapsed && (
                  <span className="font-medium text-sm truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
            text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
        >
          <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'flex-shrink-0'}`} />
          {!isCollapsed && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-10 h-10 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg flex items-center justify-center shadow-lg"
        >
          <Menu className="w-5 h-5 text-[var(--text-primary)]" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex fixed left-0 top-0 h-full bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex-col z-40 transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex flex-col z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`
        transition-all duration-300 lg:ml-64
        ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        {children}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}