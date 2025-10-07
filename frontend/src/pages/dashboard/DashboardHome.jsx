import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaUser, FaCog, FaBox, FaChartLine } from 'react-icons/fa';

const DashboardHome = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  const dashboardCards = [
    {
      title: 'My Orders',
      description: 'View and track all your orders',
      icon: <FaShoppingBag className="h-8 w-8 text-main" />,
      link: '/dashboard/my-orders',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Profile',
      description: 'Update your profile information',
      icon: <FaUser className="h-8 w-8 text-main" />,
      link: '/dashboard/profile',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: <FaCog className="h-8 w-8 text-main" />,
      link: '/dashboard/settings',
      color: 'bg-yellow-50 hover:bg-yellow-100'
    }
  ];

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-main to-main-dark text-white p-8 rounded-xl mb-8 shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex items-center">
          <div className="mr-6">
            <FaChartLine className="h-12 w-12 text-white opacity-80" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Welcome, {user?.firstName || user?.name || 'Customer'}!
            </h2>
            <p className="opacity-90 text-lg">
              View your account information and orders here.
            </p>
          </div>
        </div>
      </div>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Link 
            key={index} 
            to={card.link}
            className={`${card.color} p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 bg-white p-4 rounded-full shadow-inner">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Recent Orders Preview */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
          <Link to="/dashboard/my-orders" className="text-main hover:text-main-dark text-sm font-medium flex items-center">
            View All Orders
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="border rounded-xl overflow-hidden bg-gray-50">
          <div className="p-10 text-center text-gray-500">
            <FaBox className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg mb-4">No orders yet</p>
            <Link to="/" className="mt-4 inline-block px-6 py-3 bg-main text-white rounded-lg hover:bg-main-dark transition-colors duration-300 font-medium">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;