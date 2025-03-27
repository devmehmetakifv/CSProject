import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: string;
  createdAt: string;
  employerId: string;
  applicants: string[];
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    if (!id) return;

    try {
      const jobDoc = await getDoc(doc(db, 'jobs', id));
      if (jobDoc.exists()) {
        setJob({ id: jobDoc.id, ...jobDoc.data() } as Job);
      } else {
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job || !user) return;

    try {
      setApplying(true);
      await updateDoc(doc(db, 'jobs', job.id), {
        applicants: arrayUnion(user.uid)
      });
      alert('Başvurunuz başarıyla gönderildi!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Başvuru sırasında bir hata oluştu.');
    } finally {
      setApplying(false);
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
    return null;
  }

  const hasApplied = user && job.applicants.includes(user.uid);
  const isEmployer = user && user.uid === job.employerId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="mt-1 text-xl text-gray-600">{job.company}</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <span>{job.type}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-blue-600">{job.salary}</p>
              <p className="text-sm text-gray-500">
                {new Date(job.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">İş Açıklaması</h2>
          <div className="mt-4 prose prose-blue max-w-none">
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Gereksinimler</h2>
          <ul className="mt-4 space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-blue-500">•</span>
                <span className="ml-3 text-gray-600">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {user ? (
            isEmployer ? (
              <div className="text-center text-gray-600">
                Bu ilanı siz oluşturdunuz.
              </div>
            ) : hasApplied ? (
              <div className="text-center text-green-600">
                Bu ilana başvurdunuz.
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary w-full"
              >
                {applying ? 'Başvuruluyor...' : 'Başvur'}
              </button>
            )
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Başvuru yapmak için giriş yapmalısınız.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
              >
                Giriş Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 