import { Notification, NotificationType, NotificationData, CreateNotificationInput, NotificationError, NotificationErrorCodes } from '../models/Notification';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp, deleteDoc, writeBatch, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

export class NotificationService {
  private db = getFirestore();
  private notificationsCollection = collection(this.db, 'notifications');

  private handleError(error: unknown, code: string, message: string): never {
    console.error(`${message}:`, error);
    throw new NotificationError(message, code, error);
  }

  async createNotification(notification: CreateNotificationInput): Promise<Notification> {
    try {
      const now = Timestamp.now();
      const notificationData = {
        ...notification,
        createdAt: notification.createdAt || now,
        updatedAt: notification.updatedAt || now,
        read: notification.read ?? false
      };

      const docRef = await addDoc(this.notificationsCollection, notificationData);
      
      return {
        ...notificationData,
        id: docRef.id
      } as Notification;
    } catch (error) {
      this.handleError(error, NotificationErrorCodes.CREATE_FAILED, 'Bildirim oluşturulamadı');
    }
  }

  async getUserNotifications(userId: string, options?: {
    limit?: number;
    orderBy?: 'date' | 'type' | 'read';
    type?: NotificationType;
    read?: boolean;
  }): Promise<Notification[]> {
    try {
      if (!userId) {
        console.warn('getUserNotifications: userId boş olamaz');
        return [];
      }
      
      let q = query(this.notificationsCollection, where('userId', '==', userId));

      if (options?.type) {
        q = query(q, where('type', '==', options.type));
      }

      if (options?.read !== undefined) {
        q = query(q, where('read', '==', options.read));
      }

      if (options?.orderBy) {
        switch (options.orderBy) {
          case 'date':
            q = query(q, orderBy('createdAt', 'desc'));
            break;
          case 'type':
            q = query(q, orderBy('type'));
            break;
          case 'read':
            q = query(q, orderBy('read'));
            break;
        }
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      try {
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt || Timestamp.now(),
            updatedAt: data.updatedAt || Timestamp.now(),
            read: data.read ?? false
          } as Notification;
        });
      } catch (firestoreError: any) {
        // İzin hatalarını özel olarak ele al
        if (firestoreError.code === 'permission-denied') {
          console.warn('Notifications koleksiyonuna erişim izni yok. Boş dizi döndürülüyor.');
          return [];
        }
        throw firestoreError;
      }
    } catch (error) {
      this.handleError(error, NotificationErrorCodes.FETCH_FAILED, 'Bildirimler alınamadı');
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const now = Timestamp.now();
      const notificationRef = doc(this.notificationsCollection, notificationId);
      await updateDoc(notificationRef, {
        read: true,
        updatedAt: now
      });
    } catch (error) {
      this.handleError(error, NotificationErrorCodes.UPDATE_FAILED, 'Bildirim okundu olarak işaretlenemedi');
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(this.notificationsCollection, notificationId);
      await deleteDoc(notificationRef);
    } catch (error) {
      this.handleError(error, NotificationErrorCodes.DELETE_FAILED, 'Bildirim silinemedi');
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const now = Timestamp.now();
      const q = query(this.notificationsCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(this.db);
      
      querySnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { 
          read: true,
          updatedAt: now
        });
      });
      
      await batch.commit();
    } catch (error) {
      this.handleError(error, NotificationErrorCodes.BATCH_UPDATE_FAILED, 'Bildirimler toplu işaretlenemedi');
    }
  }
} 