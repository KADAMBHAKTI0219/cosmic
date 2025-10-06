import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if admin is logged in on component mount
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        try {
          // Set default auth header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token by fetching admin profile
          const response = await axios.get('/api/auth/me');
          
          if (response.data.success && response.data.data.role === 'admin') {
            setAdmin(response.data.data);
          } else {
            // If not admin, clear token
            localStorage.removeItem('adminToken');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (err) {
          console.error('Admin auth error:', err);
          localStorage.removeItem('adminToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkAdminAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success && response.data.data.role === 'admin') {
        localStorage.setItem('adminToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setAdmin(response.data.data);
        return true;
      } else {
        setError('Unauthorized: Admin access required');
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, error, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

export default AdminAuthContext;