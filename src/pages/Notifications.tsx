import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../hooks/useAuth';
import { NotificationList } from '../components/NotificationList';

export const Notifications = observer(() => {
  const store = useStore();
  const { notificationViewModel } = store;
  const { user, userType } = useAuth();

  useEffect(() => {
    // Admin değilse ve kullanıcı varsa bildirimleri getir
    if (user && userType && store.isNotificationEnabledForUser(userType)) {
      try {
        notificationViewModel.fetchUserNotifications(user.uid);
      } catch (error) {
        console.error("Bildirimler alınamadı:", error);
      }
    }
  }, [notificationViewModel, user, userType, store]);

  // Admin kullanıcısıysa bildirim sayfasını gösterme
  if (userType === 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bildirimler</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Bilgi:</strong>
          <span className="block sm:inline"> Admin hesabında bildirimler özelliği devre dışı bırakılmıştır.</span>
        </div>
      </div>
    );
  }

  // Bildirimler boşsa
  if (!notificationViewModel.loading && !notificationViewModel.error && notificationViewModel.notifications.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bildirimlerim</h1>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Henüz bildiriminiz bulunmamaktadır.</span>
        </div>
      </div>
    );
  }

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
          <span className="block sm:inline"> Bildirim yüklenirken bir hata oluştu. Erişim izniniz olmayabilir.</span>
        </div>
      ) : (
        <NotificationList />
      )}
    </div>
  );
}); 