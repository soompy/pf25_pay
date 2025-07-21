export const auth = {
  // Login Page
  login: {
    title: 'Login',
    subtitle: 'Sign in to your account',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot your password?',
    loginButton: 'Sign In',
    noAccount: "Don't have an account?",
    signupLink: 'Sign Up',
    socialLogin: {
      google: 'Continue with Google',
      github: 'Continue with GitHub',
      divider: 'or',
    },
  },

  // Signup Page
  signup: {
    title: 'Sign Up',
    subtitle: 'Create a new account',
    name: 'Full Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phone: 'Phone Number',
    signupButton: 'Create Account',
    hasAccount: 'Already have an account?',
    loginLink: 'Sign In',
    terms: {
      agree: 'I agree to the',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      and: ' and ',
    },
  },

  // Password Reset
  passwordReset: {
    title: 'Reset Password',
    subtitle: 'We will send a reset link to your registered email',
    email: 'Email Address',
    sendButton: 'Send Reset Link',
    backToLogin: 'Back to Login',
    success: 'Reset link has been sent to your email',
  },

  // Verification
  verification: {
    title: 'Email Verification',
    subtitle: 'Please verify your email to complete registration',
    resend: 'Resend verification email',
    verified: 'Email verified successfully',
    failed: 'Email verification failed',
  },

  // Form Validation
  validation: {
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email',
    passwordRequired: 'Password is required',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordMismatch: 'Passwords do not match',
    nameRequired: 'Name is required',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Please enter a valid phone number',
    termsRequired: 'Please agree to the terms',
  },

  // Messages
  messages: {
    loginSuccess: 'Successfully logged in',
    loginFailed: 'Login failed',
    signupSuccess: 'Account created successfully',
    signupFailed: 'Registration failed',
    logoutSuccess: 'Successfully logged out',
    sessionExpired: 'Session expired. Please log in again',
  },
};