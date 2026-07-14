/**
 * User domain entity
 * Represents the core user model independent of any framework or database
 */

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: UserRole;
  readonly avatarUrl: string | null;
  readonly phone: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
