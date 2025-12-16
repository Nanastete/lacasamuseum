// src/components/QRCodeDisplay.jsx
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Smartphone } from 'lucide-react';

const QRCodeDisplay = ({ url, title }) => {
  const [downloadFormat] = useState('png');
  
  const handleDownload = () => {
    // Get the SVG element
    const svg = document.getElementById(`qr-${title}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };
  
  return (
    <div className="bg-[#F8F5F2] p-6 rounded-lg text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Smartphone className="h-5 w-5 text-[#A85C32]" />
        <h4 className="font-semibold text-[#2D5A4A]">
          Scan to Learn More
        </h4>
      </div>
      
      {/* QR Code */}
      <div className="bg-white p-4 rounded-lg inline-block mb-4">
        <QRCodeSVG
          id={`qr-${title}`}
          value={url}
          size={200}
          level="H"
          includeMargin={true}
          fgColor="#2D5A4A"
        />
      </div>
      
      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="w-full bg-[#A85C32] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#8B4926] transition-colors flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download QR Code
      </button>
      
      <p className="text-xs text-gray-600 mt-2">
        Points to: {url}
      </p>
    </div>
  );
};

export default QRCodeDisplay;