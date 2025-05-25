import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../hooks/useAuth';
import { FavoriteJobs } from '../components/FavoriteJobs';
import { Link } from 'react-router-dom';

export const Favorites = observer(() => {
  const store = useStore();
  const { favoriteViewModel } = store;
  const { user, userType } = useAuth();

  useEffect(() => {
    if (user) {
      favoriteViewModel.fetchUserFavorites(user.uid);
    }
  }, [favoriteViewModel, user]);

  // Admin kullanıcısıysa favori sayfasını gösterme
  if (userType === 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Favori İş İlanlarım</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Bilgi:</strong>
          <span className="block sm:inline"> Admin hesabında favoriler özelliği devre dışı bırakılmıştır.</span>
        </div>
      </div>
    );
  }

  // Favoriler boşsa
  if (!favoriteViewModel.loading && !favoriteViewModel.error && favoriteViewModel.favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Favori İş İlanlarım</h1>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Henüz favoriniz bulunmamaktadır.</span>
        </div>
        <div className="text-center mt-4">
          <Link
            to="/jobs"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            İş İlanlarını Görüntüle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Favori İş İlanlarım</h1>
      {favoriteViewModel.loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : favoriteViewModel.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata!</strong>
          <span className="block sm:inline"> Favoriler yüklenirken bir hata oluştu. Erişim izniniz olmayabilir.</span>
        </div>
      ) : (
        <FavoriteJobs />
      )}
    </div>
  );
}); 