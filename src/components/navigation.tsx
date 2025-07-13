'use client';

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
  Receipt, 
  Bell, 
  DollarSign,
  TrendingUp,
  History,
  Users,
  Wallet,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/store/portfolio';
import { useAuthStore } from '@/store/auth';

export function Navigation() {
  const { isMenuOpen, toggleMenu, setCurrentSection } = usePortfolioStore();
  const { user, logout, state } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'demo', label: 'Demo', href: '/demo' },
  ];

  // Quick action items for authenticated users
  const quickActions = [
    { id: 'send', label: 'Send Money', href: '/send', icon: Send, color: 'blue' },
    { id: 'request', label: 'Request', href: '/request', icon: DollarSign, color: 'green' },
    { id: 'scan', label: 'QR Scan', href: '/scan', icon: QrCode, color: 'purple' },
    { id: 'cards', label: 'My Cards', href: '/cards', icon: CreditCard, color: 'orange' },
  ];

  // Add authenticated user menu items
  const authNavItems = user ? [
    ...navItems,
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'transactions', label: 'Transactions', href: '/transactions' },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
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
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}

            {/* Quick Actions - Only for authenticated users */}
            {state === 'authenticated' && user && (
              <div className="flex items-center space-x-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.id}
                      href={action.href}
                      className={`p-2 rounded-lg transition-colors hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/20 group`}
                      title={action.label}
                    >
                      <Icon className={`w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-${action.color}-600 dark:group-hover:text-${action.color}-400 transition-colors`} />
                    </Link>
                  );
                })}
              </div>
            )}
            
            {/* Notifications Bell - Only for authenticated users */}
            {state === 'authenticated' && user && (
              <div className="relative">
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
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
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full ring-2 ring-blue-200 dark:ring-blue-800"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center ring-2 ring-blue-200 dark:ring-blue-800">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">$12,450.00</p>
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
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      {/* User Info Header */}
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-gray-800"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">$12,450.00</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">$2,341</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">47</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">3</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Active Cards</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <TrendingUp className="w-5 h-5 mr-3 text-blue-500" />
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Overview & Analytics</p>
                          </div>
                        </Link>

                        <Link
                          href="/transactions"
                          className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <History className="w-5 h-5 mr-3 text-green-500" />
                          <div>
                            <p className="font-medium">Transaction History</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">View all payments</p>
                          </div>
                        </Link>

                        <Link
                          href="/cards"
                          className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Wallet className="w-5 h-5 mr-3 text-purple-500" />
                          <div>
                            <p className="font-medium">My Cards</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Manage payment methods</p>
                          </div>
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5 mr-3 text-orange-500" />
                          <div>
                            <p className="font-medium">Account Settings</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Privacy & Security</p>
                          </div>
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <span className="font-medium">Sign Out</span>
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
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
              className="lg:hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="py-4">
                {/* Main Navigation */}
                <div className="space-y-1 mb-4">
                  {authNavItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleNavClick(item.id)}
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Quick Actions for Mobile */}
                {state === 'authenticated' && user && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                    <p className="px-4 text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-3 px-4">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <Link
                            key={action.id}
                            href={action.href}
                            onClick={toggleMenu}
                            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Mobile Authentication Menu */}
                {state === 'authenticated' && user ? (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    {/* User Info */}
                    <div className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 mx-4 rounded-lg mb-4">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full mr-3 ring-2 ring-blue-200 dark:ring-blue-800"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 ring-2 ring-blue-200 dark:ring-blue-800">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">$12,450.00</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 px-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">$2,341</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">47</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">3</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Active Cards</p>
                      </div>
                    </div>

                    {/* Menu Links */}
                    <div className="space-y-1">
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={toggleMenu}
                      >
                        <Settings className="w-5 h-5 mr-3 text-orange-500" />
                        <div>
                          <p className="font-medium">Account Settings</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Privacy & Security</p>
                        </div>
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center mx-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      로그인
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center justify-center mx-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-lg font-medium"
                      onClick={toggleMenu}
                    >
                      회원가입
                    </Link>
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