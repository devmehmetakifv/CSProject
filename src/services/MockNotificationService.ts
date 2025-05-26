import { Notification, NotificationType, CreateNotificationInput, INotificationService } from '../models/Notification';
import { Timestamp } from 'firebase/firestore';

export class MockNotificationService implements INotificationService {
  private notifications: Notification[] = [];
  private nextId = 1;

  async createNotification(notification: CreateNotificationInput): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: `mock_${this.nextId++}`,
      createdAt: notification.createdAt || Timestamp.now(),
      updatedAt: notification.updatedAt || Timestamp.now(),
      read: notification.read ?? false
    };

    this.notifications.unshift(newNotification);
    console.log('Mock bildirim oluşturuldu:', newNotification);
    return newNotification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const userNotifications = this.notifications.filter(n => n.userId === userId);
    console.log(`Mock: ${userId} için ${userNotifications.length} bildirim bulundu`);
    return userNotifications;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.updatedAt = Timestamp.now();
      console.log('Mock bildirim okundu olarak işaretlendi:', notificationId);
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    console.log('Mock bildirim silindi:', notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    const now = Timestamp.now();
    this.notifications.forEach(notification => {
      if (notification.userId === userId) {
        notification.read = true;
        notification.updatedAt = now;
      }
    });
    console.log('Mock: Tüm bildirimler okundu olarak işaretlendi:', userId);
  }
} 