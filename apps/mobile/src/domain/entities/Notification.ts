/**
 * Notification domain entity
 */

export type NotificationType = 'order' | 'processing' | 'system' | 'promotion';

export interface Notification {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly body: string;
  readonly type: NotificationType;
  readonly data: Record<string, unknown> | null;
  readonly isRead: boolean;
  readonly createdAt: Date;
}
