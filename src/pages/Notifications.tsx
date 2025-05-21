import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../hooks/useAuth';
import { NotificationList } from '../components/NotificationList';

export const Notifications = observer(() => {
  const { notificationViewModel } = useStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      notificationViewModel.fetchUserNotifications(user.id);
    }
  }, [notificationViewModel, user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bildirimlerim</h1>
      {notificationViewModel.loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : notificationViewModel.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata!</strong>
          <span className="block sm:inline"> {notificationViewModel.error}</span>
        </div>
      ) : (
        <NotificationList />
      )}
    </div>
  );
}); 