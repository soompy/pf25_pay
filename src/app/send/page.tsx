'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  Clock,
  Repeat,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Users,
  Search,
  X,
  DollarSign,
  Lock
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { usePaymentStore } from '@/store/payment';
import { ThemeSwitcher } from '@/components/ui/molecules/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/molecules/LanguageSwitcher';
import type { Contact } from '@/types/payment';

const sendMoneySchema = z.object({
  recipientType: z.enum(['contact', 'email', 'phone', 'account']),
  recipient: z.string().min(1, 'Recipient is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  fromCard: z.string().min(1, 'Please select a card'),
  currency: z.string().optional().default('USD'),
  scheduleType: z.enum(['now', 'later', 'recurring']).optional().default('now'),
  scheduledDate: z.date().optional(),
  recurringPattern: z.enum(['daily', 'weekly', 'monthly']).optional(),
  isPrivate: z.boolean().optional().default(false),
  requestTwoFactor: z.boolean().optional().default(false),
});

type SendMoneyFormData = z.infer<typeof sendMoneySchema>;

export default function SendMoneyPage() {
  const { user, state: authState } = useAuthStore();
  const { 
    cards, 
    contacts, 
    sendMoney, 
    searchContacts,
 
    isLoading, 
    error,
    currentTransaction,
    clearError 
  } = usePaymentStore();
  
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'review' | 'confirm' | 'success'>('form');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactSearch, setContactSearch] = useState('');
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset
  } = useForm<SendMoneyFormData>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      recipientType: 'contact',
      currency: 'USD',
      scheduleType: 'now',
      isPrivate: false,
      requestTwoFactor: false,
    }
  });

  const recipientType = watch('recipientType');
  const amount = watch('amount');
  const fromCardId = watch('fromCard');
  const scheduleType = watch('scheduleType');

  // Redirect if not authenticated
  useEffect(() => {
    if (authState !== 'authenticated' || !user) {
      router.push('/auth/login');
    }
  }, [authState, user, router]);

  // Set default card
  useEffect(() => {
    const defaultCard = cards.find(card => card.isDefault);
    if (defaultCard && !fromCardId) {
      setValue('fromCard', defaultCard.id);
    }
  }, [cards, fromCardId, setValue]);

  const selectedCard = cards.find(card => card.id === fromCardId);
  const fee = amount ? amount * 0.01 : 0; // 1% fee
  const totalAmount = amount ? amount + fee : 0;

  const filteredContacts = contactSearch 
    ? searchContacts(contactSearch)
    : contacts.filter(contact => contact.isFrequent);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setValue('recipient', contact.email || contact.phone || contact.name);
    setValue('recipientType', contact.email ? 'email' : contact.phone ? 'phone' : 'contact');
    setShowContactSearch(false);
    setContactSearch('');
  };

  const handleRecipientTypeChange = (type: 'contact' | 'email' | 'phone' | 'account') => {
    setValue('recipientType', type);
    setValue('recipient', '');
    setSelectedContact(null);
  };

  const onSubmit = async (data: SendMoneyFormData) => {
    if (step === 'form') {
      setStep('review');
    } else if (step === 'review') {
      setStep('confirm');
    } else if (step === 'confirm') {
      try {
        await sendMoney(data);
        setStep('success');
      } catch {
        // Error handled by store
      }
    }
  };

  const handleBack = () => {
    if (step === 'review') {
      setStep('form');
    } else if (step === 'confirm') {
      setStep('review');
    } else {
      router.push('/dashboard');
    }
  };

  const handleStartOver = () => {
    setStep('form');
    reset();
    setSelectedContact(null);
    clearError();
  };

  if (authState !== 'authenticated' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Send Money
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {step === 'form' && 'Enter payment details'}
                  {step === 'review' && 'Review your payment'}
                  {step === 'confirm' && 'Confirm payment'}
                  {step === 'success' && 'Payment sent successfully'}
                </p>
              </div>
            </div>
            
            {/* Language and Theme Switchers */}
            <div className="flex items-center space-x-2">
              <LanguageSwitcher variant="inline" size="sm" />
              <ThemeSwitcher variant="dropdown" size="sm" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: step === 'form' ? '25%' : 
                       step === 'review' ? '50%' : 
                       step === 'confirm' ? '75%' : '100%' 
              }}
            />
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Form */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Recipient Selection */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Who are you sending to?
                  </h2>

                  {/* Recipient Type Tabs */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { type: 'contact' as const, label: 'Contact', icon: Users },
                      { type: 'email' as const, label: 'Email', icon: Mail },
                      { type: 'phone' as const, label: 'Phone', icon: Phone },
                      { type: 'account' as const, label: 'Account', icon: User },
                    ].map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleRecipientTypeChange(type)}
                        className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                          recipientType === type
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Contact Search */}
                  {recipientType === 'contact' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={contactSearch}
                          onChange={(e) => setContactSearch(e.target.value)}
                          onFocus={() => setShowContactSearch(true)}
                          className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Search contacts..."
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {contactSearch && (
                          <button
                            type="button"
                            onClick={() => {
                              setContactSearch('');
                              setShowContactSearch(false);
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Contact List */}
                      {(showContactSearch || contactSearch) && (
                        <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                          {filteredContacts.length > 0 ? (
                            filteredContacts.map((contact) => (
                              <button
                                key={contact.id}
                                type="button"
                                onClick={() => handleContactSelect(contact)}
                                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                {contact.avatar ? (
                                  <Image 
                                    src={contact.avatar} 
                                    alt={contact.name}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                                  </div>
                                )}
                                <div className="flex-1 text-left">
                                  <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {contact.email || contact.phone}
                                  </p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                              No contacts found
                            </div>
                          )}
                        </div>
                      )}

                      {/* Selected Contact Display */}
                      {selectedContact && (
                        <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          {selectedContact.avatar ? (
                            <Image 
                              src={selectedContact.avatar} 
                              alt={selectedContact.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{selectedContact.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {selectedContact.email || selectedContact.phone}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedContact(null);
                              setValue('recipient', '');
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Input */}
                  {recipientType !== 'contact' && (
                    <div>
                      <input
                        {...register('recipient')}
                        type={recipientType === 'email' ? 'email' : recipientType === 'phone' ? 'tel' : 'text'}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder={
                          recipientType === 'email' ? 'Enter email address' :
                          recipientType === 'phone' ? 'Enter phone number' :
                          'Enter account number'
                        }
                      />
                      {errors.recipient && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.recipient.message}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Amount and Card Selection */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Payment Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          {...register('amount', { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
                      )}
                    </div>

                    {/* Card Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        From Card
                      </label>
                      <select
                        {...register('fromCard')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select a card</option>
                        {cards.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.name} •••• {card.last4} (${card.balance.toLocaleString()})
                          </option>
                        ))}
                      </select>
                      {errors.fromCard && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fromCard.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What&apos;s this for?
                    </label>
                    <input
                      {...register('description')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Lunch, Rent, Gift"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Fee Display */}
                  {amount > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Amount</span>
                        <span className="text-gray-900 dark:text-white">${amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Fee (1%)</span>
                        <span className="text-gray-900 dark:text-white">${fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule Options */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    When to send?
                  </h2>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { type: 'now' as const, label: 'Send Now', icon: Send },
                      { type: 'later' as const, label: 'Schedule', icon: Clock },
                      { type: 'recurring' as const, label: 'Recurring', icon: Repeat },
                    ].map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setValue('scheduleType', type)}
                        className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                          scheduleType === type
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>

                  {scheduleType === 'later' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Scheduled Date
                      </label>
                      <input
                        {...register('scheduledDate', { valueAsDate: true })}
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}

                  {scheduleType === 'recurring' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Repeat Pattern
                      </label>
                      <select
                        {...register('recurringPattern')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Privacy and Security Options */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Privacy & Security
                  </h2>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        {...register('isPrivate')}
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Make this payment private
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        {...register('requestTwoFactor')}
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Require two-factor authentication
                      </span>
                    </label>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={!amount || !selectedCard || isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Review Payment
                </button>
              </motion.div>
            )}

            {/* Step 2: Review */}
            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Review Payment Details
                  </h2>

                  <div className="space-y-4">
                    {/* Recipient */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">To</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedContact?.name || getValues('recipient')}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${getValues('amount')?.toFixed(2)}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">For</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getValues('description')}
                      </span>
                    </div>

                    {/* From Card */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">From</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedCard?.name} •••• {selectedCard?.last4}
                      </span>
                    </div>

                    {/* Schedule */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">When</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getValues('scheduleType') === 'now' ? 'Now' :
                         getValues('scheduleType') === 'later' ? 'Scheduled' :
                         'Recurring'}
                      </span>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Amount</span>
                        <span className="text-gray-900 dark:text-white">${getValues('amount')?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Fee</span>
                        <span className="text-gray-900 dark:text-white">${fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Confirm Payment
                </button>
              </motion.div>
            )}

            {/* Step 3: Confirm (Password/2FA) */}
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Secure Payment Confirmation
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Enter your password to authorize this payment
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">You&apos;re sending</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          to {selectedContact?.name || getValues('recipient')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
                        <p className="text-red-600 dark:text-red-400 text-sm">{error.message}</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!confirmPassword || isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Payment
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && currentTransaction && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Sent!
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your payment of ${currentTransaction.totalAmount.toFixed(2)} has been sent successfully
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                        <span className="font-mono text-gray-900 dark:text-white">{currentTransaction.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Reference</span>
                        <span className="font-mono text-gray-900 dark:text-white">{currentTransaction.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date</span>
                        <span className="text-gray-900 dark:text-white">
                          {currentTransaction.createdAt.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => router.push('/transactions')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    View Transaction Details
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Send Another Payment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}