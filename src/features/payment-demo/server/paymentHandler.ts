import type { PaymentResult } from '../types';
import { paymentRequestSchema } from './paymentRequestSchema';
import { processPayment, type ProcessPaymentOptions } from './processPayment';

export const IDEMPOTENCY_HEADER = 'Idempotency-Key';
const MAX_CACHED_KEYS = 500;

interface Outcome {
  httpStatus: 200 | 400;
  body: PaymentResult;
}

export interface PaymentHandlerOptions extends ProcessPaymentOptions {
  /** Simulated processing time in ms. */
  latencyMs?: number;
}

/**
 * Builds the POST handler for /api/demo/payments.
 *
 * Responses
 * - 200 { status: 'success', orderId, approvedAt } | { status: 'failure', code }
 * - 400 { status: 'failure', code: 'invalid_request' } for a malformed body or missing key
 *
 * Requests that reuse an Idempotency-Key get the original result (and share the
 * pending one if it is still processing), so a resent request is never charged twice.
 * The cache lives in server memory only and holds no personal data.
 */
export function createPaymentHandler(options: PaymentHandlerOptions = {}) {
  const { latencyMs = 1800, ...processOptions } = options;
  const results = new Map<string, Promise<Outcome>>();

  const INVALID: Outcome = { httpStatus: 400, body: { status: 'failure', code: 'invalid_request' } };

  const handle = async (request: Request): Promise<Outcome> => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return INVALID;
    }
    const parsed = paymentRequestSchema.safeParse(body);
    if (!parsed.success) return INVALID;

    await new Promise((resolve) => setTimeout(resolve, latencyMs));
    return { httpStatus: 200, body: processPayment(parsed.data, processOptions) };
  };

  const respond = ({ httpStatus, body }: Outcome) => Response.json(body, { status: httpStatus });

  return async function POST(request: Request): Promise<Response> {
    const key = request.headers.get(IDEMPOTENCY_HEADER)?.trim();
    if (!key || key.length > 100) return respond(INVALID);

    const cached = results.get(key);
    if (cached) return respond(await cached);

    // Reserve the key synchronously, before any await, so a concurrent duplicate shares this run.
    const pending = handle(request);
    results.set(key, pending);
    if (results.size > MAX_CACHED_KEYS) {
      const oldest = results.keys().next().value;
      if (oldest !== undefined) results.delete(oldest);
    }

    const outcome = await pending;
    // A rejected body was never processed; let the client resend a corrected one with the same key.
    if (outcome.httpStatus !== 200) results.delete(key);
    return respond(outcome);
  };
}
