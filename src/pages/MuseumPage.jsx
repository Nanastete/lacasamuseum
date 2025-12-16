// src/pages/MuseumPage.jsx
import { useState, useEffect } from 'react';
import { Building2, Filter, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getArtworksByCategory } from '../utils/contentLoader';
import ArtworkCard from '../components/ArtworkCard';
import SEOHelmet from '../components/SEOHelmet';

const MuseumPage = () => {
  const { language, t } = useLanguage();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Painting', 'Sculpture', 'Piano', 'Furniture', 'Document'];
  
  useEffect(() => {
    loadArtworks();
  }, [language, selectedCategory]);
  
  const loadArtworks = async () => {
    setLoading(true);
    try {
      const loadedArtworks = await getArtworksByCategory(
        selectedCategory === 'All' ? null : selectedCategory, 
        language
      );
      setArtworks(loadedArtworks);
    } catch (error) {
      console.error('Error loading artworks:', error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBookTour = () => {
    const phoneNumber = "59170675985";
    const message = encodeURIComponent(
      language === 'en'
        ? "Hello! I'm interested in booking a guided museum tour at La Casa de Teresita. Could you provide more information? Thank you."
        : "¡Hola! Estoy interesado en reservar un tour guiado del museo en La Casa de Teresita. ¿Podrían proporcionar más información? Gracias."
    );
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };
  
  return (
    <div className="min-h-screen pt-20 bg-[#F8F5F2]">
      <SEOHelmet
        title={t.museum.title}
        description={t.museum.metaDescription}
        url="/museum"
        type="website"
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D5A4A] via-[#3D6A5A] to-[#A85C32] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-12 w-12" />
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.museum.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            {t.museum.subtitle}
          </p>
        </div>
      </section>
      
      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">
            {t.museum.intro1}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t.museum.intro2}
          </p>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">{t.museum.filterBy}:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#A85C32] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Artworks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A85C32] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading collection...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">{t.museum.noArtworks}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.slug} artwork={artwork} />
            ))}
          </div>
        )}
      </section>
      
      {/* Visit CTA */}
      <section className="bg-gradient-to-r from-[#2D5A4A] to-[#A85C32] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.museum.visitTitle}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {t.museum.visitText}
          </p>
          <button
            onClick={handleBookTour}
            className="bg-[#25D366] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#20BA5A] transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 mx-auto"
          >
            <MessageCircle className="h-6 w-6" />
            {t.museum.bookTour}
          </button>
        </div>
      </section>
    </div>
  );
};

export default MuseumPage;