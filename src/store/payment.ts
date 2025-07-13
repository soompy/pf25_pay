import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Card, 
  Contact, 
  Transaction, 
  PaymentRequest,
  SendMoneyData,
  RequestMoneyData,
  PaymentError,
  PaymentStats,
  PaymentState,
  QRCodeData
} from '@/types/payment';

interface PaymentStore {
  // State
  state: PaymentState;
  cards: Card[];
  contacts: Contact[];
  transactions: Transaction[];
  paymentRequests: PaymentRequest[];
  stats: PaymentStats | null;
  error: PaymentError | null;
  isLoading: boolean;
  
  // Current operation data
  currentTransaction: Transaction | null;
  currentRequest: PaymentRequest | null;
  
  // Actions
  sendMoney: (data: SendMoneyData) => Promise<Transaction>;
  requestMoney: (data: RequestMoneyData) => Promise<PaymentRequest>;
  respondToRequest: (requestId: string, action: 'pay' | 'decline') => Promise<void>;
  
  // Cards management
  addCard: (cardData: Omit<Card, 'id' | 'createdAt'>) => Promise<Card>;
  updateCard: (cardId: string, data: Partial<Card>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  setDefaultCard: (cardId: string) => Promise<void>;
  
  // Contacts management
  addContact: (contactData: Omit<Contact, 'id'>) => Promise<Contact>;
  updateContact: (contactId: string, data: Partial<Contact>) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  searchContacts: (query: string) => Contact[];
  
  // Transactions
  getTransactions: (filters?: { type?: string; status?: string; dateFrom?: Date; dateTo?: Date }) => Promise<void>;
  getTransactionById: (transactionId: string) => Transaction | null;
  retryTransaction: (transactionId: string) => Promise<void>;
  cancelTransaction: (transactionId: string) => Promise<void>;
  
  // Payment requests
  getPaymentRequests: () => Promise<void>;
  getPaymentRequestById: (requestId: string) => PaymentRequest | null;
  
  // Stats and analytics
  getPaymentStats: () => Promise<void>;
  
  // QR Code
  generateQRCode: (data: Omit<QRCodeData, 'userId'>) => Promise<string>;
  parseQRCode: (qrData: string) => QRCodeData | null;
  
  // Utility
  clearError: () => void;
  resetState: () => void;
}

// Mock API functions
const mockPaymentAPI = {
  async sendMoney(data: SendMoneyData): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'send',
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      status: 'completed',
      fromUser: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com',
      },
      toUser: {
        id: `user_${Date.now()}`,
        name: data.recipient,
        email: data.recipient.includes('@') ? data.recipient : `${data.recipient}@example.com`,
      },
      fee: data.amount * 0.01, // 1% fee
      totalAmount: data.amount + (data.amount * 0.01),
      reference: `REF-${Date.now()}`,
      createdAt: new Date(),
      completedAt: new Date(),
    };
    
    return transaction;
  },
  
  async requestMoney(data: RequestMoneyData): Promise<PaymentRequest> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request: PaymentRequest = {
      id: `req_${Date.now()}`,
      fromUser: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com',
      },
      toUser: {
        id: `user_${Date.now()}`,
        name: data.recipient,
        email: data.recipient.includes('@') ? data.recipient : `${data.recipient}@example.com`,
      },
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      status: 'pending',
      expiresAt: new Date(Date.now() + (data.expiresInDays * 24 * 60 * 60 * 1000)),
      createdAt: new Date(),
    };
    
    return request;
  },
  
  async getCards(): Promise<Card[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'card_1',
        name: 'Main Card',
        last4: '4532',
        type: 'Visa',
        brand: 'visa',
        balance: 8234.56,
        isDefault: true,
        expiryMonth: 12,
        expiryYear: 2027,
        currency: 'USD',
        status: 'active',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'card_2',
        name: 'Savings Card',
        last4: '8765',
        type: 'Mastercard',
        brand: 'mastercard',
        balance: 4111.11,
        isDefault: false,
        expiryMonth: 8,
        expiryYear: 2026,
        currency: 'USD',
        status: 'active',
        createdAt: new Date('2024-02-15'),
      },
    ];
  },
  
  async getContacts(): Promise<Contact[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 'contact_1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b66e3a0e?w=150',
        isFrequent: true,
        lastTransactionAt: new Date('2024-01-10'),
      },
      {
        id: 'contact_2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+1 (555) 123-4567',
        isFrequent: true,
        lastTransactionAt: new Date('2024-01-05'),
      },
      {
        id: 'contact_3',
        name: 'Carol Wilson',
        email: 'carol@example.com',
        isFrequent: false,
        lastTransactionAt: new Date('2023-12-20'),
      },
    ];
  },
  
  async getTransactions(): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'txn_1',
        type: 'receive',
        amount: 2500.00,
        currency: 'USD',
        description: 'Salary Payment',
        status: 'completed',
        fromUser: {
          id: 'company',
          name: 'Acme Corp',
          email: 'payroll@acme.com',
        },
        fee: 0,
        totalAmount: 2500.00,
        reference: 'REF-SAL-001',
        createdAt: new Date('2024-01-15'),
        completedAt: new Date('2024-01-15'),
      },
      {
        id: 'txn_2',
        type: 'send',
        amount: 89.99,
        currency: 'USD',
        description: 'Grocery Store',
        status: 'completed',
        toUser: {
          id: 'store',
          name: 'Fresh Market',
          email: 'payments@freshmarket.com',
        },
        fee: 0.90,
        totalAmount: 90.89,
        reference: 'REF-GRO-002',
        createdAt: new Date('2024-01-14'),
        completedAt: new Date('2024-01-14'),
      },
      {
        id: 'txn_3',
        type: 'send',
        amount: 1200.00,
        currency: 'USD',
        description: 'Rent Payment',
        status: 'pending',
        toUser: {
          id: 'landlord',
          name: 'Property Management',
          email: 'rent@property.com',
        },
        fee: 12.00,
        totalAmount: 1212.00,
        reference: 'REF-RENT-003',
        createdAt: new Date('2024-01-01'),
      },
    ];
  },
  
  async getPaymentStats(): Promise<PaymentStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      totalSent: 15420.50,
      totalReceived: 28750.00,
      totalRequests: 3,
      monthlyLimit: 50000.00,
      monthlySpent: 8234.56,
      transactionCount: 127,
      averageTransactionAmount: 234.56,
    };
  },
};

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      // Initial state
      state: 'idle',
      cards: [],
      contacts: [],
      transactions: [],
      paymentRequests: [],
      stats: null,
      error: null,
      isLoading: false,
      currentTransaction: null,
      currentRequest: null,
      
      // Send money action
      sendMoney: async (data: SendMoneyData) => {
        set({ state: 'validating', isLoading: true, error: null });
        
        try {
          // Validate data
          if (data.amount <= 0) {
            throw new Error('Amount must be greater than 0');
          }
          
          const cards = get().cards;
          const selectedCard = cards.find(card => card.id === data.fromCard);
          if (!selectedCard) {
            throw new Error('Selected card not found');
          }
          
          if (selectedCard.balance < data.amount) {
            throw new Error('Insufficient balance');
          }
          
          set({ state: 'processing' });
          
          const transaction = await mockPaymentAPI.sendMoney(data);
          
          set(state => ({
            state: 'completed',
            transactions: [transaction, ...state.transactions],
            currentTransaction: transaction,
            isLoading: false,
          }));
          
          // Reset state after 3 seconds
          setTimeout(() => {
            set({ state: 'idle', currentTransaction: null });
          }, 3000);
          
          return transaction;
        } catch (error) {
          set({ 
            state: 'failed',
            error: { 
              code: 'send_failed', 
              message: error instanceof Error ? error.message : 'Send money failed' 
            },
            isLoading: false 
          });
          throw error;
        }
      },
      
      // Request money action
      requestMoney: async (data: RequestMoneyData) => {
        set({ state: 'processing', isLoading: true, error: null });
        
        try {
          if (data.amount <= 0) {
            throw new Error('Amount must be greater than 0');
          }
          
          const request = await mockPaymentAPI.requestMoney(data);
          
          set(state => ({
            state: 'completed',
            paymentRequests: [request, ...state.paymentRequests],
            currentRequest: request,
            isLoading: false,
          }));
          
          setTimeout(() => {
            set({ state: 'idle', currentRequest: null });
          }, 3000);
          
          return request;
        } catch (error) {
          set({ 
            state: 'failed',
            error: { 
              code: 'request_failed', 
              message: error instanceof Error ? error.message : 'Request money failed' 
            },
            isLoading: false 
          });
          throw error;
        }
      },
      
      // Respond to payment request
      respondToRequest: async (requestId: string, action: 'pay' | 'decline') => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            paymentRequests: state.paymentRequests.map(req =>
              req.id === requestId
                ? { 
                    ...req, 
                    status: action === 'pay' ? 'paid' : 'declined',
                    paidAt: action === 'pay' ? new Date() : undefined,
                    declinedAt: action === 'decline' ? new Date() : undefined,
                  }
                : req
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: { 
              code: 'response_failed', 
              message: error instanceof Error ? error.message : 'Response failed' 
            },
            isLoading: false 
          });
        }
      },
      
      // Cards management
      addCard: async (cardData) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newCard: Card = {
            ...cardData,
            id: `card_${Date.now()}`,
            createdAt: new Date(),
          };
          
          set(state => ({
            cards: [...state.cards, newCard],
            isLoading: false,
          }));
          
          return newCard;
        } catch (error) {
          set({ 
            error: { 
              code: 'add_card_failed', 
              message: error instanceof Error ? error.message : 'Add card failed' 
            },
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateCard: async (cardId, data) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            cards: state.cards.map(card =>
              card.id === cardId ? { ...card, ...data } : card
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: { 
              code: 'update_card_failed', 
              message: error instanceof Error ? error.message : 'Update card failed' 
            },
            isLoading: false 
          });
        }
      },
      
      deleteCard: async (cardId) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            cards: state.cards.filter(card => card.id !== cardId),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: { 
              code: 'delete_card_failed', 
              message: error instanceof Error ? error.message : 'Delete card failed' 
            },
            isLoading: false 
          });
        }
      },
      
      setDefaultCard: async (cardId) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            cards: state.cards.map(card => ({
              ...card,
              isDefault: card.id === cardId,
            })),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: { 
              code: 'set_default_failed', 
              message: error instanceof Error ? error.message : 'Set default card failed' 
            },
            isLoading: false 
          });
        }
      },
      
      // Contacts management
      addContact: async (contactData) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newContact: Contact = {
            ...contactData,
            id: `contact_${Date.now()}`,
          };
          
          set(state => ({
            contacts: [...state.contacts, newContact],
            isLoading: false,
          }));
          
          return newContact;
        } catch (error) {
          set({ 
            error: { 
              code: 'add_contact_failed', 
              message: error instanceof Error ? error.message : 'Add contact failed' 
            },
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateContact: async (contactId, data) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            contacts: state.contacts.map(contact =>
              contact.id === contactId ? { ...contact, ...data } : contact
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: { 
              code: 'update_contact_failed', 
              message: error instanceof Error ? error.message : 'Update contact failed' 
            },
            isLoading: false 
          });
        }
      },
      
      deleteContact: async (contactId) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            contacts: state.contacts.filter(contact => contact.id !== contactId),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: { 
              code: 'delete_contact_failed', 
              message: error instanceof Error ? error.message : 'Delete contact failed' 
            },
            isLoading: false 
          });
        }
      },
      
      searchContacts: (query) => {
        const { contacts } = get();
        if (!query.trim()) return contacts;
        
        const lowercaseQuery = query.toLowerCase();
        return contacts.filter(contact =>
          contact.name.toLowerCase().includes(lowercaseQuery) ||
          contact.email?.toLowerCase().includes(lowercaseQuery) ||
          contact.phone?.includes(query)
        );
      },
      
      // Load initial data
      getTransactions: async (filters) => {
        set({ isLoading: true, error: null });
        
        try {
          const transactions = await mockPaymentAPI.getTransactions();
          set({ transactions, isLoading: false });
        } catch (error) {
          set({ 
            error: { 
              code: 'load_transactions_failed', 
              message: error instanceof Error ? error.message : 'Load transactions failed' 
            },
            isLoading: false 
          });
        }
      },
      
      getTransactionById: (transactionId) => {
        const { transactions } = get();
        return transactions.find(txn => txn.id === transactionId) || null;
      },
      
      retryTransaction: async (transactionId) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            transactions: state.transactions.map(txn =>
              txn.id === transactionId
                ? { ...txn, status: 'completed', completedAt: new Date() }
                : txn
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: { 
              code: 'retry_failed', 
              message: error instanceof Error ? error.message : 'Retry transaction failed' 
            },
            isLoading: false 
          });
        }
      },
      
      cancelTransaction: async (transactionId) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            transactions: state.transactions.map(txn =>
              txn.id === transactionId
                ? { ...txn, status: 'cancelled' }
                : txn
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: { 
              code: 'cancel_failed', 
              message: error instanceof Error ? error.message : 'Cancel transaction failed' 
            },
            isLoading: false 
          });
        }
      },
      
      getPaymentRequests: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock payment requests
          const requests: PaymentRequest[] = [
            {
              id: 'req_1',
              fromUser: {
                id: 'user_alice',
                name: 'Alice Johnson',
                email: 'alice@example.com',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b66e3a0e?w=150',
              },
              toUser: {
                id: 'current-user',
                name: 'Current User',
                email: 'user@example.com',
              },
              amount: 50.00,
              currency: 'USD',
              description: 'Lunch split',
              status: 'pending',
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
          ];
          
          set({ paymentRequests: requests, isLoading: false });
        } catch (error) {
          set({ 
            error: { 
              code: 'load_requests_failed', 
              message: error instanceof Error ? error.message : 'Load payment requests failed' 
            },
            isLoading: false 
          });
        }
      },
      
      getPaymentRequestById: (requestId) => {
        const { paymentRequests } = get();
        return paymentRequests.find(req => req.id === requestId) || null;
      },
      
      getPaymentStats: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const stats = await mockPaymentAPI.getPaymentStats();
          set({ stats, isLoading: false });
        } catch (error) {
          set({ 
            error: { 
              code: 'load_stats_failed', 
              message: error instanceof Error ? error.message : 'Load payment stats failed' 
            },
            isLoading: false 
          });
        }
      },
      
      generateQRCode: async (data) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const qrData: QRCodeData = {
            ...data,
            userId: 'current-user',
          };
          
          // In a real app, this would generate an actual QR code
          return btoa(JSON.stringify(qrData));
        } catch (error) {
          set({ 
            error: { 
              code: 'qr_generation_failed', 
              message: error instanceof Error ? error.message : 'QR code generation failed' 
            }
          });
          throw error;
        }
      },
      
      parseQRCode: (qrData) => {
        try {
          const decoded = JSON.parse(atob(qrData));
          return decoded as QRCodeData;
        } catch (error) {
          return null;
        }
      },
      
      // Initialize store
      init: async () => {
        set({ isLoading: true });
        
        try {
          const [cards, contacts, transactions] = await Promise.all([
            mockPaymentAPI.getCards(),
            mockPaymentAPI.getContacts(),
            mockPaymentAPI.getTransactions(),
          ]);
          
          set({ 
            cards, 
            contacts, 
            transactions,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: { 
              code: 'init_failed', 
              message: error instanceof Error ? error.message : 'Initialization failed' 
            },
            isLoading: false 
          });
        }
      },
      
      clearError: () => set({ error: null }),
      
      resetState: () => set({ 
        state: 'idle', 
        currentTransaction: null, 
        currentRequest: null, 
        error: null 
      }),
    }),
    {
      name: 'payment-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        cards: state.cards,
        contacts: state.contacts,
        transactions: state.transactions.slice(0, 50), // Keep only recent transactions
        paymentRequests: state.paymentRequests,
      }),
    }
  )
);

// Auto-initialize the store
if (typeof window !== 'undefined') {
  const store = usePaymentStore.getState();
  if (store.cards.length === 0) {
    (store as any).init?.();
  }
}