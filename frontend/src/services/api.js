import axios from 'axios';

// API बेस URL सेट करना
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// एक्सियोस इंस्टेंस बनाना
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// रिक्वेस्ट इंटरसेप्टर - टोकन जोड़ना
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// रिस्पांस इंटरसेप्टर - एरर हैंडलिंग
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // टोकन एक्सपायर होने पर लॉगआउट
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/register';
    }
    return Promise.reject(error);
  }
);

// ============ ऑथेंटिकेशन API फंक्शन्स ============

// === रजिस्ट्रेशन और लॉगिन ===
export const register = (userData) => api.post('/auth/register', userData);
export const verifyOtp = (otpData) => api.post('/auth/verify-otp', otpData);
export const resendOtp = (email) => api.post('/auth/resend-otp', { email });
export const login = (credentials) => api.post('/auth/login', credentials);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, passwordData) => api.post(`/auth/reset-password/${token}`, passwordData);

// === यूजर प्रोफाइल ===
export const getProfile = () => api.get('/auth/customers/me');
export const updateProfile = (userData) => api.put('/auth/customers/me', userData);
export const deleteAccount = () => api.delete('/auth/customers/me');

// ============ एडमिन API फंक्शन्स ============

// === यूजर मैनेजमेंट ===
export const getAllUsers = () => api.get('/admin/users');
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const updateUser = (id, userData) => api.put(`/admin/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const toggleUserStatus = (id, status) => api.put(`/admin/users/${id}/status`, { status });
export const getUserStats = () => api.get('/admin/user-stats');

// === प्रोडक्ट मैनेजमेंट ===
export const getAllProducts = () => api.get('/admin/products');
export const getProductById = (id) => api.get(`/admin/products/${id}`);
export const createProduct = (productData) => {
  const formData = new FormData();
  
  // फॉर्म डेटा में प्रोडक्ट डेटा जोड़ना
  Object.keys(productData).forEach(key => {
    if (key !== 'images') {
      formData.append(key, productData[key]);
    }
  });
  
  // इमेजेस जोड़ना
  if (productData.images && productData.images.length) {
    productData.images.forEach(image => {
      formData.append('images', image);
    });
  }
  
  return api.post('/admin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = (id, productData) => {
  const formData = new FormData();
  
  // फॉर्म डेटा में प्रोडक्ट डेटा जोड़ना
  Object.keys(productData).forEach(key => {
    if (key !== 'images') {
      formData.append(key, productData[key]);
    }
  });
  
  // इमेजेस जोड़ना
  if (productData.images && productData.images.length) {
    productData.images.forEach(image => {
      formData.append('images', image);
    });
  }
  
  return api.put(`/admin/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const updateStock = (id, stockData) => api.put(`/admin/products/${id}/stock`, stockData);
export const getProductStats = () => api.get('/admin/product-stats');

// === कैटेगरी मैनेजमेंट ===
export const getAllCategories = () => api.get('/admin/categories');
export const getCategoryById = (id) => api.get(`/admin/categories/${id}`);
export const createCategory = (categoryData) => {
  const formData = new FormData();
  
  // फॉर्म डेटा में कैटेगरी डेटा जोड़ना
  Object.keys(categoryData).forEach(key => {
    if (key !== 'image') {
      formData.append(key, categoryData[key]);
    }
  });
  
  // इमेज जोड़ना
  if (categoryData.image) {
    formData.append('image', categoryData.image);
  }
  
  return api.post('/admin/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateCategory = (id, categoryData) => {
  const formData = new FormData();
  
  // फॉर्म डेटा में कैटेगरी डेटा जोड़ना
  Object.keys(categoryData).forEach(key => {
    if (key !== 'image') {
      formData.append(key, categoryData[key]);
    }
  });
  
  // इमेज जोड़ना
  if (categoryData.image) {
    formData.append('image', categoryData.image);
  }
  
  return api.put(`/admin/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);

// === ऑर्डर मैनेजमेंट ===
export const getAllOrders = () => api.get('/admin/orders');
export const getOrderById = (id) => api.get(`/admin/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });
export const getOrderStats = () => api.get('/admin/order-stats');
export const exportOrders = () => api.get('/admin/export-orders');

// === नोटिफिकेशन मैनेजमेंट ===
export const getNotifications = () => api.get('/admin/notifications');
export const markAsRead = (id) => api.put(`/admin/notifications/${id}/read`);
export const markAllAsRead = () => api.put('/admin/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/admin/notifications/${id}`);

// === एक्टिविटी लॉग्स ===
export const getActivityLogs = () => api.get('/admin/activity-logs');
export const getErrorLogs = () => api.get('/admin/error-logs');

export default api;