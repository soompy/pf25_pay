export interface Card {
  id: string;
  name: string;
  last4: string;
  type: 'Visa' | 'Mastercard' | 'American Express' | 'Discover';
  brand: string;
  balance: number;
  isDefault: boolean;
  expiryMonth: number;
  expiryYear: number;
  currency: string;
  status: 'active' | 'blocked' | 'expired';
  createdAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  accountNumber?: string;
  isFrequent: boolean;
  lastTransactionAt?: Date;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'request' | 'refund';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  fromUser?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  toUser?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  fromCard?: Card;
  toCard?: Card;
  fee: number;
  totalAmount: number;
  reference: string;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  };
}

export interface PaymentRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  toUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'paid' | 'declined' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  paidAt?: Date;
  declinedAt?: Date;
  transactionId?: string;
}

export interface SendMoneyData {
  recipientType: 'contact' | 'email' | 'phone' | 'account';
  recipient: string;
  amount: number;
  currency: string;
  description: string;
  fromCard: string;
  scheduleType?: 'now' | 'later' | 'recurring';
  scheduledDate?: Date;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  isPrivate: boolean;
  requestTwoFactor?: boolean;
}

export interface RequestMoneyData {
  recipientType: 'contact' | 'email' | 'phone';
  recipient: string;
  amount: number;
  currency: string;
  description: string;
  expiresInDays: number;
  sendNotification: boolean;
}

export interface PaymentError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface PaymentStats {
  totalSent: number;
  totalReceived: number;
  totalRequests: number;
  monthlyLimit: number;
  monthlySpent: number;
  transactionCount: number;
  averageTransactionAmount: number;
}

export type PaymentState = 
  | 'idle'
  | 'validating'
  | 'confirming'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface QRCodeData {
  type: 'payment_request' | 'user_profile';
  userId: string;
  amount?: number;
  currency?: string;
  description?: string;
  expiresAt?: Date;
}