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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job':
        return (
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
          </svg>
        );
      case 'application':
        return (
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz bildiriminiz yok</h3>
        <p className="text-gray-500">Yeni bildirimler aldığınızda burada görünecekler.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`relative bg-white border rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${
            !notification.read 
              ? 'border-l-4 border-l-gray-900 bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                
                {!notification.read && (
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-gray-600 hover:text-gray-900 transition-colors duration-200 underline"
                    >
                      Okundu olarak işaretle
                    </button>
                  </div>
                )}
              </div>
              
              {!notification.read && (
                <div className="absolute top-4 right-4">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}); 