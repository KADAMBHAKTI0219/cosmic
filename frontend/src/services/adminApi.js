import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this to your backend URL
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear admin token
      localStorage.removeItem('adminToken');
      // Redirect to login page if needed
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardApi = {
  getDashboardStats: () => API.get('/admin/dashboard/stats'),
};

// User Management API
export const userManagementApi = {
  getAllUsers: (page = 1, limit = 10, filters = {}) => {
    const { status, search, sortBy, sortOrder } = filters;
    return API.get('/admin/users', { 
      params: { page, limit, status, search, sortBy, sortOrder } 
    });
  },
  getUserById: (id) => API.get(`/admin/users/${id}`),
  updateUser: (id, userData) => API.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getUserStats: () => API.get('/admin/users/stats'),
};

// Category Management API
export const categoryManagementApi = {
  getAllCategories: () => API.get('/admin/categories'),
  getCategoryById: (id) => API.get(`/admin/categories/${id}`),
  createCategory: (categoryData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(categoryData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, categoryData[key]);
      }
    });
    
    // Append image if exists
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }
    
    return API.post('/admin/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateCategory: (id, categoryData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(categoryData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, categoryData[key]);
      }
    });
    
    // Append image if exists
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }
    
    return API.put(`/admin/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteCategory: (id) => API.delete(`/admin/categories/${id}`),
};

// Product Management API
export const productManagementApi = {
  getAllProducts: (page = 1, limit = 10, filters = {}) => {
    const { category, status, search, sortBy, sortOrder } = filters;
    return API.get('/admin/products', { 
      params: { page, limit, category, status, search, sortBy, sortOrder } 
    });
  },
  getProductById: (id) => API.get(`/admin/products/${id}`),
  createProduct: (productData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && key !== 'features') {
        formData.append(key, productData[key]);
      }
    });
    
    // Append features as JSON
    if (productData.features) {
      formData.append('features', JSON.stringify(productData.features));
    }
    
    // Append images
    if (productData.images && productData.images.length) {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    return API.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateProduct: (id, productData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && key !== 'features') {
        formData.append(key, productData[key]);
      }
    });
    
    // Append features as JSON
    if (productData.features) {
      formData.append('features', JSON.stringify(productData.features));
    }
    
    // Append images
    if (productData.images && productData.images.length) {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    return API.put(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteProduct: (id) => API.delete(`/admin/products/${id}`),
};

// Order Management API
export const orderManagementApi = {
  getAllOrders: (page = 1, limit = 10, filters = {}) => {
    const { status, search, sortBy, sortOrder, startDate, endDate } = filters;
    return API.get('/admin/orders', { 
      params: { page, limit, status, search, sortBy, sortOrder, startDate, endDate } 
    });
  },
  getOrderById: (id) => API.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => API.put(`/admin/orders/${id}/status`, { status }),
};


// Inventory Management API
export const inventoryManagementApi = {
  getAllInventoryLogs: (page = 1, limit = 10, filters = {}) => {
    const { productId, action, sortBy, sortOrder, startDate, endDate } = filters;
    return API.get('/inventory', { 
      params: { page, limit, productId, action, sortBy, sortOrder, startDate, endDate } 
    });
  },
  updateInventory: (productId, quantity, action, notes) => 
    API.post('/inventory', { productId, quantity, action, notes }),
};

// Coupon Management API
export const couponManagementApi = {
  getAllCoupons: () => API.get('/coupon'),
  getCouponById: (id) => API.get(`/coupon/${id}`),
  createCoupon: (couponData) => API.post('/coupon', couponData),
  updateCoupon: (id, couponData) => API.put(`/coupon/${id}`, couponData),
  deleteCoupon: (id) => API.delete(`/coupon/${id}`),
};

// Offer Management API
export const offerManagementApi = {
  getAllOffers: () => API.get('/offers'),
  getOfferById: (id) => API.get(`/offers/${id}`),
  createOffer: (offerData) => API.post('/offers', offerData),
  updateOffer: (id, offerData) => API.put(`/offers/${id}`, offerData),
  deleteOffer: (id) => API.delete(`/offers/${id}`),
};

// Reports API
export const reportsApi = {
  getSalesReport: (filters = {}) => {
    const { startDate, endDate, groupBy } = filters;
    return API.get('/reports/sales', { params: { startDate, endDate, groupBy } });
  },
  getInventoryReport: () => API.get('/reports/inventory'),
  getCustomerReport: (filters = {}) => {
    const { startDate, endDate } = filters;
    return API.get('/reports/customers', { params: { startDate, endDate } });
  },
  getProductPerformance: (filters = {}) => {
    const { startDate, endDate, limit } = filters;
    return API.get('/reports/products/performance', { params: { startDate, endDate, limit } });
  },
};

// Newsletter Management API
export const newsletterManagementApi = {
  getAllSubscribers: () => API.get('/newsletter/admin/subscribers'),
  getActiveSubscribers: () => API.get('/newsletter/admin/subscribers/active'),
  deleteSubscriber: (id) => API.delete(`/newsletter/admin/subscribers/${id}`),
};

// EMI Management API
export const emiManagementApi = {
  getAllEMIs: () => API.get('/emi'),
  createEMI: (emiData) => API.post('/emi', emiData),
  updateEMI: (id, emiData) => API.put(`/emi/${id}`, emiData),
  deleteEMI: (id) => API.delete(`/emi/${id}`),
};

export default {
  userManagementApi,
  productManagementApi,
  orderManagementApi,
  categoryManagementApi,
  inventoryManagementApi,
  couponManagementApi,
  offerManagementApi,
  reportsApi,
  newsletterManagementApi,
  emiManagementApi,
};