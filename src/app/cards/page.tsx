'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CreditCard, 
  Plus, 
  Star,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
  AlertCircle,
  X,
  DollarSign,
  Edit
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { usePaymentStore } from '@/store/payment';
import { ThemeSwitcher } from '@/components/ui/molecules/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/molecules/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import type { Card } from '@/types/payment';

// Create dynamic schema with translations
const createAddCardSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t('validation.cardNameRequired')),
  cardNumber: z.string().min(16, t('validation.cardNumberMinLength')),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(new Date().getFullYear()).max(2035),
  cvv: z.string().min(3).max(4),
  balance: z.number().min(0, t('validation.balancePositive')).optional(),
});

type AddCardFormData = z.infer<ReturnType<typeof createAddCardSchema>>;

export default function CardsPage() {
  const { user, state: authState } = useAuthStore();
  const { t } = useTranslation('cards');
  const { 
    cards, 
    addCard, 
    deleteCard, 
    setDefaultCard,
    isLoading,
    error
  } = usePaymentStore();
  
  const router = useRouter();
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});
  const [showBalances, setShowBalances] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const addCardSchema = createAddCardSchema(t);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<AddCardFormData>({
    resolver: zodResolver(addCardSchema),
  });

  const cardNumber = watch('cardNumber');

  // Redirect if not authenticated
  useEffect(() => {
    if (authState !== 'authenticated' || !user) {
      router.push('/auth/login');
    }
  }, [authState, user, router]);

  const getCardType = (number: string): Card['type'] => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    if (cleaned.startsWith('6')) return 'Discover';
    return 'Visa';
  };

  const getCardBrand = (type: Card['type']): string => {
    return type.toLowerCase().replace(' ', '');
  };

  const formatCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ');
    return formatted.trim();
  };

  const maskCardNumber = (number: string) => {
    return `**** **** **** ${number.slice(-4)}`;
  };

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleSetDefault = async (cardId: string) => {
    await setDefaultCard(cardId);
  };

  const handleDeleteCard = async (cardId: string) => {
    await deleteCard(cardId);
    setShowDeleteModal(null);
  };

  const onSubmit = async (data: AddCardFormData) => {
    try {
      const cardType = getCardType(data.cardNumber);
      await addCard({
        name: data.name,
        last4: data.cardNumber.slice(-4),
        type: cardType,
        brand: getCardBrand(cardType),
        balance: data.balance || 0,
        isDefault: cards.length === 0,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        currency: 'USD',
        status: 'active',
      });
      
      reset();
      setShowAddCard(false);
    } catch {
      // Error handled by store
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                {t('title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('description')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Language and Theme Switchers */}
              <div className="flex items-center space-x-2">
                <LanguageSwitcher variant="inline" size="sm" />
                <ThemeSwitcher variant="dropdown" size="sm" />
              </div>
              
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {showBalances ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    {t('hideBalances')}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    {t('showBalances')}
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('addCard')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Card */}
              <div className={`relative p-6 rounded-xl text-white overflow-hidden ${
                card.brand === 'visa' ? 'bg-gradient-to-br from-green-600 to-green-800' :
                card.brand === 'mastercard' ? 'bg-gradient-to-br from-red-600 to-red-800' :
                card.brand === 'amex' ? 'bg-gradient-to-br from-green-600 to-green-800' :
                'bg-gradient-to-br from-purple-600 to-purple-800'
              }`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 border border-white rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 border border-white rounded-full"></div>
                </div>

                {/* Card Header */}
                <div className="relative flex items-start justify-between mb-8">
                  <div>
                    <p className="text-sm opacity-75 mb-1">
                      {card.name}
                    </p>
                    {card.isDefault && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-xs opacity-75">{t('default')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleCardVisibility(card.id)}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      {showCardNumbers[card.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedCard(card)}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Number */}
                <div className="relative mb-6">
                  <p className="text-lg font-mono tracking-wider">
                    {showCardNumbers[card.id] 
                      ? formatCardNumber(`1234567890123456`) // Mock full number
                      : maskCardNumber(`1234567890123456`)
                    }
                  </p>
                </div>

                {/* Card Footer */}
                <div className="relative flex items-end justify-between">
                  <div>
                    <p className="text-xs opacity-75 mb-1">{t('balance')}</p>
                    <p className="text-xl font-bold">
                      {showBalances ? `$${card.balance.toFixed(2)}` : '••••••'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75 mb-1">{t('expires')}</p>
                    <p className="text-sm">
                      {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                    </p>
                  </div>
                </div>

                {/* Card Brand Logo */}
                <div className="absolute bottom-4 right-4">
                  <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">{card.type}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Card Placeholder */}
          {cards.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 min-h-[200px]"
            >
              <CreditCard className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No cards added</h3>
              <p className="text-sm text-center mb-4">
                Add your first payment card to start making transactions
              </p>
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('addCard')}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Card Actions Modal */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedCard(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    Card Actions
                  </h2>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  {!selectedCard.isDefault && (
                    <button
                      onClick={() => {
                        handleSetDefault(selectedCard.id);
                        setSelectedCard(null);
                      }}
                      className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Star className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-[var(--text-primary)]">Set as Default</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      // In a real app, this would open an edit modal
                      setSelectedCard(null);
                    }}
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-[var(--text-primary)]">Edit Card</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteModal(selectedCard.id);
                      setSelectedCard(null);
                    }}
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-5 h-5 mr-3" />
                    <span>Delete Card</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Card Modal */}
        <AnimatePresence>
          {showAddCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAddCard(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    {t('addNewCard')}
                  </h2>
                  <button
                    onClick={() => setShowAddCard(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Card Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('cardName')}
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder={t('cardNamePlaceholder')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('cardNumber')}
                    </label>
                    <input
                      {...register('cardNumber')}
                      type="text"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
                      placeholder={t('cardNumberPlaceholder')}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                        e.target.value = value;
                      }}
                    />
                    {cardNumber && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {t('cardType')}: {getCardType(cardNumber)}
                      </div>
                    )}
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cardNumber.message}</p>
                    )}
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('month')}
                      </label>
                      <select
                        {...register('expiryMonth', { valueAsNumber: true })}
                        className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('year')}
                      </label>
                      <select
                        {...register('expiryYear', { valueAsNumber: true })}
                        className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        {Array.from({ length: 12 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('cvv')}
                      </label>
                      <input
                        {...register('cvv')}
                        type="text"
                        maxLength={4}
                        className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
                        placeholder={t('cvvPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Initial Balance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('initialBalance')}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register('balance', { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder={t('balancePlaceholder')}
                      />
                    </div>
                    {errors.balance && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.balance.message}</p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
                        <p className="text-red-600 dark:text-red-400 text-sm">{error.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddCard(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {t('adding')}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          {t('addCard')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeleteModal(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {t('deleteCard')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('deleteConfirmation')}
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      onClick={() => handleDeleteCard(showDeleteModal)}
                      disabled={isLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {isLoading ? t('deleting') : t('delete')}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}