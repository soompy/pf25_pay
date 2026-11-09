'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentStep } from '../types';

const STEPS = ['details', 'review', 'processing', 'result'] as const;
type IndicatorStep = (typeof STEPS)[number];

export function stepIndex(step: PaymentStep): number {
  const visual: IndicatorStep = step === 'success' || step === 'failure' ? 'result' : step;
  return STEPS.indexOf(visual);
}

interface StepIndicatorProps {
  step: PaymentStep;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export function StepIndicator({ step, t }: StepIndicatorProps) {
  const current = stepIndex(step);

  return (
    <nav aria-label={t('steps.label')} className="mb-8">
      <p className="sr-only">{t('steps.progress', { current: current + 1, total: STEPS.length })}</p>
      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((key, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={key} aria-current={active ? 'step' : undefined} className="flex flex-col items-center gap-2 text-center">
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  done && 'border-[var(--color-primary-600)] bg-[var(--color-primary-600)] text-[var(--text-inverse)]',
                  active && 'border-[var(--color-primary-600)] bg-[var(--bg-primary)] text-[var(--color-primary-600)]',
                  !done && !active && 'border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-tertiary)]',
                )}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  'text-xs sm:text-sm',
                  active ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
                )}
              >
                {t(`steps.${key}`)}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
