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
          // Create API instance with token
          const API = axios.create({
            baseURL: 'http://localhost:5000/api',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Verify token by fetching admin profile
          const response = await API.get('/admin/user-stats');
          
          // If successful response, user is authenticated as admin
          setAdmin({
            role: 'admin',
            token: token
          });
        } catch (err) {
          console.error('Admin auth error:', err);
          localStorage.removeItem('adminToken');
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
      
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
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