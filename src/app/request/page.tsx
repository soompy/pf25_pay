'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Share,
  Copy,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Users,
  Search,
  X,
  QrCode,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { usePaymentStore } from '@/store/payment';
import type { Contact } from '@/types/payment';

const requestMoneySchema = z.object({
  recipientType: z.enum(['contact', 'email', 'phone']),
  recipient: z.string().min(1, 'Recipient is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  currency: z.string().optional().default('USD'),
  expiresInDays: z.number().min(1).max(30).optional().default(7),
  sendNotification: z.boolean().optional().default(true),
});

type RequestMoneyFormData = z.infer<typeof requestMoneySchema>;

export default function RequestMoneyPage() {
  const { user, state: authState } = useAuthStore();
  const { 
    contacts, 
    requestMoney, 
    searchContacts,
    generateQRCode,
    isLoading, 
    error,
    currentRequest,
    clearError 
  } = usePaymentStore();
  
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactSearch, setContactSearch] = useState('');
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset
  } = useForm<RequestMoneyFormData>({
    resolver: zodResolver(requestMoneySchema),
    defaultValues: {
      recipientType: 'contact',
      currency: 'USD',
      expiresInDays: 7,
      sendNotification: true,
    }
  });

  const recipientType = watch('recipientType');
  const amount = watch('amount');

  // Redirect if not authenticated
  useEffect(() => {
    if (authState !== 'authenticated' || !user) {
      router.push('/auth/login');
    }
  }, [authState, user, router]);

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

  const handleRecipientTypeChange = (type: 'contact' | 'email' | 'phone') => {
    setValue('recipientType', type);
    setValue('recipient', '');
    setSelectedContact(null);
  };

  const onSubmit = async (data: RequestMoneyFormData) => {
    if (step === 'form') {
      setStep('preview');
    } else if (step === 'preview') {
      try {
        const request = await requestMoney(data);
        
        // Generate QR code for the request
        const qrData = await generateQRCode({
          type: 'payment_request',
          amount: data.amount,
          currency: data.currency,
          description: data.description,
        });
        setQrCode(qrData);
        
        // Create shareable URL (in real app, this would be a proper deep link)
        const url = `${window.location.origin}/pay/${request.id}`;
        setShareUrl(url);
        
        setStep('success');
      } catch {
        // Error handled by store
      }
    }
  };

  const handleBack = () => {
    if (step === 'preview') {
      setStep('form');
    } else {
      router.push('/dashboard');
    }
  };

  const handleStartOver = () => {
    setStep('form');
    reset();
    setSelectedContact(null);
    setQrCode('');
    setShareUrl('');
    clearError();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification
  };

  const shareRequest = async () => {
    if (navigator.share && currentRequest) {
      try {
        await navigator.share({
          title: 'Payment Request - SafePay',
          text: `${user?.name} is requesting $${currentRequest.amount.toFixed(2)} for ${currentRequest.description}`,
          url: shareUrl,
        });
      } catch {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
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
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Request Money
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {step === 'form' && 'Create a payment request'}
                {step === 'preview' && 'Review your request'}
                {step === 'success' && 'Request created successfully'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: step === 'form' ? '33%' : 
                       step === 'preview' ? '66%' : '100%' 
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
                    Who do you want to request money from?
                  </h2>

                  {/* Recipient Type Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { type: 'contact' as const, label: 'Contact', icon: Users },
                      { type: 'email' as const, label: 'Email', icon: Mail },
                      { type: 'phone' as const, label: 'Phone', icon: Phone },
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
                        type={recipientType === 'email' ? 'email' : 'tel'}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder={
                          recipientType === 'email' ? 'Enter email address' : 'Enter phone number'
                        }
                      />
                      {errors.recipient && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.recipient.message}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Request Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Request Details
                  </h2>

                  <div className="space-y-4">
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

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What&apos;s this for?
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                          {...register('description')}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                          placeholder="e.g., Dinner split, Rent contribution, Event tickets"
                        />
                      </div>
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Expiration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Request expires in
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          {...register('expiresInDays', { valueAsNumber: true })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value={1}>1 day</option>
                          <option value={3}>3 days</option>
                          <option value={7}>1 week</option>
                          <option value={14}>2 weeks</option>
                          <option value={30}>1 month</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Notification Settings
                  </h2>

                  <label className="flex items-center">
                    <input
                      {...register('sendNotification')}
                      type="checkbox"
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Send notification to recipient
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                    The recipient will receive an email or SMS notification about your request
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={!amount || isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Preview Request
                </button>
              </motion.div>
            )}

            {/* Step 2: Preview */}
            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Review Request Details
                  </h2>

                  {/* Request Preview */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 mb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Payment Request
                      </h3>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        ${getValues('amount')?.toFixed(2)}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {getValues('description')}
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        From: {user?.name}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Recipient */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Requesting from</span>
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

                    {/* Expiration */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expires</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(Date.now() + getValues('expiresInDays') * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Notification */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Notification</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getValues('sendNotification') ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
                      <p className="text-red-600 dark:text-red-400 text-sm">{error.message}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Request...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Create Request
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && currentRequest && (
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
                    Request Created!
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your request for ${currentRequest.amount.toFixed(2)} has been created successfully
                  </p>
                  
                  {/* QR Code */}
                  {qrCode && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 inline-block">
                      <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">QR Code for easy sharing</p>
                    </div>
                  )}
                  
                  {/* Request Details */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Request ID</span>
                        <span className="font-mono text-gray-900 dark:text-white">{currentRequest.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Expires</span>
                        <span className="text-gray-900 dark:text-white">
                          {currentRequest.expiresAt.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status</span>
                        <span className="text-yellow-600 dark:text-yellow-400 capitalize">
                          {currentRequest.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Share Options */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Share this request
                    </h3>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={shareRequest}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </button>
                      
                      <button
                        onClick={() => copyToClipboard(shareUrl)}
                        className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-2 font-mono break-all">
                      {shareUrl}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => router.push('/transactions')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    View All Requests
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Create Another Request
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