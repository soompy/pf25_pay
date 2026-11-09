'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { PaymentService } from '../paymentClient';
import type { PaymentStep } from '../types';
import { usePaymentFlow } from '../usePaymentFlow';
import { OrderDetailsStep } from './OrderDetailsStep';
import { ProcessingStep } from './ProcessingStep';
import { FailureResult, SuccessResult } from './ResultStep';
import { ReviewStep } from './ReviewStep';
import { StepIndicator } from './StepIndicator';

/** Steps that get their own browser-history entry. */
type HistoryStep = 'details' | 'review';
const HISTORY_KEY = 'safepayDemoStep';

function readHistoryStep(state: unknown): HistoryStep | null {
  if (!state || typeof state !== 'object') return null;
  const value = (state as Record<string, unknown>)[HISTORY_KEY];
  return value === 'details' || value === 'review' ? value : null;
}

function writeHistory(step: HistoryStep, mode: 'push' | 'replace') {
  // Keep Next.js router state that lives in history.state.
  const next = { ...(window.history.state ?? {}), [HISTORY_KEY]: step };
  if (mode === 'push') window.history.pushState(next, '');
  else window.history.replaceState(next, '');
}

interface PaymentDemoProps {
  /** Injectable for tests. */
  service?: PaymentService;
}

export function PaymentDemo({ service }: PaymentDemoProps) {
  const { t, language } = useTranslation('paymentDemo');
  const { state, updateDraft, submitDetails, backToDetails, pay, reset } = usePaymentFlow(service);
  const [submitCount, setSubmitCount] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef<PaymentStep>(state.step);

  // Move focus to the new step's heading so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (previousStep.current === state.step) return;
    previousStep.current = state.step;
    headingRef.current?.focus();
  }, [state.step]);

  // Browser back/forward: details <-> review are history entries. Processing and
  // results replace the current entry, so "back" can never re-submit a payment.
  const historyStep = useRef<HistoryStep | null>(null);
  useEffect(() => {
    if (historyStep.current === null) {
      writeHistory('details', 'replace');
      historyStep.current = 'details';
    }
    const step = state.step;
    if (step === 'review' && historyStep.current !== 'review') {
      writeHistory('review', 'push');
      historyStep.current = 'review';
    } else if (step === 'details' && historyStep.current !== 'details') {
      writeHistory('details', 'replace');
      historyStep.current = 'details';
    }
  }, [state.step]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const target = readHistoryStep(event.state);
      if (!target) return;
      if (state.step === 'processing') {
        // Leaving mid-payment is not allowed: restore the entry we were on.
        writeHistory('review', 'push');
        historyStep.current = 'review';
        return;
      }
      historyStep.current = target;
      if (target === 'details') {
        if (state.step === 'success') reset();
        else backToDetails(); // no-op while processing
      } else if (target === 'review' && state.step === 'details') {
        submitDetails();
        setSubmitCount((c) => c + 1);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [state.step, backToDetails, reset, submitDetails]);

  const handleSubmitDetails = useCallback(() => {
    submitDetails();
    setSubmitCount((c) => c + 1);
  }, [submitDetails]);

  const handleStartOver = useCallback(() => {
    reset();
    setSubmitCount(0);
  }, [reset]);

  const announcement = (() => {
    switch (state.step) {
      case 'details':
        return t('announcements.details');
      case 'review':
        return t('announcements.review');
      case 'processing':
        return t('announcements.processing');
      case 'success':
        return t('announcements.success', { orderId: state.receipt.orderId });
      case 'failure':
        return t('announcements.failure', { reason: t(`result.failures.${state.code}`) });
    }
  })();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      {/* Polite live region: announces step changes, loading and results. */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1 rounded text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary-600)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t('backHome')}
          </Link>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
            <span className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] bg-clip-text text-transparent">
              SafePay
            </span>{' '}
            {t('pageTitle')}
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">{t('pageDescription')}</p>
        </div>
      </div>

      <p className="mb-8 flex items-start gap-2 rounded-xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-3 text-sm text-[var(--color-primary-800)] dark:border-[var(--color-primary-800)] dark:bg-[var(--color-primary-900)]/20 dark:text-[var(--color-primary-200)]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('demoBanner')}
      </p>

      <StepIndicator step={state.step} t={t} />

      {state.step === 'details' && (
        <OrderDetailsStep
          draft={state.draft}
          errors={state.errors}
          submitCount={submitCount}
          onChange={updateDraft}
          onSubmit={handleSubmitDetails}
          headingRef={headingRef}
          language={language}
          t={t}
        />
      )}

      {state.step === 'review' && (
        <ReviewStep
          order={state.order}
          price={state.price}
          isPaying={false}
          onBack={() => window.history.back()}
          onPay={pay}
          headingRef={headingRef}
          language={language}
          t={t}
        />
      )}

      {state.step === 'processing' && (
        <ProcessingStep amount={state.price.total} headingRef={headingRef} language={language} t={t} />
      )}

      {state.step === 'success' && (
        <SuccessResult
          receipt={state.receipt}
          onStartOver={handleStartOver}
          headingRef={headingRef}
          language={language}
          t={t}
        />
      )}

      {state.step === 'failure' && (
        <FailureResult
          code={state.code}
          attempt={state.attempt}
          order={state.order}
          price={state.price}
          onRetry={pay}
          onEdit={backToDetails}
          onStartOver={handleStartOver}
          headingRef={headingRef}
          language={language}
          t={t}
        />
      )}
    </main>
  );
}
