import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  createdAt: string;
  applicants: string[];
}

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return;

    try {
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('employerId', '==', user.uid)
      );
      const querySnapshot = await getDocs(jobsQuery);
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Bu ilanı silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('İlan silinirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İşveren Paneli</h1>
        <Link to="/employer/jobs/new" className="btn-primary">
          Yeni İlan Ekle
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">İlanlarım</h2>
        </div>

        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-blue-600 truncate">
                      {job.title}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{job.company}</span>
                      <span className="mx-2">•</span>
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span>{job.type}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>{job.salary}</span>
                      <span className="mx-2">•</span>
                      <span>{job.applicants.length} başvuru</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-4">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn-secondary"
                    >
                      Görüntüle
                    </Link>
                    <Link
                      to={`/employer/jobs/${job.id}/edit`}
                      className="btn-secondary"
                    >
                      Düzenle
                    </Link>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(job.id);
                      }}
                      className="btn-secondary text-red-600 hover:text-red-700"
                    >
                      Sil
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz ilan yok</h3>
          <p className="mt-1 text-sm text-gray-500">
            Yeni bir iş ilanı oluşturarak başlayın.
          </p>
          <div className="mt-6">
            <Link to="/employer/jobs/new" className="btn-primary">
              Yeni İlan Ekle
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 