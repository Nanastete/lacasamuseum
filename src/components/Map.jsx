import { MapPin, Navigation } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


const Map = () => {
  const { t } = useLanguage();

  const handleDirections = () => {
    const address = encodeURIComponent('San Jorge, Calle 10, La Paz, Bolivia');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl md:text-5xl font-bold text-[#2D5A4A] text-center mb-12"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t.location.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-8 w-8 text-[#A85C32] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-semibold text-[#2D5A4A] mb-2">
                  La Casa de Teresita
                </h3>
                <p className="text-xl text-gray-700">{t.location.address}</p>
              </div>
            </div>

            <button
              onClick={handleDirections}
              className="w-full lg:w-auto bg-[#A85C32] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#8B4926] transition-all duration-300 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Navigation className="h-5 w-5" />
              {t.location.directions}
            </button>

            <div className="bg-[#F8F5F2] p-6 rounded-lg">
              <h4 className="font-semibold text-[#2D5A4A] mb-3 text-lg">
                {t.location.title}
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>• 15 min del aeropuerto El Alto</li>
                <li>• 10 min del centro de La Paz</li>
                <li>• 5 min de la Plaza San Jorge</li>
                <li>• Estacionamiento gratuito disponible</li>
              </ul>
            </div>
          </div>

          <div className="h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30568.98857847054!2d-68.13!3d-16.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f206e5c5d0c9d%3A0x1d0b5c5c5c5c5c5c!2sLa%20Paz%2C%20Bolivia!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Location Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
