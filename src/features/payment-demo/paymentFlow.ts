import { calculatePrice } from './pricing';
import { validateOrderDraft } from './validation';
import type { OrderDraft, PaymentFailureCode, PaymentFlowState, ValidationErrors } from './types';

export const INITIAL_DRAFT: OrderDraft = {
  productId: null,
  quantity: 1,
  paymentMethodId: null,
  couponCode: '',
  acceptedDemoTerms: false,
};

export const INITIAL_STATE: PaymentFlowState = {
  step: 'details',
  draft: INITIAL_DRAFT,
  errors: {},
  attempt: 0,
};

export type PaymentFlowAction =
  | { type: 'updateDraft'; patch: Partial<OrderDraft> }
  | { type: 'submitDetails' }
  | { type: 'backToDetails' }
  | { type: 'startPayment' }
  | { type: 'paymentSucceeded'; orderId: string; approvedAt: string }
  | { type: 'paymentFailed'; code: PaymentFailureCode }
  | { type: 'reset' };

/**
 * Pure state machine for the checkout flow. Actions that are not valid for the
 * current step are ignored, which is what makes a second "Pay" click harmless.
 */
export function paymentFlowReducer(state: PaymentFlowState, action: PaymentFlowAction): PaymentFlowState {
  switch (action.type) {
    case 'updateDraft': {
      if (state.step !== 'details') return state;
      const errors: ValidationErrors = { ...state.errors };
      for (const key of Object.keys(action.patch) as (keyof OrderDraft)[]) delete errors[key];
      return { ...state, draft: { ...state.draft, ...action.patch }, errors };
    }

    case 'submitDetails': {
      if (state.step !== 'details') return state;
      const result = validateOrderDraft(state.draft);
      if (!result.ok) return { ...state, errors: result.errors };
      const { order } = result;
      return {
        step: 'review',
        draft: state.draft,
        order,
        price: calculatePrice(order.productId, order.quantity, order.couponCode),
        attempt: state.attempt,
      };
    }

    case 'backToDetails': {
      if (state.step !== 'review' && state.step !== 'failure') return state;
      return { step: 'details', draft: state.draft, errors: {}, attempt: state.attempt };
    }

    case 'startPayment': {
      if (state.step !== 'review' && state.step !== 'failure') return state;
      return {
        step: 'processing',
        draft: state.draft,
        order: state.order,
        price: state.price,
        attempt: state.attempt + 1,
      };
    }

    case 'paymentSucceeded': {
      if (state.step !== 'processing') return state;
      return {
        step: 'success',
        draft: state.draft,
        attempt: state.attempt,
        receipt: {
          orderId: action.orderId,
          approvedAt: action.approvedAt,
          order: state.order,
          price: state.price,
        },
      };
    }

    case 'paymentFailed': {
      if (state.step !== 'processing') return state;
      return { ...state, step: 'failure', code: action.code };
    }

    case 'reset':
      return state.step === 'processing' ? state : INITIAL_STATE;
  }
}
