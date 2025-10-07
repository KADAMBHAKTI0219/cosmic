import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { cartApi, ordersApi } from '../../services/api';
import GuestCheckout from '../checkout/GuestCheckout';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showGuestCheckout, setShowGuestCheckout] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verificationOtp, setVerificationOtp] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartApi.getCart();
      if (response.data.success) {
        const items = response.data.data.items || [];
        if (items.length === 0) {
          navigate('/cart');
          return;
        }
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Free shipping for orders above ₹10,000
    return subtotal > 10000 ? 0 : 250;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (orderLoading) return;
    
    setOrderLoading(true);
    setError(null);
    
    try {
      // Create order payload
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: calculateTotal(),
        shippingFee: calculateShipping()
      };
      
      let response;
      
      // Handle guest checkout or logged-in user checkout
      if (!isLoggedIn) {
        if (!verifiedEmail || !verificationOtp) {
          setShowGuestCheckout(true);
          setOrderLoading(false);
          return;
        }
        
        // Place order as guest with verified email
        response = await ordersApi.verifyEmailAndPlaceOrder({
          email: verifiedEmail,
          otp: verificationOtp,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: formData.paymentMethod,
          totalAmount: calculateTotal(),
          shippingFee: calculateShipping()
        });
      } else {
        // Place order as logged-in user
        response = await ordersApi.placeOrder(orderData);
      }
      
      if (response.data.success) {
        // Clear cart after successful order
        await cartApi.clearCart();
        
        // Redirect to order confirmation
        navigate(`/order-confirmation/${response.data.data._id}`);
      } else {
        setError(response.data.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };
  
  const handleGuestVerification = (email, otp) => {
    setVerifiedEmail(email);
    setVerificationOtp(otp);
    setShowGuestCheckout(false);
    setFormData({
      ...formData,
      email: email
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {showGuestCheckout && (
        <div className="mb-6">
          <GuestCheckout 
            onVerified={handleGuestVerification}
            onCancel={() => setShowGuestCheckout(false)}
          />
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Shipping Information</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Payment Method</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="online"
                      name="paymentMethod"
                      type="radio"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="online" className="ml-3 block text-sm font-medium text-gray-700">
                      Online Payment (Razorpay)
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:hidden">
              <button
                type="submit"
                disabled={orderLoading}
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium flex items-center justify-center ${
                  orderLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {orderLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock className="mr-2" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center text-green-600 hover:text-green-800"
            >
              <FaArrowLeft className="mr-2" />
              Back to Cart
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-60 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-start space-x-3 mb-3 pb-3 border-b border-gray-100">
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-50 p-1 border border-gray-100 rounded-md">
                    <img 
                      src={item.productId?.images?.[0] ? item.productId.images[0] : 'https://via.placeholder.com/100'} 
                      alt={item.productId?.name || 'Product'} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                      {item.productId?.name || 'Product'}
                    </h3>
                    <div className="flex justify-between items-end mt-1">
                      <p className="text-sm font-bold text-gray-900">
                        ₹{item.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{calculateShipping() === 0 ? 'Free' : `₹${calculateShipping()}`}</span>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (Including shipping & taxes)
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={orderLoading}
              className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium flex items-center justify-center ${
                orderLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={handleSubmit}
            >
              {orderLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaLock className="mr-2" />
                  Place Order
                </>
              )}
            </button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <div className="flex items-center justify-center mb-1">
                <FaLock className="text-green-600 mr-1" />
                Secure checkout
              </div>
              {formData.paymentMethod === 'online' && (
                <div>Powered by Razorpay</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;