import { findPaymentMethod } from '../catalog';
import { calculatePrice } from '../pricing';
import type { PaymentRequest, PaymentResult } from '../types';

/**
 * Mock payment processor (server side). It never contacts a payment gateway:
 * the outcome is decided by the selected *test* payment method.
 *
 * - approve:            always succeeds
 * - decline:            always fails with card_declined
 * - fail-first-attempt: fails with temporary_error on attempt 1, succeeds on retry
 */
export interface ProcessPaymentOptions {
  now?: () => Date;
  generateOrderId?: (now: Date) => string;
}

export function generateDemoOrderId(now: Date): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0');
  return `DEMO-${y}${m}${d}-${suffix}`;
}

export function processPayment(request: PaymentRequest, options: ProcessPaymentOptions = {}): PaymentResult {
  const { now = () => new Date(), generateOrderId = generateDemoOrderId } = options;
  const { order } = request;

  // Never trust the client's amount: recompute it from the order.
  const expected = calculatePrice(order.productId, order.quantity, order.couponCode).total;
  if (expected !== request.amount) return { status: 'failure', code: 'amount_mismatch' };

  const { scenario } = findPaymentMethod(order.paymentMethodId);
  if (scenario === 'decline') return { status: 'failure', code: 'card_declined' };
  if (scenario === 'fail-first-attempt' && request.attempt <= 1) {
    return { status: 'failure', code: 'temporary_error' };
  }

  const approvedAt = now();
  return { status: 'success', orderId: generateOrderId(approvedAt), approvedAt: approvedAt.toISOString() };
}
