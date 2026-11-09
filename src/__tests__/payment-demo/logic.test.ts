import { calculatePrice, SHIPPING_FEE } from '@/features/payment-demo/pricing';
import { validateOrderDraft } from '@/features/payment-demo/validation';
import { processPayment } from '@/features/payment-demo/server/processPayment';
import { createPaymentClient } from '@/features/payment-demo/paymentClient';
import { INITIAL_DRAFT, INITIAL_STATE, paymentFlowReducer } from '@/features/payment-demo/paymentFlow';
import type { OrderDraft, ValidOrder } from '@/features/payment-demo/types';

describe('calculatePrice', () => {
  it('adds shipping below the free-shipping threshold', () => {
    // 18,900 × 2 = 37,800 < 50,000
    expect(calculatePrice('coffee-beans', 2, '')).toEqual({
      unitPrice: 18_900,
      quantity: 2,
      subtotal: 37_800,
      discount: 0,
      shippingFee: SHIPPING_FEE,
      total: 40_800,
    });
  });

  it('ships free at or above the threshold', () => {
    expect(calculatePrice('wireless-earbuds', 1, '').total).toBe(89_000);
  });

  it('applies a floored 10% coupon before deciding shipping', () => {
    // 45,500 × 3 = 136,500 → discount 13,650 → 122,850, free shipping
    const p = calculatePrice('leather-wallet', 3, ' demo10 ');
    expect(p.discount).toBe(13_650);
    expect(p.total).toBe(122_850);
  });

  it('can push an order back under the threshold with the coupon', () => {
    // 18,900 × 3 = 56,700 → discount 5,670 → 51,030 (free). ×1 = 18,900 → 1,890 → 17,010 + 3,000
    expect(calculatePrice('coffee-beans', 1, 'DEMO10').total).toBe(20_010);
  });

  it('floors fractional discounts to whole won', () => {
    // 18,900 × 7 = 132,300 → 13,230 exactly; 45,500 × 1 = 45,500 → 4,550
    expect(calculatePrice('coffee-beans', 7, 'DEMO10').discount).toBe(13_230);
    expect(Number.isInteger(calculatePrice('leather-wallet', 1, 'DEMO10').total)).toBe(true);
  });
});

describe('validateOrderDraft', () => {
  const valid: OrderDraft = {
    productId: 'coffee-beans',
    quantity: 1,
    paymentMethodId: 'test-card-approve',
    couponCode: '',
    acceptedDemoTerms: true,
  };

  it('reports every missing required field', () => {
    const result = validateOrderDraft(INITIAL_DRAFT);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual({
        productId: 'productRequired',
        paymentMethodId: 'paymentMethodRequired',
        acceptedDemoTerms: 'termsRequired',
      });
    }
  });

  it.each([
    [Number.NaN, 'quantityInvalid'],
    [1.5, 'quantityInvalid'],
    [0, 'quantityRange'],
    [11, 'quantityRange'],
  ])('rejects quantity %p', (quantity, code) => {
    const result = validateOrderDraft({ ...valid, quantity });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.quantity).toBe(code);
  });

  it('rejects unknown coupons and normalizes known ones', () => {
    const bad = validateOrderDraft({ ...valid, couponCode: 'FREE' });
    expect(bad.ok).toBe(false);
    const good = validateOrderDraft({ ...valid, couponCode: ' demo10' });
    expect(good.ok && good.order.couponCode).toBe('DEMO10');
  });
});

describe('processPayment', () => {
  const order = (paymentMethodId: ValidOrder['paymentMethodId']): ValidOrder => ({
    productId: 'wireless-earbuds',
    quantity: 1,
    paymentMethodId,
    couponCode: '',
  });
  const opts = { now: () => new Date('2026-11-09T10:00:00Z'), generateOrderId: () => 'DEMO-TEST-0001' };

  it('approves the approve scenario', () => {
    expect(processPayment({ order: order('test-card-approve'), amount: 89_000, attempt: 1 }, opts)).toEqual({
      status: 'success',
      orderId: 'DEMO-TEST-0001',
      approvedAt: '2026-11-09T10:00:00.000Z',
    });
  });

  it('declines the decline scenario on every attempt', () => {
    for (const attempt of [1, 2, 3]) {
      expect(processPayment({ order: order('test-card-decline'), amount: 89_000, attempt }, opts)).toEqual({
        status: 'failure',
        code: 'card_declined',
      });
    }
  });

  it('fails the flaky scenario once, then approves on retry', () => {
    const req = { order: order('test-card-flaky'), amount: 89_000 };
    expect(processPayment({ ...req, attempt: 1 }, opts)).toEqual({ status: 'failure', code: 'temporary_error' });
    expect(processPayment({ ...req, attempt: 2 }, opts).status).toBe('success');
  });

  it('rejects a tampered amount', () => {
    expect(processPayment({ order: order('test-card-approve'), amount: 1, attempt: 1 }, opts)).toEqual({
      status: 'failure',
      code: 'amount_mismatch',
    });
  });
});

