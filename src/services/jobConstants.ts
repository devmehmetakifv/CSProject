// İş ilanları için sabit değerler

// İş Türleri
export const JOB_TYPES = [
  { id: 'full-time', name: 'Tam Zamanlı' },
  { id: 'part-time', name: 'Yarı Zamanlı' },
  { id: 'contract', name: 'Sözleşmeli' },
  { id: 'internship', name: 'Staj' },
  { id: 'temporary', name: 'Geçici' },
  { id: 'project-based', name: 'Proje Bazlı' }
];

// Çalışma Tercihleri
export const WORK_PREFERENCES = [
  { id: 'on-site', name: 'İş Yerinde' },
  { id: 'remote', name: 'Uzaktan' },
  { id: 'hybrid', name: 'Hibrit' }
];

// Deneyim Seviyeleri
export const EXPERIENCE_LEVELS = [
  { id: 'entry', name: 'Deneyimsiz / Yeni Başlangıç' },
  { id: 'junior', name: '1-3 Yıl Deneyimli' },
  { id: 'mid', name: '4-6 Yıl Deneyimli' },
  { id: 'senior', name: '7+ Yıl Deneyimli' },
  { id: 'executive', name: 'Yönetici' }
];

// Pozisyonlar
export const POSITIONS = [
  { id: 'software-developer', name: 'Yazılım Geliştirici' },
  { id: 'frontend-developer', name: 'Frontend Geliştirici' },
  { id: 'backend-developer', name: 'Backend Geliştirici' },
  { id: 'full-stack-developer', name: 'Full Stack Geliştirici' },
  { id: 'mobile-developer', name: 'Mobil Uygulama Geliştirici' },
  { id: 'ux-ui-designer', name: 'UX/UI Tasarımcı' },
  { id: 'graphic-designer', name: 'Grafik Tasarımcı' },
  { id: 'data-analyst', name: 'Veri Analisti' },
  { id: 'data-scientist', name: 'Veri Bilimci' },
  { id: 'devops-engineer', name: 'DevOps Mühendisi' },
  { id: 'qa-engineer', name: 'Kalite Kontrol Mühendisi' },
  { id: 'product-manager', name: 'Ürün Yöneticisi' },
  { id: 'project-manager', name: 'Proje Yöneticisi' },
  { id: 'sales-representative', name: 'Satış Temsilcisi' },
  { id: 'marketing-specialist', name: 'Pazarlama Uzmanı' },
  { id: 'financial-analyst', name: 'Finans Analisti' },
  { id: 'hr-specialist', name: 'İnsan Kaynakları Uzmanı' },
  { id: 'content-writer', name: 'İçerik Yazarı' },
  { id: 'customer-support', name: 'Müşteri Hizmetleri' },
  { id: 'administrative-assistant', name: 'İdari Asistan' }
];

// Sektörler
export const SECTORS = [
  { id: 'technology', name: 'Teknoloji' },
  { id: 'finance', name: 'Finans' },
  { id: 'healthcare', name: 'Sağlık' },
  { id: 'education', name: 'Eğitim' },
  { id: 'manufacturing', name: 'Üretim' },
  { id: 'retail', name: 'Perakende' },
  { id: 'hospitality', name: 'Turizm ve Otelcilik' },
  { id: 'marketing', name: 'Pazarlama ve Reklam' },
  { id: 'real-estate', name: 'Gayrimenkul' },
  { id: 'construction', name: 'İnşaat' },
  { id: 'logistics', name: 'Lojistik ve Ulaşım' },
  { id: 'consulting', name: 'Danışmanlık' },
  { id: 'media', name: 'Medya ve İletişim' },
  { id: 'food', name: 'Gıda' },
  { id: 'energy', name: 'Enerji' },
  { id: 'telecommunications', name: 'Telekomünikasyon' },
  { id: 'automotive', name: 'Otomotiv' },
  { id: 'agriculture', name: 'Tarım' },
  { id: 'non-profit', name: 'Sivil Toplum' },
  { id: 'government', name: 'Kamu' }
];

// Helper fonksiyonlar
export const getNameById = (list: { id: string; name: string }[], id: string): string => {
  const item = list.find(item => item.id === id);
  return item ? item.name : '';
};

export const getLabelValue = (list: { id: string; name: string }[]): { label: string; value: string }[] => {
  return list.map(item => ({
    label: item.name,
    value: item.id
  }));
}; 