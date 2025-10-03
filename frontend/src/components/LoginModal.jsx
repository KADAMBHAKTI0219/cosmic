import React from 'react';
import { Link } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
        
        <form>
          <div className="mb-3 sm:mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm mb-1">Email Address:</label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              required
            />
          </div>
          
          <div className="mb-4 sm:mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm mb-1">Password:</label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-2 sm:py-3 rounded font-medium hover:bg-green-700 transition duration-200 text-sm"
          >
            Sign In
          </button>
        </form>
        
        <div className="text-center mt-3 sm:mt-4">
          <p className="text-gray-600 text-sm">New Customer?</p>
          <Link 
            to="/auth/register" 
            onClick={onClose}
            className="block mt-2 border border-green-600 text-green-600 py-1.5 sm:py-2 rounded font-medium hover:bg-green-50 transition duration-200 text-sm"
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
          <Link to="/forgot-password" className="text-green-600 hover:underline text-sm">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;