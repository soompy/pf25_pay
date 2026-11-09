'use client';

import { useEffect, useRef, type FormEvent, type ReactNode, type RefObject } from 'react';
import { AlertCircle, ArrowRight, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/atoms/Button';
import { cn } from '@/lib/utils';
import { MAX_QUANTITY, MIN_QUANTITY, PRODUCTS, TEST_PAYMENT_METHODS } from '../catalog';
import { calculatePrice, formatKRW } from '../pricing';
import { FIELD_ORDER } from '../validation';
import type { OrderDraft, ValidationErrors, ValidationField } from '../types';
import { OrderSummary } from './OrderSummary';

type T = (key: string, params?: Record<string, string | number>) => string;

interface OrderDetailsStepProps {
  draft: OrderDraft;
  errors: ValidationErrors;
  /** Increments on every submit attempt so the error summary can take focus. */
  submitCount: number;
  onChange: (patch: Partial<OrderDraft>) => void;
  onSubmit: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  language: string;
  t: T;
}

/** id of the element an error-summary link should move focus to. */
const FIELD_TARGET: Record<ValidationField, string> = {
  productId: `product-${PRODUCTS[0].id}`,
  quantity: 'quantity',
  paymentMethodId: `method-${TEST_PAYMENT_METHODS[0].id}`,
  couponCode: 'coupon',
  acceptedDemoTerms: 'terms',
};

const errorId = (field: ValidationField) => `${field}-error`;

function FieldError({ field, errors, t }: { field: ValidationField; errors: ValidationErrors; t: T }) {
  const code = errors[field];
  if (!code) return null;
  return (
    <p id={errorId(field)} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-[var(--color-error)]">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {t(`errors.${code}`)}
    </p>
  );
}

function ChoiceCard({ children, invalid }: { children: ReactNode; invalid: boolean }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border-2 bg-[var(--bg-elevated)] p-4 transition-colors',
        'hover:border-[var(--color-primary-300)]',
        'has-[:checked]:border-[var(--color-primary-600)] has-[:checked]:bg-[var(--color-primary-50)] dark:has-[:checked]:bg-[var(--color-primary-900)]/20',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-primary-500)] has-[:focus-visible]:ring-offset-2',
        invalid ? 'border-[var(--color-error)]' : 'border-[var(--border-primary)]',
      )}
    >
      {children}
    </label>
  );
}

const inputBase =
  'h-11 rounded-lg border bg-[var(--bg-primary)] px-3 text-base text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]';

