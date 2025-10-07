import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartApi } from '../services/api';
import { fixImageUrl } from '../utils/imageUtils';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

// Import product image as fallback
import solarModule from '../assets/images/power1.webp';

const CartPopup = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);
  
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await cartApi.getCart();
      if (response.data.success) {
        const items = response.data.data.items || [];
        setCartItems(items);
        
        // Calculate total price
        const total = items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
        setTotalPrice(total);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveItem = async (itemId, e) => {
    e.stopPropagation();
    try {
      await cartApi.removeCartItem(itemId);
      fetchCartItems(); // Refresh cart after removal
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
  
  if (!isOpen) return null;
  
  // Fallback cart product if API fails
  const fallbackProduct = {
    _id: 1,
    name: 'WAAREE 590Wp 144Cells 24 Volts N-Type Framed...',
    price: 10599,
    images: [solarModule],
    link: '/product/waaree-590wp-solar-module'
  };

  return (
    <div className="absolute top-12 sm:top-16 right-0 z-50 w-[calc(100vw-20px)] sm:w-96 max-w-sm bg-white rounded-md shadow-xl border border-gray-200">
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-center mb-3 border-b pb-2">
          <h3 className="font-medium text-gray-800">Your Cart</h3>
          <span className="text-sm text-gray-500">{cartItems.length} item(s)</span>
        </div>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-200 rounded-md"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="max-h-60 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-start space-x-3 sm:space-x-4 mb-3 pb-3 border-b border-gray-100">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-50 p-1 border border-gray-100 rounded-md">
                  <img 
                    src={item.productId?.images?.[0] ? fixImageUrl(item.productId.images[0]) : fallbackProduct.images[0]} 
                    alt={item.productId?.name || 'Product'} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
                      {item.productId?.name || 'Product'}
                    </h3>
                    <button 
                      onClick={(e) => handleRemoveItem(item._id, e)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{item.price || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center font-medium mt-2">
              <span>Total:</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <FaShoppingCart className="mx-auto text-gray-300 text-4xl mb-2" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        )}
        
        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2">
          <Link 
            to="/cart" 
            className="text-center py-1.5 sm:py-2 px-2 sm:px-4 border border-main text-main rounded hover:bg-main-light transition-colors duration-200 text-xs sm:text-sm font-medium"
            onClick={onClose}
          >
            View Cart
          </Link>
          <Link 
            to="/checkout" 
            className="text-center py-1.5 sm:py-2 px-2 sm:px-4 bg-main text-white rounded hover:bg-main-dark transition-colors duration-200 text-xs sm:text-sm font-medium"
            onClick={(e) => {
              if (cartItems.length === 0) {
                e.preventDefault();
              } else {
                onClose();
              }
            }}
          >
            Check Out Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;