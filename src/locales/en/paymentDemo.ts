export const paymentDemo = {
  pageTitle: 'Payment Demo',
  pageDescription: 'Walk through the full SafePay checkout flow without signing in.',
  demoBanner: 'Demo only. No real payments are processed, and no card numbers or personal data are collected.',
  backHome: 'Home',

  steps: {
    label: 'Checkout progress',
    details: 'Order details',
    review: 'Review',
    processing: 'Processing',
    result: 'Result',
    progress: 'Step {{current}} of {{total}}',
  },

  products: {
    legend: 'Choose a product',
    'coffee-beans': { name: 'Specialty Coffee Beans 500g', description: 'Ethiopia Yirgacheffe single origin' },
    'wireless-earbuds': { name: 'Wireless Earbuds', description: 'Noise cancelling · up to 30h playback' },
    'leather-wallet': { name: 'Leather Card Wallet', description: 'Italian vegetable-tanned leather' },
  },

  quantity: {
    label: 'Quantity',
    hint: 'You can order {{min}}–{{max}} items.',
    decrease: 'Decrease quantity',
    increase: 'Increase quantity',
  },

  methods: {
    legend: 'Test payment method',
    hint: 'No real card details — each option just picks an outcome.',
    'test-card-approve': { name: 'Test card · Approve', description: 'The payment is always approved.' },
    'test-wallet': { name: 'SafePay test wallet', description: 'Pay from wallet balance (always approved)' },
    'test-card-flaky': { name: 'Test card · Temporary error', description: 'Fails on the first try, approved on retry.' },
    'test-card-decline': { name: 'Test card · Decline', description: 'Always declined by the issuer.' },
  },

  coupon: {
    label: 'Coupon code (optional)',
    hint: 'Enter DEMO10 for 10% off.',
  },

  terms: {
    label: 'I understand this is a demo and no real payment will be made.',
  },

  errors: {
    summary: 'Please check your input. {{count}} field(s) need attention.',
    productRequired: 'Please choose a product.',
    quantityInvalid: 'Please enter the quantity as a number.',
    quantityRange: 'Quantity must be between 1 and 10.',
    paymentMethodRequired: 'Please choose a test payment method.',
    couponInvalid: 'This coupon code is not valid. Enter DEMO10 or leave it empty.',
    termsRequired: 'Please confirm the demo payment notice.',
  },

  summary: {
    title: 'Order total',
    empty: 'Choose a product to see the price.',
    unitPrice: 'Unit price',
    subtotal: 'Subtotal',
    discount: 'Coupon discount',
    shipping: 'Shipping',
    freeShipping: 'Free',
    freeShippingHint: 'Free shipping on orders of {{amount}} or more',
    total: 'Total',
    product: 'Product',
    quantity: 'Quantity',
    method: 'Payment method',
    quantityValue: '× {{count}}',
  },

  actions: {
    next: 'Review order',
    back: 'Back',
    pay: 'Pay {{amount}}',
    paying: 'Requesting payment…',
    retry: 'Try again',
    edit: 'Edit order',
    startOver: 'Back to start',
    newPayment: 'Start a new payment',
  },

  review: {
    title: 'Review your order',
    description: 'Pressing Pay runs a test payment.',
  },

  processing: {
    title: 'Processing your payment',
    description: 'Please wait. Do not close or refresh this window.',
  },

  result: {
    successTitle: 'Payment complete',
    successDescription: 'A virtual order was created. No real payment was made.',
    orderId: 'Order number',
    approvedAt: 'Approved at',
    failureTitle: 'Payment failed',
    failureDescription: 'Your order details have been kept.',
    attempt: 'Attempts: {{count}}',
    failures: {
      card_declined: 'The issuer declined the payment. Try another test payment method.',
      temporary_error: 'A temporary error occurred. Please try again.',
      amount_mismatch: 'The payment amount did not match the order. Please review your order.',
      invalid_request: 'The payment request was not valid. Please review your order.',
      network_error: 'Could not reach the payment server. Check your connection and try again.',
    },
  },

  announcements: {
    details: 'Step 1, order details',
    review: 'Step 2, review order',
    processing: 'Processing your payment.',
    success: 'Payment complete. Order number {{orderId}}',
    failure: 'Payment failed. {{reason}}',
  },
};
