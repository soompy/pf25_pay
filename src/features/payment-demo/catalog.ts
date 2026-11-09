import type { Product, ProductId, TestPaymentMethod, TestPaymentMethodId } from './types';

/** Sample products. Display names live in the locale files (paymentDemo.products). */
export const PRODUCTS: readonly Product[] = [
  { id: 'coffee-beans', unitPrice: 18_900 },
  { id: 'wireless-earbuds', unitPrice: 89_000 },
  { id: 'leather-wallet', unitPrice: 45_500 },
];

/**
 * Test-only payment methods. They carry no card number, CVV or holder data:
 * each one simply selects a scenario in the mock payment service.
 */
export const TEST_PAYMENT_METHODS: readonly TestPaymentMethod[] = [
  { id: 'test-card-approve', scenario: 'approve' },
  { id: 'test-wallet', scenario: 'approve' },
  { id: 'test-card-flaky', scenario: 'fail-first-attempt' },
  { id: 'test-card-decline', scenario: 'decline' },
];

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 10;

export function findProduct(id: ProductId): Product {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown product: ${id}`);
  return product;
}

export function findPaymentMethod(id: TestPaymentMethodId): TestPaymentMethod {
  const method = TEST_PAYMENT_METHODS.find((m) => m.id === id);
  if (!method) throw new Error(`Unknown payment method: ${id}`);
  return method;
}
