export const dashboard = {
  // Page Title
  title: 'Dashboard',
  welcome: "Here's your financial overview for today",
  welcomeBack: 'Welcome back',

  // Balance Section
  balance: {
    title: 'Balance',
    available: 'Available',
    pending: 'Pending',
    totalBalance: 'Total Balance',
    hideBalance: 'Hide Balance',
    showBalance: 'Show Balance',
  },

  // Quick Actions
  quickActions: {
    title: 'Quick Actions',
    sendMoney: 'Send Money',
    requestMoney: 'Request Money',
    scanQr: 'Scan QR',
    addCard: 'Add Card',
    topUp: 'Top Up',
    withdraw: 'Withdraw',
    security: 'Security',
  },

  // Recent Transactions
  recentTransactions: {
    title: 'Recent Transactions',
    viewAll: 'View All',
    noTransactions: 'No transactions found',
    amount: 'Amount',
    date: 'Date',
    status: 'Status',
    type: 'Type',
    recipient: 'Recipient',
    sender: 'Sender',
    reference: 'Reference',
  },

  // Statistics
  statistics: {
    title: 'Statistics',
    monthlySpending: 'Monthly Spending',
    monthlyIncome: 'Monthly Income',
    totalTransactions: 'Total Transactions',
    averageTransaction: 'Average Transaction',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    increase: 'Increase',
    decrease: 'Decrease',
  },

  // Security
  security: {
    level: 'Security Level',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },

  // Cards Section
  cards: {
    title: 'My Cards',
    addCard: 'Add Card',
    defaultCard: 'Default Card',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cardHolder: 'Card Holder',
    balance: 'Balance',
    limit: 'Limit',
    setDefault: 'Set as Default',
    viewDetails: 'View Details',
    manage: 'Manage Cards',
  },

  // Notifications
  notifications: {
    title: 'Notifications',
    markAllRead: 'Mark All as Read',
    noNotifications: 'No new notifications',
    types: {
      transaction: 'Transaction',
      security: 'Security',
      promotion: 'Promotion',
      system: 'System',
    },
  },

  // Status
  status: {
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    cancelled: 'Cancelled',
    processing: 'Processing',
  },

  // Transaction Types
  transactionTypes: {
    sent: 'Sent',
    received: 'Received',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    payment: 'Payment',
    refund: 'Refund',
    fee: 'Fee',
    interest: 'Interest',
    send: 'Sent',
    receive: 'Received',
    request: 'Request',
  },

  // Transactions Page
  transactions: {
    title: 'Transactions',
    subtitle: 'View and manage your payment history',
    tabs: {
      transactions: 'Transactions',
      requests: 'Payment Requests',
    },
    search: {
      placeholder: 'Search transactions...',
      filters: 'Filters',
    },
    filters: {
      type: 'Type',
      status: 'Status',
      timePeriod: 'Time Period',
      allTypes: 'All Types',
      allStatus: 'All Status',
      allTime: 'All Time',
      today: 'Today',
      week: 'Last Week',
      month: 'Last Month',
      year: 'Last Year',
    },
    actions: {
      export: 'Export',
      retry: 'Retry',
      cancel: 'Cancel',
      pay: 'Pay',
      decline: 'Decline',
      viewDetails: 'View Details',
    },
    empty: {
      transactions: 'No transactions found',
      requests: 'No payment requests found',
      filtered: 'Try adjusting your filters to see more results.',
      start: 'Start by sending or requesting money.',
      requestsDescription: 'Payment requests you send or receive will appear here.',
    },
    details: {
      title: 'Transaction Details',
      to: 'To',
      from: 'From',
      date: 'Date',
      reference: 'Reference',
      fee: 'Fee',
      total: 'Total',
      expires: 'Expires',
      retryTransaction: 'Retry Transaction',
    },
  },
};