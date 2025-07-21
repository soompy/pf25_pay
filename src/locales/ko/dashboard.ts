export const dashboard = {
  // Page Title
  title: '대시보드',
  welcome: '오늘의 금융 현황을 확인하세요',
  welcomeBack: '다시 오신 것을 환영합니다',

  // Balance Section
  balance: {
    title: '잔액',
    available: '사용 가능',
    pending: '대기 중',
    totalBalance: '총 잔액',
    hideBalance: '잔액 숨기기',
    showBalance: '잔액 보기',
  },

  // Quick Actions
  quickActions: {
    title: '빠른 작업',
    sendMoney: '송금',
    requestMoney: '요청',
    scanQr: 'QR 스캔',
    addCard: '카드 추가',
    topUp: '충전',
    withdraw: '출금',
  },

  // Recent Transactions
  recentTransactions: {
    title: '최근 거래',
    viewAll: '전체 보기',
    noTransactions: '거래 내역이 없습니다',
    amount: '금액',
    date: '날짜',
    status: '상태',
    type: '유형',
    recipient: '받는 사람',
    sender: '보낸 사람',
    reference: '참조',
  },

  // Statistics
  statistics: {
    title: '통계',
    monthlySpending: '이달 지출',
    monthlyIncome: '이달 수입',
    totalTransactions: '총 거래 수',
    averageTransaction: '평균 거래 금액',
    thisMonth: '이번 달',
    lastMonth: '지난 달',
    increase: '증가',
    decrease: '감소',
  },

  // Cards Section
  cards: {
    title: '내 카드',
    addCard: '카드 추가',
    defaultCard: '기본 카드',
    cardNumber: '카드 번호',
    expiryDate: '만료일',
    cardHolder: '소유자',
    balance: '잔액',
    limit: '한도',
    setDefault: '기본 카드로 설정',
    viewDetails: '상세 정보',
    manage: '카드 관리',
  },

  // Notifications
  notifications: {
    title: '알림',
    markAllRead: '모두 읽음 처리',
    noNotifications: '새로운 알림이 없습니다',
    types: {
      transaction: '거래',
      security: '보안',
      promotion: '프로모션',
      system: '시스템',
    },
  },

  // Status
  status: {
    completed: '완료',
    pending: '대기 중',
    failed: '실패',
    cancelled: '취소됨',
    processing: '처리 중',
  },

  // Transaction Types
  transactionTypes: {
    sent: '송금',
    received: '수신',
    deposit: '입금',
    withdrawal: '출금',
    payment: '결제',
    refund: '환불',
    fee: '수수료',
    interest: '이자',
    send: '송금',
    receive: '수신',
    request: '요청',
  },

  // Transactions Page
  transactions: {
    title: '거래내역',
    subtitle: '결제 내역을 조회하고 관리하세요',
    tabs: {
      transactions: '거래내역',
      requests: '결제 요청',
    },
    search: {
      placeholder: '거래내역 검색...',
      filters: '필터',
    },
    filters: {
      type: '유형',
      status: '상태',
      timePeriod: '기간',
      allTypes: '모든 유형',
      allStatus: '모든 상태',
      allTime: '전체 기간',
      today: '오늘',
      week: '지난 주',
      month: '지난 달',
      year: '지난 해',
    },
    actions: {
      export: '내보내기',
      retry: '재시도',
      cancel: '취소',
      pay: '결제',
      decline: '거절',
      viewDetails: '상세 보기',
    },
    empty: {
      transactions: '거래내역이 없습니다',
      requests: '결제 요청이 없습니다',
      filtered: '필터를 조정하여 더 많은 결과를 확인하세요.',
      start: '송금이나 결제 요청으로 시작해보세요.',
      requestsDescription: '보내거나 받은 결제 요청이 여기에 표시됩니다.',
    },
    details: {
      title: '거래 상세정보',
      to: '받는 사람',
      from: '보낸 사람',
      date: '날짜',
      reference: '참조번호',
      fee: '수수료',
      total: '총액',
      expires: '만료',
      retryTransaction: '거래 재시도',
    },
  },
};