'use client';

import type { RefObject } from 'react';
import { CheckCircle2, Pencil, RotateCcw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/atoms/Button';
import type { PaymentFailureCode, PaymentReceipt, PriceBreakdown, ValidOrder } from '../types';
import { OrderSummary } from './OrderSummary';

type T = (key: string, params?: Record<string, string | number>) => string;

interface SuccessProps {
  receipt: PaymentReceipt;
  onStartOver: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  language: string;
  t: T;
}

export function SuccessResult({ receipt, onStartOver, headingRef, language, t }: SuccessProps) {
  const approvedAt = new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(receipt.approvedAt));

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--color-success)]" aria-hidden="true" />
        <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-bold text-[var(--text-primary)] focus:outline-none">
          {t('result.successTitle')}
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">{t('result.successDescription')}</p>
      </div>

      <dl className="grid gap-3 rounded-2xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-5 text-sm dark:border-[var(--color-primary-800)] dark:bg-[var(--color-primary-900)]/20 sm:grid-cols-2">
        <div>
          <dt className="text-[var(--text-secondary)]">{t('result.orderId')}</dt>
          <dd className="mt-1 break-all font-mono text-base font-semibold text-[var(--text-primary)]">{receipt.orderId}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-secondary)]">{t('result.approvedAt')}</dt>
          <dd className="mt-1 font-medium text-[var(--text-primary)]">
            <time dateTime={receipt.approvedAt}>{approvedAt}</time>
          </dd>
        </div>
      </dl>

      <OrderSummary price={receipt.price} order={receipt.order} language={language} t={t} headingLevel="h3" />

      <Button type="button" variant="success" size="lg" fullWidth onClick={onStartOver}>
        {t('actions.newPayment')}
      </Button>
    </div>
  );
}

interface FailureProps {
  code: PaymentFailureCode;
  attempt: number;
  order: ValidOrder;
  price: PriceBreakdown;
  onRetry: () => void;
  onEdit: () => void;
  onStartOver: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  language: string;
  t: T;
}

export function FailureResult({
  code,
  attempt,
  order,
  price,
  onRetry,
  onEdit,
  onStartOver,
  headingRef,
  language,
  t,
}: FailureProps) {
  // These cannot be fixed by resending the same request; the order must be edited.
  const canRetry = code !== 'amount_mismatch' && code !== 'invalid_request';

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="text-center">
        <XCircle className="mx-auto h-16 w-16 text-[var(--color-error)]" aria-hidden="true" />
        <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-bold text-[var(--text-primary)] focus:outline-none">
          {t('result.failureTitle')}
        </h2>
        <p className="mt-3 font-medium text-[var(--color-error)]">{t(`result.failures.${code}`)}</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {t('result.failureDescription')} · {t('result.attempt', { count: attempt })}
        </p>
      </div>

      <OrderSummary price={price} order={order} language={language} t={t} headingLevel="h3" />

      <div className="flex flex-col gap-3 sm:flex-row">
        {canRetry && (
          <Button
            type="button"
            variant="success"
            size="lg"
            onClick={onRetry}
            leftIcon={<RotateCcw className="h-5 w-5" />}
            className="w-full sm:flex-1"
          >
            {t('actions.retry')}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onEdit}
          leftIcon={<Pencil className="h-5 w-5" />}
          className="w-full sm:flex-1"
        >
          {t('actions.edit')}
        </Button>
      </div>
      <Button type="button" variant="ghost" fullWidth onClick={onStartOver}>
        {t('actions.startOver')}
      </Button>
    </div>
  );
}
