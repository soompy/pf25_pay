/**
 * @jest-environment node
 */
import { createPaymentHandler } from '@/features/payment-demo/server/paymentHandler';
import { POST as routePOST } from '@/app/api/demo/payments/route';

const validBody = {
  order: { productId: 'coffee-beans', quantity: 2, paymentMethodId: 'test-card-approve', couponCode: '' },
  amount: 40_800,
  attempt: 1,
};

function post(body: unknown, key: string | null = 'key-1') {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (key) headers['Idempotency-Key'] = key;
  return new Request('http://localhost/api/demo/payments', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/demo/payments', () => {
  let orderSeq = 0;
  const handler = () =>
    createPaymentHandler({ latencyMs: 0, generateOrderId: () => `DEMO-TEST-${++orderSeq}` });

  it('is wired to the route file', () => {
    expect(typeof routePOST).toBe('function');
  });

  it('approves a valid request', async () => {
    const res = await handler()(post(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: 'success', orderId: expect.stringMatching(/^DEMO-TEST-/) });
  });

  it('returns the business failure with 200', async () => {
    const res = await handler()(
      post({ ...validBody, order: { ...validBody.order, paymentMethodId: 'test-card-decline' } }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'failure', code: 'card_declined' });
  });

  it('recomputes the amount on the server', async () => {
    const res = await handler()(post({ ...validBody, amount: 100 }));
    expect(await res.json()).toEqual({ status: 'failure', code: 'amount_mismatch' });
  });

  it.each([
    ['missing idempotency key', post(validBody, null)],
    ['invalid JSON', post('{not json')],
    ['unknown product', post({ ...validBody, order: { ...validBody.order, productId: 'tv' } })],
    ['quantity out of range', post({ ...validBody, order: { ...validBody.order, quantity: 99 } })],
    ['unknown coupon', post({ ...validBody, order: { ...validBody.order, couponCode: 'FREE100' } })],
    ['extra card data', post({ ...validBody, order: { ...validBody.order, cardNumber: '4111111111111111' } })],
  ])('rejects %s with 400', async (_label, request) => {
    const res = await handler()(request);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ status: 'failure', code: 'invalid_request' });
  });

  it('returns the original result for a repeated idempotency key', async () => {
    const h = handler();
    const [a, b] = await Promise.all([h(post(validBody, 'same')), h(post(validBody, 'same'))]);
    const first = await a.json();
    expect(await b.json()).toEqual(first);
    const third = await (await h(post(validBody, 'same'))).json();
    expect(third.orderId).toBe(first.orderId);
    const other = await (await h(post(validBody, 'different'))).json();
    expect(other.orderId).not.toBe(first.orderId);
  });
});
