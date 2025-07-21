export const auth = {
  // Login Page
  login: {
    title: '로그인',
    subtitle: '계정에 로그인하세요',
    email: '이메일',
    password: '비밀번호',
    rememberMe: '로그인 상태 유지',
    forgotPassword: '비밀번호를 잊으셨나요?',
    loginButton: '로그인',
    noAccount: '계정이 없으신가요?',
    signupLink: '회원가입',
    socialLogin: {
      google: 'Google로 계속하기',
      github: 'GitHub로 계속하기',
      divider: '또는',
    },
  },

  // Signup Page
  signup: {
    title: '회원가입',
    subtitle: '새 계정을 만드세요',
    name: '이름',
    email: '이메일',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    phone: '전화번호',
    signupButton: '회원가입',
    hasAccount: '이미 계정이 있으신가요?',
    loginLink: '로그인',
    terms: {
      agree: '다음 약관에 동의합니다',
      termsOfService: '서비스 약관',
      privacyPolicy: '개인정보 처리방침',
      and: ' 및 ',
    },
  },

  // Password Reset
  passwordReset: {
    title: '비밀번호 재설정',
    subtitle: '등록된 이메일로 재설정 링크를 보내드립니다',
    email: '이메일 주소',
    sendButton: '재설정 링크 전송',
    backToLogin: '로그인으로 돌아가기',
    success: '재설정 링크가 이메일로 전송되었습니다',
  },

  // Verification
  verification: {
    title: '이메일 인증',
    subtitle: '회원가입을 완료하려면 이메일을 인증하세요',
    resend: '인증 이메일 재전송',
    verified: '인증이 완료되었습니다',
    failed: '인증에 실패했습니다',
  },

  // Form Validation
  validation: {
    emailRequired: '이메일을 입력해주세요',
    emailInvalid: '유효한 이메일을 입력해주세요',
    passwordRequired: '비밀번호를 입력해주세요',
    passwordTooShort: '비밀번호는 최소 8자 이상이어야 합니다',
    passwordMismatch: '비밀번호가 일치하지 않습니다',
    nameRequired: '이름을 입력해주세요',
    phoneRequired: '전화번호를 입력해주세요',
    phoneInvalid: '유효한 전화번호를 입력해주세요',
    termsRequired: '약관에 동의해주세요',
  },

  // Messages
  messages: {
    loginSuccess: '로그인되었습니다',
    loginFailed: '로그인에 실패했습니다',
    signupSuccess: '회원가입이 완료되었습니다',
    signupFailed: '회원가입에 실패했습니다',
    logoutSuccess: '로그아웃되었습니다',
    sessionExpired: '세션이 만료되었습니다. 다시 로그인해주세요',
  },
};