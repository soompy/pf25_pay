import { createPaymentHandler } from '@/features/payment-demo/server/paymentHandler';

// Mock payment API for the demo. No payment gateway is called.
export const dynamic = 'force-dynamic';

export const POST = createPaymentHandler();
