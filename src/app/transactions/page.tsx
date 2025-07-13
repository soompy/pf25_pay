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
  Calendar,
  DollarSign,
  User,
  RefreshCw,
  Eye,
  MoreHorizontal,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Repeat,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { usePaymentStore } from '@/store/payment';
import type { Transaction, PaymentRequest } from '@/types/payment';

type FilterType = 'all' | 'send' | 'receive' | 'request' | 'refund';
type StatusFilter = 'all' | 'completed' | 'pending' | 'failed' | 'cancelled';
type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

export default function TransactionsPage() {
  const { user, state: authState } = useAuthStore();
  const { 
    transactions, 
    paymentRequests, 
    getTransactions, 
    getPaymentRequests,
    retryTransaction,
    cancelTransaction,
    respondToRequest,
    isLoading, 
    error 
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Transactions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage your payment history
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportTransactions}
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Transactions ({filteredTransactions.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Payment Requests ({filteredRequests.length})
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Search transactions..."
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && activeTab === 'transactions' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Types</option>
                      <option value="send">Sent</option>
                      <option value="receive">Received</option>
                      <option value="request">Requests</option>
                      <option value="refund">Refunds</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Time Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time Period
                    </label>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="year">Last Year</option>
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
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No transactions found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || timeFilter !== 'all'
                      ? 'Try adjusting your filters to see more results.'
                      : 'Start by sending or requesting money.'}
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Type Icon */}
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              {getTypeIcon(transaction.type)}
                            </div>

                            {/* Transaction Details */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {transaction.description}
                                </h3>
                                {getStatusIcon(transaction.status)}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span>
                                  {transaction.type === 'send' ? 'To: ' : 'From: '}
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
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {transaction.type === 'receive' ? '+' : '-'}${transaction.amount.toFixed(2)}
                              </div>
                              {transaction.fee > 0 && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Fee: ${transaction.fee.toFixed(2)}
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
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Retry transaction"
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
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Cancel transaction"
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
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No payment requests found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Payment requests you send or receive will appear here.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
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
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>

                            {/* Request Details */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {request.description}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                  request.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                  request.status === 'declined' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                }`}>
                                  {request.status}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span>
                                  From: {request.fromUser.name}
                                </span>
                                <span>•</span>
                                <span>{request.createdAt.toLocaleDateString()}</span>
                                <span>•</span>
                                <span>Expires: {request.expiresAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Amount and Actions */}
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                ${request.amount.toFixed(2)}
                              </div>
                            </div>

                            {/* Request Actions */}
                            {request.status === 'pending' && request.toUser.id === 'current-user' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleRespondToRequest(request.id, 'pay')}
                                  disabled={isLoading}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-lg transition-colors"
                                >
                                  Pay
                                </button>
                                <button
                                  onClick={() => handleRespondToRequest(request.id, 'decline')}
                                  disabled={isLoading}
                                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm rounded-lg transition-colors"
                                >
                                  Decline
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
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Transaction Details
                  </h2>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Amount */}
                  <div className="text-center py-4">
                    <div className={`text-3xl font-bold ${
                      selectedTransaction.type === 'receive' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {selectedTransaction.type === 'receive' ? '+' : '-'}${selectedTransaction.amount.toFixed(2)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 mt-1">
                      {selectedTransaction.description}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedTransaction.status)}
                        <span className="capitalize font-medium text-gray-900 dark:text-white">
                          {selectedTransaction.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type</span>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(selectedTransaction.type)}
                        <span className="capitalize font-medium text-gray-900 dark:text-white">
                          {selectedTransaction.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {selectedTransaction.type === 'send' ? 'To' : 'From'}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedTransaction.type === 'send' 
                          ? selectedTransaction.toUser?.name 
                          : selectedTransaction.fromUser?.name}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedTransaction.createdAt.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reference</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {selectedTransaction.reference}
                      </span>
                    </div>

                    {selectedTransaction.fee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fee</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${selectedTransaction.fee.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${selectedTransaction.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedTransaction.status === 'failed' && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <button
                        onClick={() => {
                          handleRetryTransaction(selectedTransaction.id);
                          setSelectedTransaction(null);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Retry Transaction
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