import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'jobseeker';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email);
      navigate(userType === 'employer' ? '/employer/dashboard' : '/jobs');
    } catch (err) {
      // Hata yönetimi burada yapılacak
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sol taraf - Bilgilendirme Alanı */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-blue-50 to-white p-12 relative">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-16">
            <img
              src="/logo-blue.png"
              alt="İşBul Logo"
              className="h-12 mx-auto mb-8"
            />
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Seni keşfedecek binlerce işveren</h3>
                <p className="mt-1 text-gray-500">Hayalindeki iş fırsatlarını yakala</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Her gün binlerce yeni ilan</h3>
                <p className="mt-1 text-gray-500">Güncel iş ilanlarına hemen başvur</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Binlerce pozisyonun maaş bilgisi</h3>
                <p className="mt-1 text-gray-500">Kariyerini en iyi şekilde planla</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dekoratif arka plan elementleri */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EBF5FF" fillOpacity="0.4" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Sağ taraf - Login Formu */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">İşBul'a hoş geldin!</h2>
            <p className="mt-2 text-sm text-gray-600">
              {userType === 'employer' ? 'İşveren hesabınıza giriş yapın' : 'Hesabınıza giriş yapın'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Kullanıcı adı veya E-posta"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Devam et
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">ya da</p>
              <div className="mt-4 space-y-3">
             

             
              </div>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            <Link
              to={`/register?type=${userType}`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              İşveren misin?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;