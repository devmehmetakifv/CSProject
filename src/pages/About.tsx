import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hakkında</h1>
        <p className="text-gray-700 text-lg mb-6">
          Sana mı iş yok? platformu, iş arayanlar ile işverenleri modern ve kullanıcı dostu bir arayüzde buluşturmayı amaçlar. 
          Kullanıcılar kolayca iş ilanlarına başvurabilir, işverenler ise ilanlarını yönetebilir ve başvuruları görüntüleyebilir. 
          Proje, React ve Firebase teknolojileriyle geliştirilmiştir.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default About;