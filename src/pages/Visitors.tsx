import React from 'react';

const Visitors: React.FC = () => {
  // Gerçek fotoğraflar eklendi
  const visitorPhotos = [
    {
      id: 1,
      src: "/assets/images/sizdengelenler1.jpeg",
      alt: "Proje Tanıtımı - Ziyaretçi 1",
      description: "Projemizi inceleyen öğrenci arkadaşlarımız"
    },
    {
      id: 2,
      src: "/assets/images/sizdengelenler2.jpeg",
      alt: "Proje Tanıtımı - Ziyaretçi 2", 
      description: "Demo sırasında çekilen anılar"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-3xl mb-20">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full opacity-10 blur-3xl transform -translate-x-48 translate-y-48"></div>
          </div>
          
          <div className="relative px-8 py-16 md:px-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white shadow-lg rounded-full text-green-700 font-semibold mb-8 border border-green-100">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                Proje Tanıtımı
              </div>
              
              {/* Main title */}
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 bg-clip-text text-transparent mb-8 leading-tight py-2">
                SİZDEN GELENLER
              </h1>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Okulda projemizi tanıttığımız sırada <span className="font-semibold text-green-600">sizlerle birlikte</span> çektiğimiz unutulmaz anılar
              </p>
              
              <p className="text-base text-gray-500 mb-12 leading-relaxed max-w-3xl mx-auto">
                Projemizi merak eden arkadaşlarımız, öğretmenlerimiz ve ziyaretçilerimizle birlikte geçirdiğimiz 
                keyifli anları sizlerle paylaşıyoruz. Her fotoğraf, projemizin ne kadar ilgi gördüğünün bir kanıtı.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                  <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Ziyaretçi</div>
                </div>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
                  <div className="text-sm text-gray-600 font-medium">Sunum Günü</div>
                </div>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                  <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
                  <div className="text-sm text-gray-600 font-medium">Güzel Anı</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fotoğraf Galerisi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proje tanıtımı sırasında çekilen özel anlarımız
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {visitorPhotos.map((photo) => (
              <div
                key={photo.id}
                className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Photo */}
                <div className="relative h-80 bg-gradient-to-br from-green-400 to-blue-500 overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Siz de Projemizi Merak Ediyor musunuz?
          </h3>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Projemiz hakkında daha fazla bilgi almak ve demo görmek için bizimle iletişime geçin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/team"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              Ekibimizi Tanıyın
            </a>
            <a
              href="/jobs"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              Projeyi İnceleyin
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Visitors; 