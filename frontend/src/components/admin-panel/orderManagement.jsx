import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { orderManagementApi } from '../../services/adminApi';
import { toast } from 'react-toastify';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderManagementApi.getAllOrders();
        console.log('Orders response:', response);
        
        // Extract orders data from response
        const ordersData = response.data && response.data.data ? response.data.data : [];
        
        // Transform data for display
        const formattedOrders = ordersData.map(order => ({
          id: order._id,
          orderId: order.orderId,
          customer: order.userId ? (order.userId.name || 'Unknown User') : 'Unknown User',
          email: order.userId ? (order.userId.email || 'No Email') : 'No Email',
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.orderStatus,
          total: `₹${order.totalPrice.toFixed(2)}`,
          items: order.items.length,
          rawData: order
        }));
        
        setOrders(formattedOrders);
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
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (order.orderId && order.orderId.toString().includes(searchTerm));
    
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
      console.log('Updating order status:', id, newStatus);
      // Pass the orderStatus parameter correctly
      await orderManagementApi.updateOrderStatus(id, newStatus);
      
      // Reload orders after status update
      const response = await orderManagementApi.getAllOrders();
      const ordersData = response.data && response.data.data ? response.data.data : [];
      
      // Transform data for display
      const formattedOrders = ordersData.map(order => ({
        id: order._id,
        orderId: order.orderId,
        customer: order.userId ? (order.userId.name || 'Unknown User') : 'Unknown User',
        email: order.userId ? (order.userId.email || 'No Email') : 'No Email',
        date: new Date(order.createdAt).toLocaleDateString(),
        status: order.orderStatus,
        total: `₹${order.totalPrice.toFixed(2)}`,
        items: order.items.length,
        rawData: order
      }));
      console.log('Updated orders:', formattedOrders);
      setOrders(formattedOrders);
      
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
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-blue-100 text-blue-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
      
      {/* Search and Filter */}
      <div className="flex flex-wrap items-center mb-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by order ID or customer"
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <select 
          className="border rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{order.orderId}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.total}</td>
                    <td className="py-3 px-4">{order.items}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleEditClick(order)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Edit Order"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete Order"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-semibold">Order Details</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Order ID</p>
                  <p className="font-medium">{selectedOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-gray-600">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{selectedOrder.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total</p>
                  <p className="font-medium">{selectedOrder.total}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status] || 'bg-gray-100'}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.status === status 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 mb-2">Order Items</p>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500">Item</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500">Quantity</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.rawData && selectedOrder.rawData.items && selectedOrder.rawData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2 px-3 text-sm">{item.productId ? (item.productId.name || 'Unknown Product') : 'Unknown Product'}</td>
                          <td className="py-2 px-3 text-sm">{item.quantity}</td>
                          <td className="py-2 px-3 text-sm">₹{item.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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