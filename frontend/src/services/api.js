import axios from 'axios';

// Set API base URL - Using direct URL to ensure connection
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token
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

// Response interceptor - Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Logout on token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/register';
    }
    return Promise.reject(error);
  }
);

// ============ Authentication API Functions ============

// === Registration and Login ===
export const register = (userData) => api.post('/auth/register', userData);
export const verifyOtp = (otpData) => api.post('/auth/verify-otp', otpData);
export const resendOtp = (email) => api.post('/auth/resend-otp', { email });
export const login = (credentials) => api.post('/auth/login', credentials);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, passwordData) => api.post(`/auth/reset-password/${token}`, passwordData);
export const createAdmin = (adminData) => api.post('/auth/create-admin', adminData);

// === User Profile ===
export const getProfile = () => api.get('/auth/customers/me');
export const updateProfile = (userData) => api.put('/auth/customers/me', userData);
export const deleteAccount = () => api.delete('/auth/customers/me');

// ============ Admin API Functions ============

// === User Management ===
export const getAllUsers = (params = {}) => {
  const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  return api.get('/admin/users', { 
    params: { page, limit, status, search, sortBy, sortOrder } 
  });
};

export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const updateUser = (id, userData) => api.put(`/admin/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const toggleUserStatus = (id, isActive) => api.put(`/admin/users/${id}`, { isActive });
export const getAllCustomers = () => api.get('/auth/customers');
export const getCustomer = (id) => api.get(`/auth/customers/${id}`);
export const getUserStats = () => api.get('/admin/user-stats');

// === Product Management ===
export const getAllProducts = (params = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    category,
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = params;
  
  return api.get('/admin/products', { 
    params: { page, limit, category, status, search, sortBy, sortOrder } 
  });
};

export const getProductById = (id) => api.get(`/admin/products/${id}`);

export const createProduct = (productData) => {
  const formData = new FormData();
  
  // Add product data to FormData
  Object.keys(productData).forEach(key => {
    if (key !== 'images') {
      formData.append(key, productData[key]);
    }
  });
  
  // Add images to FormData
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
  
  // Add product data to FormData
  Object.keys(productData).forEach(key => {
    if (key !== 'images') {
      formData.append(key, productData[key]);
    }
  });
  
  // Add images to FormData
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

// === Category Management ===
export const getAllCategories = () => api.get('/admin/categories');
export const getCategoryById = (id) => api.get(`/admin/categories/${id}`);

export const createCategory = (categoryData) => {
  // If categoryData is already FormData, use it directly
  if (categoryData instanceof FormData) {
    return api.post('/admin/categories', categoryData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  // Otherwise, create a new FormData object
  const formData = new FormData();
  
  // Add category data to FormData
  Object.keys(categoryData).forEach(key => {
    if (categoryData[key] !== null && categoryData[key] !== undefined) {
      formData.append(key, categoryData[key]);
    }
  });
  
  return api.post('/admin/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateCategory = (id, categoryData) => {
  const formData = new FormData();
  
  // Add category data to FormData
  Object.keys(categoryData).forEach(key => {
    if (key !== 'image') {
      formData.append(key, categoryData[key]);
    }
  });
  
  // Add image to FormData
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

// === Order Management ===
export const getAllOrders = (params = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    startDate,
    endDate
  } = params;
  
  return api.get('/admin/orders', { 
    params: { page, limit, status, search, sortBy, sortOrder, startDate, endDate } 
  });
};

export const getOrderById = (id) => api.get(`/admin/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });

// === Inventory Management ===
export const getInventoryLogs = (params = {}) => {
  const { page = 1, limit = 10, productId, action, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  return api.get('/inventory', { 
    params: { page, limit, productId, action, sortBy, sortOrder } 
  });
};

export const addInventoryLog = (logData) => api.post('/inventory', logData);

// === Notification Management ===
export const getNotifications = (params = {}) => {
  const { page = 1, limit = 10, read, type } = params;
  return api.get('/admin/notifications', { 
    params: { page, limit, read, type } 
  });
};

export const markAsRead = (id) => api.put(`/admin/notifications/${id}/read`);
export const markAllAsRead = () => api.put('/admin/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/admin/notifications/${id}`);

export const getActivityLogs = () => api.get('/admin/activity-logs');
export const getErrorLogs = () => api.get('/admin/error-logs');



export const getOrderStats = () => api.get('/admin/stats/orders');
// === Dashboard Stats ===

export default api;