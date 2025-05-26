import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { NotificationService } from '../services/NotificationService';

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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const notificationService = new NotificationService();

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

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

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      setProfileLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job || !user) return;

    try {
      setApplying(true);
      console.log('User:', user); // Debug
      console.log('Job ID:', job.id); // Debug
      console.log('User UID:', user.uid); // Debug
      
      await updateDoc(doc(db, 'jobs', job.id), {
        applicants: arrayUnion(user.uid)
      });

      // İşverene bildirim gönder
      try {
        await notificationService.createNotification({
          userId: job.employerId,
          title: 'Yeni Başvuru!',
          message: `"${job.title}" ilanınıza yeni bir başvuru geldi.`,
          type: 'application',
          read: false,
          data: {
            jobId: job.id,
            applicantId: user.uid
          }
        });
      } catch (notificationError) {
        console.error('Bildirim gönderilirken hata:', notificationError);
      }

      // Dialog göster
      setShowSuccessDialog(true);
      
      // Başvurudan sonra job state'i güncelle
      setJob({
        ...job,
        applicants: [...job.applicants, user.uid]
      });
      
      // 5 saniye sonra dialog'u otomatik kapat
      setTimeout(() => {
        setShowSuccessDialog(false);
      }, 5000);
    } catch (error) {
      console.error('Error applying for job:', error);
      setErrorMessage('Başvuru sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setShowErrorDialog(true);
      
      // 5 saniye sonra hata dialog'unu otomatik kapat
      setTimeout(() => {
        setShowErrorDialog(false);
      }, 5000);
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
  const hasRequiredInfo = userProfile && userProfile.name && userProfile.phone;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Başarı Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg transform transition-all">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Başvuru Başarılı</h3>
            <p className="text-sm text-gray-500 text-center">Başvurunuz başarıyla gönderildi!</p>
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate('/jobs'); // İlanlar sayfasına yönlendir
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hata Dialog */}
      {showErrorDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg transform transition-all">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Başvuru Hatası</h3>
            <p className="text-sm text-gray-500 text-center">{errorMessage}</p>
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => {
                  setShowErrorDialog(false);
                  navigate('/jobs'); // İlanlar sayfasına yönlendir
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

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
            ) : !hasRequiredInfo ? (
              <div className="text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="text-left">
                      <h3 className="text-sm font-medium text-yellow-800">Profil Bilgileri Eksik</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Başvuru yapmak için ad soyad ve telefon bilgilerinizi doldurmanız gerekiyor.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Profilini Güncelle
                </button>
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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