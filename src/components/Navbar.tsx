import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { user, userType, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      
      // 2 saniye bekle ve ana sayfaya yönlendir
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate('/');
      }, 800);
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Loading ekranı göster
  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Çıkış yapılıyor...</p>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <Logo width={120} height={80} />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              
              <Link
                to="/categories"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Categories
              </Link>
              
              <Link
                to="/authors"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/authors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Authors
              </Link>
            </div>
          </div>

          {/* Sağ taraftaki butonlar */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {!user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  Giriş Yap / Üye Ol
                  <svg
                    className={`ml-2 h-5 w-5 transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Aday (İş mi Arıyorsun?)</p>
                        <p className="text-xs text-gray-500 mb-3">Burada seni bekleyen binlerce ilan var!</p>
                        <div className="flex space-x-2">
                          <Link
                            to="/login?type=jobseeker"
                            className="flex-1 text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Aday Girişi
                          </Link>
                          <Link
                            to="/register?type=jobseeker"
                            className="flex-1 text-center bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Üye Ol
                          </Link>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-600 mb-2">İşveren (İlan mı Vereceksiniz?)</p>
                        <p className="text-xs text-gray-500 mb-3">Pozisyonunuza en uygun aday burada!</p>
                        <div className="flex space-x-2">
                          <Link
                            to="/login?type=employer"
                            className="flex-1 text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            İşveren Girişi
                          </Link>
                          <Link
                            to="/register?type=employer"
                            className="flex-1 text-center bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Üye Ol
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {userType === 'employer' && (
                  <>
                    <Link
                      to="/employer/dashboard"
                      className={`text-sm font-medium ${
                        location.pathname === '/employer/dashboard'
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      İlanlarım
                    </Link>
                    <Link
                      to="/employer/jobs/new"
                      className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Yeni İlan Ekle
                    </Link>
                  </>
                )}
                {userType === 'jobseeker' && (
                  <>
                    <Link
                      to="/my-applications"
                      className={`text-sm font-medium ${
                        location.pathname === '/my-applications'
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Başvurularım
                    </Link>
                    <Link
                      to="/profile"
                      className={`text-sm font-medium ${
                        location.pathname === '/profile'
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Profilim
                    </Link>
                  </>
                )}
                {userType === 'admin' && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium ${
                      location.pathname === '/admin'
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Yönetici Paneli
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>

          {/* Mobil menü butonu */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Menüyü aç</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            >
              Home
            </Link>
            <Link
              to="/categories"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            >
              Categories
            </Link>
            <Link
              to="/authors"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            >
              Authors
            </Link>
            {!user ? (
              <>
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Aday (İş mi Arıyorsun?)</p>
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/login?type=jobseeker"
                        className="text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Aday Girişi
                      </Link>
                      <Link
                        to="/register?type=jobseeker"
                        className="text-center bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Üye Ol
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2">İşveren (İlan mı Vereceksiniz?)</p>
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/login?type=employer"
                        className="text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        İşveren Girişi
                      </Link>
                      <Link
                        to="/register?type=employer"
                        className="text-center bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Üye Ol
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {userType === 'employer' && (
                  <>
                    <Link
                      to="/employer/dashboard"
                      className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    >
                      İlanlarım
                    </Link>
                    <Link
                      to="/employer/jobs/new"
                      className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    >
                      Yeni İlan Ekle
                    </Link>
                  </>
                )}
                {userType === 'jobseeker' && (
                  <>
                    <Link
                      to="/my-applications"
                      className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    >
                      Başvurularım
                    </Link>
                    <Link
                      to="/profile"
                      className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    >
                      Profilim
                    </Link>
                  </>
                )}
                {userType === 'admin' && (
                  <Link
                    to="/admin"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  >
                    Yönetici Paneli
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium text-red-700 hover:bg-gray-50 hover:border-gray-300"
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 