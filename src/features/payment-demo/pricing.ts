import { findProduct } from './catalog';
import type { PriceBreakdown, ProductId } from './types';

/** Orders at or above this subtotal (after discount) ship free. */
export const FREE_SHIPPING_THRESHOLD = 50_000;
export const SHIPPING_FEE = 3_000;

/** Demo coupon: 10% off the subtotal, rounded down to the won. */
export const DEMO_COUPON_CODE = 'DEMO10';
export const DEMO_COUPON_RATE_PERCENT = 10;

export function normalizeCoupon(code: string): string {
  return code.trim().toUpperCase();
}

export function isKnownCoupon(code: string): boolean {
  return normalizeCoupon(code) === DEMO_COUPON_CODE;
}

/** Integer-only price calculation. */
export function calculatePrice(productId: ProductId, quantity: number, couponCode: string): PriceBreakdown {
  const { unitPrice } = findProduct(productId);
  const subtotal = unitPrice * quantity;
  const discount = isKnownCoupon(couponCode)
    ? Math.floor((subtotal * DEMO_COUPON_RATE_PERCENT) / 100)
    : 0;
  const discounted = subtotal - discount;
  const shippingFee = discounted >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return {
    unitPrice,
    quantity,
    subtotal,
    discount,
    shippingFee,
    total: discounted + shippingFee,
  };
}

export function formatKRW(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}
