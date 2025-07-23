'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  DollarSign,
  RefreshCw,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { usePaymentStore } from '@/store/payment';
import { useTranslation } from '@/hooks/useTranslation';
import type { Transaction } from '@/types/payment';

type FilterType = 'all' | 'send' | 'receive' | 'request' | 'refund';
type StatusFilter = 'all' | 'completed' | 'pending' | 'failed' | 'cancelled';
type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

export default function TransactionsPage() {
  const { user, state: authState } = useAuthStore();
  const { t } = useTranslation('dashboard');
  const { 
    transactions, 
    paymentRequests, 
    getTransactions, 
    getPaymentRequests,
    retryTransaction,
    cancelTransaction,
    respondToRequest,
    isLoading 
  } = usePaymentStore();
  
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'requests'>('transactions');

  // Redirect if not authenticated
  useEffect(() => {
    if (authState !== 'authenticated' || !user) {
      router.push('/auth/login');
    }
  }, [authState, user, router]);

  // Load data on mount
  useEffect(() => {
    if (authState === 'authenticated') {
      getTransactions();
      getPaymentRequests();
    }
  }, [authState, getTransactions, getPaymentRequests]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(txn => 
        txn.description.toLowerCase().includes(query) ||
        txn.reference.toLowerCase().includes(query) ||
        txn.fromUser?.name.toLowerCase().includes(query) ||
        txn.toUser?.name.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(txn => txn.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(txn => txn.status === statusFilter);
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (timeFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }
      
      filtered = filtered.filter(txn => new Date(txn.createdAt) >= startDate);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transactions, searchQuery, typeFilter, statusFilter, timeFilter]);

  // Filter payment requests
  const filteredRequests = useMemo(() => {
    let filtered = paymentRequests;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.description.toLowerCase().includes(query) ||
        req.fromUser?.name.toLowerCase().includes(query) ||
        req.toUser?.name.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [paymentRequests, searchQuery]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'receive': return <ArrowDownRight className="w-4 h-4 text-green-500" />;
      case 'request': return <DollarSign className="w-4 h-4 text-blue-500" />;
      case 'refund': return <RefreshCw className="w-4 h-4 text-purple-500" />;
      default: return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleRetryTransaction = async (transactionId: string) => {
    await retryTransaction(transactionId);
  };

  const handleCancelTransaction = async (transactionId: string) => {
    await cancelTransaction(transactionId);
  };

  const handleRespondToRequest = async (requestId: string, action: 'pay' | 'decline') => {
    await respondToRequest(requestId, action);
  };

  const exportTransactions = () => {
    const data = filteredTransactions.map(txn => ({
      id: txn.id,
      type: txn.type,
      amount: txn.amount,
      description: txn.description,
      status: txn.status,
      date: txn.createdAt.toISOString(),
      reference: txn.reference,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (authState !== 'authenticated' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                {t('transactions.title')}
              </h1>
              <p className="text-[var(--text-secondary)]">
                {t('transactions.subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportTransactions}
                className="flex items-center px-4 py-2 border border-[var(--border-primary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('transactions.actions.export')}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-[var(--bg-tertiary)] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t('transactions.tabs.transactions')} ({filteredTransactions.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t('transactions.tabs.requests')} ({filteredRequests.length})
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                placeholder={t('transactions.search.placeholder')}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-[var(--border-primary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              {t('transactions.search.filters')}
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && activeTab === 'transactions' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-[var(--border-primary)]"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      {t('transactions.filters.type')}
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                      className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="all">{t('transactions.filters.allTypes')}</option>
                      <option value="send">{t('transactionTypes.sent')}</option>
                      <option value="receive">{t('transactionTypes.received')}</option>
                      <option value="request">{t('transactionTypes.request')}</option>
                      <option value="refund">{t('transactionTypes.refund')}</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      {t('transactions.filters.status')}
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                      className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="all">{t('transactions.filters.allStatus')}</option>
                      <option value="completed">{t('status.completed')}</option>
                      <option value="pending">{t('status.pending')}</option>
                      <option value="failed">{t('status.failed')}</option>
                      <option value="cancelled">{t('status.cancelled')}</option>
                    </select>
                  </div>

                  {/* Time Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      {t('transactions.filters.timePeriod')}
                    </label>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                      className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="all">{t('transactions.filters.allTime')}</option>
                      <option value="today">{t('transactions.filters.today')}</option>
                      <option value="week">{t('transactions.filters.week')}</option>
                      <option value="month">{t('transactions.filters.month')}</option>
                      <option value="year">{t('transactions.filters.year')}</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'transactions' ? (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-12 text-center">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                    {t('transactions.empty.transactions')}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || timeFilter !== 'all'
                      ? t('transactions.empty.filtered')
                      : t('transactions.empty.start')}
                  </p>
                </div>
              ) : (
                <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] overflow-hidden">
                  <div className="divide-y divide-[var(--border-primary)]">
                    {filteredTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Type Icon */}
                            <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
                              {getTypeIcon(transaction.type)}
                            </div>

                            {/* Transaction Details */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-[var(--text-primary)]">
                                  {transaction.description}
                                </h3>
                                {getStatusIcon(transaction.status)}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)] mt-1">
                                <span>
                                  {transaction.type === 'send' ? t('transactions.details.to') + ': ' : t('transactions.details.from') + ': '}
                                  {transaction.type === 'send' 
                                    ? transaction.toUser?.name 
                                    : transaction.fromUser?.name}
                                </span>
                                <span>•</span>
                                <span>{transaction.createdAt.toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="font-mono">{transaction.reference}</span>
                              </div>
                            </div>
                          </div>

                          {/* Amount and Actions */}
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className={`font-semibold ${
                                transaction.type === 'receive' 
                                  ? 'text-[var(--color-success)]' 
                                  : 'text-[var(--text-primary)]'
                              }`}>
                                {transaction.type === 'receive' ? '+' : '-'}${transaction.amount.toFixed(2)}
                              </div>
                              {transaction.fee > 0 && (
                                <div className="text-sm text-[var(--text-secondary)]">
                                  {t('transactions.details.fee')}: ${transaction.fee.toFixed(2)}
                                </div>
                              )}
                            </div>

                            {/* Quick Actions */}
                            {transaction.status === 'failed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRetryTransaction(transaction.id);
                                }}
                                className="p-2 text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] rounded-lg transition-colors"
                                title={t('transactions.actions.retry')}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}

                            {transaction.status === 'pending' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelTransaction(transaction.id);
                                }}
                                className="p-2 text-[var(--color-error)] hover:bg-[var(--color-error-50)] rounded-lg transition-colors"
                                title={t('transactions.actions.cancel')}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-12 text-center">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                    {t('transactions.empty.requests')}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {t('transactions.empty.requestsDescription')}
                  </p>
                </div>
              ) : (
                <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] overflow-hidden">
                  <div className="divide-y divide-[var(--border-primary)]">
                    {filteredRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Request Icon */}
                            <div className="w-10 h-10 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-[var(--color-primary-600)]" />
                            </div>

                            {/* Request Details */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-[var(--text-primary)]">
                                  {request.description}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  request.status === 'pending' ? 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]' :
                                  request.status === 'paid' ? 'bg-[var(--color-success-100)] text-[var(--color-success-800)]' :
                                  request.status === 'declined' ? 'bg-[var(--color-error-100)] text-[var(--color-error-800)]' :
                                  'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                                }`}>
                                  {request.status}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)] mt-1">
                                <span>
                                  {t('transactions.details.from')}: {request.fromUser.name}
                                </span>
                                <span>•</span>
                                <span>{request.createdAt.toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{t('transactions.details.expires')}: {request.expiresAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Amount and Actions */}
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-semibold text-[var(--text-primary)]">
                                ${request.amount.toFixed(2)}
                              </div>
                            </div>

                            {/* Request Actions */}
                            {request.status === 'pending' && request.toUser.id === 'current-user' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleRespondToRequest(request.id, 'pay')}
                                  disabled={isLoading}
                                  className="px-3 py-1 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] disabled:bg-[var(--color-primary-400)] text-white text-sm rounded-lg transition-colors"
                                >
                                  {t('transactions.actions.pay')}
                                </button>
                                <button
                                  onClick={() => handleRespondToRequest(request.id, 'decline')}
                                  disabled={isLoading}
                                  className="px-3 py-1 border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] text-sm rounded-lg transition-colors"
                                >
                                  {t('transactions.actions.decline')}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction Detail Modal */}
        <AnimatePresence>
          {selectedTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTransaction(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    {t('transactions.details.title')}
                  </h2>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Amount */}
                  <div className="text-center py-4">
                    <div className={`text-3xl font-bold ${
                      selectedTransaction.type === 'receive' 
                        ? 'text-[var(--color-success)]' 
                        : 'text-[var(--text-primary)]'
                    }`}>
                      {selectedTransaction.type === 'receive' ? '+' : '-'}${selectedTransaction.amount.toFixed(2)}
                    </div>
                    <div className="text-[var(--text-secondary)] mt-1">
                      {selectedTransaction.description}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 border-t border-[var(--border-primary)] pt-4">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Status</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedTransaction.status)}
                        <span className="capitalize font-medium text-[var(--text-primary)]">
                          {selectedTransaction.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Type</span>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(selectedTransaction.type)}
                        <span className="capitalize font-medium text-[var(--text-primary)]">
                          {selectedTransaction.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">
                        {selectedTransaction.type === 'send' ? t('transactions.details.to') : t('transactions.details.from')}
                      </span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {selectedTransaction.type === 'send' 
                          ? selectedTransaction.toUser?.name 
                          : selectedTransaction.fromUser?.name}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{t('transactions.details.date')}</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {selectedTransaction.createdAt.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{t('transactions.details.reference')}</span>
                      <span className="font-mono text-sm text-[var(--text-primary)]">
                        {selectedTransaction.reference}
                      </span>
                    </div>

                    {selectedTransaction.fee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">{t('transactions.details.fee')}</span>
                        <span className="font-medium text-[var(--text-primary)]">
                          ${selectedTransaction.fee.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{t('transactions.details.total')}</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        ${selectedTransaction.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedTransaction.status === 'failed' && (
                    <div className="border-t border-[var(--border-primary)] pt-4">
                      <button
                        onClick={() => {
                          handleRetryTransaction(selectedTransaction.id);
                          setSelectedTransaction(null);
                        }}
                        className="w-full bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        {t('transactions.details.retryTransaction')}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}