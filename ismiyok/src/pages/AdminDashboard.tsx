import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

interface User {
  id: string;
  email: string;
  userType: string;
  createdAt: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  employerId: string;
  createdAt: string;
  applicants: string[];
  status: 'active' | 'pending' | 'rejected';
}

export default function   () {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Kullanıcıları getir
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      // İş ilanlarını getir
      const jobsSnapshot = await getDocs(collection(db, 'jobs'));
      const jobsData = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];

      setUsers(usersData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Paneli</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
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

      {activeTab === 'users' ? (
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {user.email}
                        </p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="capitalize">{user.userType}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn-secondary text-red-600 hover:text-red-700"
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
      ) : (
        <div className="mt-8">
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
                          className="input-field"
                        >
                          <option value="active">Aktif</option>
                          <option value="pending">Onay Bekliyor</option>
                          <option value="rejected">Reddedildi</option>
                        </select>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="btn-secondary text-red-600 hover:text-red-700"
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
  );
} 