import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { PaymentDemo } from '@/features/payment-demo/components/PaymentDemo';

export const metadata: Metadata = {
  title: 'Payment Demo | SafePay',
  description: 'Try the full SafePay checkout flow without signing in. Demo only — no real payments are processed.',
};

export default function PaymentDemoPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navigation />
      <PaymentDemo />
    </div>
  );
}
