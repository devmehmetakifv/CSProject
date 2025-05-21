import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreContext';
import { Job } from '../models/Job';

interface JobCardProps {
  job: Job;
}

export const JobCard = observer(({ job }: JobCardProps) => {
  const { favoriteViewModel, authViewModel } = useStore();
  const [isFavorited, setIsFavorited] = React.useState(false);

  React.useEffect(() => {
    if (authViewModel.user) {
      favoriteViewModel.isJobFavorited(authViewModel.user.id, job.id)
        .then(setIsFavorited);
    }
  }, [authViewModel.user, job.id]);

  const handleFavorite = async () => {
    if (!authViewModel.user) return;

    try {
      if (isFavorited) {
        const favorite = favoriteViewModel.favorites.find(f => f.jobId === job.id);
        if (favorite) {
          await favoriteViewModel.removeFromFavorites(favorite.id);
        }
      } else {
        await favoriteViewModel.addToFavorites({
          userId: authViewModel.user.id,
          jobId: job.id
        });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600 mt-1">{job.company}</p>
        </div>
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-full ${
            isFavorited ? 'text-red-500' : 'text-gray-400'
          } hover:bg-gray-100`}
        >
          <svg
            className="w-6 h-6"
            fill={isFavorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Konum</p>
          <p className="text-gray-900">{job.location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">İş Tipi</p>
          <p className="text-gray-900">{job.type}</p>
        </div>
      </div>

      {job.requirements && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Gereksinimler</p>
          <p className="text-gray-900">{job.requirements}</p>
        </div>
      )}

      {job.salary && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Maaş</p>
          <p className="text-gray-900">
            {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
          </p>
        </div>
      )}

      <div className="mt-6">
        <Link
          to={`/jobs/${job.id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Detayları Gör
        </Link>
      </div>
    </div>
  );
}); 