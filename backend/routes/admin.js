const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers
const { login } = require('../controllers/auth/login');
const userManagementController = require('../controllers/admin/userManagementController');
const productManagementController = require('../controllers/admin/productManagementController');
const orderManagementController = require('../controllers/admin/orderManagementController');
const notificationController = require('../controllers/notifications/notificationController');

// Admin Login Route
router.post('/login', login);

// User Management Routes
router.get('/users', protect, authorize('admin'), userManagementController.getAllUsers);
router.get('/users/:id', protect, authorize('admin'), userManagementController.getUserById);
router.put('/users/:id', protect, authorize('admin'), userManagementController.updateUser);
router.delete('/users/:id', protect, authorize('admin'), userManagementController.deleteUser);
router.put('/users/:id/status', protect, authorize('admin'), userManagementController.toggleUserStatus);
router.get('/user-stats', protect, authorize('admin'), userManagementController.getUserStats);

// Product Management Routes
router.get('/products', protect, authorize('admin'), productManagementController.getAllProducts);
router.get('/products/:id', protect, authorize('admin'), productManagementController.getProductById);
router.post('/products', protect, authorize('admin'), productManagementController.createProduct);
router.put('/products/:id', protect, authorize('admin'), productManagementController.updateProduct);
router.delete('/products/:id', protect, authorize('admin'), productManagementController.deleteProduct);
router.put('/products/:id/stock', protect, authorize('admin'), productManagementController.updateStock);
router.get('/product-stats', protect, authorize('admin'), productManagementController.getProductStats);

// Order Management Routes
router.get('/orders', protect, authorize('admin'), orderManagementController.getAllOrders);
router.get('/orders/:id', protect, authorize('admin'), orderManagementController.getOrderById);
router.put('/orders/:id/status', protect, authorize('admin'), orderManagementController.updateOrderStatus);
router.get('/order-stats', protect, authorize('admin'), orderManagementController.getOrderStats);
router.get('/export-orders', protect, authorize('admin'), orderManagementController.exportOrders);

// Notification Routes
router.get('/notifications', protect, authorize('admin'), notificationController.getUserNotifications);
router.put('/notifications/:id/read', protect, authorize('admin'), notificationController.markAsRead);
router.put('/notifications/read-all', protect, authorize('admin'), notificationController.markAllAsRead);
router.delete('/notifications/:id', protect, authorize('admin'), notificationController.deleteNotification);

// Activity Logs Routes
router.get('/activity-logs', protect, authorize('admin'), notificationController.getActivityLogs);
router.get('/error-logs', protect, authorize('admin'), notificationController.getErrorLogs);

module.exports = router;