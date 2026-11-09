import type { PaymentFailureCode, PaymentRequest, PaymentResult } from './types';

export const PAYMENT_ENDPOINT = '/api/demo/payments';
const IDEMPOTENCY_HEADER = 'Idempotency-Key';

/** What the checkout flow needs from a payment backend. */
export interface PaymentService {
  pay(request: PaymentRequest): Promise<PaymentResult>;
  isProcessing(): boolean;
}

type FetchLike = (input: string, init: RequestInit) => Promise<Pick<Response, 'ok' | 'status' | 'json'>>;

export interface PaymentClientOptions {
  endpoint?: string;
  fetchImpl?: FetchLike;
  createIdempotencyKey?: () => string;
}

const FAILURE_CODES: readonly PaymentFailureCode[] = [
  'card_declined',
  'temporary_error',
  'amount_mismatch',
  'invalid_request',
  'network_error',
];

function isPaymentResult(value: unknown): value is PaymentResult {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.status === 'success') return typeof v.orderId === 'string' && typeof v.approvedAt === 'string';
  if (v.status === 'failure') return FAILURE_CODES.includes(v.code as PaymentFailureCode);
  return false;
}

function defaultIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * HTTP client for the mock payment API.
 * - One request in flight at a time: a duplicate call gets the same promise.
 * - Each attempt carries its own Idempotency-Key so the server can drop resends.
 * - Network or malformed responses become a retryable `network_error`.
 */
export function createPaymentClient(options: PaymentClientOptions = {}): PaymentService {
  const {
    endpoint = PAYMENT_ENDPOINT,
    fetchImpl = (input, init) => fetch(input, init),
    createIdempotencyKey = defaultIdempotencyKey,
  } = options;
  let inFlight: Promise<PaymentResult> | null = null;

  const send = async (request: PaymentRequest): Promise<PaymentResult> => {
    try {
      const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', [IDEMPOTENCY_HEADER]: createIdempotencyKey() },
        body: JSON.stringify(request),
      });
      const data: unknown = await response.json().catch(() => null);
      if (isPaymentResult(data)) return data;
      return { status: 'failure', code: response.ok ? 'network_error' : 'invalid_request' };
    } catch {
      return { status: 'failure', code: 'network_error' };
    }
  };

  return {
    pay(request) {
      if (inFlight) return inFlight;
      inFlight = send(request).finally(() => {
        inFlight = null;
      });
      return inFlight;
    },
    isProcessing: () => inFlight !== null,
  };
}

/** Shared instance used by the demo page. */
export const paymentClient = createPaymentClient();
