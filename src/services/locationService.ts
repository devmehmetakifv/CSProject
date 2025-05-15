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
    districts: ['Seyhan', 'Çukurova', 'Yüreğir', 'Ceyhan', 'Kozan', 'İmamoğlu', 'Karaisalı', 'Pozantı', 'Saimbeyli', 'Tufanbeyli', 'Yumurtalık', 'Sarıçam', 'Karataş', 'Aladağ', 'Feke']
  },
  {
    id: 2,
    name: 'Adıyaman',
    districts: ['Merkez', 'Besni', 'Kahta', 'Gerger', 'Gölbaşı', 'Sincik', 'Tut', 'Çelikhan', 'Samsat']
  },
  {
    id: 3,
    name: 'Afyonkarahisar',
    districts: ['Merkez', 'Bolvadin', 'Çay', 'Dazkırı', 'Dinar', 'Emirdağ', 'İhsaniye', 'Sandıklı', 'Sinanpaşa', 'Sultandağı', 'Şuhut', 'Başmakçı', 'Bayat', 'İscehisar', 'Kızılören', 'Çobanlar', 'Evciler', 'Hocalar']
  },
  {
    id: 4,
    name: 'Ağrı',
    districts: ['Merkez', 'Diyadin', 'Doğubayazıt', 'Eleşkirt', 'Hamur', 'Patnos', 'Taşlıçay', 'Tutak']
  },
  {
    id: 5,
    name: 'Amasya',
    districts: ['Merkez', 'Göynücek', 'Gümüşhacıköy', 'Hamamözü', 'Merzifon', 'Suluova', 'Taşova']
  },
  {
    id: 6,
    name: 'Ankara',
    districts: ['Çankaya', 'Keçiören', 'Mamak', 'Altındağ', 'Etimesgut', 'Sincan', 'Yenimahalle', 'Pursaklar', 'Gölbaşı', 'Polatlı', 'Kazan', 'Akyurt', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çubuk', 'Elmadağ', 'Evren', 'Güdül', 'Haymana', 'Kalecik', 'Kızılcahamam', 'Nallıhan', 'Şereflikoçhisar']
  },
  {
    id: 7,
    name: 'Antalya',
    districts: ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Alanya', 'Manavgat', 'Serik', 'Kaş', 'Kemer', 'Aksu', 'Döşemealtı', 'Finike', 'Gazipaşa', 'Gündoğmuş', 'İbradı', 'Korkuteli', 'Kumluca', 'Akseki', 'Elmalı', 'Demre']
  },
  {
    id: 8,
    name: 'Artvin',
    districts: ['Merkez', 'Ardanuç', 'Arhavi', 'Borçka', 'Hopa', 'Şavşat', 'Yusufeli', 'Murgul']
  },
  {
    id: 9,
    name: 'Aydın',
    districts: ['Efeler', 'Kuşadası', 'Didim', 'Söke', 'Nazilli', 'İncirliova', 'Germencik', 'Bozdoğan', 'Buharkent', 'Çine', 'Karacasu', 'Karpuzlu', 'Koçarlı', 'Köşk', 'Sultanhisar', 'Yenipazar']
  },
  {
    id: 10,
    name: 'Balıkesir',
    districts: ['Altıeylül', 'Karesi', 'Ayvalık', 'Bandırma', 'Edremit', 'Gönen', 'Burhaniye', 'Dursunbey', 'Erdek', 'Bigadiç', 'Havran', 'İvrindi', 'Kepsut', 'Manyas', 'Savaştepe', 'Sındırgı', 'Susurluk', 'Marmara']
  },
  {
    id: 11,
    name: 'Bilecik',
    districts: ['Merkez', 'Bozüyük', 'Gölpazarı', 'Osmaneli', 'Pazaryeri', 'Söğüt', 'Yenipazar', 'İnhisar']
  },
  {
    id: 12,
    name: 'Bingöl',
    districts: ['Merkez', 'Genç', 'Karlıova', 'Kiğı', 'Solhan', 'Adaklı', 'Yayladere', 'Yedisu']
  },
  {
    id: 13,
    name: 'Bitlis',
    districts: ['Merkez', 'Adilcevaz', 'Ahlat', 'Güroymak', 'Hizan', 'Mutki', 'Tatvan']
  },
  {
    id: 14,
    name: 'Bolu',
    districts: ['Merkez', 'Gerede', 'Göynük', 'Kıbrıscık', 'Mengen', 'Mudurnu', 'Seben', 'Dörtdivan', 'Yeniçağa']
  },
  {
    id: 15,
    name: 'Burdur',
    districts: ['Merkez', 'Ağlasun', 'Bucak', 'Gölhisar', 'Tefenni', 'Yeşilova', 'Karamanlı', 'Kemer', 'Altınyayla', 'Çavdır', 'Çeltikçi']
  },
  {
    id: 16,
    name: 'Bursa',
    districts: ['Osmangazi', 'Nilüfer', 'Yıldırım', 'İnegöl', 'Gemlik', 'Mudanya', 'Kestel', 'Gürsu', 'Karacabey', 'Mustafakemalpaşa', 'Orhangazi', 'İznik', 'Yenişehir', 'Büyükorhan', 'Harmancık', 'Keles', 'Orhaneli']
  },
  {
    id: 17,
    name: 'Çanakkale',
    districts: ['Merkez', 'Biga', 'Çan', 'Gelibolu', 'Eceabat', 'Ayvacık', 'Bayramiç', 'Bozcaada', 'Ezine', 'Gökçeada', 'Lapseki', 'Yenice']
  },
  {
    id: 18,
    name: 'Çankırı',
    districts: ['Merkez', 'Çerkeş', 'Eldivan', 'Ilgaz', 'Kurşunlu', 'Orta', 'Şabanözü', 'Yapraklı', 'Atkaracalar', 'Kızılırmak', 'Bayramören', 'Korgun']
  },
  {
    id: 19,
    name: 'Çorum',
    districts: ['Merkez', 'Alaca', 'Bayat', 'İskilip', 'Kargı', 'Mecitözü', 'Ortaköy', 'Osmancık', 'Sungurlu', 'Boğazkale', 'Uğurludağ', 'Dodurga', 'Laçin', 'Oğuzlar']
  },
  {
    id: 20,
    name: 'Denizli',
    districts: ['Pamukkale', 'Merkezefendi', 'Çivril', 'Acıpayam', 'Tavas', 'Buldan', 'Çal', 'Çameli', 'Çardak', 'Güney', 'Kale', 'Sarayköy', 'Serinhisar', 'Bozkurt', 'Honaz', 'Babadan']
  },
  {
    id: 21,
    name: 'Diyarbakır',
    districts: ['Bağlar', 'Kayapınar', 'Sur', 'Yenişehir', 'Bismil', 'Ergani', 'Çınar', 'Çermik', 'Dicle', 'Eğil', 'Hani', 'Hazro', 'Kocaköy', 'Kulp', 'Lice', 'Silvan', 'Çüngüş']
  },
  {
    id: 22,
    name: 'Edirne',
    districts: ['Merkez', 'Keşan', 'Uzunköprü', 'Havsa', 'İpsala', 'Enez', 'Lalapaşa', 'Meriç', 'Süloğlu']
  },
  {
    id: 23,
    name: 'Elazığ',
    districts: ['Merkez', 'Ağın', 'Baskil', 'Karakoçan', 'Keban', 'Maden', 'Palu', 'Sivrice', 'Arıcak', 'Kovancılar', 'Alacakaya']
  },
  {
    id: 24,
    name: 'Erzincan',
    districts: ['Merkez', 'Çayırlı', 'İliç', 'Kemah', 'Kemaliye', 'Refahiye', 'Tercan', 'Üzümlü', 'Otlukbeli']
  },
  {
    id: 25,
    name: 'Erzurum',
    districts: ['Yakutiye', 'Palandöken', 'Aziziye', 'Oltu', 'Horasan', 'Pasinler', 'Hınıs', 'İspir', 'Karayazı', 'Narman', 'Olur', 'Şenkaya', 'Tekman', 'Tortum', 'Karaçoban', 'Aşkale', 'Çat', 'Köprüköy', 'Uzundere']
  },
  {
    id: 26,
    name: 'Eskişehir',
    districts: ['Tepebaşı', 'Odunpazarı', 'Çifteler', 'Sivrihisar', 'Mahmudiye', 'Alpu', 'Beylikova', 'Günyüzü', 'Han', 'İnönü', 'Mihalgazi', 'Mihalıççık', 'Sarıcakaya', 'Seyitgazi']
  },
  {
    id: 27,
    name: 'Gaziantep',
    districts: ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Oğuzeli', 'Araban', 'Yavuzeli', 'Karkamış', 'Nurdağı']
  },
  {
    id: 28,
    name: 'Giresun',
    districts: ['Merkez', 'Alucra', 'Bulancak', 'Dereli', 'Espiye', 'Eynesil', 'Görele', 'Keşap', 'Şebinkarahisar', 'Tirebolu', 'Piraziz', 'Yağlıdere', 'Çamoluk', 'Çanakçı', 'Doğankent', 'Güce']
  },
  {
    id: 29,
    name: 'Gümüşhane',
    districts: ['Merkez', 'Kelkit', 'Şiran', 'Torul', 'Köse', 'Kürtün']
  },
  {
    id: 30,
    name: 'Hakkari',
    districts: ['Merkez', 'Çukurca', 'Şemdinli', 'Yüksekova', 'Derecik']
  },
  {
    id: 31,
    name: 'Hatay',
    districts: ['Antakya', 'İskenderun', 'Dörtyol', 'Kırıkhan', 'Reyhanlı', 'Samandağ', 'Yayladağı', 'Altınözü', 'Belen', 'Hassa', 'Kumlu', 'Erzin', 'Payas']
  },
  {
    id: 32,
    name: 'Isparta',
    districts: ['Merkez', 'Eğirdir', 'Şarkikaraağaç', 'Yalvaç', 'Aksu', 'Atabey', 'Gelendost', 'Gönen', 'Keçiborlu', 'Senirkent', 'Sütçüler', 'Uluborlu', 'Yenişarbademli']
  },
  {
    id: 33,
    name: 'Mersin',
    districts: ['Akdeniz', 'Mezitli', 'Toroslar', 'Yenişehir', 'Tarsus', 'Erdemli', 'Silifke', 'Anamur', 'Mut', 'Gülnar', 'Aydıncık', 'Bozyazı', 'Çamlıyayla']
  },
  {
    id: 34,
    name: 'İstanbul',
    districts: ['Ataşehir', 'Bakırköy', 'Başakşehir', 'Beşiktaş', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Esenler', 'Esenyurt', 'Fatih', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sarıyer', 'Şişli', 'Sultanbeyli', 'Sultangazi', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu', 'Adalar', 'Arnavutköy', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bayrampaşa', 'Beykoz', 'Çatalca', 'Çekmeköy', 'Eyüp', 'Gaziosmanpaşa', 'Güngören', 'Sancaktepe', 'Silivri', 'Şile']
  },
  {
    id: 35,
    name: 'İzmir',
    districts: ['Konak', 'Karşıyaka', 'Bornova', 'Karabağlar', 'Buca', 'Çiğli', 'Bayraklı', 'Balçova', 'Gaziemir', 'Ödemiş', 'Bergama', 'Torbalı', 'Urla', 'Çeşme', 'Aliağa', 'Bayındır', 'Beydağ', 'Dikili', 'Foça', 'Güzelbahçe', 'Karaburun', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Menderes', 'Menemen', 'Narlıdere', 'Seferihisar', 'Selçuk', 'Tire']
  },
  {
    id: 36,
    name: 'Kars',
    districts: ['Merkez', 'Akyaka', 'Arpaçay', 'Digor', 'Kağızman', 'Sarıkamış', 'Selim', 'Susuz']
  },
  {
    id: 37,
    name: 'Kastamonu',
    districts: ['Merkez', 'Abana', 'Araç', 'Azdavay', 'Bozkurt', 'Cide', 'Çatalzeytin', 'Daday', 'Devrekani', 'İnebolu', 'Küre', 'Taşköprü', 'Tosya', 'İhsangazi', 'Pınarbaşı', 'Şenpazar', 'Doğanyurt', 'Hanönü', 'Seydiler']
  },
  {
    id: 38,
    name: 'Kayseri',
    districts: ['Kocasinan', 'Melikgazi', 'Talas', 'Develi', 'İncesu', 'Hacılar', 'Bünyan', 'Felahiye', 'Özvatan', 'Pınarbaşı', 'Sarıoğlan', 'Sarız', 'Tomarza', 'Yahyalı', 'Yeşilhisar', 'Akkışla']
  },
  {
    id: 39,
    name: 'Kırklareli',
    districts: ['Merkez', 'Babaeski', 'Demirköy', 'Kofçaz', 'Lüleburgaz', 'Pehlivanköy', 'Pınarhisar', 'Vize']
  },
  {
    id: 40,
    name: 'Kırşehir',
    districts: ['Merkez', 'Çiçekdağı', 'Kaman', 'Mucur', 'Akpınar', 'Boztepe', 'Dulkadiroğlu']
  },
  {
    id: 41,
    name: 'Kocaeli',
    districts: ['İzmit', 'Gebze', 'Darıca', 'Gölcük', 'Körfez', 'Derince', 'Kartepe', 'Başiskele', 'Çayırova', 'Dilovası', 'Kandıra', 'Karamürsel']
  },
  {
    id: 42,
    name: 'Konya',
    districts: ['Meram', 'Selçuklu', 'Karatay', 'Akşehir', 'Beyşehir', 'Ereğli', 'Cihanbeyli', 'Çumra', 'Doğanhisar', 'Hadim', 'Ilgın', 'Kadınhanı', 'Sarayönü', 'Seydişehir', 'Yunak', 'Altınekin', 'Derebucak', 'Hüyük', 'Kulu', 'Taşkent', 'Tuzlukçu', 'Yalıhüyük', 'Çeltik', 'Emirgazi', 'Güneysınır', 'Halkapınar']
  },
  {
    id: 43,
    name: 'Kütahya',
    districts: ['Merkez', 'Altıntaş', 'Domaniç', 'Emet', 'Gediz', 'Simav', 'Tavşanlı', 'Aslanapa', 'Dumlupınar', 'Hisarcık', 'Çavdarhisar', 'Pazarlar', 'Şaphane']
  },
  {
    id: 44,
    name: 'Malatya',
    districts: ['Yeşilyurt', 'Battalgazi', 'Doğanşehir', 'Akçadağ', 'Darende', 'Hekimhan', 'Pütürge', 'Yazıhan', 'Arapgir', 'Arguvan', 'Kuluncak']
  },
  {
    id: 45,
    name: 'Manisa',
    districts: ['Şehzadeler', 'Yunusemre', 'Akhisar', 'Salihli', 'Turgutlu', 'Soma', 'Alaşehir', 'Demirci', 'Gördes', 'Kırkağaç', 'Kula', 'Saruhanlı', 'Selendi', 'Gölmarmara', 'Ahmetli', 'Sarigöl']
  },
  {
    id: 46,
    name: 'Kahramanmaraş',
    districts: ['Dulkadiroğlu', 'Onikişubat', 'Afşin', 'Andırın', 'Elbistan', 'Göksun', 'Pazarcık', 'Türkoğlu', 'Çağlayancerit', 'Ekinözü', 'Nurhak']
  },
  {
    id: 47,
    name: 'Mardin',
    districts: ['Artuklu', 'Kızıltepe', 'Midyat', 'Nusaybin', 'Derik', 'Mazıdağı', 'Dargeçit', 'Savur', 'Yeşilli', 'Ömerli']
  },
  {
    id: 48,
    name: 'Muğla',
    districts: ['Menteşe', 'Bodrum', 'Fethiye', 'Marmaris', 'Milas', 'Ortaca', 'Dalaman', 'Datça', 'Kavaklıdere', 'Köyceğiz', 'Seydikemer', 'Ula', 'Yatağan']
  },
  {
    id: 49,
    name: 'Muş',
    districts: ['Merkez', 'Bulanık', 'Malazgirt', 'Varto', 'Hasköy', 'Korkut']
  },
  {
    id: 50,
    name: 'Nevşehir',
    districts: ['Merkez', 'Avanos', 'Derinkuyu', 'Gülşehir', 'Hacıbektaş', 'Kozaklı', 'Ürgüp', 'Acıgöl']
  },
  {
    id: 51,
    name: 'Niğde',
    districts: ['Merkez', 'Bor', 'Çamardı', 'Ulukışla', 'Altunhisar', 'Çiftlik']
  },
  {
    id: 52,
    name: 'Ordu',
    districts: ['Altınordu', 'Ünye', 'Fatsa', 'Gölköy', 'Korgan', 'Kumru', 'Mesudiye', 'Perşembe', 'Ulubey', 'Akkuş', 'Aybastı', 'Çamaş', 'Çatalpınar', 'Çaybaşı', 'Gülyalı', 'Gürgentepe', 'İkizce', 'Kabadüz', 'Kabataş']
  },
  {
    id: 53,
    name: 'Rize',
    districts: ['Merkez', 'Ardeşen', 'Çamlıhemşin', 'Çayeli', 'Fındıklı', 'İkizdere', 'Kalkandere', 'Pazar', 'Güneysu', 'Derepazarı', 'Hemşin', 'İyidere']
  },
  {
    id: 54,
    name: 'Sakarya',
    districts: ['Adapazarı', 'Serdivan', 'Erenler', 'Hendek', 'Akyazı', 'Sapanca', 'Pamukova', 'Geyve', 'Karapürçek', 'Kocaali', 'Kaynarca', 'Ferizli', 'Söğütlü', 'Taraklı', 'Arifiye']
  },
  {
    id: 55,
    name: 'Samsun',
    districts: ['Atakum', 'İlkadım', 'Canik', 'Tekkeköy', 'Bafra', 'Çarşamba', 'Vezirköprü', 'Terme', 'Havza', 'Kavak', 'Alaçam', 'Asarcık', 'Ayvacık', 'Ladik', 'Ondokuzmayıs', 'Salıpazarı', 'Yakakent']
  },
  {
    id: 56,
    name: 'Siirt',
    districts: ['Merkez', 'Baykan', 'Eruh', 'Kurtalan', 'Pervari', 'Şirvan', 'Tillo']
  },
  {
    id: 57,
    name: 'Sinop',
    districts: ['Merkez', 'Ayancık', 'Boyabat', 'Durağan', 'Erfelek', 'Gerze', 'Türkeli', 'Dikmen', 'Saraydüzü']
  },
  {
    id: 58,
    name: 'Sivas',
    districts: ['Merkez', 'Divriği', 'Gemerek', 'Hafik', 'İmranlı', 'Kangal', 'Koyulhisar', 'Suşehri', 'Şarkışla', 'Yıldızeli', 'Zara', 'Akıncılar', 'Altınyayla', 'Doğanşar', 'Gölova', 'Ulaş']
  },
  {
    id: 59,
    name: 'Tekirdağ',
    districts: ['Süleymanpaşa', 'Çerkezköy', 'Çorlu', 'Ergene', 'Hayrabolu', 'Kapaklı', 'Malkara', 'Marmaraereğlisi', 'Muratlı', 'Saray', 'Şarköy']
  },
  {
    id: 60,
    name: 'Tokat',
    districts: ['Merkez', 'Almus', 'Artova', 'Erbaa', 'Niksar', 'Reşadiye', 'Turhal', 'Zile', 'Başçiftlik', 'Pazar', 'Sulusaray', 'Yeşilyurt']
  },
  {
    id: 61,
    name: 'Trabzon',
    districts: ['Ortahisar', 'Akçaabat', 'Araklı', 'Of', 'Yomra', 'Beşikdüzü', 'Çarşıbaşı', 'Çaykara', 'Dernekpazarı', 'Düzköy', 'Hayrat', 'Köprübaşı', 'Maçka', 'Sürmene', 'Şalpazarı', 'Tonya', 'Vakfıkebir']
  },
  {
    id: 62,
    name: 'Tunceli',
    districts: ['Merkez', 'Çemişgezek', 'Hozat', 'Mazgirt', 'Nazımiye', 'Ovacık', 'Pertek', 'Pülümür']
  },
  {
    id: 63,
    name: 'Şanlıurfa',
    districts: ['Eyyübiye', 'Haliliye', 'Karaköprü', 'Siverek', 'Viranşehir', 'Birecik', 'Harran', 'Hilvan', 'Suruç', 'Bozova', 'Akçakale', 'Ceylanpınar']
  },
  {
    id: 64,
    name: 'Uşak',
    districts: ['Merkez', 'Banaz', 'Eşme', 'Karahallı', 'Sivaslı', 'Ulubey']
  },
  {
    id: 65,
    name: 'Van',
    districts: ['İpekyolu', 'Tuşba', 'Edremit', 'Erciş', 'Özalp', 'Çaldıran', 'Başkale', 'Çatak', 'Gürpınar', 'Muradiye', 'Saray', 'Gevaş', 'Bahçesaray']
  },
  {
    id: 66,
    name: 'Yozgat',
    districts: ['Merkez', 'Akdağmadeni', 'Boğazlıyan', 'Çayıralan', 'Çekerek', 'Sarıkaya', 'Sorgun', 'Şefaatli', 'Yerköy', 'Aydıncık', 'Çandır', 'Kadışehri', 'Saraykent', 'Yenifakılı']
  },
  {
    id: 67,
    name: 'Zonguldak',
    districts: ['Merkez', 'Çaycuma', 'Devrek', 'Karabük', 'Ereğli', 'Alaplı', 'Gökçebey', 'Kilimli', 'Kozlu']
  },
  {
    id: 68,
    name: 'Aksaray',
    districts: ['Merkez', 'Ağaçören', 'Eskil', 'Gülağaç', 'Güzelyurt', 'Ortaköy', 'Sarıyahşi']
  },
  {
    id: 69,
    name: 'Bayburt',
    districts: ['Merkez', 'Aydıntepe', 'Demirözü']
  },
  {
    id: 70,
    name: 'Karaman',
    districts: ['Merkez', 'Ayrancı', 'Başyayla', 'Ermenek', 'Kazımkarabekir', 'Sarıveliler']
  },
  {
    id: 71,
    name: 'Kırıkkale',
    districts: ['Merkez', 'Bahşılı', 'Balışeyh', 'Çelebi', 'Delice', 'Karakeçili', 'Keskin', 'Sulakyurt', 'Yahşihan']
  },
  {
    id: 72,
    name: 'Batman',
    districts: ['Merkez', 'Beşiri', 'Gercüş', 'Kozluk', 'Sason', 'Hasankeyf']
  },
  {
    id: 73,
    name: 'Şırnak',
    districts: ['Merkez', 'Beytüşşebap', 'Cizre', 'İdil', 'Silopi', 'Uludere', 'Güçlükonak']
  },
  {
    id: 74,
    name: 'Bartın',
    districts: ['Merkez', 'Amasra', 'Kurucaşile', 'Ulus']
  },
  {
    id: 75,
    name: 'Ardahan',
    districts: ['Merkez', 'Çıldır', 'Damal', 'Göle', 'Hanak', 'Posof']
  },
  {
    id: 76,
    name: 'Iğdır',
    districts: ['Merkez', 'Aralık', 'Karakoyunlu', 'Tuzluca']
  },
  {
    id: 77,
    name: 'Yalova',
    districts: ['Merkez', 'Altınova', 'Armutlu', 'Çınarcık', 'Çiftlikköy', 'Termal']
  },
  {
    id: 78,
    name: 'Karabük',
    districts: ['Merkez', 'Eflani', 'Eskipazar', 'Ovacık', 'Safranbolu', 'Yenice']
  },
  {
    id: 79,
    name: 'Kilis',
    districts: ['Merkez', 'Elbeyli', 'Musabeyli', 'Polateli']
  },
  {
    id: 80,
    name: 'Osmaniye',
    districts: ['Merkez', 'Bahçe', 'Düziçi', 'Hasanbeyli', 'Kadirli', 'Sumbas', 'Toprakkale']
  },
  {
    id: 81,
    name: 'Düzce',
    districts: ['Merkez', 'Akçakoca', 'Cumayeri', 'Çilimli', 'Gölyaka', 'Gümüşova', 'Kaynaşlı', 'Yığılca']
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