'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  CreditCard,
  Shield,
  TrendingUp,
  Users,
  Settings,
  Check,
  Save,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  email: boolean;
  push: boolean;
  category: 'security' | 'financial' | 'social' | 'system';
}

export default function NotificationsSettingsPage() {
  const { user } = useAuthStore();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    // Security Notifications
    {
      id: 'login_alerts',
      title: 'Login Alerts',
      description: 'Get notified when someone logs into your account',
      icon: Shield,
      email: true,
      push: true,
      category: 'security'
    },
    {
      id: 'security_updates',
      title: 'Security Updates',
      description: 'Important security announcements and updates',
      icon: Shield,
      email: true,
      push: false,
      category: 'security'
    },
    {
      id: 'password_changes',
      title: 'Password Changes',
      description: 'Notifications when your password is changed',
      icon: Shield,
      email: true,
      push: true,
      category: 'security'
    },
    
    // Financial Notifications
    {
      id: 'payment_received',
      title: 'Payment Received',
      description: 'When you receive a payment',
      icon: CreditCard,
      email: true,
      push: true,
      category: 'financial'
    },
    {
      id: 'payment_sent',
      title: 'Payment Sent',
      description: 'When you send a payment',
      icon: CreditCard,
      email: false,
      push: true,
      category: 'financial'
    },
    {
      id: 'low_balance',
      title: 'Low Balance Alert',
      description: 'When your account balance is running low',
      icon: TrendingUp,
      email: true,
      push: true,
      category: 'financial'
    },
    {
      id: 'monthly_summary',
      title: 'Monthly Summary',
      description: 'Monthly spending and income summary',
      icon: TrendingUp,
      email: true,
      push: false,
      category: 'financial'
    },
    
    // Social Notifications
    {
      id: 'friend_requests',
      title: 'Friend Requests',
      description: 'When someone sends you a friend request',
      icon: Users,
      email: false,
      push: true,
      category: 'social'
    },
    {
      id: 'payment_requests',
      title: 'Payment Requests',
      description: 'When someone requests money from you',
      icon: Users,
      email: true,
      push: true,
      category: 'social'
    },
    
    // System Notifications
    {
      id: 'system_maintenance',
      title: 'System Maintenance',
      description: 'Scheduled maintenance and downtime alerts',
      icon: Settings,
      email: true,
      push: false,
      category: 'system'
    },
    {
      id: 'feature_updates',
      title: 'Feature Updates',
      description: 'New features and product announcements',
      icon: Settings,
      email: false,
      push: false,
      category: 'system'
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    marketingEmails: false,
    weeklyDigest: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  });

  const categories = [
    { id: 'security', title: 'Security', icon: Shield, color: 'red' },
    { id: 'financial', title: 'Financial', icon: CreditCard, color: 'green' },
    { id: 'social', title: 'Social', icon: Users, color: 'blue' },
    { id: 'system', title: 'System', icon: Settings, color: 'gray' }
  ];

  const updateNotificationSetting = (id: string, type: 'email' | 'push', value: boolean) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, [type]: value } : setting
      )
    );
  };

  const updateGlobalSetting = (key: string, value: any) => {
    setGlobalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateQuietHours = (key: string, value: string | boolean) => {
    setGlobalSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('idle');
    }
  };

  const getCategorySettings = (category: string) => {
    return notificationSettings.filter(setting => setting.category === category);
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      gray: 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Global Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Global Notification Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Control your overall notification preferences
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Master Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={globalSettings.emailEnabled}
                  onChange={(e) => updateGlobalSetting('emailEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={globalSettings.pushEnabled}
                  onChange={(e) => updateGlobalSetting('pushEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Marketing Emails</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Product updates and promotional content</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={globalSettings.marketingEmails}
                  onChange={(e) => updateGlobalSetting('marketingEmails', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Weekly summary of your account activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={globalSettings.weeklyDigest}
                  onChange={(e) => updateGlobalSetting('weeklyDigest', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Quiet Hours</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pause non-urgent notifications during these hours</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={globalSettings.quietHours.enabled}
                  onChange={(e) => updateQuietHours('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {globalSettings.quietHours.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={globalSettings.quietHours.start}
                    onChange={(e) => updateQuietHours('start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={globalSettings.quietHours.end}
                    onChange={(e) => updateQuietHours('end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Categories */}
      {categories.map((category, categoryIndex) => {
        const categorySettings = getCategorySettings(category.id);
        if (categorySettings.length === 0) return null;

        const Icon = category.icon;

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(category.color)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.title} Notifications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage {category.title.toLowerCase()} related notifications
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="col-span-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification</p>
                  </div>
                  <div className="col-span-3 text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                  </div>
                  <div className="col-span-3 text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Push</p>
                  </div>
                </div>

                {/* Notification Items */}
                {categorySettings.map((setting, index) => {
                  const SettingIcon = setting.icon;
                  return (
                    <motion.div
                      key={setting.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                      className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2"
                    >
                      <div className="col-span-6 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <SettingIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {setting.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.email && globalSettings.emailEnabled}
                            onChange={(e) => updateNotificationSetting(setting.id, 'email', e.target.checked)}
                            disabled={!globalSettings.emailEnabled}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                        </label>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.push && globalSettings.pushEnabled}
                            onChange={(e) => updateNotificationSetting(setting.id, 'push', e.target.checked)}
                            disabled={!globalSettings.pushEnabled}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                        </label>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Preferences
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}