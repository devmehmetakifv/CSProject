import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { getCities, getDistrictsByCityId } from '../services/locationService';
import { 
  JOB_TYPES,
  WORK_PREFERENCES,
  EXPERIENCE_LEVELS,
  POSITIONS,
  SECTORS,
  getNameById
} from '../services/jobConstants';

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
  isActive?: boolean;
  cityId?: number;
  districtName?: string;
  workPreference?: string;
  sector?: string;
  position?: string;
  experienceLevel?: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtreleme durumları
  const [selectedType, setSelectedType] = useState('');
  const [selectedCity, setSelectedCity] = useState<number | ''>('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWorkPreference, setSelectedWorkPreference] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('');
  
  // İlçe listesi için durum
  const [districts, setDistricts] = useState<string[]>([]);
  
  // API'den şehirler
  const cities = getCities();
  
  const { user } = useAuth();

  // Şehir değiştiğinde ilçeleri güncelle
  useEffect(() => {
    if (selectedCity) {
      const cityDistricts = getDistrictsByCityId(Number(selectedCity));
      setDistricts(cityDistricts);
      setSelectedDistrict(''); // Şehir değiştiğinde ilçe seçimini temizle
    } else {
      setDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Sadece onaylanmış iş ilanlarını getir
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('status', '==', 'approved')
      );
      const querySnapshot = await getDocs(jobsQuery);
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isActive: doc.data().isActive !== undefined ? doc.data().isActive : true
      })) as Job[];
      
      // Sadece aktif ilanları göster
      const activeJobs = jobsData.filter(job => job.isActive);
      setJobs(activeJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tüm filtrelere göre iş ilanlarını filtrele
  const filteredJobs = jobs.filter(job => {
    // Arama terimine göre filtrele
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // İş türüne göre filtrele
    const matchesType = !selectedType || job.type === selectedType;
    
    // Şehre göre filtrele
    const matchesCity = !selectedCity || job.cityId === Number(selectedCity);
    
    // İlçeye göre filtrele
    const matchesDistrict = !selectedDistrict || job.districtName === selectedDistrict;
    
    // Çalışma şekline göre filtrele (uzaktan/iş yerinde/hibrit)
    const matchesWorkPreference = !selectedWorkPreference || job.workPreference === selectedWorkPreference;
    
    // Sektöre göre filtrele
    const matchesSector = !selectedSector || job.sector === selectedSector;
    
    // Pozisyona göre filtrele
    const matchesPosition = !selectedPosition || job.position === selectedPosition;
    
    // Deneyim seviyesine göre filtrele
    const matchesExperienceLevel = !selectedExperienceLevel || job.experienceLevel === selectedExperienceLevel;
    
    // Tüm filtrelerin eşleşmesi gerekiyor
    return matchesSearch && matchesType && matchesCity && matchesDistrict && 
           matchesWorkPreference && matchesSector && matchesPosition && matchesExperienceLevel;
  });

  // Filtreleri sıfırla
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedWorkPreference('');
    setSelectedSector('');
    setSelectedPosition('');
    setSelectedExperienceLevel('');
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
      {/* Üstte arama barı */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pozisyon veya şirket ara"
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          >
            <option value="">Tüm Şehirler</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İş İlanları</h1>
        {user?.userType === 'employer' && (
          <Link to="/employer/jobs/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Yeni İlan Ekle
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtreler */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-lg shadow-md sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Temizle
              </button>
            </div>
            
            {/* Arama */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arama
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İş başlığı, şirket veya açıklama"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Şehir Seçimi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şehir
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tüm Şehirler</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* İlçe Seçimi - Sadece şehir seçildiğinde göster */}
            {selectedCity && districts.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İlçe
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Tüm İlçeler</option>
                  {districts.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* İş Türü Seçimi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İş Türü
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                {JOB_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Çalışma Tercihi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Çalışma Şekli
              </label>
              <select
                value={selectedWorkPreference}
                onChange={(e) => setSelectedWorkPreference(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                {WORK_PREFERENCES.map(pref => (
                  <option key={pref.id} value={pref.id}>
                    {pref.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sektör */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sektör
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tüm Sektörler</option>
                {SECTORS.map(sector => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Pozisyon */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pozisyon
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tüm Pozisyonlar</option>
                {POSITIONS.map(position => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Deneyim Seviyesi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deneyim Seviyesi
              </label>
              <select
                value={selectedExperienceLevel}
                onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tüm Seviyeler</option>
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* İş İlanları */}
        <div className="lg:col-span-3">
          {/* İlan Sayısı ve Sıralama */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">{filteredJobs.length} ilan bulundu</p>
          </div>
          
          {/* İlanlar */}
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Uygun İlan Bulunamadı</h3>
                <p className="text-gray-500">Lütfen filtreleri değiştirip tekrar deneyin.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      
                      <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-2">
                        {/* Şehir - İlçe */}
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        
                        {/* Çalışma Şekli */}
                        {job.workPreference && (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {getNameById(WORK_PREFERENCES, job.workPreference)}
                          </span>
                        )}
                        
                        {/* İş Türü */}
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getNameById(JOB_TYPES, job.type)}
                        </span>
                      </div>
                      
                      {/* Deneyim ve Sektör Bilgisi */}
                      <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-2">
                        {job.experienceLevel && (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {getNameById(EXPERIENCE_LEVELS, job.experienceLevel)}
                          </span>
                        )}
                        
                        {job.sector && (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {getNameById(SECTORS, job.sector)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-blue-600">{job.salary}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 line-clamp-2">{job.description}</p>
                  
                  {/* Gereksinimler */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{job.requirements.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 