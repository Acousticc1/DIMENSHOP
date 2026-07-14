import { create } from 'zustand';
import { User, UserRole } from '../../domain/entities/User';
import { AuthSession } from '../../domain/repositories/IAuthRepository';
import { SupabaseAuthRepository } from '../../infrastructure/repositories/SupabaseAuthRepository';
import { logger } from '../../shared/utils/logger';

const authRepository = new SupabaseAuthRepository();

interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  initSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authRepository.signIn({ email, password });
      set({ session, user: session.user, isLoading: false });
      logger.info('User logged in successfully', { userId: session.user.id });
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  signUp: async (email, password, fullName, role) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authRepository.signUp({ email, password, fullName, role });
      
      // session might be null if email confirmation is required
      if (session && session.user) {
        set({ session, user: session.user });
      }
      
      set({ isLoading: false });
      logger.info('User registered successfully');
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authRepository.signOut();
      set({ session: null, user: null, isLoading: false });
      logger.info('User logged out');
    } catch (err: any) {
      set({ error: err.message || 'Logout failed', isLoading: false });
    }
  },

  initSession: async () => {
    set({ isLoading: true });
    try {
      const session = await authRepository.getSession();
      if (session) {
        set({ session, user: session.user });
        logger.info('Session restored from cache', { userId: session.user.id });
      } else {
        set({ session: null, user: null });
      }
    } catch (err) {
      logger.warn('Failed to restore active session', err);
      set({ session: null, user: null });
    } finally {
      set({ isLoading: false });
    }

    // Subscribe to auth state updates (e.g. token refresh, logout from server)
    authRepository.onAuthStateChange((session) => {
      if (session) {
        set({ session, user: session.user });
      } else {
        set({ session: null, user: null });
      }
    });
  },

  clearError: () => set({ error: null }),
}));
