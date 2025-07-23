import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  User, 
  AuthSession, 
  AuthState, 
  AuthError,
  LoginCredentials,
  RegisterData,
  TwoFactorData,
  PasswordResetRequest,
  PasswordResetData
} from '@/types/auth';

interface AuthStore {
  // State
  state: AuthState;
  user: User | null;
  session: AuthSession | null;
  error: AuthError | null;
  isLoading: boolean;
  
  // Temporary data for multi-step flows
  tempCredentials: LoginCredentials | null;
  resetToken: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  verifyTwoFactor: (data: TwoFactorData) => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<void>;
  resetPassword: (data: PasswordResetData) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
  
  // Profile management
  updateProfile: (data: Partial<User>) => Promise<void>;
  enableTwoFactor: () => Promise<string>; // Returns QR code URL
  disableTwoFactor: (code: string) => Promise<void>;
  
  // Session management
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  isSessionValid: () => boolean;
}

// Mock API functions (replace with real API calls)
const mockAuthAPI = {
  async login(credentials: LoginCredentials): Promise<{ session?: AuthSession; requires2FA?: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Mock 2FA requirement
    if (credentials.email === 'test2fa@example.com') {
      return { requires2FA: true };
    }
    
    // Mock successful login
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      name: 'Test User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      role: 'user',
      isEmailVerified: true,
      twoFactorEnabled: credentials.email === 'test2fa@example.com',
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
    };
    
    const session: AuthSession = {
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };
    
    return { session };
  },
  
  async register(data: RegisterData): Promise<AuthSession> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '2',
      email: data.email,
      name: data.name,
      role: 'user',
      isEmailVerified: false,
      twoFactorEnabled: false,
      createdAt: new Date(),
    };
    
    return {
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  },
  
  async verifyTwoFactor(code: string): Promise<AuthSession> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (code !== '123456') {
      throw new Error('Invalid verification code');
    }
    
    const mockUser: User = {
      id: '1',
      email: 'test2fa@example.com',
      name: 'Test User',
      role: 'user',
      isEmailVerified: true,
      twoFactorEnabled: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
    };
    
    return {
      user: mockUser,
      accessToken: 'mock-access-token-2fa',
      refreshToken: 'mock-refresh-token-2fa',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  },
  
  async requestPasswordReset(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock success - in real app, this would send an email
  },
  
  async resetPassword(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock success
  },
  
  async refreshSession(): Promise<AuthSession> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock refresh logic
    throw new Error('Refresh token expired');
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      state: 'idle',
      user: null,
      session: null,
      error: null,
      isLoading: false,
      tempCredentials: null,
      resetToken: null,
      
      // Login action
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await mockAuthAPI.login(credentials);
          
          if (result.requires2FA) {
            set({ 
              state: 'requires-2fa',
              tempCredentials: credentials,
              isLoading: false 
            });
          } else if (result.session) {
            set({ 
              state: 'authenticated',
              session: result.session,
              user: result.session.user,
              tempCredentials: null,
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            state: 'unauthenticated',
            error: { 
              code: 'login_failed', 
              message: error instanceof Error ? error.message : 'Login failed' 
            },
            isLoading: false 
          });
        }
      },
      
      // Register action
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const session = await mockAuthAPI.register(data);
          set({ 
            state: session.user.isEmailVerified ? 'authenticated' : 'requires-email-verification',
            session,
            user: session.user,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            state: 'unauthenticated',
            error: { 
              code: 'register_failed', 
              message: error instanceof Error ? error.message : 'Registration failed' 
            },
            isLoading: false 
          });
        }
      },
      
      // Logout action
      logout: () => {
        set({ 
          state: 'unauthenticated',
          user: null,
          session: null,
          error: null,
          tempCredentials: null,
          resetToken: null 
        });
      },
      
      // Two-factor verification
      verifyTwoFactor: async (data: TwoFactorData) => {
        set({ isLoading: true, error: null });
        
        try {
          const session = await mockAuthAPI.verifyTwoFactor(data.code);
          set({ 
            state: 'authenticated',
            session,
            user: session.user,
            tempCredentials: null,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: { 
              code: '2fa_failed', 
              message: error instanceof Error ? error.message : '2FA verification failed' 
            },
            isLoading: false 
          });
        }
      },
      
      // Password reset request
      requestPasswordReset: async (data: PasswordResetRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          await mockAuthAPI.requestPasswordReset(data.email);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: { 
              code: 'reset_request_failed', 
              message: error instanceof Error ? error.message : 'Password reset request failed' 
            },
            isLoading: false 
          });
        }
      },
      
      // Password reset
      resetPassword: async (data: PasswordResetData) => {
        set({ isLoading: true, error: null });
        
        try {
          await mockAuthAPI.resetPassword(data.token, data.password);
          set({ 
            resetToken: null,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: { 
              code: 'reset_failed', 
              message: error instanceof Error ? error.message : 'Password reset failed' 
            },
            isLoading: false 
          });
        }
      },
      
      // Refresh session
      refreshSession: async () => {
        const { session } = get();
        if (!session?.refreshToken) return;
        
        set({ isLoading: true });
        
        try {
          const newSession = await mockAuthAPI.refreshSession(session.refreshToken);
          set({ 
            session: newSession,
            user: newSession.user,
            isLoading: false 
          });
        } catch {
          // Refresh failed, logout user
          get().logout();
        }
      },
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Profile management
      updateProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const updatedUser = { ...user, ...data };
          set({ 
            user: updatedUser,
            session: get().session ? { ...get().session!, user: updatedUser } : null,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: { 
              code: 'profile_update_failed', 
              message: error instanceof Error ? error.message : 'Profile update failed' 
            },
            isLoading: false 
          });
        }
      },
      
      // Enable 2FA
      enableTwoFactor: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock QR code URL
          const qrCodeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
          
          set({ isLoading: false });
          return qrCodeUrl;
        } catch (error) {
          set({ 
            error: { 
              code: '2fa_enable_failed', 
              message: error instanceof Error ? error.message : '2FA enable failed' 
            },
            isLoading: false 
          });
          throw error;
        }
      },
      
      // Disable 2FA
      disableTwoFactor: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (user) {
            const updatedUser = { ...user, twoFactorEnabled: false };
            set({ 
              user: updatedUser,
              session: get().session ? { ...get().session!, user: updatedUser } : null,
            });
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: { 
              code: '2fa_disable_failed', 
              message: error instanceof Error ? error.message : '2FA disable failed' 
            },
            isLoading: false 
          });
        }
      },
      
      // Session management helpers
      setSession: (session: AuthSession) => {
        set({ 
          state: 'authenticated',
          session,
          user: session.user 
        });
      },
      
      clearSession: () => {
        set({ 
          state: 'unauthenticated',
          session: null,
          user: null 
        });
      },
      
      isSessionValid: () => {
        const { session } = get();
        if (!session) return false;
        return new Date() < new Date(session.expiresAt);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        session: state.session,
        state: state.state 
      }),
    }
  )
);