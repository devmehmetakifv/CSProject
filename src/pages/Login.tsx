import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'jobseeker';
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('E-posta ve şifre zorunlu.');
      return;
    }
    
    try {
      setIsLoggingIn(true);
      // Firebase Authentication ile giriş denemesi yapılır
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Kullanıcı türünü Firestore'dan kontrol et
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        await auth.signOut();
        setError('Böyle bir e-posta adresi bulunamadı.');
        setIsLoggingIn(false);
        return;
      }
      
      const userData = userDoc.data();
      const userTypeFromDb = userData?.userType;
      
      // Kullanıcı tipini kontrol et
      if (userType === 'jobseeker' && userTypeFromDb !== 'jobseeker') {
        await auth.signOut();
        setError('Böyle bir e-posta adresi bulunamadı.');
        setIsLoggingIn(false);
        return;
      }
      
      if (userType === 'employer' && userTypeFromDb !== 'employer') {
        await auth.signOut();
        setError('Böyle bir e-posta adresi bulunamadı.');
        setIsLoggingIn(false);
        return;
      }
      
      // Başarılı giriş
      await login(email, password);
      
      // Yarım saniye loading göster
      setTimeout(() => {
        setIsLoggingIn(false);
        navigate('/'); // Ana sayfaya yönlendir
      }, 100);
      
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      setIsLoggingIn(false);
    }
  };

  // Loading ekranı göster
  if (isLoggingIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Giriş yapılıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${userType === 'employer' ? 'bg-gradient-to-br from-yellow-50 to-white' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
      {/* Sol taraf - Bilgilendirme Alanı */}
      <div className={`hidden lg:flex lg:w-1/2 p-12 relative ${userType === 'employer' ? 'bg-gradient-to-b from-yellow-100 to-white' : 'bg-gradient-to-b from-blue-100 to-white'}`}>
        <div className="max-w-lg mx-auto flex flex-col justify-center h-full">
          {userType === 'employer' ? (
            <>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-extrabold text-yellow-700 mb-2">İşveren Girişi</h2>
                <p className="text-lg text-yellow-800">Pozisyonunuza en uygun adayı bulmak için giriş yapın.</p>
              </div>
              <ul className="space-y-8">
                <li className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a4 4 0 00-8 0v2m8 0v2a4 4 0 01-8 0V7m8 0v2a4 4 0 01-8 0V9" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-900">Aday Havuzu</h3>
                    <p className="mt-1 text-yellow-700">Binlerce aday arasından filtreleme yapın.</p>
                  </div>
                </li>
                <li className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 00-4-4H5a4 4 0 00-4 4v2a4 4 0 004 4h2a4 4 0 004-4z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-900">Kolay İlan Yönetimi</h3>
                    <p className="mt-1 text-yellow-700">İlanlarınızı kolayca oluşturun ve yönetin.</p>
                  </div>
                </li>
                <li className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-900">Hızlı Başvuru Takibi</h3>
                    <p className="mt-1 text-yellow-700">Başvuruları anlık olarak takip edin.</p>
                  </div>
                </li>
              </ul>
            </>
          ) : (
            <>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-extrabold text-blue-700 mb-2">Aday Girişi</h2>
                <p className="text-lg text-blue-800">Hayalindeki işe ulaşmak için giriş yap.</p>
              </div>
              <ul className="space-y-8">
                <li className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">Seni keşfedecek binlerce işveren</h3>
                    <p className="mt-1 text-blue-700">Hayalindeki iş fırsatlarını yakala</p>
                  </div>
                </li>
                <li className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">Her gün binlerce yeni ilan</h3>
                    <p className="mt-1 text-blue-700">Güncel iş ilanlarına hemen başvur</p>
                  </div>
                </li>
                <li className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">Binlerce pozisyonun maaş bilgisi</h3>
                    <p className="mt-1 text-blue-700">Kariyerini en iyi şekilde planla</p>
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Sağ taraf - Login Formu */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold ${userType === 'employer' ? 'text-yellow-700' : 'text-blue-700'}`}>{userType === 'employer' ? 'İşveren Girişi' : 'Aday Girişi'}</h2>
            <p className={`mt-2 text-sm ${userType === 'employer' ? 'text-yellow-800' : 'text-blue-800'}`}>
              {userType === 'employer' ? 'İşveren hesabınıza giriş yapın' : 'Aday hesabınıza giriş yapın'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-md bg-red-50 p-2 text-red-700 text-sm text-center">{error}</div>}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${userType === 'employer' ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500' : 'border-blue-400 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm mb-2`}
                placeholder="Kullanıcı adı veya E-posta"
              />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${userType === 'employer' ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500' : 'border-blue-400 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                placeholder="Şifre"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${userType === 'employer' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {isLoggingIn ? 'Giriş Yapılıyor...' : 'Devam et'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">ya da</p>
              <div className="mt-4 space-y-3"></div>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            {userType === 'employer' ? (
              <Link
                to="/login?type=jobseeker"
                className="font-medium text-yellow-700 hover:text-yellow-600"
              >
                Aday mısın?
              </Link>
            ) : (
              <Link
                to="/login?type=employer"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                İşveren misin?
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;