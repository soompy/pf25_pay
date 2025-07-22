'use client';

import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardSidebar>
      {children}
    </DashboardSidebar>
  );
}