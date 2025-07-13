'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Settings,
  QrCode
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function DashboardPage() {
  const { user, state } = useAuthStore();
  const router = useRouter();

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

  const mockData = {
    balance: 12345.67,
    monthlyIncome: 8500.00,
    monthlyExpense: 3200.50,
    recentTransactions: [
      { id: 1, type: 'income', amount: 2500.00, description: 'Salary', date: '2024-01-15', status: 'completed' },
      { id: 2, type: 'expense', amount: 89.99, description: 'Grocery Store', date: '2024-01-14', status: 'completed' },
      { id: 3, type: 'expense', amount: 1200.00, description: 'Rent Payment', date: '2024-01-01', status: 'completed' },
      { id: 4, type: 'income', amount: 150.00, description: 'Freelance', date: '2024-01-10', status: 'pending' },
    ],
    cards: [
      { id: 1, name: 'Main Card', last4: '4532', type: 'Visa', balance: 8234.56, isDefault: true },
      { id: 2, name: 'Savings Card', last4: '8765', type: 'Mastercard', balance: 4111.11, isDefault: false },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your financial overview for today
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${mockData.balance.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +${mockData.monthlyIncome.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  -${mockData.monthlyExpense.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Level</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {user.twoFactorEnabled ? 'High' : 'Medium'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cards Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Cards</h2>
                <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Card
                </button>
              </div>

              <div className="space-y-4">
                {mockData.cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-blue-100 text-sm">{card.name}</p>
                          <p className="text-xl font-bold">${card.balance.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-100 text-xs">{card.type}</p>
                          {card.isDefault && (
                            <span className="inline-block bg-white/20 text-xs px-2 py-1 rounded-full mt-1">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-blue-100 text-xs mb-1">Card Number</p>
                          <p className="font-mono text-lg">•••• •••• •••• {card.last4}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Card decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {mockData.recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-900/20' 
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className={`w-5 h-5 ${
                            transaction.type === 'income' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`} />
                        ) : (
                          <ArrowDownRight className={`w-5 h-5 ${
                            transaction.type === 'income' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${
                        transaction.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-500' 
                            : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => router.push('/send')}
                className="flex flex-col items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-2">
                  <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Send Money</span>
              </button>
              
              <button 
                onClick={() => router.push('/scan')}
                className="flex flex-col items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-2">
                  <QrCode className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">QR Scan</span>
              </button>
              
              <button 
                onClick={() => router.push('/request')}
                className="flex flex-col items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Request</span>
              </button>
              
              <button 
                onClick={() => router.push('/settings/security')}
                className="flex flex-col items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Security</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}