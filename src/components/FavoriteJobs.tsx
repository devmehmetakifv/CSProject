import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { JobCard } from './JobCard';

export const FavoriteJobs = observer(() => {
  const { favoriteViewModel, jobViewModel } = useStore();
  const { favorites } = favoriteViewModel;

  const handleRemoveFavorite = async (favoriteId: string) => {
    await favoriteViewModel.removeFromFavorites(favoriteId);
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Henüz favori iş ilanınız bulunmamaktadır.</p>
        <Link
          to="/jobs"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          İş İlanlarını Görüntüle
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {favorites.map((favorite) => {
        const job = jobViewModel.jobs.find((j) => j.id === favorite.jobId);
        if (!job) return null;

        return (
          <div key={favorite.id} className="relative">
            <JobCard job={job} />
            <button
              onClick={() => handleRemoveFavorite(favorite.id)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
              title="Favorilerden çıkar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}); 