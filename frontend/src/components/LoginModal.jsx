import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';

const LoginModal = ({ isOpen, onClose }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in when modal opens
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      try {
        // Only parse if userData exists and is not 'undefined'
        const user = userData && userData !== 'undefined' ? JSON.parse(userData) : null;
        
        if (token && user) {
          // If already logged in, redirect based on role and close modal
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
          onClose();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
      }
    }
  }, [isOpen, navigate, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      const response = await login(credentials);
      
      // Store user data and token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Make sure user data exists before storing and using it
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Show success message
        toast.success('Login successful');
        
        // Redirect based on user role
        if (response.data.user.role === 'admin') {
          console.log('Admin login detected, redirecting to admin dashboard');
          navigate('/admin');
        } else {
          console.log('User login detected, redirecting to home page');
          navigate('/');
        }
      } else {
        // Handle case when user data is missing
        console.error('Login response missing user data');
        toast.error('Login successful but user data is incomplete');
        navigate('/');
      }
      
      // Close the modal after successful login
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex sm:items-center justify-center sm:justify-end z-50 p-4">
      <div className="bg-white rounded-md shadow-lg w-full max-w-[350px] sm:w-96 p-4 sm:p-6 relative sm:mt-0 sm:mr-4">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Login to my account</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">Enter your e-mail and password:</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3 sm:mb-4">
            <label htmlFor="modal-email" className="block text-gray-700 text-sm mb-1">Email Address:</label>
            <input
              type="email"
              id="modal-email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#92c51b] focus:border-[#92c51b] text-sm"
              required
            />
          </div>
          
          <div className="mb-4 sm:mb-6">
            <label htmlFor="modal-password" className="block text-gray-700 text-sm mb-1">Password:</label>
            <input
              type="password"
              id="modal-password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#92c51b] focus:border-[#92c51b] text-sm"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#92c51b] text-white py-2 sm:py-3 rounded font-medium hover:bg-[#83b118] transition duration-200 text-sm"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-3 sm:mt-4">
          <p className="text-gray-600 text-sm">New Customer?</p>
          <Link 
            to="/auth/register" 
            onClick={onClose}
            className="block mt-2 border border-[#92c51b] text-[#92c51b] py-1.5 sm:py-2 rounded font-medium hover:bg-[#f0f7e6] transition duration-200 text-sm"
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create an Account
            </span>
          </Link>
        </div>
        
        <div className="text-center mt-3 sm:mt-4">
          <Link to="/auth/forgot-password" onClick={onClose} className="text-[#92c51b] hover:underline text-sm">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;