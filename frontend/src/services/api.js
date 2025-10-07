import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this to your backend URL
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: (userData) => API.post('/auth/register', userData),
  verifyOtp: (data) => API.post('/auth/verify-otp', data),
  resendOtp: (data) => API.post('/auth/resend-otp', data),
  login: (credentials) => API.post('/auth/login', credentials),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.post(`/auth/reset-password/${token}`, { password }),
  getProfile: (id) => API.get(`/auth/customers/${id}`),
  updateProfile: (id, userData) => API.put(`/auth/customers/${id}`, userData),
  deleteAccount: (id) => API.delete(`/auth/customers/${id}`),
};

// Products API
export const productsApi = {
  getAllProducts: (page = 1, limit = 10, filters = {}) => {
    const { category, search, sortBy, sortOrder, minPrice, maxPrice } = filters;
    return API.get('/products', { 
      params: { page, limit, category, search, sortBy, sortOrder, minPrice, maxPrice } 
    });
  },
  getProductById: (id) => API.get(`/products/${id}`),
  getProductReviews: (id) => API.get(`/reviews/product/${id}`),
  getRelatedProducts: (id) => API.get(`/products/${id}/related`),
  getTopRatedProducts: () => API.get('/products/top-rated'),
  getNewArrivals: () => API.get('/products/new-arrivals'),
};

// Cart API
export const cartApi = {
  getCart: () => API.get('/cart'),
  addToCart: (productData) => API.post('/cart', productData),
  updateCartItem: (itemId, quantity) => API.put(`/cart/${itemId}`, { quantity }),
  removeCartItem: (itemId) => API.delete(`/cart/${itemId}`),
};

// Review API
export const reviewApi = {
  getUserReviews: () => API.get('/reviews/user'),
  getReviewById: (id) => API.get(`/reviews/${id}`),
  createReview: (data) => API.post('/reviews', data),
  updateReview: (id, data) => API.put(`/reviews/${id}`, data),
  deleteReview: (id) => API.delete(`/reviews/${id}`),
  getProductReviews: (productId) => API.get(`/reviews/${productId}`),
};

// Notification API
export const notificationApi = {
  getNotifications: () => API.get('/notifications'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put('/notifications/read-all'),
  deleteNotification: (id) => API.delete(`/notifications/${id}`),
};

// EMI API
export const emiApi = {
  getUserEmiPlans: () => API.get('/emi/user-plans'),
  getEmiPlanById: (id) => API.get(`/emi/plans/${id}`),
  makeEmiPayment: (installmentId, data) => API.post(`/emi/payment/${installmentId}`, data),
  getEmiOptions: (productId) => API.get(`/emi/options/${productId}`),
};

// Coupon API
export const couponApi = {
  validateCoupon: (code, orderAmount) => API.post('/coupons/validate', { code, orderAmount }),
  applyCoupon: (code) => API.post('/coupons/apply', { code }),
};

// Orders API
export const ordersApi = {
  placeOrder: (orderData) => API.post('/orders', orderData),
  getMyOrders: () => API.get('/orders'),
  getOrderById: (id) => API.get(`/orders/${id}`),
};

// Wishlist API
export const wishlistApi = {
  getWishlist: () => API.get('/wishlist'),
  addToWishlist: (productId) => API.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => API.delete(`/wishlist/${productId}`),
};

// Category API
export const categoryApi = {
  getAllCategories: () => API.get('/categories'),
  getCategoryById: (id) => API.get(`/categories/${id}`),
  getCategoriesBySlug: (slug) => API.get(`/categories/slug/${slug}`),
  createCategory: (categoryData) => API.post('/admin/categories', categoryData),
  updateCategory: (id, categoryData) => API.put(`/admin/categories/${id}`, categoryData),
  deleteCategory: (id) => API.delete(`/admin/categories/${id}`),
};



// Newsletter API
export const newsletterApi = {
  subscribe: (email) => API.post('/newsletter', { email }),
  unsubscribe: (email) => API.delete(`/newsletter/${email}`),
};

export default {
  auth: authApi,
  products: productsApi,
  cart: cartApi,
  orders: ordersApi,
  wishlist: wishlistApi,
  category: categoryApi,
  review: reviewApi,
  coupon: couponApi,
  newsletter: newsletterApi,
};