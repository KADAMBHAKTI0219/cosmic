import React from 'react';
import { Link } from 'react-router-dom';

// Import product image
import solarModule from '../assets/images/power1.webp';

const CartPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const cartProduct = {
    id: 1,
    name: 'WAAREE 590Wp 144Cells 24 Volts N-Type Framed...',
    price: '₹10,599.00',
    image: solarModule,
    link: '/product/waaree-590wp-solar-module'
  };

  return (
    <div className="absolute top-12 sm:top-16 right-0 z-50 w-[calc(100vw-20px)] sm:w-80 max-w-sm bg-white rounded-md shadow-xl border border-gray-200">
      <div className="p-3 sm:p-4">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 p-1 sm:p-2 border border-gray-100 rounded-md">
            <img 
              src={cartProduct.image} 
              alt={cartProduct.name} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
              {cartProduct.name}
            </h3>
            <p className="text-sm sm:text-base font-bold text-gray-900 mt-1 sm:mt-2">
              {cartProduct.price}
            </p>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2">
          <Link 
            to="/cart" 
            className="text-center py-1.5 sm:py-2 px-2 sm:px-4 border border-main text-main rounded hover:bg-main-light transition-colors duration-200 text-xs sm:text-sm font-medium"
          >
            View Cart
          </Link>
          <Link 
            to="/checkout" 
            className="text-center py-1.5 sm:py-2 px-2 sm:px-4 bg-main text-white rounded hover:bg-main-dark transition-colors duration-200 text-xs sm:text-sm font-medium"
          >
            Check Out Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;