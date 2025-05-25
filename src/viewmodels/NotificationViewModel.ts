import { makeAutoObservable } from 'mobx';
import { NotificationService } from '../services/NotificationService';
import { Notification } from '../models/Notification';
import { Timestamp } from 'firebase/firestore';

export class NotificationViewModel {
  notifications: Notification[] = [];
  loading: boolean = false;
  error: string | null = null;
  unreadCount: number = 0;
  notificationStats = {
    total: 0,
    unread: 0,
    byType: {
      job: 0,
      application: 0,
      system: 0
    }
  };

  constructor(private notificationService: NotificationService) {
    makeAutoObservable(this);
  }

  private handleError(error: unknown, defaultMessage: string) {
    console.error(defaultMessage, error);
    this.error = error instanceof Error ? error.message : defaultMessage;
  }

  updateNotificationStats() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
    this.notificationStats = {
      total: this.notifications.length,
      unread: this.unreadCount,
      byType: {
        job: this.notifications.filter(n => n.type === 'job').length,
        application: this.notifications.filter(n => n.type === 'application').length,
        system: this.notifications.filter(n => n.type === 'system').length
      }
    };
  }

  async fetchUserNotifications(userId: string) {
    try {
      this.loading = true;
      this.error = null;
      const notifications = await this.notificationService.getUserNotifications(userId);
      this.notifications = notifications.map(notification => ({
        ...notification,
        createdAt: notification.createdAt instanceof Timestamp 
          ? notification.createdAt 
          : Timestamp.fromDate(new Date(notification.createdAt))
      }));
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirimler yüklenirken bir hata oluştu');
    } finally {
      this.loading = false;
    }
  }

  async markAsRead(notificationId: string) {
    try {
      this.error = null;
      await this.notificationService.markAsRead(notificationId);
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        this.updateNotificationStats();
      }
    } catch (error) {
      this.handleError(error, 'Bildirim okundu olarak işaretlenirken bir hata oluştu');
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    try {
      this.error = null;
      const newNotification = await this.notificationService.createNotification({
        ...notification,
        createdAt: Timestamp.now()
      });
      this.notifications.unshift(newNotification);
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirim oluşturulurken bir hata oluştu');
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      this.error = null;
      await this.notificationService.deleteNotification(notificationId);
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirim silinirken bir hata oluştu');
    }
  }

  async markAllAsRead(userId: string) {
    try {
      this.error = null;
      await this.notificationService.markAllAsRead(userId);
      this.notifications = this.notifications.map(n => ({ ...n, read: true }));
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirimler toplu işaretlenirken bir hata oluştu');
    }
  }

  async sortNotifications(sortBy: 'date' | 'type' | 'read') {
    try {
      this.error = null;
      switch(sortBy) {
        case 'date':
          this.notifications.sort((a, b) => {
            const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'type':
          this.notifications.sort((a, b) => a.type.localeCompare(b.type));
          break;
        case 'read':
          this.notifications.sort((a, b) => Number(a.read) - Number(b.read));
          break;
      }
    } catch (error) {
      this.handleError(error, 'Bildirimler sıralanırken bir hata oluştu');
    }
  }

  async filterNotifications(filters: {
    type?: 'job' | 'application' | 'system';
    read?: boolean;
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      this.error = null;
      let filteredNotifications = [...this.notifications];

      if (filters.type) {
        filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
      }

      if (filters.read !== undefined) {
        filteredNotifications = filteredNotifications.filter(n => n.read === filters.read);
      }

      if (filters.startDate) {
        filteredNotifications = filteredNotifications.filter(n => {
          const date = n.createdAt instanceof Timestamp ? n.createdAt.toDate() : new Date(n.createdAt);
          return date >= filters.startDate!;
        });
      }

      if (filters.endDate) {
        filteredNotifications = filteredNotifications.filter(n => {
          const date = n.createdAt instanceof Timestamp ? n.createdAt.toDate() : new Date(n.createdAt);
          return date <= filters.endDate!;
        });
      }

      this.notifications = filteredNotifications;
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirimler filtrelenirken bir hata oluştu');
    }
  }

  clearError() {
    this.error = null;
  }
} 