export function OrderDetailsStep({
  draft,
  errors,
  submitCount,
  onChange,
  onSubmit,
  headingRef,
  language,
  t,
}: OrderDetailsStepProps) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const errorFields = FIELD_ORDER.filter((f) => errors[f]);
  const hasErrors = errorFields.length > 0;

  // After a failed submit, move focus to the error summary so it is read out.
  useEffect(() => {
    if (submitCount > 0 && hasErrors) summaryRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to new submits
  }, [submitCount]);

  const quantityValid =
    Number.isInteger(draft.quantity) && draft.quantity >= MIN_QUANTITY && draft.quantity <= MAX_QUANTITY;
  const price = draft.productId && quantityValid ? calculatePrice(draft.productId, draft.quantity, draft.couponCode) : null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const setQuantity = (value: number) => onChange({ quantity: value });
  const stepQuantity = (delta: number) => {
    const base = Number.isInteger(draft.quantity) ? draft.quantity : MIN_QUANTITY;
    setQuantity(Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, base + delta)));
  };

  const describedBy = (field: ValidationField, hintId?: string) =>
    [errors[field] ? errorId(field) : null, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-[var(--text-primary)] focus:outline-none">
          {t('steps.details')}
        </h2>

        {hasErrors && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-xl border-2 border-[var(--color-error)] bg-[var(--color-error)]/5 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)]"
          >
            <p id="error-summary-title" className="font-semibold text-[var(--color-error)]">
              {t('errors.summary', { count: errorFields.length })}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {errorFields.map((field) => (
                <li key={field}>
                  <a
                    href={`#${FIELD_TARGET[field]}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(FIELD_TARGET[field])?.focus();
                    }}
                    className="text-[var(--color-error)] underline underline-offset-2"
                  >
                    {t(`errors.${errors[field]}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Product */}
        <fieldset aria-describedby={describedBy('productId')}>
          <legend className="mb-3 text-base font-semibold text-[var(--text-primary)]">{t('products.legend')}</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {PRODUCTS.map((product) => (
              <ChoiceCard key={product.id} invalid={!!errors.productId}>
                <input
                  type="radio"
                  id={`product-${product.id}`}
                  name="product"
                  value={product.id}
                  checked={draft.productId === product.id}
                  onChange={() => onChange({ productId: product.id })}
                  aria-describedby={describedBy('productId')}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary-600)]"
                />
                <span className="flex flex-col gap-1">
                  <span className="font-semibold text-[var(--text-primary)]">{t(`products.${product.id}.name`)}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{t(`products.${product.id}.description`)}</span>
                  <span className="mt-1 font-bold text-[var(--color-primary-600)] tabular-nums">
                    {formatKRW(product.unitPrice, language)}
                  </span>
                </span>
              </ChoiceCard>
            ))}
          </div>
          <FieldError field="productId" errors={errors} t={t} />
        </fieldset>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="mb-2 block text-base font-semibold text-[var(--text-primary)]">
            {t('quantity.label')}
          </label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={t('quantity.decrease')}
              aria-controls="quantity"
              onClick={() => stepQuantity(-1)}
              disabled={Number.isInteger(draft.quantity) && draft.quantity <= MIN_QUANTITY}
              className="h-11 w-11"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </Button>
            <input
              id="quantity"
              type="number"
              inputMode="numeric"
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              step={1}
              value={Number.isNaN(draft.quantity) ? '' : draft.quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? Number.NaN : Number(e.target.value))}
              aria-invalid={!!errors.quantity || undefined}
              aria-describedby={describedBy('quantity', 'quantity-hint')}
              className={cn(
                inputBase,
                'w-20 text-center tabular-nums',
                errors.quantity ? 'border-[var(--color-error)]' : 'border-[var(--border-primary)]',
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={t('quantity.increase')}
              aria-controls="quantity"
              onClick={() => stepQuantity(1)}
              disabled={Number.isInteger(draft.quantity) && draft.quantity >= MAX_QUANTITY}
              className="h-11 w-11"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <p id="quantity-hint" className="mt-2 text-xs text-[var(--text-tertiary)]">
            {t('quantity.hint', { min: MIN_QUANTITY, max: MAX_QUANTITY })}
          </p>
          <FieldError field="quantity" errors={errors} t={t} />
        </div>

        {/* Payment method */}
        <fieldset aria-describedby={describedBy('paymentMethodId', 'methods-hint')}>
          <legend className="text-base font-semibold text-[var(--text-primary)]">{t('methods.legend')}</legend>
          <p id="methods-hint" className="mb-3 mt-1 text-xs text-[var(--text-tertiary)]">
            {t('methods.hint')}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEST_PAYMENT_METHODS.map((method) => (
              <ChoiceCard key={method.id} invalid={!!errors.paymentMethodId}>
                <input
                  type="radio"
                  id={`method-${method.id}`}
                  name="paymentMethod"
                  value={method.id}
                  checked={draft.paymentMethodId === method.id}
                  onChange={() => onChange({ paymentMethodId: method.id })}
                  aria-describedby={describedBy('paymentMethodId')}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary-600)]"
                />
                <span className="flex flex-col gap-1">
                  <span className="font-semibold text-[var(--text-primary)]">{t(`methods.${method.id}.name`)}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{t(`methods.${method.id}.description`)}</span>
                </span>
              </ChoiceCard>
            ))}
          </div>
          <FieldError field="paymentMethodId" errors={errors} t={t} />
        </fieldset>

        {/* Coupon */}
        <div>
          <label htmlFor="coupon" className="mb-2 block text-base font-semibold text-[var(--text-primary)]">
            {t('coupon.label')}
          </label>
          <input
            id="coupon"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={20}
            value={draft.couponCode}
            onChange={(e) => onChange({ couponCode: e.target.value })}
            aria-invalid={!!errors.couponCode || undefined}
            aria-describedby={describedBy('couponCode', 'coupon-hint')}
            className={cn(
              inputBase,
              'w-full max-w-xs uppercase',
              errors.couponCode ? 'border-[var(--color-error)]' : 'border-[var(--border-primary)]',
            )}
          />
          <p id="coupon-hint" className="mt-2 text-xs text-[var(--text-tertiary)]">
            {t('coupon.hint')}
          </p>
          <FieldError field="couponCode" errors={errors} t={t} />
        </div>

        {/* Demo terms */}
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              checked={draft.acceptedDemoTerms}
              onChange={(e) => onChange({ acceptedDemoTerms: e.target.checked })}
              aria-invalid={!!errors.acceptedDemoTerms || undefined}
              aria-describedby={describedBy('acceptedDemoTerms')}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-primary-600)]"
            />
            <span className="text-sm text-[var(--text-primary)]">{t('terms.label')}</span>
          </label>
          <FieldError field="acceptedDemoTerms" errors={errors} t={t} />
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <OrderSummary price={price} language={language} t={t} headingLevel="h3" />
        <Button type="submit" variant="success" size="lg" fullWidth rightIcon={<ArrowRight className="h-5 w-5" />}>
          {t('actions.next')}
        </Button>
      </aside>
    </form>
  );
}
