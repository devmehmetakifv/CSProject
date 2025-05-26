import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { NotificationService } from '../services/NotificationService';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  createdAt: string;
  employerId: string;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean; // Aktiflik durumu
  applicants: string[];
  cityId?: number;
  districtName?: string;
  workPreference?: string;
  sector?: string;
  position?: string;
  experienceLevel?: string;
}

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<{
    type: 'approve' | 'reject' | 'pending' | 'delete';
    jobId: string;
    jobTitle: string;
    newStatus?: 'pending' | 'approved' | 'rejected';
  } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const { user } = useAuth();
  const [notificationService] = useState(() => new NotificationService());

  // Admin kontrolü - sadece belirli email adresleri admin olabilir
  const isAdmin = user?.email === 'admin@sanaismikyok.com' || user?.email === 'fuurkandemiir@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      fetchJobs();
    }
  }, [isAdmin]);

  const fetchJobs = async () => {
    try {
      const jobsQuery = query(collection(db, 'jobs'));
      const querySnapshot = await getDocs(jobsQuery);
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isActive: doc.data().isActive !== undefined ? doc.data().isActive : true // Varsayılan olarak aktif
      })) as Job[];
      
      // Tarihe göre sırala (en yeni önce)
      jobsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (type: 'approve' | 'reject' | 'pending' | 'delete', jobId: string, jobTitle: string, newStatus?: 'pending' | 'approved' | 'rejected') => {
    setDialogAction({ type, jobId, jobTitle, newStatus });
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setDialogAction(null);
  };

  const confirmAction = async () => {
    if (!dialogAction) return;

    setActionLoading(dialogAction.jobId);
    try {
      if (dialogAction.type === 'delete') {
        await deleteDoc(doc(db, 'jobs', dialogAction.jobId));
        setJobs(jobs.filter(job => job.id !== dialogAction.jobId));
      } else {
        const job = jobs.find(j => j.id === dialogAction.jobId);
        await updateDoc(doc(db, 'jobs', dialogAction.jobId), { status: dialogAction.newStatus });
        setJobs(jobs.map(job => 
          job.id === dialogAction.jobId ? { ...job, status: dialogAction.newStatus! } : job
        ));

        // İşverene bildirim gönder
        if (job && (dialogAction.newStatus === 'approved' || dialogAction.newStatus === 'rejected')) {
          try {
            const title = dialogAction.newStatus === 'approved' 
              ? 'İş İlanınız Onaylandı!' 
              : 'İş İlanınız Reddedildi';
            
            const message = dialogAction.newStatus === 'approved'
              ? `"${job.title}" ilanınız admin tarafından onaylandı ve yayınlandı.`
              : `"${job.title}" ilanınız admin tarafından reddedildi.`;

            await notificationService.createNotification({
              userId: job.employerId,
              title,
              message,
              type: 'job',
              read: false,
              data: {
                jobId: job.id
              }
            });
          } catch (notificationError) {
            console.error('Bildirim gönderilirken hata:', notificationError);
          }
        }
      }
      closeDialog();
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (jobId: string, status: 'pending' | 'approved' | 'rejected') => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const actionType = status === 'approved' ? 'approve' : status === 'rejected' ? 'reject' : 'pending';
      openDialog(actionType as any, jobId, job.title, status);
    }
  };

  const handleDelete = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setJobToDelete(job);
      setShowDeleteDialog(true);
    }
  };

  // Admin değilse ana sayfaya yönlendir
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filtreleme
  const filteredJobs = jobs.filter(job => {
    // Durum filtresi
    if (filterStatus !== 'all' && job.status !== filterStatus) return false;
    
    // Aktiflik filtresi
    if (filterActive === 'active' && !job.isActive) return false;
    if (filterActive === 'inactive' && job.isActive) return false;
    
    // Arama filtresi
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !job.company.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  // İstatistikler
  const stats = {
    total: jobs.length,
    pending: jobs.filter(job => job.status === 'pending').length,
    approved: jobs.filter(job => job.status === 'approved').length,
    rejected: jobs.filter(job => job.status === 'rejected').length,
    active: jobs.filter(job => job.isActive).length,
    inactive: jobs.filter(job => !job.isActive).length,
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">İş ilanlarını yönetin ve durumlarını güncelleyin</p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Toplam İlan</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">Bekleyen</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-500">Onaylı</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-500">Reddedilen</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          <div className="text-sm text-gray-500">Aktif</div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İş başlığı veya şirket ara..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Onay Durumu</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tümü</option>
              <option value="pending">Bekleyen</option>
              <option value="approved">Onaylı</option>
              <option value="rejected">Reddedilen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aktiflik Durumu</label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tümü</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterActive('all');
              }}
              className="w-full px-4 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* İş İlanları Listesi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            İş İlanları ({filteredJobs.length})
          </h2>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">İlan bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Seçilen filtrelere uygun ilan bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'approved' ? 'bg-green-100 text-green-800' :
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {job.status === 'approved' ? 'Onaylı' :
                         job.status === 'pending' ? 'Bekleyen' :
                         'Reddedilen'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Şirket:</strong> {job.company}</p>
                      <p><strong>Konum:</strong> {job.location}</p>
                      <p><strong>Maaş:</strong> {job.salary}</p>
                      <p><strong>Başvuru Sayısı:</strong> {Array.isArray(job.applicants) ? job.applicants.length : 0}</p>
                      <p><strong>Oluşturulma:</strong> {new Date(job.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    {/* Onay Durumu Butonları */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(job.id, 'approved')}
                        disabled={actionLoading === job.id || job.status === 'approved'}
                        className={`px-3 py-1 text-xs rounded-md ${
                          job.status === 'approved' 
                            ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        } disabled:opacity-50`}
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(job.id, 'rejected')}
                        disabled={actionLoading === job.id || job.status === 'rejected'}
                        className={`px-3 py-1 text-xs rounded-md ${
                          job.status === 'rejected' 
                            ? 'bg-red-100 text-red-800 cursor-not-allowed' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        } disabled:opacity-50`}
                      >
                        Reddet
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(job.id, 'pending')}
                        disabled={actionLoading === job.id || job.status === 'pending'}
                        className={`px-3 py-1 text-xs rounded-md ${
                          job.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed' 
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        } disabled:opacity-50`}
                      >
                        Beklet
                      </button>
                    </div>
                    

                    
                    {/* Silme Butonu */}
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={actionLoading === job.id}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                      title="İlanı Sil"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    
                    {actionLoading === job.id && (
                      <div className="text-xs text-gray-500">İşleniyor...</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog Modal */}
      {showDialog && dialogAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {dialogAction.type === 'approve' && 'İlanı Onayla'}
              {dialogAction.type === 'reject' && 'İlanı Reddet'}
              {dialogAction.type === 'pending' && 'İlanı Beklemede Tut'}
              {dialogAction.type === 'delete' && 'İlanı Sil'}
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              <strong>"{dialogAction.jobTitle}"</strong> ilanını{' '}
              {dialogAction.type === 'approve' && 'onaylamak'}
              {dialogAction.type === 'reject' && 'reddetmek'}
              {dialogAction.type === 'pending' && 'beklemede tutmak'}
              {dialogAction.type === 'delete' && 'kalıcı olarak silmek'}
              {' '}istediğinizden emin misiniz?
            </p>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={closeDialog}
                disabled={actionLoading === dialogAction.jobId}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading === dialogAction.jobId}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 ${
                  dialogAction.type === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  dialogAction.type === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  dialogAction.type === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoading === dialogAction.jobId ? 'İşleniyor...' : 
                 dialogAction.type === 'approve' ? 'Onayla' :
                 dialogAction.type === 'reject' ? 'Reddet' :
                 dialogAction.type === 'pending' ? 'Beklet' :
                 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && jobToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              İlanı Sil
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              <strong>"{jobToDelete.title}"</strong> ilanını kalıcı olarak silmek istediğinizden emin misiniz?
            </p>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  handleDelete(jobToDelete.id);
                  setShowDeleteDialog(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
} 