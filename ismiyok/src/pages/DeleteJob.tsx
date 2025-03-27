import React, { useState, useEffect } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { useParams, useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  company: string;
  employerId: string;
}

export default function DeleteJob() {
  const { user } = useAuth();
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    if (!jobId) return;

    try {
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      if (jobDoc.exists()) {
        const data = jobDoc.data();
        setJob({
          id: jobDoc.id,
          title: data.title,
          company: data.company,
          employerId: data.employerId
        });
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!jobId || !user) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'jobs', jobId));
      navigate('/employer/dashboard');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('İş ilanı silinirken bir hata oluştu.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">İş ilanı bulunamadı</h3>
        <p className="mt-1 text-sm text-gray-500">
          Bu iş ilanı artık mevcut değil veya erişim izniniz yok.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            İş İlanını Sil
          </h2>
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                İş İlanını Silmek İstediğinize Emin Misiniz?
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Bu işlemi geri alamazsınız. Bu iş ilanı kalıcı olarak silinecektir.
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">İş İlanı Detayları</h4>
                  <dl className="mt-2 text-sm text-gray-500">
                    <div className="mt-1">
                      <dt className="inline">Başlık:</dt>
                      <dd className="inline ml-1">{job.title}</dd>
                    </div>
                    <div className="mt-1">
                      <dt className="inline">Şirket:</dt>
                      <dd className="inline ml-1">{job.company}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Siliniyor...' : 'Sil'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/employer/dashboard')}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
} 