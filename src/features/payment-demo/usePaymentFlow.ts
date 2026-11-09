'use client';

import { useCallback, useReducer, useRef } from 'react';
import { paymentClient, type PaymentService } from './paymentClient';
import { INITIAL_STATE, paymentFlowReducer } from './paymentFlow';
import type { OrderDraft } from './types';

/**
 * Local (component-scoped) state for the demo. No global store is involved,
 * so leaving the page or starting over always begins from a clean state.
 */
export function usePaymentFlow(service: PaymentService = paymentClient) {
  const [state, dispatch] = useReducer(paymentFlowReducer, INITIAL_STATE);
  // Synchronous lock: blocks a second request even before React re-renders.
  const payingRef = useRef(false);

  const updateDraft = useCallback((patch: Partial<OrderDraft>) => dispatch({ type: 'updateDraft', patch }), []);
  const submitDetails = useCallback(() => dispatch({ type: 'submitDetails' }), []);
  const backToDetails = useCallback(() => dispatch({ type: 'backToDetails' }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const pay = useCallback(async () => {
    if (payingRef.current || service.isProcessing()) return;
    if (state.step !== 'review' && state.step !== 'failure') return;

    payingRef.current = true;
    const attempt = state.attempt + 1;
    dispatch({ type: 'startPayment' });

    try {
      const result = await service.pay({ order: state.order, amount: state.price.total, attempt });
      if (result.status === 'success') {
        dispatch({ type: 'paymentSucceeded', orderId: result.orderId, approvedAt: result.approvedAt });
      } else {
        dispatch({ type: 'paymentFailed', code: result.code });
      }
    } catch {
      dispatch({ type: 'paymentFailed', code: 'temporary_error' });
    } finally {
      payingRef.current = false;
    }
  }, [service, state]);

  return { state, updateDraft, submitDetails, backToDetails, pay, reset };
}
