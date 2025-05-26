import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

interface UserProfile {
  id: string;
  email: string;
  userType: string;
  name?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  cvUrl?: string;
  cvFileName?: string;
  createdAt: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setProfile({ id: userDoc.id, ...userDoc.data() } as UserProfile);
        setFormData(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), formData);
      setProfile({ ...profile!, ...formData });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profil güncellenirken bir hata oluştu.');
    }
  };

  const handleCvUpload = async (file: File) => {
    if (!user) return;
    
    setUploadingCv(true);
    try {
      // Simulated CV upload - replace with actual Firebase Storage implementation
      const cvData = {
        cvFileName: file.name,
        cvUrl: `cv/${user.uid}/${file.name}` // This would be the actual download URL
      };
      
      await updateDoc(doc(db, 'users', user.uid), cvData);
      setProfile({ ...profile!, ...cvData });
      setFormData({ ...formData, ...cvData });
      setCvFile(null);
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('CV yüklenirken bir hata oluştu.');
    } finally {
      setUploadingCv(false);
    }
  };

  const handleCvDelete = async () => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        cvFileName: null,
        cvUrl: null
      });
      setProfile({ ...profile!, cvFileName: undefined, cvUrl: undefined });
      setFormData({ ...formData, cvFileName: undefined, cvUrl: undefined });
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('CV silinirken bir hata oluştu.');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : profile.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.name || 'İsimsiz Kullanıcı'}
                  </h1>
                  <p className="text-gray-600">{profile.email}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800 mt-2">
                    {profile.userType === 'jobseeker' ? 'İş Arayan' : 'İşveren'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0">
                <button
                  onClick={() => setEditing(!editing)}
                  className={`inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                    editing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {editing ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    )}
                  </svg>
                  {editing ? 'İptal Et' : 'Düzenle'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Kişisel Bilgiler
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={editing ? formData.name || '' : profile.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    placeholder="Adınızı ve soyadınızı girin"
                    className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                      editing 
                        ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  value={editing ? formData.phone || '' : profile.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  placeholder="Telefon numaranızı girin"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                    editing 
                      ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hakkımda
                </label>
                <textarea
                  rows={4}
                  value={editing ? formData.bio || '' : profile.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!editing}
                  placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                  className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none ${
                    editing 
                      ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* CV Upload Section */}
          {profile.userType === 'jobseeker' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  CV Yönetimi
                </h2>
              </div>
              
              <div className="p-6">
                {profile.cvFileName ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="font-medium text-green-800">{profile.cvFileName}</p>
                        <p className="text-sm text-green-600">CV başarıyla yüklendi</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => window.open(profile.cvUrl, '_blank')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Görüntüle
                      </button>
                      <button
                        type="button"
                        onClick={handleCvDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-2">CV Yükle</p>
                    <p className="text-gray-500 mb-4">PDF formatında CV'nizi yükleyebilirsiniz</p>
                    
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCvFile(file);
                          handleCvUpload(file);
                        }
                      }}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors ${
                        uploadingCv
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {uploadingCv ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          CV Seç
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills, Experience, Education for Job Seekers */}
          {profile.userType === 'jobseeker' && (
            <>
              {/* Skills */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Yetenekler
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {(editing ? formData.skills || [] : profile.skills || []).length === 0 && !editing && (
                      <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                        <p className="mb-2">Henüz yetenek eklenmemiş. Örnek yetenekler:</p>
                        <ul className="text-sm space-y-1">
                          <li>• JavaScript, React, Node.js</li>
                          <li>• Python, Django, Flask</li>
                          <li>• Photoshop, Illustrator, Figma</li>
                          <li>• Proje Yönetimi, Scrum, Agile</li>
                          <li>• İngilizce (İleri), Almanca (Orta)</li>
                        </ul>
                      </div>
                    )}
                    {(editing ? formData.skills || [] : profile.skills || []).map((skill, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const newSkills = [...(formData.skills || [])];
                            newSkills[index] = e.target.value;
                            setFormData({ ...formData, skills: newSkills });
                          }}
                          disabled={!editing}
                          placeholder="Örn: JavaScript, React, Photoshop, Proje Yönetimi"
                          className={`flex-1 px-4 py-3 border rounded-lg transition-colors ${
                            editing 
                              ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        />
                        {editing && (
                          <button
                            type="button"
                            onClick={() => {
                              const newSkills = (formData.skills || []).filter((_, i) => i !== index);
                              setFormData({ ...formData, skills: newSkills });
                            }}
                            className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            skills: [...(formData.skills || []), '']
                          });
                        }}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors"
                      >
                        + Yeni Yetenek Ekle
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    İş Deneyimi
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {(editing ? formData.experience || [] : profile.experience || []).length === 0 && !editing && (
                      <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                        <p className="mb-2">Henüz deneyim eklenmemiş. Örnek deneyim:</p>
                        <div className="text-sm bg-white p-3 rounded border-l-4 border-blue-200">
                          <p className="font-medium">Frontend Developer - ABC Teknoloji</p>
                          <p className="text-gray-600">Ocak 2022 - Devam Ediyor (2 yıl)</p>
                          <p className="mt-1">React ve TypeScript kullanarak e-ticaret platformu geliştirdim. Takım içinde 5 kişilik ekiple çalıştım ve proje yönetiminde aktif rol aldım.</p>
                        </div>
                      </div>
                    )}
                    {(editing ? formData.experience || [] : profile.experience || []).map((exp, index) => (
                      <div key={index} className="flex space-x-3">
                        <textarea
                          value={exp}
                          onChange={(e) => {
                            const newExp = [...(formData.experience || [])];
                            newExp[index] = e.target.value;
                            setFormData({ ...formData, experience: newExp });
                          }}
                          disabled={!editing}
                          placeholder="Örn: Frontend Developer - ABC Teknoloji&#10;Ocak 2022 - Devam Ediyor (2 yıl)&#10;React ve TypeScript kullanarak e-ticaret platformu geliştirdim..."
                          rows={4}
                          className={`flex-1 px-4 py-3 border rounded-lg transition-colors resize-none ${
                            editing 
                              ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        />
                        {editing && (
                          <button
                            type="button"
                            onClick={() => {
                              const newExp = (formData.experience || []).filter((_, i) => i !== index);
                              setFormData({ ...formData, experience: newExp });
                            }}
                            className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors h-fit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            experience: [...(formData.experience || []), '']
                          });
                        }}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors"
                      >
                        + Yeni Deneyim Ekle
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Eğitim Bilgileri
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {(editing ? formData.education || [] : profile.education || []).length === 0 && !editing && (
                      <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                        <p className="mb-2">Henüz eğitim bilgisi eklenmemiş. Örnek eğitim:</p>
                        <div className="text-sm bg-white p-3 rounded border-l-4 border-green-200">
                          <p className="font-medium">Bilgisayar Mühendisliği - İstanbul Teknik Üniversitesi</p>
                          <p className="text-gray-600">2018 - 2022 (Lisans)</p>
                          <p className="mt-1">GPA: 3.2/4.0 - Yazılım geliştirme, veri yapıları ve algoritma konularında uzmanlaştım.</p>
                        </div>
                      </div>
                    )}
                    {(editing ? formData.education || [] : profile.education || []).map((edu, index) => (
                      <div key={index} className="flex space-x-3">
                        <textarea
                          value={edu}
                          onChange={(e) => {
                            const newEdu = [...(formData.education || [])];
                            newEdu[index] = e.target.value;
                            setFormData({ ...formData, education: newEdu });
                          }}
                          disabled={!editing}
                          placeholder="Örn: Bilgisayar Mühendisliği - İstanbul Teknik Üniversitesi&#10;2018 - 2022 (Lisans)&#10;GPA: 3.2/4.0 - Yazılım geliştirme konularında uzmanlaştım..."
                          rows={3}
                          className={`flex-1 px-4 py-3 border rounded-lg transition-colors resize-none ${
                            editing 
                              ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        />
                        {editing && (
                          <button
                            type="button"
                            onClick={() => {
                              const newEdu = (formData.education || []).filter((_, i) => i !== index);
                              setFormData({ ...formData, education: newEdu });
                            }}
                            className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors h-fit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            education: [...(formData.education || []), '']
                          });
                        }}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors"
                      >
                        + Yeni Eğitim Ekle
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}



          {/* Save Button */}
          {editing && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                İptal Et
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 