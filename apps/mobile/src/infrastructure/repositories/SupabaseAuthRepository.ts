import { supabase } from '../supabase/client';
import { IAuthRepository, SignUpParams, SignInParams, AuthSession } from '../../domain/repositories/IAuthRepository';
import { User, UserRole } from '../../domain/entities/User';
import { AppError } from '../../domain/errors/AppError';
import { logger } from '../../shared/utils/logger';

export class SupabaseAuthRepository implements IAuthRepository {
  private mapSupabaseUser(sbUser: any, profile?: any): User {
    return {
      id: sbUser.id,
      email: sbUser.email || '',
      fullName: profile?.full_name || sbUser.user_metadata?.full_name || 'User',
      role: (profile?.role || sbUser.user_metadata?.role || 'buyer') as UserRole,
      avatarUrl: profile?.avatar_url || sbUser.user_metadata?.avatar_url || null,
      phone: profile?.phone || sbUser.phone || null,
      createdAt: new Date(profile?.created_at || sbUser.created_at),
      updatedAt: new Date(profile?.updated_at || sbUser.updated_at || sbUser.created_at),
    };
  }

  private async fetchProfile(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      logger.warn('Could not fetch user profile from public.users table', { userId, error });
      return null;
    }
    return data;
  }

  async signUp(params: SignUpParams): Promise<AuthSession> {
    try {
      logger.info('Executing Supabase signUp', { email: params.email });
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            role: params.role,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new AppError('AUTH_EMAIL_IN_USE', 'This email is already in use', 400);
        }
        throw new AppError('AUTH_INVALID_CREDENTIALS', error.message, 400);
      }

      if (!data.user || !data.session) {
        throw new AppError('AUTH_UNAUTHORIZED', 'Registration successful, check email for verification link', 200);
      }

      // Allow a brief delay for trigger execution on signup
      let profile = await this.fetchProfile(data.user.id);
      
      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at || 0,
        user: this.mapSupabaseUser(data.user, profile),
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error('Sign up failed', err);
      throw new AppError('UNKNOWN_ERROR', 'Sign up failed due to an unexpected error');
    }
  }

  async signIn(params: SignInParams): Promise<AuthSession> {
    try {
      logger.info('Executing Supabase signIn', { email: params.email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });

      if (error) {
        throw new AppError('AUTH_INVALID_CREDENTIALS', 'Invalid email or password', 401);
      }

      if (!data.user || !data.session) {
        throw new AppError('AUTH_UNAUTHORIZED', 'Failed to retrieve session', 401);
      }

      const profile = await this.fetchProfile(data.user.id);

      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at || 0,
        user: this.mapSupabaseUser(data.user, profile),
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error('Sign in failed', err);
      throw new AppError('UNKNOWN_ERROR', 'Sign in failed due to an unexpected error');
    }
  }

  async signOut(): Promise<void> {
    try {
      logger.info('Executing Supabase signOut');
      const { error } = await supabase.auth.signOut();
      if (error) throw new AppError('UNKNOWN_ERROR', error.message);
    } catch (err) {
      logger.error('Sign out failed', err);
      throw new AppError('UNKNOWN_ERROR', 'Sign out failed');
    }
  }

  async getSession(): Promise<AuthSession | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session || !session.user) return null;

      const profile = await this.fetchProfile(session.user.id);

      return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at || 0,
        user: this.mapSupabaseUser(session.user, profile),
      };
    } catch (err) {
      logger.warn('Failed to retrieve current auth session', err);
      return null;
    }
  }

  async refreshSession(): Promise<AuthSession> {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error || !session) {
        throw new AppError('AUTH_SESSION_EXPIRED', 'Session expired, please log in again', 401);
      }

      const profile = await this.fetchProfile(session.user.id);

      return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at || 0,
        user: this.mapSupabaseUser(session.user, profile),
      };
    } catch (err) {
      logger.error('Token refresh failed', err);
      throw new AppError('AUTH_SESSION_EXPIRED', 'Failed to refresh session');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw new AppError('UNKNOWN_ERROR', error.message);
    } catch (err) {
      logger.error('Reset password request failed', err);
      throw new AppError('UNKNOWN_ERROR', 'Password reset request failed');
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new AppError('UNKNOWN_ERROR', error.message);
    } catch (err) {
      logger.error('Password update failed', err);
      throw new AppError('UNKNOWN_ERROR', 'Failed to update password');
    }
  }

  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Supabase Auth State Changed', { event });
      
      if (!session || !session.user) {
        callback(null);
        return;
      }

      const profile = await this.fetchProfile(session.user.id);
      callback({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at || 0,
        user: this.mapSupabaseUser(session.user, profile),
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}
