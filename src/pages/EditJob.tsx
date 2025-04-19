import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
}

const EditJob: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: ['']
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobDoc = await getDoc(doc(db, 'jobs', id!));
        if (jobDoc.exists()) {
          const jobData = jobDoc.data() as JobFormData;
          setFormData(jobData);
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
      await updateDoc(doc(db, 'jobs', id!), formData);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">İş İlanını Düzenle</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block mb-2">İş Başlığı</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Şirket</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Lokasyon</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block mb-2">İş Tipi</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Seçiniz</option>
            <option value="full-time">Tam Zamanlı</option>
            <option value="part-time">Yarı Zamanlı</option>
            <option value="contract">Sözleşmeli</option>
            <option value="internship">Staj</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Maaş</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block mb-2">İş Açıklaması</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field h-32"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Gereksinimler</label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                className="input-field"
                placeholder="Gereksinim ekleyin"
                required
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sil
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="btn-secondary mt-2"
          >
            Gereksinim Ekle
          </button>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/employer/dashboard')}
            className="btn-secondary"
          >
            İptal
          </button>
          <button type="submit" className="btn-primary">
            Güncelle
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob; 