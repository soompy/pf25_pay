'use client';

import type { RefObject } from 'react';
import { Loader2 } from 'lucide-react';
import { formatKRW } from '../pricing';

type T = (key: string, params?: Record<string, string | number>) => string;

interface ProcessingStepProps {
  amount: number;
  headingRef: RefObject<HTMLHeadingElement | null>;
  language: string;
  t: T;
}

export function ProcessingStep({ amount, headingRef, language, t }: ProcessingStepProps) {
  return (
    <div aria-busy="true" className="mx-auto flex max-w-md flex-col items-center py-12 text-center">
      <Loader2 className="h-14 w-14 animate-spin text-[var(--color-primary-600)] motion-reduce:animate-none" aria-hidden="true" />
      <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-2xl font-bold text-[var(--text-primary)] focus:outline-none">
        {t('processing.title')}
      </h2>
      <p className="mt-2 text-3xl font-bold text-[var(--color-primary-600)] tabular-nums">{formatKRW(amount, language)}</p>
      <p className="mt-4 text-sm text-[var(--text-secondary)]">{t('processing.description')}</p>
    </div>
  );
}
