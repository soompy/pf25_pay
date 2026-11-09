import { z } from 'zod';
import { MAX_QUANTITY, MIN_QUANTITY, PRODUCTS, TEST_PAYMENT_METHODS } from '../catalog';
import { DEMO_COUPON_CODE } from '../pricing';
import type { PaymentRequest, ProductId, TestPaymentMethodId } from '../types';

const productIds = PRODUCTS.map((p) => p.id) as [ProductId, ...ProductId[]];
const methodIds = TEST_PAYMENT_METHODS.map((m) => m.id) as [TestPaymentMethodId, ...TestPaymentMethodId[]];

/**
 * Server-side validation of POST /api/demo/payments.
 * `.strict()` rejects unknown keys, so card numbers or personal data sent by
 * mistake are refused instead of being silently accepted.
 */
export const paymentRequestSchema = z
  .object({
    order: z
      .object({
        productId: z.enum(productIds),
        quantity: z.number().int().min(MIN_QUANTITY).max(MAX_QUANTITY),
        paymentMethodId: z.enum(methodIds),
        couponCode: z.union([z.literal(''), z.literal(DEMO_COUPON_CODE)]),
      })
      .strict(),
    amount: z.number().int().positive(),
    attempt: z.number().int().min(1).max(100),
  })
  .strict() satisfies z.ZodType<PaymentRequest>;
