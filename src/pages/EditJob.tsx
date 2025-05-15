import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
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

const EditJob: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState<string[]>([]);
  
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
    const fetchJob = async () => {
      try {
        const jobDoc = await getDoc(doc(db, 'jobs', id!));
        if (jobDoc.exists()) {
          const jobData = jobDoc.data() as JobFormData;
          setFormData({
            ...jobData,
            cityId: jobData.cityId || '',
            districtName: jobData.districtName || '',
            workPreference: jobData.workPreference || '',
            sector: jobData.sector || '',
            position: jobData.position || '',
            experienceLevel: jobData.experienceLevel || '',
          });
          
          // If cityId exists, load districts
          if (jobData.cityId) {
            const cityDistricts = getDistrictsByCityId(Number(jobData.cityId));
            setDistricts(cityDistricts);
          }
        } else {
          navigate('/employer/dashboard');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a plain object without class instance methods for Firestore
      const jobDataToUpdate = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary: formData.salary,
        description: formData.description,
        requirements: formData.requirements,
        cityId: formData.cityId,
        districtName: formData.districtName,
        workPreference: formData.workPreference,
        sector: formData.sector,
        position: formData.position,
        experienceLevel: formData.experienceLevel
      };
      
      await updateDoc(doc(db, 'jobs', id!), jobDataToUpdate);
      navigate('/employer/dashboard');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('İş ilanı güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            İş İlanını Düzenle
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Pozisyon
                </label>
                <div className="mt-1">
                  <select
                    id="position"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Seçiniz</option>
                    {POSITIONS.map(pos => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
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
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Seçiniz</option>
                    {SECTORS.map(sect => (
                      <option key={sect.id} value={sect.id}>
                        {sect.name}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Gereksinimler
                </label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex mt-2 space-x-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder="Gereksinim ekleyin"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Gereksinim Ekle
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Güncelle
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditJob; 