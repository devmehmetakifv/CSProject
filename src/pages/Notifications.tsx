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
    // Sadece employer kullanıcıları için bildirimleri getir
    if (user && userType === 'employer') {
      try {
        notificationViewModel.fetchUserNotifications(user.uid);
      } catch (error) {
        console.error("Bildirimler alınamadı:", error);
      }
    }
  }, [notificationViewModel, user, userType]);

  // Admin veya jobseeker kullanıcısıysa bildirim sayfasını gösterme
  if (userType === 'admin' || userType === 'jobseeker') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Bildirimler</h1>
          <p className="text-gray-600">Hesap bildirimlerinizi buradan takip edebilirsiniz</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                Bu hesap türünde bildirimler özelliği devre dışı bırakılmıştır.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bildirimler boşsa
  if (!notificationViewModel.loading && !notificationViewModel.error && notificationViewModel.notifications.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Bildirimlerim</h1>
          <p className="text-gray-600">Hesap bildirimlerinizi buradan takip edebilirsiniz</p>
        </div>
        
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz bildiriminiz yok</h3>
          <p className="text-gray-500">Yeni bildirimler aldığınızda burada görünecekler.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Bildirimlerim</h1>
        <p className="text-gray-600">Hesap bildirimlerinizi buradan takip edebilirsiniz</p>
      </div>
      
      {notificationViewModel.loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-gray-200 rounded-full"></div>
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : notificationViewModel.error ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                Bildirimler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <NotificationList />
      )}
    </div>
  );
}); 