import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const AdminNavbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-blue-600 border-b border-blue-700">
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
                to="/admin/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/admin/dashboard')
                    ? 'border-white text-white' 
                    : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                }`}
              >
                İlan Yönetimi
              </Link>
              
              <Link
                to="/admin/users"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/admin/users')
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                }`}
              >
                Kullanıcı Yönetimi
              </Link>
            </div>
          </div>

          {/* Sağ taraftaki butonlar */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/"
              className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-4 py-2 rounded-md text-sm font-medium border border-blue-200"
            >
              Ana Siteye Dön
            </Link>
          </div>

          {/* Mobil menü butonu */}
          <div className="sm:hidden flex items-center">
            <div className="flex space-x-2">
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/dashboard')
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                İlanlar
              </Link>
              <Link
                to="/admin/users"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/users')
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                Kullanıcılar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar; 