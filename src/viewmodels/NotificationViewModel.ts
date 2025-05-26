import { makeAutoObservable, action } from 'mobx';
import { INotificationService, Notification } from '../models/Notification';
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

  constructor(private notificationService: INotificationService) {
    makeAutoObservable(this);
  }

  private handleError = action((error: unknown, defaultMessage: string) => {
    console.error(defaultMessage, error);
    this.error = error instanceof Error ? error.message : defaultMessage;
  });

  private setNotifications = action((notifications: Notification[]) => {
    this.notifications = notifications;
  });

  updateNotificationStats = action(() => {
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
  });

  fetchUserNotifications = action(async (userId: string) => {
    try {
      this.loading = true;
      this.error = null;
      const notifications = await this.notificationService.getUserNotifications(userId);
      const formattedNotifications = notifications.map((notification: Notification) => ({
        ...notification,
        createdAt: notification.createdAt instanceof Timestamp 
          ? notification.createdAt 
          : Timestamp.fromDate(new Date(notification.createdAt))
      }));
      this.setNotifications(formattedNotifications);
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirimler yüklenirken bir hata oluştu');
    } finally {
      this.setLoading(false);
    }
  });

  private setLoading = action((loading: boolean) => {
    this.loading = loading;
  });

  markAsRead = action(async (notificationId: string) => {
    try {
      this.error = null;
      await this.notificationService.markAsRead(notificationId);
      const updatedNotifications = this.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      this.setNotifications(updatedNotifications);
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirim okundu olarak işaretlenirken bir hata oluştu');
    }
  });

  createNotification = action(async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      this.error = null;
      const newNotification = await this.notificationService.createNotification({
        ...notification,
        createdAt: Timestamp.now()
      });
      const updatedNotifications = [newNotification, ...this.notifications];
      this.setNotifications(updatedNotifications);
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirim oluşturulurken bir hata oluştu');
    }
  });

  deleteNotification = action(async (notificationId: string) => {
    try {
      this.error = null;
      await this.notificationService.deleteNotification(notificationId);
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirim silinirken bir hata oluştu');
    }
  });

  markAllAsRead = action(async (userId: string) => {
    try {
      this.error = null;
      await this.notificationService.markAllAsRead(userId);
      this.notifications = this.notifications.map(n => ({ ...n, read: true }));
      this.updateNotificationStats();
    } catch (error) {
      this.handleError(error, 'Bildirimler toplu işaretlenirken bir hata oluştu');
    }
  });

  sortNotifications = action((sortBy: 'date' | 'type' | 'read') => {
    try {
      this.error = null;
      const sortedNotifications = [...this.notifications];
      
      switch(sortBy) {
        case 'date':
          sortedNotifications.sort((a, b) => {
            const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'type':
          sortedNotifications.sort((a, b) => a.type.localeCompare(b.type));
          break;
        case 'read':
          sortedNotifications.sort((a, b) => Number(a.read) - Number(b.read));
          break;
      }
      
      this.setNotifications(sortedNotifications);
    } catch (error) {
      this.handleError(error, 'Bildirimler sıralanırken bir hata oluştu');
    }
  });

  filterNotifications = action(async (filters: {
    type?: 'job' | 'application' | 'system';
    read?: boolean;
    startDate?: Date;
    endDate?: Date;
  }) => {
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
  });

  clearError = action(() => {
    this.error = null;
  });
} 