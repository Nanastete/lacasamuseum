// src/components/ArtworkCard.jsx
import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import QRCodeDisplay from './QRCodeDisplay';

const ArtworkCard = ({ artwork }) => {
  const [showModal, setShowModal] = useState(false);
  
  // Category icons/colors
  const categoryStyles = {
    Painting: 'bg-red-100 text-red-800',
    Sculpture: 'bg-blue-100 text-blue-800',
    Piano: 'bg-purple-100 text-purple-800',
    Furniture: 'bg-amber-100 text-amber-800',
    Document: 'bg-green-100 text-green-800'
  };
  
  return (
    <>
      {/* Card */}
      <div 
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={artwork.image} 
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[artwork.category] || 'bg-gray-100 text-gray-800'}`}>
              {artwork.category}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-[#2D5A4A] mb-1 group-hover:text-[#A85C32] transition-colors">
            {artwork.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {artwork.artist} · {artwork.year}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{artwork.location}</span>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="sticky top-4 right-4 float-right bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            
            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="space-y-4">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                  
                  {/* QR Code */}
                  {artwork.qrCode && (
                    <QRCodeDisplay 
                      url={artwork.qrCode} 
                      title={artwork.title}
                    />
                  )}
                </div>
                
                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${categoryStyles[artwork.category]}`}>
                      {artwork.category}
                    </span>
                    <h2 
                      className="text-3xl font-bold text-[#2D5A4A] mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {artwork.title}
                    </h2>
                    <p className="text-xl text-gray-600 mb-4">
                      {artwork.artist} · {artwork.year}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 bg-[#F8F5F2] p-3 rounded-lg">
                    <MapPin className="h-5 w-5 text-[#A85C32]" />
                    <span>{artwork.location}</span>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown>{artwork.body}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtworkCard;