'use client';

import { FREE_SHIPPING_THRESHOLD, formatKRW } from '../pricing';
import type { PriceBreakdown, ValidOrder } from '../types';

type T = (key: string, params?: Record<string, string | number>) => string;

interface OrderSummaryProps {
  price: PriceBreakdown | null;
  /** When given, product / quantity / method rows are shown above the amounts. */
  order?: ValidOrder;
  language: string;
  t: T;
  headingLevel?: 'h2' | 'h3';
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className={emphasis ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}>{label}</dt>
      <dd
        className={
          emphasis
            ? 'text-xl font-bold text-[var(--color-primary-600)] tabular-nums'
            : 'text-right font-medium text-[var(--text-primary)] tabular-nums'
        }
      >
        {value}
      </dd>
    </div>
  );
}

export function OrderSummary({ price, order, language, t, headingLevel: Heading = 'h2' }: OrderSummaryProps) {
  const money = (n: number) => formatKRW(n, language);

  return (
    <section
      aria-labelledby="order-summary-title"
      className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] p-5 shadow-sm"
    >
      <Heading id="order-summary-title" className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
        {t('summary.title')}
      </Heading>

      {!price ? (
        <p className="text-sm text-[var(--text-secondary)]">{t('summary.empty')}</p>
      ) : (
        <dl className="text-sm">
          {order && (
            <div className="mb-2 border-b border-[var(--border-primary)] pb-2">
              <Row label={t('summary.product')} value={t(`products.${order.productId}.name`)} />
              <Row label={t('summary.quantity')} value={t('summary.quantityValue', { count: order.quantity })} />
              <Row label={t('summary.method')} value={t(`methods.${order.paymentMethodId}.name`)} />
            </div>
          )}
          <Row label={t('summary.unitPrice')} value={money(price.unitPrice)} />
          <Row label={t('summary.subtotal')} value={money(price.subtotal)} />
          {price.discount > 0 && <Row label={t('summary.discount')} value={`−${money(price.discount)}`} />}
          <Row
            label={t('summary.shipping')}
            value={price.shippingFee === 0 ? t('summary.freeShipping') : money(price.shippingFee)}
          />
          <div className="mt-2 border-t border-[var(--border-primary)] pt-2">
            <Row label={t('summary.total')} value={money(price.total)} emphasis />
          </div>
          {price.shippingFee > 0 && (
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">
              {t('summary.freeShippingHint', { amount: money(FREE_SHIPPING_THRESHOLD) })}
            </p>
          )}
        </dl>
      )}
    </section>
  );
}
