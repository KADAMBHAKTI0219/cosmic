import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaEye, FaSearch } from 'react-icons/fa';
import { ordersApi } from '../../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.getUserOrders();
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('There was a problem loading your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Function to get status text
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    
    return statusMap[status] || status;
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
          <span className="ml-3 text-gray-600">Loading your orders...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-xl mb-6 shadow-sm border border-red-100">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-red-700 hover:text-red-800 font-medium flex items-center"
          >
            Try Again
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl shadow-sm border border-gray-100">
          <FaBox className="mx-auto h-20 w-20 text-gray-300 mb-6" />
          <h3 className="text-2xl font-medium text-gray-700 mb-3">No Orders Found</h3>
          <p className="text-gray-500 mb-8 text-lg">You haven't placed any orders yet</p>
          <Link to="/" className="bg-main text-white px-8 py-3 rounded-lg hover:bg-main-dark transition-colors duration-300 font-medium inline-flex items-center">
            <FaShoppingBag className="mr-2" /> Shop Now
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber || order._id.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{order.totalAmount?.toFixed(2) || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/orders/${order._id}`} 
                        className="text-main hover:text-main-dark flex items-center transition-colors duration-150"
                      >
                        <FaEye className="mr-1" /> View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;