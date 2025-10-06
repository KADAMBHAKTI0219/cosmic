import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { orderManagementApi } from '../../services/adminApi';
import { toast } from 'react-toastify';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API से ऑर्डर्स लोड करना
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderManagementApi.getAllOrders();
        // Check if response.data is an array, if not, try to extract the array from response.data
        const ordersData = Array.isArray(response.data) ? response.data : 
                          (response.data.data || response.data.orders || []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setError(null);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        console.error('Error fetching orders:', err);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };
  
  const handleEditClick = (order) => {
    setEditOrder({...order});
    setShowEditModal(true);
  };
  
  const handleEditOrder = () => {
    setOrders(orders.map(order => 
      order.id === editOrder.id ? editOrder : order
    ));
    setShowEditModal(false);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await orderManagementApi.updateOrderStatus(id, newStatus);
      
      // API से ऑर्डर्स को फिर से लोड करना
      const response = await orderManagementApi.getAllOrders();
      const ordersData = Array.isArray(response.data) ? response.data : 
                        (response.data.data || response.data.orders || []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      
      toast.success('Order status updated successfully');
      setShowDetailsModal(false);
    } catch (err) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  const handleDeleteOrder = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const statusColors = {
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Shipped': 'bg-blue-100 text-blue-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div>
          <select
            className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleViewDetails(order)}
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEditClick(order)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order #{selectedOrder.id} Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500 text-sm">Customer</p>
                <p className="font-medium">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Order Date</p>
                <p className="font-medium">{selectedOrder.date}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Amount</p>
                <p className="font-medium">{selectedOrder.total}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-medium">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Order Items</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample order items - would be replaced with actual data */}
                  {Array.from({ length: selectedOrder.items }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">Product {index + 1}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{Math.floor(Math.random() * 3) + 1}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">₹{(Math.random() * 1000).toFixed(2)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">₹{(Math.random() * 2000).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Update Status</h3>
              <div className="flex space-x-2">
                {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedOrder.status === status 
                        ? 'bg-[#92c51b] text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    disabled={selectedOrder.status === status}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && editOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Order #{editOrder.id}</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Customer Name</label>
              <input
                type="text"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editOrder.customer}
                onChange={(e) => setEditOrder({...editOrder, customer: e.target.value})}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Order Date</label>
              <input
                type="date"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editOrder.date}
                onChange={(e) => setEditOrder({...editOrder, date: e.target.value})}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editOrder.status}
                onChange={(e) => setEditOrder({...editOrder, status: e.target.value})}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#92c51b] hover:bg-[#7ba515] text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleEditOrder}
              >
                <FaSave className="mr-2" /> Update Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;