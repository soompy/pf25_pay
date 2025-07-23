'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Trash2, 
  AlertTriangle, 
  Download,
  FileText,
  Database,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  X,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const deleteAccountSchema = z.object({
  confirmText: z.string().refine(val => val === 'DELETE MY ACCOUNT', 'Type "DELETE MY ACCOUNT" to confirm'),
  password: z.string().min(1, 'Password is required'),
  reason: z.string().optional(),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

export default function DangerZoneSettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'initial' | 'confirm' | 'processing' | 'completed'>('initial');
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'completed'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const confirmText = watch('confirmText');

  const handleExportData = async () => {
    setExportStatus('exporting');
    try {
      // Mock data export
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock export data
      const exportData = {
        profile: {
          name: user?.name,
          email: user?.email,
          createdAt: user?.createdAt,
          role: user?.role
        },
        transactions: [
          { id: 1, type: 'income', amount: 2500.00, description: 'Salary', date: '2024-01-15' },
          { id: 2, type: 'expense', amount: 89.99, description: 'Grocery Store', date: '2024-01-14' },
          { id: 3, type: 'expense', amount: 1200.00, description: 'Rent Payment', date: '2024-01-01' }
        ],
        settings: {
          twoFactorEnabled: user?.twoFactorEnabled,
          emailVerified: user?.isEmailVerified
        },
        exportedAt: new Date().toISOString()
      };

      // Download as JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `safepay-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus('completed');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch {
      setExportStatus('idle');
    }
  };

  const onDeleteSubmit = async () => {
    setDeleteStep('processing');
    try {
      // Mock account deletion
      await new Promise(resolve => setTimeout(resolve, 3000));
      setDeleteStep('completed');
      
      // Auto logout and redirect after 2 seconds
      setTimeout(() => {
        logout();
        router.push('/');
      }, 2000);
    } catch {
      setDeleteStep('confirm');
    }
  };

  const handleCancelDelete = () => {
    setDeleteStep('initial');
    reset();
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Data Export Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Export Your Data
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download a copy of your personal data and account information
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-300">
                Your data export will include profile information, transaction history, settings, and other account data.
                This process may take a few minutes to complete.
              </p>
            </div>

            {/* Data Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Profile Data</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Personal information and preferences</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Transaction History</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Payment and transaction records</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Security Settings</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Authentication and security preferences</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Account Metadata</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Creation dates and usage statistics</p>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={handleExportData}
                disabled={exportStatus === 'exporting'}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
              >
                {exportStatus === 'exporting' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting Data...
                  </>
                ) : exportStatus === 'completed' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Export Complete!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800">
        <div className="px-6 py-4 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-900 dark:text-red-400">
                Delete Account
              </h2>
              <p className="text-sm text-red-600 dark:text-red-400">
                Permanently delete your account and all associated data
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {deleteStep === 'initial' && (
              <motion.div
                key="initial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-300 mb-2">
                        Warning: This action cannot be undone
                      </p>
                      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                        <li>• All your personal data will be permanently deleted</li>
                        <li>• Your transaction history will be removed</li>
                        <li>• You will lose access to all connected services</li>
                        <li>• Your username will become available for others to use</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Before deleting your account:</strong> Consider exporting your data first. 
                    Once your account is deleted, we cannot recover your information.
                  </p>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => setDeleteStep('confirm')}
                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    I Want to Delete My Account
                  </button>
                </div>
              </motion.div>
            )}

            {deleteStep === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <form onSubmit={handleSubmit(onDeleteSubmit)} className="space-y-6">
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      Please confirm that you want to delete your account by completing the form below.
                    </p>
                  </div>

                  {/* Confirmation Text */}
                  <div>
                    <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type &quot;DELETE MY ACCOUNT&quot; to confirm
                    </label>
                    <input
                      {...register('confirmText')}
                      type="text"
                      id="confirmText"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="DELETE MY ACCOUNT"
                    />
                    {errors.confirmText && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmText.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter your password to confirm
                    </label>
                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Reason (Optional) */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for leaving (optional)
                    </label>
                    <textarea
                      {...register('reason')}
                      id="reason"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Help us improve by telling us why you're leaving..."
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCancelDelete}
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={confirmText !== 'DELETE MY ACCOUNT'}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete My Account
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {deleteStep === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-red-600 dark:text-red-400 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Deleting Your Account
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we process your account deletion...
                </p>
              </motion.div>
            )}

            {deleteStep === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Account Deleted Successfully
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your account has been permanently deleted. You will be redirected shortly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}