// src/components/AccessoriesSection.jsx
import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Coffee, Car, Mountain, ParkingCircle, Bed } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const AccessoriesSection = ({ roomId, onAccessoriesChange }) => {
  const { language } = useLanguage();
  const { accessories, config } = useData();
  const [selectedAccessories, setSelectedAccessories] = useState({});

  const iconMap = {
    'petit-dejeuner': Coffee,
    'transfert-aeroport': Car,
    'excursion': Mountain,
    'parking': ParkingCircle,
    'lit-supplementaire': Bed,
  };

  const getIcon = (id) => {
    const Icon = iconMap[id] || Plus;
    return Icon;
  };

  const handleQuantityChange = (accessoryId, delta) => {
    const newQuantity = Math.max(0, (selectedAccessories[accessoryId] || 0) + delta);
    const newSelected = {
      ...selectedAccessories,
      [accessoryId]: newQuantity
    };
    
    // Remove if quantity is 0
    if (newQuantity === 0) {
      delete newSelected[accessoryId];
    }
    
    setSelectedAccessories(newSelected);
    
    // Notify parent component
    if (onAccessoriesChange) {
      onAccessoriesChange(newSelected);
    }
  };

  const calculateTotal = () => {
    return Object.entries(selectedAccessories).reduce((total, [id, qty]) => {
      const accessory = accessories.find(a => a.id === id);
      return total + (accessory ? accessory.prix * qty : 0);
    }, 0);
  };

  if (!accessories || accessories.length === 0) {
    return null;
  }

  const total = calculateTotal();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-6 w-6 text-[#A85C32]" />
        <h3 className="text-2xl font-bold text-[#2D5A4A]">
          {language === 'en' ? 'Add-ons & Services' : 'Servicios Adicionales'}
        </h3>
      </div>

      <div className="space-y-4">
        {accessories.map((accessory) => {
          const Icon = getIcon(accessory.id);
          const quantity = selectedAccessories[accessory.id] || 0;

          return (
            <div 
              key={accessory.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-[#A85C32] transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className="bg-[#F8F5F2] p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-[#A85C32]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {accessory.nom}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {accessory.description}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#A85C32]">
                        ${accessory.prix}
                      </span>
                      <span className="text-sm text-gray-500">
                        {config.currency || 'USD'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleQuantityChange(accessory.id, -1)}
                    disabled={quantity === 0}
                    className={`p-2 rounded-lg transition-colors ${
                      quantity === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#F8F5F2] text-[#A85C32] hover:bg-[#A85C32] hover:text-white'
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="w-8 text-center font-semibold text-gray-900">
                    {quantity}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(accessory.id, 1)}
                    className="p-2 rounded-lg bg-[#A85C32] text-white hover:bg-[#8B4926] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {quantity > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {language === 'en' ? 'Subtotal' : 'Subtotal'}:
                    </span>
                    <span className="font-semibold text-[#A85C32]">
                      ${(accessory.prix * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Total Add-ons' : 'Total Servicios'}:
            </span>
            <span className="text-2xl font-bold text-[#A85C32]">
              ${total.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-500 text-right">
            {language === 'en' 
              ? 'Added to your booking total'
              : 'Se agregará al total de tu reserva'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AccessoriesSection;