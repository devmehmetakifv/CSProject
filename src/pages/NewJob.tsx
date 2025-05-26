import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { getCities, getDistrictsByCityId, formatLocation } from '../services/locationService';
import { 
  JOB_TYPES, 
  WORK_PREFERENCES, 
  EXPERIENCE_LEVELS,
  POSITIONS,
  SECTORS
} from '../services/jobConstants';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  cityId: number | '';
  districtName: string;
  workPreference: string;
  sector: string;
  position: string;
  experienceLevel: string;
}

export default function NewJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const cities = getCities();
  
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: [''],
    cityId: '',
    districtName: '',
    workPreference: '',
    sector: '',
    position: '',
    experienceLevel: '',
  });

  useEffect(() => {
    if (formData.cityId) {
      const cityDistricts = getDistrictsByCityId(Number(formData.cityId));
      setDistricts(cityDistricts);
      if (formData.districtName && !cityDistricts.includes(formData.districtName)) {
        setFormData({ ...formData, districtName: '' });
      }
    } else {
      setDistricts([]);
      setFormData({ ...formData, districtName: '' });
    }
  }, [formData.cityId]);

  useEffect(() => {
    if (formData.cityId && formData.districtName) {
      const cityName = cities.find(c => c.id === Number(formData.cityId))?.name || '';
      const locationString = formatLocation(cityName, formData.districtName);
      setFormData({ ...formData, location: locationString });
    } else if (formData.cityId) {
      const cityName = cities.find(c => c.id === Number(formData.cityId))?.name || '';
      setFormData({ ...formData, location: cityName });
    } else {
      setFormData({ ...formData, location: '' });
    }
  }, [formData.cityId, formData.districtName]);

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const jobData = {
        ...formData,
        employerId: user.uid,
        createdAt: new Date().toISOString(),
        applicants: [],
        status: 'pending', // Admin onayı bekliyor
        isActive: true, // Varsayılan olarak aktif
      };

      await addDoc(collection(db, 'jobs'), jobData);
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate('/employer/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating job:', error);
      alert('İlan oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              İş İlanı Başarıyla Oluşturuldu!
            </h3>
            <p className="text-sm text-gray-600 text-center">
              İlanınız admin onayından sonra yayınlanacaktır.
            </p>
          </div>
        </div>
      )}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Yeni İş İlanı
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              İlan Bilgileri
            </h3>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  İş Başlığı
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Şirket Adı
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company"
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="cityId" className="block text-sm font-medium text-gray-700">
                  Şehir
                </label>
                <div className="mt-1">
                  <select
                    id="cityId"
                    name="cityId"
                    required
                    value={formData.cityId}
                    onChange={(e) => setFormData({ ...formData, cityId: e.target.value ? Number(e.target.value) : '' })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Şehir Seçin</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="districtName" className="block text-sm font-medium text-gray-700">
                  İlçe
                </label>
                <div className="mt-1">
                  <select
                    id="districtName"
                    name="districtName"
                    required
                    disabled={!formData.cityId}
                    value={formData.districtName}
                    onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  >
                    <option value="">İlçe Seçin</option>
                    {districts.map(district => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="workPreference" className="block text-sm font-medium text-gray-700">
                  Çalışma Şekli
                </label>
                <div className="mt-1">
                  <select
                    id="workPreference"
                    name="workPreference"
                    required
                    value={formData.workPreference}
                    onChange={(e) => setFormData({ ...formData, workPreference: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Seçiniz</option>
                    {WORK_PREFERENCES.map(pref => (
                      <option key={pref.id} value={pref.id}>
                        {pref.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  İş Türü
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Seçiniz</option>
                    {JOB_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                  Sektör
                </label>
                <div className="mt-1">
                  <select
                    id="sector"
                    name="sector"
                    required
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Seçiniz</option>
                    {SECTORS.map(sector => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Pozisyon
                </label>
                <div className="mt-1">
                  <select
                    id="position"
                    name="position"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Seçiniz</option>
                    {POSITIONS.map(position => (
                      <option key={position.id} value={position.id}>
                        {position.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
                  Deneyim Seviyesi
                </label>
                <div className="mt-1">
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    required
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Seçiniz</option>
                    {EXPERIENCE_LEVELS.map(level => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                  Maaş
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="salary"
                    id="salary"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Örn: 5000-7000 TL"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  İş Açıklaması
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Gereksinimler
                </label>
                <div className="mt-2 space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Gereksinim ekleyin"
                      />
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Gereksinim Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/employer/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Oluşturuluyor...' : 'İlan Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
} 