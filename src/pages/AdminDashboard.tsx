import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Veri tipleri
interface User {
  id: string;
  email: string;
  userType: 'jobseeker' | 'employer' | 'admin';
  createdAt: string;
  name?: string;
  company?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  applicants: string[];
  createdAt: string;
  status: 'active' | 'pending' | 'rejected';
}

// Ana dashboard bileşeni
export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'jobs'>('dashboard');
  const [filterType, setFilterType] = useState<'all' | 'jobseeker' | 'employer'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  // Admin giriş kontrolü
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/admin');
      return;
    }

    // Firebase authentication durumunu kontrol et
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Kullanıcı oturum açmamışsa admin sayfasına yönlendir
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin');
      } else {
        try {
          // Users koleksiyonundan kullanıcı verisini al
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists() || userDoc.data().userType !== 'admin') {
            // Kullanıcı admin değilse çıkış yap
            localStorage.removeItem('isAdminLoggedIn');
            await auth.signOut();
            navigate('/admin');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          // Hata durumunda da çıkış yap
          localStorage.removeItem('isAdminLoggedIn');
          await auth.signOut();
          navigate('/admin');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Veri çekme
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Kullanıcıları getir
      let usersData: User[] = [];
      let jobsData: Job[] = [];
      
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
      } catch (error) {
        console.error('Error fetching users:', error);
        // Örnek veriler yerine boş array
        usersData = [];
      }
      
      // İş ilanlarını getir
      try {
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        jobsData = jobsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Job[];
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Örnek veriler yerine boş array
        jobsData = [];
      }
      
      setUsers(usersData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Veritabanından veriler yüklenirken bir hata oluştu. Lütfen erişim izinlerinizi kontrol edin.');
      
      // Boş diziler ata
      setUsers([]);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı silme
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Kullanıcı silinirken bir hata oluştu.');
    }
  };

  // İş ilanı silme
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Bu ilanı silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('İlan silinirken bir hata oluştu.');
    }
  };

  // İş ilanı durumunu güncelleme
  const handleUpdateJobStatus = async (jobId: string, status: Job['status']) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), { status });
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status } : job
      ));
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('İlan durumu güncellenirken bir hata oluştu.');
    }
  };

  // Çıkış yap
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('isAdminLoggedIn');
      navigate('/admin');
    }
  };

  // Filtreleme işlemleri
  const filteredUsers = users.filter(user => {
    if (filterType !== 'all' && user.userType !== filterType) return false;
    if (searchTerm && !user.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Yükleme ekranı
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex space-x-4">
              <Link 
                to="/"
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                Ana Menüye Dön
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab menü */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Kullanıcılar
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              İş İlanları
            </button>
          </nav>
        </div>

        {/* Dashboard içeriği */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Genel Bakış</h2>
            
            {/* İstatistik kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Toplam Kullanıcı</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{users.length}</dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className="font-medium text-blue-600">
                      {users.filter(u => u.userType === 'jobseeker').length} İş Arayan, 
                      {' '}{users.filter(u => u.userType === 'employer').length} İşveren
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Toplam İlan</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{jobs.length}</dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className="font-medium text-blue-600">
                      {jobs.filter(j => j.status === 'active').length} Aktif, 
                      {' '}{jobs.filter(j => j.status === 'pending').length} Beklemede
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Başvurular</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {jobs.reduce((total, job) => total + (job.applicants?.length || 0), 0)}
                    </dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className="font-medium text-blue-600">
                      Toplam başvuru sayısı
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Ortalama Başvuru</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {jobs.length ? (jobs.reduce((total, job) => total + (job.applicants?.length || 0), 0) / jobs.length).toFixed(1) : 0}
                    </dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className="font-medium text-blue-600">İlan başına ortalama başvuru</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Son aktiviteler */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Son Eklenen İlanlar</h3>
              </div>
              <div className="border-t border-gray-200 divide-y divide-gray-200">
                {jobs.slice(0, 5).map(job => (
                  <div key={job.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{job.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {job.status === 'active' ? 'Aktif' : job.status === 'pending' ? 'Beklemede' : 'Reddedildi'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {job.company}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Kullanıcılar sekmesi */}
        {activeTab === 'users' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Kullanıcı Yönetimi</h2>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Kullanıcı ara..."
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tüm Kullanıcılar</option>
                  <option value="jobseeker">İş Arayanlar</option>
                  <option value="employer">İşverenler</option>
                </select>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li key={user.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {user.email}
                          </p>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs">
                              {user.userType === 'jobseeker' ? 'İş Arayan' : 
                               user.userType === 'employer' ? 'İşveren' : 'Admin'}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* İş İlanları sekmesi */}
        {activeTab === 'jobs' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İş İlanları</h2>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {job.title}
                          </p>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>{job.company}</span>
                            <span className="mx-2">•</span>
                            <span>{job.applicants.length} başvuru</span>
                            <span className="mx-2">•</span>
                            <span>
                              {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex space-x-4">
                          <select
                            value={job.status}
                            onChange={(e) => handleUpdateJobStatus(job.id, e.target.value as Job['status'])}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="active">Aktif</option>
                            <option value="pending">Onay Bekliyor</option>
                            <option value="rejected">Reddedildi</option>
                          </select>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 