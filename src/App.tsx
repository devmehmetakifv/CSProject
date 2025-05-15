import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import NewJob from './pages/NewJob';
import EditJob from './pages/EditJob';
import DeleteJob from './pages/DeleteJob';
import EmployerDashboard from './pages/EmployerDashboard';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import Applicants from './pages/Applicants';
import Logo from './components/Logo';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: ('jobseeker' | 'employer' | 'admin')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedUserTypes }) => {
  const { user, userType } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userType!)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

// Çerez Uyarı Bildirimi Bileşeni
const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Çerez onayı verilmemişse göster
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <p>Bu site, size daha iyi hizmet verebilmek için çerezleri kullanmaktadır. Sitemizi kullanarak çerezleri kullanmamızı kabul etmiş olursunuz.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={acceptCookies}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
};

// Ana Layout bileşeni - sayfa düzenini ve navbar'ı yönetir
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-white">
      {!isAdminPage && <Navbar />}
      <div className="max-w-full mx-auto">
        {children}
      </div>
      <footer className={`bg-gray-100 border-t border-gray-200 py-6 mt-12 ${isAdminPage ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <Logo width={100} height={60} />
          <span className="text-gray-500 text-sm mt-2">© 2024 Sana mı iş yok. Tüm hakları saklıdır.</span>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/admin" element={<AdminLogin />} />
            
            {/* İş Arayan Rotaları */}
            <Route
              path="/profile"
              element={
                <PrivateRoute allowedUserTypes={['jobseeker']}>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <PrivateRoute allowedUserTypes={['jobseeker']}>
                  <MyApplications />
                </PrivateRoute>
              }
            />

            {/* İşveren Rotaları */}
            <Route
              path="/employer/dashboard"
              element={
                <PrivateRoute allowedUserTypes={['employer']}>
                  <EmployerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer/jobs/new"
              element={
                <PrivateRoute allowedUserTypes={['employer']}>
                  <NewJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer/jobs/:id/edit"
              element={
                <PrivateRoute allowedUserTypes={['employer']}>
                  <EditJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer/jobs/:jobId/delete"
              element={
                <PrivateRoute allowedUserTypes={['employer']}>
                  <DeleteJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer/jobs/:jobId/applicants"
              element={
                <PrivateRoute allowedUserTypes={['employer']}>
                  <Applicants />
                </PrivateRoute>
              }
            />

            {/* Admin Rotaları */}
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
};

export default App; 