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
  createdAt: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Profil Bilgileri
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary"
          >
            {editing ? 'İptal' : 'Düzenle'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profile.email}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ad Soyad
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={editing ? formData.name || '' : profile.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={editing ? formData.phone || '' : profile.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editing}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Hakkımda
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={editing ? formData.bio || '' : profile.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!editing}
                    className="input-field"
                  />
                </div>
              </div>

              {profile.userType === 'jobseeker' && (
                <>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Yetenekler
                    </label>
                    <div className="mt-2 space-y-2">
                      {(editing ? formData.skills || [] : profile.skills || []).map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...(formData.skills || [])];
                              newSkills[index] = e.target.value;
                              setFormData({ ...formData, skills: newSkills });
                            }}
                            disabled={!editing}
                            className="input-field"
                          />
                          {editing && (
                            <button
                              type="button"
                              onClick={() => {
                                const newSkills = (formData.skills || []).filter((_, i) => i !== index);
                                setFormData({ ...formData, skills: newSkills });
                              }}
                              className="btn-secondary"
                            >
                              Sil
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
                          className="btn-secondary"
                        >
                          Yetenek Ekle
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Deneyim
                    </label>
                    <div className="mt-2 space-y-2">
                      {(editing ? formData.experience || [] : profile.experience || []).map((exp, index) => (
                        <div key={index} className="flex gap-2">
                          <textarea
                            value={exp}
                            onChange={(e) => {
                              const newExp = [...(formData.experience || [])];
                              newExp[index] = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                            disabled={!editing}
                            className="input-field"
                            rows={2}
                          />
                          {editing && (
                            <button
                              type="button"
                              onClick={() => {
                                const newExp = (formData.experience || []).filter((_, i) => i !== index);
                                setFormData({ ...formData, experience: newExp });
                              }}
                              className="btn-secondary"
                            >
                              Sil
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
                          className="btn-secondary"
                        >
                          Deneyim Ekle
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Eğitim
                    </label>
                    <div className="mt-2 space-y-2">
                      {(editing ? formData.education || [] : profile.education || []).map((edu, index) => (
                        <div key={index} className="flex gap-2">
                          <textarea
                            value={edu}
                            onChange={(e) => {
                              const newEdu = [...(formData.education || [])];
                              newEdu[index] = e.target.value;
                              setFormData({ ...formData, education: newEdu });
                            }}
                            disabled={!editing}
                            className="input-field"
                            rows={2}
                          />
                          {editing && (
                            <button
                              type="button"
                              onClick={() => {
                                const newEdu = (formData.education || []).filter((_, i) => i !== index);
                                setFormData({ ...formData, education: newEdu });
                              }}
                              className="btn-secondary"
                            >
                              Sil
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
                          className="btn-secondary"
                        >
                          Eğitim Ekle
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
            >
              Kaydet
            </button>
          </div>
        )}
      </form>
    </div>
  );
} 