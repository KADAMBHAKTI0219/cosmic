import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaBoxOpen, FaChartLine, FaDollarSign, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { dashboardApi } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';

// Chart.js रजिस्ट्रेशन
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const { adminToken } = useAdminAuth();
  
  // API से स्टैट्स लोड करना
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Dashboard stats fetch करना
        const response = await dashboardApi.getDashboardStats();
        setDashboardStats(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (adminToken) {
      fetchStats();
    }
  }, [adminToken]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="text-4xl text-primary animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">{error}</h2>
        <p className="text-gray-600 mt-2">Please try refreshing the page or contact support.</p>
      </div>
    );
  }
  
  // फेलबैक स्टैट्स (API फेल होने पर)
  const stats = [
    { 
      title: 'Total Users', 
      value: dashboardStats?.userStats?.totalUsers || '0', 
      icon: <FaUsers className="text-blue-500" />, 
      change: dashboardStats?.userStats?.growth || '0%' 
    },
    { 
      title: 'Total Orders', 
      value: dashboardStats?.orderStats?.totalOrders || '0', 
      icon: <FaShoppingCart className="text-green-500" />, 
      change: dashboardStats?.orderStats?.growth || '0%' 
    },
    { 
      title: 'Total Products', 
      value: dashboardStats?.productStats?.totalProducts || '0', 
      icon: <FaBoxOpen className="text-yellow-500" />, 
      change: dashboardStats?.productStats?.growth || '0%' 
    },
    { 
      title: 'Total Revenue', 
      value: dashboardStats?.orderStats?.totalRevenue ? `₹${dashboardStats.orderStats.totalRevenue.toLocaleString()}` : '₹0', 
      icon: <FaDollarSign className="text-purple-500" />, 
      change: dashboardStats?.orderStats?.revenueGrowth || '0%' 
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-green-500 text-sm mt-2">{stat.change} from last month</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
          <div className="h-64">
            <Line 
                data={{
                  labels: dashboardStats?.chartData?.monthlySales?.map(item => item.month) || 
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Sales',
                      data: dashboardStats?.chartData?.monthlySales?.map(item => item.count) || 
                        [0, 0, 0, 0, 0, 0],
                      borderColor: '#92c51b',
                      backgroundColor: 'rgba(146, 197, 27, 0.1)',
                      tension: 0.4,
                    }
                  ]
                }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
          <div className="h-64">
                <Pie 
                  data={{
                    labels: ['In Stock', 'Out of Stock', 'Low Stock'],
                    datasets: [
                      {
                        data: [
                          dashboardStats?.productStats?.inStockProducts || 0,
                          dashboardStats?.productStats?.outOfStockProducts || 0,
                          dashboardStats?.productStats?.lowStockProducts || 0
                        ],
                        backgroundColor: [
                          'rgba(146, 197, 27, 0.7)',
                          'rgba(54, 162, 235, 0.7)',
                          'rgba(255, 206, 86, 0.7)',
                          'rgba(75, 192, 192, 0.7)',
                          'rgba(153, 102, 255, 0.7)',
                        ],
                        borderWidth: 1,
                      }
                    ]
                  }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Recent Orders & Low Stock Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Placeholder data for recent orders */}
                {[
                  { orderId: '12345', customerName: 'Rahul Sharma', amount: '12,500', status: 'Delivered' },
                  { orderId: '12346', customerName: 'Priya Singh', amount: '8,900', status: 'Processing' },
                  { orderId: '12347', customerName: 'Amit Kumar', amount: '15,200', status: 'Pending' }
                ].map((order, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#{order.orderId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">₹{order.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Pending' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Placeholder data for low stock products */}
                {[
                  { name: 'Solar Panel 500W', category: 'Solar Panels', stock: 8 },
                  { name: 'Inverter 2kW', category: 'Inverters', stock: 5 },
                  { name: 'Battery 200Ah', category: 'Batteries', stock: 3 }
                ].map((product, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.stock > 10 ? 'bg-green-100 text-green-800' : 
                          product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {product.stock > 10 ? 'In Stock' : product.stock > 5 ? 'Low Stock' : 'Critical Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;