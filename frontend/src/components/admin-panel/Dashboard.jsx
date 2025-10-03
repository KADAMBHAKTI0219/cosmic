import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaBoxOpen, FaChartLine, FaDollarSign, FaSpinner } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { getUserStats, getProductStats, getOrderStats } from '../../services/api';

// Chart.js रजिस्ट्रेशन
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  
  // API से स्टैट्स लोड करना
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // सभी स्टैट्स एक साथ फेच करना
        const [userResponse, productResponse, orderResponse] = await Promise.all([
          getUserStats(),
          getProductStats(),
          getOrderStats()
        ]);
        
        setUserStats(userResponse.data);
        setProductStats(productResponse.data);
        setOrderStats(orderResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // फेलबैक स्टैट्स (API फेल होने पर)
  const stats = [
    { title: 'Total Users', value: userStats?.totalUsers || '1,245', icon: <FaUsers className="text-blue-500" />, change: userStats?.growth || '+12%' },
    { title: 'Total Orders', value: orderStats?.totalOrders || '845', icon: <FaShoppingCart className="text-green-500" />, change: orderStats?.growth || '+23%' },
    { title: 'Total Products', value: productStats?.totalProducts || '356', icon: <FaBoxOpen className="text-yellow-500" />, change: productStats?.growth || '+7%' },
    { title: 'Total Revenue', value: orderStats?.totalRevenue || '₹1,25,456', icon: <FaDollarSign className="text-purple-500" />, change: orderStats?.revenueGrowth || '+18%' },
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
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <FaSpinner className="text-4xl text-gray-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-red-500">Failed to load sales data</p>
            </div>
          ) : (
            <div className="h-64">
              <Line 
                data={{
                  labels: orderStats?.monthlySales?.map(item => item.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Sales',
                      data: orderStats?.monthlySales?.map(item => item.count) || [30, 45, 60, 75, 90, 105],
                      borderColor: '#92c51b',
                      backgroundColor: 'rgba(146, 197, 27, 0.1)',
                      tension: 0.4,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Breakdown</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <FaSpinner className="text-4xl text-gray-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-red-500">Failed to load revenue data</p>
            </div>
          ) : (
            <div className="h-64">
              <Bar
                data={{
                  labels: orderStats?.categoryRevenue?.map(item => item.category) || ['Electronics', 'Clothing', 'Books', 'Home', 'Beauty'],
                  datasets: [
                    {
                      label: 'Revenue',
                      data: orderStats?.categoryRevenue?.map(item => item.revenue) || [12000, 8000, 5000, 7500, 4000],
                      backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                      ],
                      borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                      ],
                      borderWidth: 1,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Additional Chart - User Growth */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">User Growth</h2>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <FaSpinner className="text-4xl text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500">Failed to load user data</p>
          </div>
        ) : (
          <div className="h-64">
            <Line 
              data={{
                labels: userStats?.monthlyGrowth?.map(item => item.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'New Users',
                    data: userStats?.monthlyGrowth?.map(item => item.count) || [25, 35, 40, 50, 65, 80],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        )}
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-{1000 + item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Customer {item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-{10 + item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item * 1000 + 500}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                      item % 3 === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item % 3 === 0 ? 'Processing' : item % 3 === 1 ? 'Completed' : 'Cancelled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;