describe('createPaymentClient', () => {
  const request = {
    order: { productId: 'wireless-earbuds', quantity: 1, paymentMethodId: 'test-card-approve', couponCode: '' } as ValidOrder,
    amount: 89_000,
    attempt: 1,
  };
  const ok = (body: unknown) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) } as Response);

  it('POSTs JSON with an idempotency key and returns the result', async () => {
    const fetchImpl = jest.fn().mockReturnValue(ok({ status: 'success', orderId: 'A', approvedAt: 'B' }));
    const client = createPaymentClient({ fetchImpl, createIdempotencyKey: () => 'key-1' });
    await expect(client.pay(request)).resolves.toEqual({ status: 'success', orderId: 'A', approvedAt: 'B' });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('/api/demo/payments');
    expect(init.method).toBe('POST');
    expect(init.headers['Idempotency-Key']).toBe('key-1');
    expect(JSON.parse(init.body)).toEqual(request);
  });

  it('shares one request between duplicate calls', async () => {
    let resolve!: (v: unknown) => void;
    const fetchImpl = jest.fn().mockReturnValue(new Promise((r) => (resolve = r)));
    const client = createPaymentClient({ fetchImpl });
    const first = client.pay(request);
    const second = client.pay(request);
    expect(second).toBe(first);
    expect(client.isProcessing()).toBe(true);
    resolve({ ok: true, status: 200, json: () => Promise.resolve({ status: 'failure', code: 'card_declined' }) });
    await first;
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(client.isProcessing()).toBe(false);
  });

  it('maps a thrown fetch to network_error', async () => {
    const client = createPaymentClient({ fetchImpl: () => Promise.reject(new TypeError('offline')) });
    await expect(client.pay(request)).resolves.toEqual({ status: 'failure', code: 'network_error' });
  });

  it('maps a malformed response to network_error', async () => {
    const client = createPaymentClient({ fetchImpl: () => ok({ hello: 'world' }) });
    await expect(client.pay(request)).resolves.toEqual({ status: 'failure', code: 'network_error' });
  });
});

describe('paymentFlowReducer', () => {
  const filled = paymentFlowReducer(INITIAL_STATE, {
    type: 'updateDraft',
    patch: { productId: 'coffee-beans', quantity: 2, paymentMethodId: 'test-card-approve', acceptedDemoTerms: true },
  });

  it('stays on details with errors when invalid', () => {
    const next = paymentFlowReducer(INITIAL_STATE, { type: 'submitDetails' });
    expect(next.step).toBe('details');
    expect(next.step === 'details' && Object.keys(next.errors)).toContain('productId');
  });

  it('clears a field error once the field is edited', () => {
    const invalid = paymentFlowReducer(INITIAL_STATE, { type: 'submitDetails' });
    const edited = paymentFlowReducer(invalid, { type: 'updateDraft', patch: { productId: 'coffee-beans' } });
    expect(edited.step === 'details' && edited.errors.productId).toBeUndefined();
  });

  it('keeps the draft when going back from review', () => {
    const review = paymentFlowReducer(filled, { type: 'submitDetails' });
    expect(review.step).toBe('review');
    const back = paymentFlowReducer(review, { type: 'backToDetails' });
    expect(back.step).toBe('details');
    expect(back.draft).toEqual(filled.draft);
  });

  it('ignores a second startPayment while processing', () => {
    const review = paymentFlowReducer(filled, { type: 'submitDetails' });
    const processing = paymentFlowReducer(review, { type: 'startPayment' });
    expect(processing.step).toBe('processing');
    expect(processing.attempt).toBe(1);
    expect(paymentFlowReducer(processing, { type: 'startPayment' })).toBe(processing);
    expect(paymentFlowReducer(processing, { type: 'reset' })).toBe(processing);
  });

  it('keeps order and draft after failure and allows retry', () => {
    const review = paymentFlowReducer(filled, { type: 'submitDetails' });
    const processing = paymentFlowReducer(review, { type: 'startPayment' });
    const failed = paymentFlowReducer(processing, { type: 'paymentFailed', code: 'temporary_error' });
    expect(failed.step).toBe('failure');
    expect(failed.draft).toEqual(filled.draft);
    const retry = paymentFlowReducer(failed, { type: 'startPayment' });
    expect(retry.step).toBe('processing');
    expect(retry.attempt).toBe(2);
  });

  it('reset returns to a clean initial state', () => {
    const review = paymentFlowReducer(filled, { type: 'submitDetails' });
    const processing = paymentFlowReducer(review, { type: 'startPayment' });
    const done = paymentFlowReducer(processing, { type: 'paymentSucceeded', orderId: 'X', approvedAt: 'Y' });
    expect(paymentFlowReducer(done, { type: 'reset' })).toBe(INITIAL_STATE);
  });
});
