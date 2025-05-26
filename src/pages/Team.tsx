import React from 'react';

interface TeamMember {
  id: number;
  name: string;
  department: string;
  year: string;
  role: string;
  focus: string;
  description: string;
  image?: string | null;
  skills: string[];
}

const Team: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Furkan Demir",
      department: "Bilgisayar Mühendisliği",
      year: "3. Sınıf",
      role: "Full Stack Developer",
      focus: "Backend & Frontend",
      description: "Projenin teknik mimarisi ve backend geliştirmesinde öncü rol aldı. Aynı zamanda frontend tarafında da aktif katkı sağladı.",
      image: "/assets/images/furkan.jpeg",
      skills: ["React", "Node.js", "TypeScript", "Database Design"]
    },
    {
      id: 2,
      name: "Mehmet Çolaker",
      department: "Yazılım Mühendisliği",
      year: "1. Sınıf",
      role: "Frontend Developer",
      focus: "Frontend Development",
      description: "Kullanıcı arayüzü tasarımı ve frontend geliştirmede yaratıcı çözümler üretti. Modern web teknolojilerini hızla öğrendi.",
      image: "/assets/images/mehmet.jpg",
      skills: ["React", "CSS", "JavaScript", "UI/UX Design"]
    },
    {
      id: 3,
      name: "Emre Bıyık",
      department: "Bilgisayar Mühendisliği",
      year: "3. Sınıf",
      role: "Backend Developer",
      focus: "Backend Development",
      description: "Sunucu tarafı geliştirme ve veritabanı yönetiminde uzmanlaştı. API tasarımı ve güvenlik konularında liderlik etti.",
      image: "/assets/images/emre.jpeg",
      skills: ["Node.js", "Express", "MongoDB", "API Development"]
    },
    {
      id: 4,
      name: "Sıla Maçin",
      department: "Yazılım Mühendisliği",
      year: "Hazırlık",
      role: "Frontend Developer",
      focus: "Frontend Development",
      description: "Kullanıcı deneyimi odaklı tasarımlar geliştirdi. Responsive design ve modern CSS teknikleri konusunda yetenekli.",
      image: null,
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design"]
    },
    {
      id: 5,
      name: "Mehmet Akif",
      department: "Yazılım Mühendisliği",
      year: "3. Sınıf",
      role: "Mentor & Team Lead",
      focus: "Mentörlük & Proje Yönetimi",
      description: "Takım mentoru olarak projenin koordinasyonunu sağladı. Teknik rehberlik ve proje yönetimi konularında liderlik etti.",
      image: "/assets/images/mehmetAkif.png",
      skills: ["Project Management", "Mentoring", "Team Leadership", "Software Architecture"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Project Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl mb-20">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full opacity-10 blur-3xl transform -translate-x-48 translate-y-48"></div>
          </div>
          
          <div className="relative px-8 py-16 md:px-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white shadow-lg rounded-full text-blue-700 font-semibold mb-8 border border-blue-100">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Proje Tamamlandı
              </div>
              
              {/* Main title */}
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8 leading-tight py-2">
                SANA İŞ Mİ YOK
              </h1>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Üniversite öğrencileri tarafından <span className="font-semibold text-blue-600">modern web teknolojileri</span> 
                kullanılarak geliştirilmiş kapsamlı bir platform
              </p>
              
              <p className="text-base text-gray-500 mb-12 leading-relaxed max-w-3xl mx-auto">
                React, TypeScript, Node.js ve diğer güncel teknolojiler ile kullanıcı dostu bir deneyim sunmayı hedefledik. 
                Projemiz, hem iş arayanlar hem de işverenler için kapsamlı bir çözüm sunmaktadır.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                  <div className="text-sm text-gray-600 font-medium">Ekip Üyesi</div>
                </div>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                  <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
                  <div className="text-sm text-gray-600 font-medium">Ay Süre</div>
                </div>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                  <div className="text-3xl font-bold text-green-600 mb-2">56</div>
                  <div className="text-sm text-gray-600 font-medium">Commit</div>
                </div>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
                  <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
                  <div className="text-sm text-gray-600 font-medium">Kahve</div>
                </div>
              </div>
              
              {/* Tech stack */}
              <div className="flex flex-wrap justify-center gap-3">
                {['React', 'TypeScript', 'Node.js', 'Firebase', 'Tailwind CSS'].map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-white bg-opacity-80 backdrop-blur-sm rounded-full text-gray-700 font-medium text-sm shadow-md border border-white border-opacity-30">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ekibimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bu projeyi hayata geçiren yetenekli ve tutkulu ekibimizle tanışın
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Profile Image */}
              <div className="relative h-72 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                    style={{ objectPosition: 'center top' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-1">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.department} - {member.year}
                  </p>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {member.focus}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {member.description}
                </p>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Yetenekler:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Galeri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proje geliştirme sürecinden ve ekip çalışmalarımızdan kareler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { src: "/assets/images/ekip1.jpeg", alt: "Ekip Fotoğrafı 1" },
              { src: "/assets/images/ekip2.jpeg", alt: "Ekip Fotoğrafı 2" },
              { src: "/assets/images/ekip3.jpeg", alt: "Ekip Fotoğrafı 3" },
              { src: "/assets/images/ekip4.jpeg", alt: "Ekip Fotoğrafı 4" }
            ].map((image, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default Team; 