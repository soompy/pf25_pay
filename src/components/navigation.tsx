'use client';

import Image from 'next/image';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  CreditCard, 
  Send, 
  QrCode, 
  Bell, 
  DollarSign,
  TrendingUp,
  History,
  Wallet
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/store/portfolio';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/atoms/Button';
import { ThemeSwitcher } from '@/components/ui/molecules/ThemeSwitcher';
import { useNavTranslation, useCommonTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navigation() {
  const { isMenuOpen, toggleMenu, setCurrentSection } = usePortfolioStore();
  const { user, logout, state } = useAuthStore();
  const { nav } = useNavTranslation();
  const { language, setLanguage } = useLanguage();
  const { translations } = useCommonTranslation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const navItems: Array<{ id: string; label: string; href: string }> = [];

  // Quick action items for authenticated users
  const quickActions = [
    { id: 'send', label: nav.send, href: '/send', icon: Send, color: 'green' },
    { id: 'request', label: nav.request, href: '/request', icon: DollarSign, color: 'green' },
    { id: 'scan', label: nav.scan, href: '/scan', icon: QrCode, color: 'purple' },
    { id: 'cards', label: nav.cards, href: '/cards', icon: CreditCard, color: 'orange' },
  ];

  // Add authenticated user menu items
  const authNavItems = user ? [
    ...navItems,
    { id: 'dashboard', label: nav.dashboard, href: '/dashboard' },
    { id: 'transactions', label: nav.transactions, href: '/transactions' },
  ] : navItems;

  const handleNavClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    toggleMenu();
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-sm border-b border-[var(--border-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[var(--color-primary-600)] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[var(--text-inverse)]" />
            </div>
            <span className="font-bold text-xl text-[var(--text-primary)]">
              SafePay
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {authNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setCurrentSection(item.id)}
                className="text-[var(--text-primary)] hover:text-[var(--color-primary-600)] transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}

            
            {/* Language Switcher - Nav style */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setLanguage('ko')}
                className={`
                  px-2 py-1 rounded-md text-sm font-medium transition-all duration-200
                  ${language === 'ko' 
                    ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border border-[var(--color-primary-300)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }
                `}
              >
한국어
              </button>
              <span className="text-[var(--text-tertiary)]">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`
                  px-2 py-1 rounded-md text-sm font-medium transition-all duration-200
                  ${language === 'en' 
                    ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border border-[var(--color-primary-300)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }
                `}
              >
                EN
              </button>
            </div>
            
            {/* Theme Switcher */}
            <ThemeSwitcher variant="dropdown" size="sm" />
            
            {/* Notifications Bell - Only for authenticated users */}
            {state === 'authenticated' && user && (
              <div className="relative">
                <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--color-primary-600)] transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-notification)] rounded-full text-xs text-[var(--text-inverse)] flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            )}

            {/* Authentication Menu */}
            {state === 'authenticated' && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  {user.avatar ? (
                    <div className="w-8 h-8 relative">
                      <Image 
                        src={user.avatar} 
                        alt={user.name}
                        fill
                        sizes="32px"
                        className="rounded-full ring-2 ring-[var(--color-primary-200)] object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] rounded-full flex items-center justify-center ring-2 ring-[var(--color-primary-200)]">
                      <User className="w-4 h-4 text-[var(--text-inverse)]" />
                    </div>
                  )}
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">$12,450.00</p>
                  </div>
                </button>

                {/* Enhanced User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-[var(--bg-primary)] rounded-xl shadow-xl border border-[var(--border-primary)] overflow-hidden"
                    >
                      {/* User Info Header */}
                      <div className="px-6 py-4 bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--bg-accent)] border-b border-[var(--border-primary)]">
                        <div className="flex items-center space-x-3">
                          {user.avatar ? (
                            <div className="w-12 h-12 relative">
                              <Image 
                                src={user.avatar} 
                                alt={user.name}
                                fill
                                sizes="48px"
                                className="rounded-full ring-2 ring-[var(--bg-primary)] object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] rounded-full flex items-center justify-center ring-2 ring-[var(--bg-primary)]">
                              <User className="w-6 h-6 text-[var(--text-inverse)]" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
                            <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                            <p className="text-lg font-bold text-[var(--color-primary-600)]">$12,450.00</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="px-6 py-3 border-b border-[var(--border-primary)]">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-lg font-semibold text-[var(--text-primary)]">$2,341</p>
                            <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.thisMonth}</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-[var(--text-primary)]">47</p>
                            <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.transactions}</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-[var(--text-primary)]">3</p>
                            <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.activeCards}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-6 py-3 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <TrendingUp className="w-5 h-5 mr-3 text-[var(--color-primary-500)]" />
                          <div>
                            <p className="font-medium">{nav.dashboard}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.dashboardDesc}</p>
                          </div>
                        </Link>

                        <Link
                          href="/transactions"
                          className="flex items-center px-6 py-3 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <History className="w-5 h-5 mr-3 text-[var(--color-primary-500)]" />
                          <div>
                            <p className="font-medium">{nav.transactions}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.transactionsDesc}</p>
                          </div>
                        </Link>

                        <Link
                          href="/cards"
                          className="flex items-center px-6 py-3 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Wallet className="w-5 h-5 mr-3 text-[var(--color-purple-500)]" />
                          <div>
                            <p className="font-medium">{nav.cards}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.cardsDesc}</p>
                          </div>
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center px-6 py-3 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5 mr-3 text-[var(--color-orange-500)]" />
                          <div>
                            <p className="font-medium">{nav.settings}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.settingsDesc}</p>
                          </div>
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-[var(--border-primary)] p-3">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-[var(--color-error)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <span className="font-medium">{nav.signOut}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-[var(--text-primary)] hover:text-[var(--color-primary-600)] transition-colors font-medium"
                >
                  {translations.auth.login}
                </Link>
                <Button
                  variant="success"
                  size="default"
                  className="shadow-lg"
                  onClick={() => router.push('/auth/register')}
                >
                  {translations.auth.signup}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile/Tablet Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-[var(--border-primary)]"
            >
              <div className="py-4">
                {/* Main Navigation */}
                <div className="space-y-1 mb-4">
                  {authNavItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleNavClick(item.id)}
                      className="flex items-center px-4 py-3 text-[var(--text-primary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Quick Actions for Mobile */}
                {state === 'authenticated' && user && (
                  <div className="border-t border-[var(--border-primary)] pt-4 mb-4">
                    <p className="px-4 text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-3 px-4">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <Link
                            key={action.id}
                            href={action.href}
                            onClick={toggleMenu}
                            className="flex flex-col items-center p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                          >
                            <Icon className="w-6 h-6 text-[var(--text-secondary)] mb-2" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">{action.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Language & Theme Switcher for Mobile */}
                <div className="border-t border-[var(--border-primary)] pt-4 mb-4">
                  <div className="px-4">
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Language & Theme</p>
                    
                    {/* Language Switcher - Nav style for mobile */}
                    <div className="flex items-center space-x-2 mb-3">
                      <button
                        onClick={() => setLanguage('ko')}
                        className={`
                          flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 text-center
                          ${language === 'ko' 
                            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border border-[var(--color-primary-300)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                          }
                        `}
                      >
        한국어
                      </button>
                      <button
                        onClick={() => setLanguage('en')}
                        className={`
                          flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 text-center
                          ${language === 'en' 
                            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border border-[var(--color-primary-300)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                          }
                        `}
                      >
                        EN
                      </button>
                    </div>
                    
                    {/* Theme Switcher */}
                    <div className="flex justify-center">
                      <ThemeSwitcher variant="dropdown" size="md" />
                    </div>
                  </div>
                </div>
                
                {/* Mobile Authentication Menu */}
                {state === 'authenticated' && user ? (
                  <div className="border-t border-[var(--border-primary)] pt-4">
                    {/* User Info */}
                    <div className="flex items-center px-4 py-3 bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--bg-accent)] mx-4 rounded-lg mb-4">
                      {user.avatar ? (
                        <div className="w-10 h-10 relative mr-3">
                          <Image 
                            src={user.avatar} 
                            alt={user.name}
                            fill
                            sizes="40px"
                            className="rounded-full ring-2 ring-[var(--color-primary-200)] object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] rounded-full flex items-center justify-center mr-3 ring-2 ring-[var(--color-primary-200)]">
                          <User className="w-5 h-5 text-[var(--text-inverse)]" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                        <p className="text-lg font-bold text-[var(--color-primary-600)]">$12,450.00</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 px-4 mb-4">
                      <div className="text-center p-3 bg-[var(--bg-tertiary)] rounded-lg">
                        <p className="text-lg font-semibold text-[var(--text-primary)]">$2,341</p>
                        <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.thisMonth}</p>
                      </div>
                      <div className="text-center p-3 bg-[var(--bg-tertiary)] rounded-lg">
                        <p className="text-lg font-semibold text-[var(--text-primary)]">47</p>
                        <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.transactions}</p>
                      </div>
                      <div className="text-center p-3 bg-[var(--bg-tertiary)] rounded-lg">
                        <p className="text-lg font-semibold text-[var(--text-primary)]">3</p>
                        <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.activeCards}</p>
                      </div>
                    </div>

                    {/* Menu Links */}
                    <div className="space-y-1">
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-3 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        onClick={toggleMenu}
                      >
                        <Settings className="w-5 h-5 mr-3 text-[var(--color-orange-500)]" />
                        <div>
                          <p className="font-medium">{nav.settings}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{translations.userMenu.settingsDesc}</p>
                        </div>
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="flex items-center w-full px-4 py-3 text-[var(--color-error)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">{nav.signOut}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-[var(--border-primary)] pt-4 space-y-3">
                    <div className="mx-4">
                      <Button
                        variant="outline"
                        size="default"
                        fullWidth={true}
                        onClick={() => {
                          router.push('/auth/login');
                          toggleMenu();
                        }}
                      >
                        {translations.auth.login}
                      </Button>
                    </div>
                    <div className="mx-4">
                      <Button
                        variant="success"
                        size="default"
                        fullWidth={true}
                        className="shadow-lg"
                        onClick={() => {
                          router.push('/auth/register');
                          toggleMenu();
                        }}
                      >
                        {translations.auth.signup}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}