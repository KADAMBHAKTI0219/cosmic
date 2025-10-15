import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { shippingApi, ordersApi, cartApi } from '../services/api';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(true);
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Try to get order details from shipping API
        const response = await shippingApi.getOrderDetails(orderId);
        setOrder(response.data.data);
        setOrderDetails(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching order details:', err);
        
        // Fallback to orders API if shipping API fails
        try {
          const orderResponse = await ordersApi.getOrderById(orderId);
          setOrderDetails(orderResponse.data.data);
          setOrder(orderResponse.data.data);
          setError(null);
        } catch (orderErr) {
          setError(err.response?.data?.message || 'Failed to load order details');
          toast.error(err.response?.data?.message || 'Failed to load order details');
        }
      } finally {
        setLoading(false);
      }
    };

    const clearCart = async () => {
      try {
        await cartApi.clearCart();
        setCartCleared(true);
        console.log('Cart cleared successfully');
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    };

    if (orderId) {
      fetchOrderDetails();
      clearCart(); // Clear cart when order confirmation page loads
    }
  }, [orderId]);

  const confirmOrder = async () => {
    setConfirmLoading(true);
    try {
      await shippingApi.confirmOrder(orderId);
      setSuccess(true);
      toast.success('Order confirmed successfully!');
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm order. Please try again or contact customer support.');
      toast.error(err.response?.data?.message || 'Failed to confirm order');
    } finally {
      setConfirmLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!showCancelForm) {
      setShowCancelForm(true);
      return;
    }
    
    if (!cancelReason.trim()) {
      setError('Please provide a reason for cancellation');
      toast.error('Please provide a reason for cancellation');
      return;
    }
    
    setCancelLoading(true);
    try {
      await shippingApi.cancelOrder(orderId, { reason: cancelReason });
      setSuccess(true);
      setError(null);
      toast.success('Order cancelled successfully');
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order. Please try again or contact customer support.');
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">
            <FaCheckCircle className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for confirming your order. We'll process it right away.</p>
          
          <div className="mb-6">
            <p className="text-gray-700 font-medium">Order ID: <span className="font-bold">{orderId}</span></p>
            <p className="text-gray-700 font-medium mt-2">Total Amount: <span className="font-bold">₹{order?.totalAmount || orderDetails?.totalPrice || 0}</span></p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
            >
              Continue Shopping
            </Link>
            
            <Link 
              to="/account/orders" 
              className="w-full py-2 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition duration-200"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Thank You Popup */}
      {showThankYouPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 relative">
            <button 
              onClick={() => setShowThankYouPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimesCircle />
            </button>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
              <div className="mb-4">
                <p className="text-gray-700 font-medium">Order ID: <span className="font-bold">{orderId}</span></p>
              </div>
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
                  onClick={() => setShowThankYouPopup(false)}
                >
                  Continue Shopping
                </Link>
                <Link 
                  to="/account/orders" 
                  className="w-full py-2 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition duration-200"
                  onClick={() => setShowThankYouPopup(false)}
                >
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Confirm Your Order</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {order ? (
          <div>
            <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p>{order?.shippingAddress?.fullName}</p>
                <p>{order?.shippingAddress?.addressLine1}</p>
                {order?.shippingAddress?.addressLine2 && <p>{order?.shippingAddress?.addressLine2}</p>}
                <p>
                  {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.postalCode}
                </p>
                <p>{order?.shippingAddress?.country}</p>
                <p>Phone: {order?.shippingAddress?.phone}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Order Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Product</th>
                      <th className="py-2 px-4 text-right">Quantity</th>
                      <th className="py-2 px-4 text-right">Price</th>
                      <th className="py-2 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.items?.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4">
                          <div className="flex items-center">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                            )}
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-right">{item.quantity}</td>
                        <td className="py-2 px-4 text-right">₹{item.price}</td>
                        <td className="py-2 px-4 text-right">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>₹{order?.totalAmount?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Shipping</p>
                <p>₹{order?.shippingCharges?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <p>Total</p>
                <p>₹{((order?.totalAmount || 0) + (order?.shippingCharges || 0)).toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Shipping Charges Added</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>The admin has added shipping charges to your order. Please review the total amount and confirm your order.</p>
                    {order?.adminNotes && (
                      <div className="mt-2">
                        <p className="font-medium">Admin Notes:</p>
                        <p>{order?.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!showCancelForm ? (
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={confirmOrder}
                  disabled={confirmLoading}
                  className="w-full sm:w-auto bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 disabled:bg-gray-400"
                >
                  {confirmLoading ? 'Processing...' : 'Confirm Order'}
                </button>
                <button
                  onClick={cancelOrder}
                  className="w-full sm:w-auto bg-white border border-red-500 text-red-500 py-2 px-6 rounded-md hover:bg-red-50 transition duration-300"
                >
                  Cancel Order
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Reason for Cancellation</h3>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  rows="3"
                  placeholder="Please provide a reason for cancellation"
                ></textarea>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={cancelOrder}
                    disabled={cancelLoading}
                    className="w-full sm:w-auto bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400"
                  >
                    {cancelLoading ? 'Processing...' : 'Confirm Cancellation'}
                  </button>
                  <button
                    onClick={() => setShowCancelForm(false)}
                    className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-50 transition duration-300"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center p-8">
            <FaSpinner className="animate-spin text-blue-600 text-2xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;