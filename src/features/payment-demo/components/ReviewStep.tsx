'use client';

import type { RefObject } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/atoms/Button';
import { formatKRW } from '../pricing';
import type { PriceBreakdown, ValidOrder } from '../types';
import { OrderSummary } from './OrderSummary';

type T = (key: string, params?: Record<string, string | number>) => string;

interface ReviewStepProps {
  order: ValidOrder;
  price: PriceBreakdown;
  isPaying: boolean;
  onBack: () => void;
  onPay: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  language: string;
  t: T;
}

export function ReviewStep({ order, price, isPaying, onBack, onPay, headingRef, language, t }: ReviewStepProps) {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-[var(--text-primary)] focus:outline-none">
          {t('review.title')}
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">{t('review.description')}</p>
      </div>

      <OrderSummary price={price} order={order} language={language} t={t} headingLevel="h3" />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isPaying}
          leftIcon={<ArrowLeft className="h-5 w-5" />}
          className="w-full sm:w-auto"
        >
          {t('actions.back')}
        </Button>
        <Button
          type="button"
          variant="success"
          size="lg"
          onClick={onPay}
          loading={isPaying}
          leftIcon={<Lock className="h-5 w-5" />}
          className="w-full sm:w-auto"
        >
          {isPaying ? t('actions.paying') : t('actions.pay', { amount: formatKRW(price.total, language) })}
        </Button>
      </div>
    </div>
  );
}
