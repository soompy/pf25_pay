import { MAX_QUANTITY, MIN_QUANTITY } from './catalog';
import { isKnownCoupon, normalizeCoupon } from './pricing';
import type { OrderDraft, ValidOrder, ValidationErrors } from './types';

export type ValidationResult =
  | { ok: true; order: ValidOrder }
  | { ok: false; errors: ValidationErrors };

/** Pure validation of the step-1 form. Returns either a valid order or per-field error codes. */
export function validateOrderDraft(draft: OrderDraft): ValidationResult {
  const errors: ValidationErrors = {};

  if (!draft.productId) errors.productId = 'productRequired';

  if (!Number.isInteger(draft.quantity)) {
    errors.quantity = 'quantityInvalid';
  } else if (draft.quantity < MIN_QUANTITY || draft.quantity > MAX_QUANTITY) {
    errors.quantity = 'quantityRange';
  }

  if (!draft.paymentMethodId) errors.paymentMethodId = 'paymentMethodRequired';

  const coupon = normalizeCoupon(draft.couponCode);
  if (coupon !== '' && !isKnownCoupon(coupon)) errors.couponCode = 'couponInvalid';

  if (!draft.acceptedDemoTerms) errors.acceptedDemoTerms = 'termsRequired';

  if (Object.keys(errors).length > 0 || !draft.productId || !draft.paymentMethodId) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    order: {
      productId: draft.productId,
      quantity: draft.quantity,
      paymentMethodId: draft.paymentMethodId,
      couponCode: coupon,
    },
  };
}

/** Order in which fields appear on screen, used to focus the first invalid one. */
export const FIELD_ORDER = ['productId', 'quantity', 'paymentMethodId', 'couponCode', 'acceptedDemoTerms'] as const;
