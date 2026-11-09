export const paymentDemo = {
  pageTitle: '결제 데모',
  pageDescription: '로그인 없이 SafePay 결제 흐름 전체를 체험해 보세요.',
  demoBanner: 'Demo only. 실제 결제는 발생하지 않으며, 카드번호나 개인정보를 수집하지 않습니다.',
  backHome: '홈으로',

  steps: {
    label: '결제 진행 단계',
    details: '주문 정보',
    review: '주문 확인',
    processing: '결제 처리',
    result: '결제 결과',
    progress: '{{total}}단계 중 {{current}}단계',
  },

  products: {
    legend: '상품 선택',
    'coffee-beans': { name: '스페셜티 원두 500g', description: '에티오피아 예가체프 싱글 오리진' },
    'wireless-earbuds': { name: '무선 이어폰', description: '노이즈 캔슬링 · 최대 30시간 재생' },
    'leather-wallet': { name: '가죽 카드 지갑', description: '이탈리안 베지터블 레더' },
  },

  quantity: {
    label: '수량',
    hint: '{{min}}~{{max}}개까지 주문할 수 있어요.',
    decrease: '수량 줄이기',
    increase: '수량 늘리기',
  },

  methods: {
    legend: '테스트 결제수단',
    hint: '실제 카드 정보 없이 결과 시나리오만 선택합니다.',
    'test-card-approve': { name: '테스트 카드 · 승인', description: '항상 결제가 승인됩니다.' },
    'test-wallet': { name: 'SafePay 테스트 지갑', description: '지갑 잔액으로 결제 (항상 승인)' },
    'test-card-flaky': { name: '테스트 카드 · 일시 오류', description: '첫 시도는 실패, 재시도하면 승인됩니다.' },
    'test-card-decline': { name: '테스트 카드 · 거절', description: '항상 카드사 거절로 실패합니다.' },
  },

  coupon: {
    label: '쿠폰 코드 (선택)',
    hint: 'DEMO10 을 입력하면 10% 할인됩니다.',
  },

  terms: {
    label: '이 결제는 데모이며 실제 결제가 이루어지지 않는다는 점을 확인했습니다.',
  },

  errors: {
    summary: '입력 내용을 확인해 주세요. {{count}}개 항목에 오류가 있습니다.',
    productRequired: '상품을 선택해 주세요.',
    quantityInvalid: '수량을 숫자로 입력해 주세요.',
    quantityRange: '수량은 1개 이상 10개 이하로 입력해 주세요.',
    paymentMethodRequired: '테스트 결제수단을 선택해 주세요.',
    couponInvalid: '사용할 수 없는 쿠폰 코드입니다. DEMO10 을 입력하거나 비워 두세요.',
    termsRequired: '데모 결제 안내에 동의해 주세요.',
  },

  summary: {
    title: '결제 금액',
    empty: '상품을 선택하면 금액이 계산됩니다.',
    unitPrice: '단가',
    subtotal: '상품 금액',
    discount: '쿠폰 할인',
    shipping: '배송비',
    freeShipping: '무료',
    freeShippingHint: '{{amount}} 이상 구매 시 무료 배송',
    total: '최종 결제 금액',
    product: '상품',
    quantity: '수량',
    method: '결제수단',
    quantityValue: '{{count}}개',
  },

  actions: {
    next: '주문 확인하기',
    back: '이전 단계',
    pay: '{{amount}} 결제하기',
    paying: '결제 요청 중…',
    retry: '다시 시도',
    edit: '주문 정보 수정',
    startOver: '처음으로',
    newPayment: '새 결제 시작',
  },

  review: {
    title: '주문 내역을 확인해 주세요',
    description: '결제하기를 누르면 테스트 결제가 진행됩니다.',
  },

  processing: {
    title: '결제를 처리하고 있어요',
    description: '잠시만 기다려 주세요. 창을 닫거나 새로고침하지 마세요.',
  },

  result: {
    successTitle: '결제가 완료되었습니다',
    successDescription: '가상 주문이 생성되었습니다. 실제 결제는 이루어지지 않았습니다.',
    orderId: '주문번호',
    approvedAt: '승인 시각',
    failureTitle: '결제에 실패했습니다',
    failureDescription: '입력한 주문 정보는 그대로 유지됩니다.',
    attempt: '시도 횟수: {{count}}회',
    failures: {
      card_declined: '카드사에서 결제를 거절했습니다. 다른 테스트 결제수단을 선택해 보세요.',
      temporary_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      amount_mismatch: '결제 금액이 주문 금액과 일치하지 않습니다. 주문 정보를 다시 확인해 주세요.',
      invalid_request: '결제 요청 형식이 올바르지 않습니다. 주문 정보를 다시 확인해 주세요.',
      network_error: '결제 서버에 연결하지 못했습니다. 네트워크를 확인한 뒤 다시 시도해 주세요.',
    },
  },

  announcements: {
    details: '1단계, 주문 정보 입력',
    review: '2단계, 주문 확인',
    processing: '결제를 처리하고 있습니다.',
    success: '결제가 완료되었습니다. 주문번호 {{orderId}}',
    failure: '결제에 실패했습니다. {{reason}}',
  },
};
