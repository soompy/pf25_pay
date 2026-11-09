/**
 * Domain types for the interactive payment demo.
 * All amounts are integer KRW (won) so no floating-point rounding can occur.
 */

export type ProductId = 'coffee-beans' | 'wireless-earbuds' | 'leather-wallet';

export interface Product {
  id: ProductId;
  /** Unit price in KRW (integer). */
  unitPrice: number;
}

export type TestPaymentMethodId =
  | 'test-card-approve'
  | 'test-card-decline'
  | 'test-card-flaky'
  | 'test-wallet';

/** How the mock service responds to a given test payment method. */
export type PaymentScenario = 'approve' | 'decline' | 'fail-first-attempt';

export interface TestPaymentMethod {
  id: TestPaymentMethodId;
  scenario: PaymentScenario;
}

/** What the user enters on step 1. Contains no personal or card data. */
export interface OrderDraft {
  productId: ProductId | null;
  quantity: number;
  paymentMethodId: TestPaymentMethodId | null;
  couponCode: string;
  acceptedDemoTerms: boolean;
}

/** A draft that passed validation. */
export interface ValidOrder {
  productId: ProductId;
  quantity: number;
  paymentMethodId: TestPaymentMethodId;
  couponCode: string;
}

export interface PriceBreakdown {
  unitPrice: number;
  quantity: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}

export type ValidationField = 'productId' | 'quantity' | 'paymentMethodId' | 'couponCode' | 'acceptedDemoTerms';

export type ValidationErrorCode =
  | 'productRequired'
  | 'quantityInvalid'
  | 'quantityRange'
  | 'paymentMethodRequired'
  | 'couponInvalid'
  | 'termsRequired';

export type ValidationErrors = Partial<Record<ValidationField, ValidationErrorCode>>;

export interface PaymentRequest {
  order: ValidOrder;
  amount: number;
  /** 1 for the first try, incremented on each retry. */
  attempt: number;
}

export interface PaymentReceipt {
  orderId: string;
  approvedAt: string;
  order: ValidOrder;
  price: PriceBreakdown;
}

export type PaymentFailureCode =
  | 'card_declined'
  | 'temporary_error'
  | 'amount_mismatch'
  | 'invalid_request'
  | 'network_error';

export type PaymentResult =
  | { status: 'success'; orderId: string; approvedAt: string }
  | { status: 'failure'; code: PaymentFailureCode };

/**
 * Explicit state model for the checkout flow.
 * The draft travels with every state so going back or retrying never loses input.
 */
export type PaymentFlowState =
  | { step: 'details'; draft: OrderDraft; errors: ValidationErrors; attempt: number }
  | { step: 'review'; draft: OrderDraft; order: ValidOrder; price: PriceBreakdown; attempt: number }
  | { step: 'processing'; draft: OrderDraft; order: ValidOrder; price: PriceBreakdown; attempt: number }
  | { step: 'success'; draft: OrderDraft; receipt: PaymentReceipt; attempt: number }
  | {
      step: 'failure';
      draft: OrderDraft;
      order: ValidOrder;
      price: PriceBreakdown;
      code: PaymentFailureCode;
      attempt: number;
    };

export type PaymentStep = PaymentFlowState['step'];
