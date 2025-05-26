import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

interface User {
  id: string;
  email: string;
  userType: 'jobseeker' | 'employer' | 'admin';
  createdAt: string;
  name?: string;
  company?: string;
  phone?: string;
  bio?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'jobseeker' | 'employer'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // Admin kontrolü - sadece belirli email adresleri admin olabilir
  const isAdmin = user?.email === 'admin@sanaismikyok.com' || user?.email === 'fuurkandemiir@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const querySnapshot = await getDocs(usersQuery);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      // Admin kullanıcıları hariç tut ve tarihe göre sırala (en yeni önce)
      const nonAdminUsers = usersData.filter(u => u.userType !== 'admin');
      nonAdminUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUsers(nonAdminUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz?')) return;
    
    setActionLoading(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      alert('Kullanıcı başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Kullanıcı silinirken bir hata oluştu.');
    } finally {
      setActionLoading(null);
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
  const filteredUsers = users.filter(user => {
    // Kullanıcı türü filtresi
    if (filterType !== 'all' && user.userType !== filterType) return false;
    
    // Arama filtresi
    if (searchTerm && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !(user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    
    return true;
  });

  // İstatistikler
  const stats = {
    total: users.length,
    jobseekers: users.filter(user => user.userType === 'jobseeker').length,
    employers: users.filter(user => user.userType === 'employer').length,
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
        <p className="mt-2 text-gray-600">Tüm kullanıcıları görüntüleyin ve yönetin</p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Toplam Kullanıcı</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.jobseekers}</div>
          <div className="text-sm text-gray-500">İş Arayan</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.employers}</div>
          <div className="text-sm text-gray-500">İşveren</div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Email, isim veya şirket ara..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Türü</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tümü</option>
              <option value="jobseeker">İş Arayan</option>
              <option value="employer">İşveren</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Kullanıcılar ({filteredUsers.length})
          </h2>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Kullanıcı bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Seçilen filtrelere uygun kullanıcı bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {user.name || user.email}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.userType === 'jobseeker' ? 'bg-blue-100 text-blue-800' :
                        user.userType === 'employer' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.userType === 'jobseeker' ? 'İş Arayan' :
                         user.userType === 'employer' ? 'İşveren' :
                         'Admin'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Email:</strong> {user.email}</p>
                      {user.name && <p><strong>İsim:</strong> {user.name}</p>}
                      {user.company && <p><strong>Şirket:</strong> {user.company}</p>}
                      {user.phone && <p><strong>Telefon:</strong> {user.phone}</p>}
                      {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                      <p><strong>Kayıt Tarihi:</strong> {new Date(user.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    {/* Silme Butonu */}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={actionLoading === user.id}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                      title={actionLoading === user.id ? 'Siliniyor...' : 'Kullanıcıyı Sil'}
                    >
                      {actionLoading === user.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
} 