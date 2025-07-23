'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Smartphone,
  AlertTriangle,
  Check,
  X,
  Loader2,
  QrCode,
  Copy,
  Download
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력하세요'),
  newPassword: z.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/(?=.*[a-z])/, '소문자를 포함해야 합니다')
    .regex(/(?=.*[A-Z])/, '대문자를 포함해야 합니다')
    .regex(/(?=.*\d)/, '숫자를 포함해야 합니다'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export default function SecuritySettingsPage() {
  const { user, enableTwoFactor, disableTwoFactor, isLoading } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<'idle' | 'changing' | 'success' | 'error'>('idle');
  const [twoFactorStep, setTwoFactorStep] = useState<'idle' | 'setup' | 'verify' | 'disable'>('idle');
  const [, setQrCodeUrl] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const newPassword = watch('newPassword');
  const passwordRequirements = [
    { test: newPassword?.length >= 8, label: '8자 이상' },
    { test: /(?=.*[a-z])/.test(newPassword || ''), label: '소문자 포함' },
    { test: /(?=.*[A-Z])/.test(newPassword || ''), label: '대문자 포함' },
    { test: /(?=.*\d)/.test(newPassword || ''), label: '숫자 포함' },
  ];

  const onPasswordSubmit = async () => {
    setPasswordChangeStatus('changing');
    try {
      // Mock password change
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPasswordChangeStatus('success');
      reset();
      setTimeout(() => setPasswordChangeStatus('idle'), 3000);
    } catch {
      setPasswordChangeStatus('error');
      setTimeout(() => setPasswordChangeStatus('idle'), 3000);
    }
  };

  const handleEnable2FA = async () => {
    setTwoFactorStep('setup');
    try {
      const qrUrl = await enableTwoFactor();
      setQrCodeUrl(qrUrl);
      // Mock backup codes generation
      setBackupCodes([
        'abc123def456',
        'ghi789jkl012',
        'mno345pqr678',
        'stu901vwx234',
        'yz567abc890',
        'def123ghi456',
        'jkl789mno012',
        'pqr345stu678'
      ]);
    } catch {
      setTwoFactorStep('idle');
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) return;
    
    setTwoFactorStep('verify');
    try {
      // Mock verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorStep('idle');
      setVerificationCode('');
    } catch {
      setTwoFactorStep('setup');
    }
  };

  const handleDisable2FA = async () => {
    setTwoFactorStep('disable');
    try {
      await disableTwoFactor(verificationCode);
      setTwoFactorStep('idle');
      setVerificationCode('');
    } catch {
      setTwoFactorStep('idle');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safepay-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Password Change Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Change Password
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update your password to keep your account secure
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onPasswordSubmit)} className="p-6">
          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  {...register('currentPassword')}
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  {...register('newPassword')}
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {newPassword && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
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
              
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Confirm new password"
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
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={passwordChangeStatus === 'changing'}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
            >
              {passwordChangeStatus === 'changing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : passwordChangeStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Changed!
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.twoFactorEnabled
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
            }`}>
              {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>

        <div className="p-6">
          {user.twoFactorEnabled ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">
                    Two-factor authentication is enabled
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Your account is protected with an additional security layer
                  </p>
                </div>
              </div>
              
              {twoFactorStep === 'disable' ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-300">
                        Disable Two-Factor Authentication
                      </p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        Enter a verification code from your authenticator app to disable 2FA
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Verification Code
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                      <button
                        onClick={handleDisable2FA}
                        disabled={verificationCode.length !== 6 || isLoading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Disable'
                        )}
                      </button>
                      <button
                        onClick={() => setTwoFactorStep('idle')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setTwoFactorStep('disable')}
                  className="flex items-center px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Disable Two-Factor Authentication
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {twoFactorStep === 'idle' && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">
                        Secure your account with 2FA
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Use an authenticator app to generate verification codes
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleEnable2FA}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    Enable Two-Factor Authentication
                  </button>
                </div>
              )}

              {twoFactorStep === 'setup' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Set up Two-Factor Authentication
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Scan the QR code with your authenticator app
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <QrCode className="w-48 h-48 text-gray-400" />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Backup Codes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                          <code className="text-sm font-mono">{code}</code>
                          <button
                            onClick={() => copyToClipboard(code)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={downloadBackupCodes}
                      className="flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download Backup Codes
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter verification code to complete setup
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                      <button
                        onClick={handleVerify2FA}
                        disabled={verificationCode.length !== 6 || twoFactorStep === 'setup'}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
                      >
                        {twoFactorStep === 'setup' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Verify & Enable'
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Demo code: 123456
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}