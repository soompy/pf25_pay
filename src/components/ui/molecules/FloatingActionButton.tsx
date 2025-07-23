'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Send, 
  QrCode, 
  CreditCard, 
  DollarSign,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

interface ActionItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('dashboard');

  const actions: ActionItem[] = [
    {
      id: 'send',
      label: t('quickActions.sendMoney'),
      href: '/send',
      icon: Send,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
    },
    {
      id: 'request',
      label: t('quickActions.requestMoney'),
      href: '/request',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30'
    },
    {
      id: 'scan',
      label: t('quickActions.scanQr'),
      href: '/scan',
      icon: QrCode,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30'
    },
    {
      id: 'cards',
      label: 'My Cards',
      href: '/cards',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
    }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 -z-10"
          />
        )}
      </AnimatePresence>

      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.3, 
                    y: 20,
                    x: 20 
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    x: 0 
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.3, 
                    y: 20,
                    x: 20 
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.1
                  }}
                  className="flex items-center justify-end"
                >
                  {/* Label */}
                  <div className="mr-4 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-lg">
                    <span className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                      {action.label}
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <Link
                    href={action.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      w-12 h-12 rounded-full shadow-lg border border-[var(--border-primary)] 
                      flex items-center justify-center transition-all duration-200
                      ${action.bgColor} ${action.color}
                      hover:scale-110 hover:shadow-xl
                    `}
                  >
                    <Icon className="w-6 h-6" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={toggleMenu}
        className={`
          w-14 h-14 rounded-full shadow-lg border-2 border-[var(--color-primary-200)]
          flex items-center justify-center transition-all duration-300
          ${isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-700)]'
          }
          hover:scale-110 hover:shadow-xl active:scale-95
        `}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          rotate: isOpen ? 45 : 0,
          backgroundColor: isOpen ? '#ef4444' : undefined
        }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}