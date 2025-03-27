// Türkiye şehirleri ve ilçeleri için API servisi
export interface City {
  id: number;
  name: string;
  districts: string[];
}

// Türkiye'nin şehirleri ve ilçeleri
const turkeyData: City[] = [
  {
    id: 1,
    name: 'Adana',
    districts: ['Seyhan', 'Çukurova', 'Yüreğir', 'Ceyhan', 'Kozan', 'İmamoğlu']
  },
  {
    id: 2,
    name: 'Adıyaman',
    districts: ['Merkez', 'Besni', 'Kahta', 'Gerger', 'Gölbaşı', 'Sincik']
  },
  {
    id: 3,
    name: 'Ankara',
    districts: ['Çankaya', 'Keçiören', 'Mamak', 'Altındağ', 'Etimesgut', 'Sincan', 'Yenimahalle', 'Pursaklar', 'Gölbaşı']
  },
  {
    id: 4,
    name: 'Antalya',
    districts: ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Alanya', 'Manavgat', 'Serik', 'Kaş', 'Kemer']
  },
  {
    id: 5,
    name: 'Aydın',
    districts: ['Efeler', 'Kuşadası', 'Didim', 'Söke', 'Nazilli', 'İncirliova']
  },
  {
    id: 6,
    name: 'Balıkesir',
    districts: ['Altıeylül', 'Karesi', 'Ayvalık', 'Bandırma', 'Edremit', 'Gönen']
  },
  {
    id: 7,
    name: 'Bursa',
    districts: ['Osmangazi', 'Nilüfer', 'Yıldırım', 'İnegöl', 'Gemlik', 'Mudanya', 'Kestel']
  },
  {
    id: 8,
    name: 'Çanakkale',
    districts: ['Merkez', 'Biga', 'Çan', 'Gelibolu', 'Eceabat', 'Ayvacık']
  },
  {
    id: 9,
    name: 'Denizli',
    districts: ['Pamukkale', 'Merkezefendi', 'Çivril', 'Acıpayam', 'Tavas']
  },
  {
    id: 10,
    name: 'Diyarbakır',
    districts: ['Bağlar', 'Kayapınar', 'Sur', 'Yenişehir', 'Bismil', 'Ergani']
  },
  {
    id: 11,
    name: 'Edirne',
    districts: ['Merkez', 'Keşan', 'Uzunköprü', 'Havsa', 'İpsala']
  },
  {
    id: 12,
    name: 'Erzurum',
    districts: ['Yakutiye', 'Palandöken', 'Aziziye', 'Oltu', 'Horasan', 'Pasinler']
  },
  {
    id: 13,
    name: 'Eskişehir',
    districts: ['Tepebaşı', 'Odunpazarı', 'Çifteler', 'Sivrihisar', 'Mahmudiye']
  },
  {
    id: 14,
    name: 'Gaziantep',
    districts: ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Oğuzeli']
  },
  {
    id: 15,
    name: 'İstanbul',
    districts: ['Ataşehir', 'Bakırköy', 'Başakşehir', 'Beşiktaş', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Esenler', 'Esenyurt', 'Fatih', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sarıyer', 'Şişli', 'Sultanbeyli', 'Sultangazi', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu']
  },
  {
    id: 16,
    name: 'İzmir',
    districts: ['Konak', 'Karşıyaka', 'Bornova', 'Karabağlar', 'Buca', 'Çiğli', 'Bayraklı', 'Balçova', 'Gaziemir', 'Ödemiş', 'Bergama', 'Torbalı', 'Urla', 'Çeşme']
  },
  {
    id: 17,
    name: 'Kayseri',
    districts: ['Kocasinan', 'Melikgazi', 'Talas', 'Develi', 'İncesu', 'Hacılar']
  },
  {
    id: 18,
    name: 'Kocaeli',
    districts: ['İzmit', 'Gebze', 'Darıca', 'Gölcük', 'Körfez', 'Derince', 'Kartepe', 'Başiskele']
  },
  {
    id: 19,
    name: 'Konya',
    districts: ['Meram', 'Selçuklu', 'Karatay', 'Akşehir', 'Beyşehir', 'Ereğli']
  },
  {
    id: 20,
    name: 'Malatya',
    districts: ['Yeşilyurt', 'Battalgazi', 'Doğanşehir', 'Akçadağ', 'Darende']
  },
  {
    id: 21,
    name: 'Manisa',
    districts: ['Şehzadeler', 'Yunusemre', 'Akhisar', 'Salihli', 'Turgutlu', 'Soma']
  },
  {
    id: 22,
    name: 'Mardin',
    districts: ['Artuklu', 'Kızıltepe', 'Midyat', 'Nusaybin', 'Derik', 'Mazıdağı']
  },
  {
    id: 23,
    name: 'Mersin',
    districts: ['Akdeniz', 'Mezitli', 'Toroslar', 'Yenişehir', 'Tarsus', 'Erdemli', 'Silifke']
  },
  {
    id: 24,
    name: 'Muğla',
    districts: ['Menteşe', 'Bodrum', 'Fethiye', 'Marmaris', 'Milas', 'Ortaca', 'Dalaman']
  },
  {
    id: 25,
    name: 'Sakarya',
    districts: ['Adapazarı', 'Serdivan', 'Erenler', 'Hendek', 'Akyazı', 'Sapanca']
  },
  {
    id: 26,
    name: 'Samsun',
    districts: ['Atakum', 'İlkadım', 'Canik', 'Tekkeköy', 'Bafra', 'Çarşamba']
  },
  {
    id: 27,
    name: 'Şanlıurfa',
    districts: ['Eyyübiye', 'Haliliye', 'Karaköprü', 'Siverek', 'Viranşehir', 'Birecik']
  },
  {
    id: 28,
    name: 'Trabzon',
    districts: ['Ortahisar', 'Akçaabat', 'Araklı', 'Of', 'Yomra', 'Beşikdüzü']
  },
  {
    id: 29,
    name: 'Van',
    districts: ['İpekyolu', 'Tuşba', 'Edremit', 'Erciş', 'Özalp', 'Çaldıran']
  }
];

// Tüm şehirleri getir
export const getCities = (): City[] => {
  return turkeyData;
};

// Şehir ID'sine göre şehri getir
export const getCityById = (id: number): City | undefined => {
  return turkeyData.find(city => city.id === id);
};

// Şehir adına göre şehri getir
export const getCityByName = (name: string): City | undefined => {
  return turkeyData.find(city => city.name.toLowerCase() === name.toLowerCase());
};

// Şehir ID'sine göre ilçeleri getir
export const getDistrictsByCityId = (cityId: number): string[] => {
  const city = getCityById(cityId);
  return city ? city.districts : [];
};

// Şehir adına göre ilçeleri getir
export const getDistrictsByCityName = (cityName: string): string[] => {
  const city = getCityByName(cityName);
  return city ? city.districts : [];
};

// Tüm şehir ve ilçe verilerini düz liste olarak getir
export const getAllLocations = (): { cityName: string; districtName: string }[] => {
  const allLocations: { cityName: string; districtName: string }[] = [];
  
  turkeyData.forEach(city => {
    city.districts.forEach(district => {
      allLocations.push({
        cityName: city.name,
        districtName: district
      });
    });
  });
  
  return allLocations;
};

// Şehir - ilçe formatında lokasyon string'i oluştur
export const formatLocation = (cityName: string, districtName: string): string => {
  return `${districtName}, ${cityName}`;
}; 