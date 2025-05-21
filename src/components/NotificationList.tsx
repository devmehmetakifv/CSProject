import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreContext';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

export const NotificationList = observer(() => {
  const { notificationViewModel } = useStore();
  const { notifications } = notificationViewModel;

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationViewModel.markAsRead(notificationId);
  };

  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'dd MMMM yyyy HH:mm', { locale: tr });
    }
    return format(date, 'dd MMMM yyyy HH:mm', { locale: tr });
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Henüz bildiriminiz bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-white rounded-lg shadow p-4 ${
            !notification.read ? 'border-l-4 border-blue-500' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
              <p className="mt-1 text-gray-600">{notification.message}</p>
              <p className="mt-2 text-sm text-gray-500">
                {formatDate(notification.createdAt)}
              </p>
            </div>
            {!notification.read && (
              <button
                onClick={() => handleMarkAsRead(notification.id)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Okundu olarak işaretle
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}); 