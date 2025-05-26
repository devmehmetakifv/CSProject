import { Timestamp } from 'firebase/firestore';

export type NotificationType = 'job' | 'application' | 'system';

export interface NotificationData {
  jobId?: string;
  applicationId?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  data?: NotificationData;
}

export type CreateNotificationInput = Omit<Notification, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
};

// Common interface for notification services
export interface INotificationService {
  createNotification(notification: CreateNotificationInput): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}

export class NotificationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'NotificationError';
  }
}

export const NotificationErrorCodes = {
  CREATE_FAILED: 'NOTIFICATION_CREATE_FAILED',
  FETCH_FAILED: 'NOTIFICATION_FETCH_FAILED',
  UPDATE_FAILED: 'NOTIFICATION_UPDATE_FAILED',
  DELETE_FAILED: 'NOTIFICATION_DELETE_FAILED',
  BATCH_UPDATE_FAILED: 'NOTIFICATION_BATCH_UPDATE_FAILED'
} as const; 