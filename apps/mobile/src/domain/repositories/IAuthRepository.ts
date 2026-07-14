/**
 * Auth repository interface
 * Defines the contract for authentication operations
 */

import { User, UserRole } from '../entities/User';

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

export interface IAuthRepository {
  signUp(params: SignUpParams): Promise<AuthSession>;
  signIn(params: SignInParams): Promise<AuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  refreshSession(): Promise<AuthSession>;
  resetPassword(email: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
}
