export const cards = {
  // Page Title and Description
  title: 'My Cards',
  description: 'Manage your payment cards and view balances',
  
  // Header Actions
  hideBalances: 'Hide Balances',
  showBalances: 'Show Balances',
  addCard: 'Add Card',
  
  // Card Details
  default: 'Default',
  balance: 'Balance',
  expires: 'Expires',
  cardType: 'Card Type',
  
  // Add Card Modal
  addNewCard: 'Add New Card',
  cardName: 'Card Name',
  cardNamePlaceholder: 'My Credit Card',
  cardNumber: 'Card Number',
  cardNumberPlaceholder: '1234 5678 9012 3456',
  month: 'Month',
  year: 'Year',
  cvv: 'CVV',
  cvvPlaceholder: '123',
  initialBalance: 'Initial Balance (Optional)',
  balancePlaceholder: '0.00',
  cancel: 'Cancel',
  adding: 'Adding...',
  
  // Delete Confirmation
  deleteCard: 'Delete Card',
  deleteConfirmation: 'Are you sure you want to delete this card? This action cannot be undone.',
  deleting: 'Deleting...',
  delete: 'Delete',
  
  // Card Actions (context menu)
  setAsDefault: 'Set as Default',
  editCard: 'Edit Card',
  removeCard: 'Remove Card',
  
  // Empty State
  noCards: 'No cards added yet',
  noCardsDescription: 'Add your first payment card to get started',
  
  // Card Types
  cardTypes: {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    unknown: 'Unknown'
  },

  // Validation Messages
  validation: {
    cardNameRequired: 'Card name is required',
    cardNumberMinLength: 'Card number must be at least 16 digits',
    balancePositive: 'Balance must be positive'
  }
};