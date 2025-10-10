import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cartApi } from '../services/api';
import { fixImageUrl } from '../utils/imageUtils';
import { FaShoppingCart, FaTrash, FaTimes, FaArrowRight, FaBolt, FaStar } from 'react-icons/fa';

// Import product image as fallback
import solarModule from '../assets/images/power1.webp';

const CartPopup = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const cartRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
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
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"></div>
      )}
      
      {/* Offcanvas */}
      <div 
        ref={cartRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxWidth: '100%' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaShoppingCart className="mr-2" /> 
              Your Cart <span className="ml-2 text-sm text-gray-500">({cartItems.length} items)</span>
            </h3>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          {/* Body */}
           <div className="flex-1 overflow-y-auto">
             {loading ? (
               <div className="p-8 text-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto"></div>
                 <p className="mt-4 text-sm text-gray-500">Loading your cart...</p>
               </div>
             ) : cartItems.length === 0 ? (
               <div className="p-8 text-center">
                 <FaShoppingCart className="mx-auto h-16 w-16 text-gray-300" />
                 <p className="mt-4 text-base text-gray-500">Your cart is empty</p>
                 <Link 
                   to="/products" 
                   className="mt-6 inline-block px-6 py-3 bg-main text-white text-sm font-medium rounded-md hover:bg-main-dark transition-colors duration-200"
                   onClick={onClose}
                 >
                   Browse Products
                 </Link>
               </div>
             ) : (
               <>
                 <ul className="divide-y divide-gray-100">
                   {cartItems.map((item) => (
                     <li key={item._id} className="p-4 hover:bg-gray-50">
                       <div className="flex items-center space-x-4">
                         <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                           <img 
                             src={item.product?.images?.[0] ? fixImageUrl(item.product.images[0]) : solarModule} 
                             alt={item.product?.name || 'Product'} 
                             className="w-full h-full object-cover"
                           />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-gray-900 truncate">
                             {item.product?.name || 'Product'}
                           </p>
                           <div className="flex items-center mt-1">
                             <span className="text-sm text-gray-500 mr-2">Qty: {item.quantity}</span>
                             <div className="flex items-center space-x-2">
                               <button className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300">-</button>
                               <button className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300">+</button>
                             </div>
                           </div>
                           <p className="text-sm font-medium text-main mt-1">
                             ₹{item.price || 0}
                           </p>
                         </div>
                         <div>
                           <button
                             onClick={(e) => handleRemoveItem(item._id, e)}
                             className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                             aria-label="Remove item"
                           >
                             <FaTrash className="h-4 w-4" />
                           </button>
                         </div>
                       </div>
                     </li>
                   ))}
                 </ul>
                 
                 {/* Product Recommendations */}
                 <div className="mt-4 p-4 border-t border-gray-200">
                   <div className="flex items-center justify-between mb-3">
                     <h3 className="text-sm font-medium text-gray-900">Recommended for You</h3>
                     <div className="flex items-center text-xs text-main">
                       <span>Personalized</span>
                       <FaBolt className="ml-1 text-yellow-500" />
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                     {/* Recommendation 1 */}
                     <div className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                       <div className="relative">
                         <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-2">
                           <img 
                             src={solarModule} 
                             alt="Solar Panel" 
                             className="w-full h-full object-cover"
                           />
                         </div>
                         <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
                           Best Seller
                         </div>
                       </div>
                       <h4 className="text-xs font-medium text-gray-900 line-clamp-2">Solar Panel 450W Monocrystalline</h4>
                       <div className="flex items-center mt-1 mb-1">
                         <div className="flex text-yellow-400 text-xs">
                           <FaStar />
                           <FaStar />
                           <FaStar />
                           <FaStar />
                           <FaStar className="text-gray-300" />
                         </div>
                         <span className="text-xs text-gray-500 ml-1">(42)</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <div>
                           <p className="text-xs font-bold text-main">₹12,999</p>
                           <p className="text-xs text-gray-500 line-through">₹15,999</p>
                         </div>
                         <button className="text-xs bg-main text-white px-2 py-1 rounded-full hover:bg-main-dark transition-colors duration-200 flex items-center">
                           <span>Add</span>
                           <FaShoppingCart className="ml-1 text-xs" />
                         </button>
                       </div>
                     </div>
                     
                     {/* Recommendation 2 */}
                     <div className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                       <div className="relative">
                         <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-2">
                           <img 
                             src={solarModule} 
                             alt="Solar Inverter" 
                             className="w-full h-full object-cover"
                           />
                         </div>
                         <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
                           20% Off
                         </div>
                       </div>
                       <h4 className="text-xs font-medium text-gray-900 line-clamp-2">Solar Inverter 3kW Pure Sine Wave</h4>
                       <div className="flex items-center mt-1 mb-1">
                         <div className="flex text-yellow-400 text-xs">
                           <FaStar />
                           <FaStar />
                           <FaStar />
                           <FaStar />
                           <FaStar className="text-yellow-400" />
                         </div>
                         <span className="text-xs text-gray-500 ml-1">(28)</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <div>
                           <p className="text-xs font-bold text-main">₹18,499</p>
                           <p className="text-xs text-gray-500 line-through">₹22,999</p>
                         </div>
                         <button className="text-xs bg-main text-white px-2 py-1 rounded-full hover:bg-main-dark transition-colors duration-200 flex items-center">
                           <span>Add</span>
                           <FaShoppingCart className="ml-1 text-xs" />
                         </button>
                       </div>
                     </div>
                   </div>
                   
                   <div className="mt-3">
                     <Link to="/products" onClick={onClose} className="text-xs text-main hover:text-main-dark flex items-center justify-center w-full">
                       View more recommendations <FaArrowRight className="ml-1" />
                     </Link>
                   </div>
                 </div>
               </>
             )}
          </div>
          
          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-3">
                <p>Subtotal</p>
                <p>₹{totalPrice.toLocaleString()}</p>
              </div>
              <div className="mt-4 space-y-2">
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-main hover:bg-main-dark focus:outline-none transition-colors duration-200"
                  onClick={onClose}
                >
                  Proceed to Checkout <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/cart"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                  onClick={onClose}
                >
                  View Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPopup;