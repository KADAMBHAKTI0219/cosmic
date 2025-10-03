import React from 'react';
import { Link } from 'react-router-dom';

// Import product images
import solarModule1 from '../assets/images/power1.webp';
import solarModule2 from '../assets/images/power2.webp';
import solarModule3 from '../assets/images/power3.webp';
import solarModule4 from '../assets/images/power4.webp';

const SearchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const recommendedProducts = [
    {
      id: 1,
      name: 'WAAREE 540Wp 144 Cells Mono PERC Solar Module',
      image: solarModule1,
      link: '/product/waaree-540wp-solar-module'
    },
    {
      id: 2,
      name: 'WAAREE 10Wp Small Solar Module',
      image: solarModule2,
      link: '/product/waaree-10wp-small-solar-module'
    },
    {
      id: 3,
      name: 'WAAREE 3 Kw On Grid Single Phase Bifacial DCR Solar System',
      image: solarModule3,
      link: '/product/waaree-3kw-on-grid-solar-system'
    },
    {
      id: 4,
      name: 'WAAREE 580Wp 144Cells 24 Volts TOPCON N-Type Framed Dual Glass Bifacial Non-DCR Solar Module',
      image: solarModule4,
      link: '/product/waaree-580wp-topcon-solar-module'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-4 sm:pt-10 md:pt-20 px-2 sm:px-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95%] sm:max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">Search</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-xl sm:text-2xl font-bold">×</span>
          </button>
        </div>
        
        <div className="p-3 sm:p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-md py-1.5 sm:py-2 px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Recommended Products</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {recommendedProducts.map(product => (
              <Link 
                key={product.id} 
                to={product.link}
                className="border border-gray-200 rounded-lg p-2 sm:p-3 hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-square overflow-hidden mb-1 sm:mb-2">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">{product.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;