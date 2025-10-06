const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/multerConfig');

// Import controllers - Using only admin controllers for consistency
const userManagementController = require('../controllers/admin/userManagementController');
const productManagementController = require('../controllers/admin/productManagementController');
const orderManagementController = require('../controllers/admin/orderManagementController');
const notificationController = require('../controllers/notifications/notificationController');
const categoryController = require('../controllers/category/categoryController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User Management Routes
router.get('/users', userManagementController.getAllUsers);
router.get('/users/:id', userManagementController.getUserById);
router.put('/users/:id', userManagementController.updateUser);
router.delete('/users/:id', userManagementController.deleteUser);
router.put('/users/:id/status', userManagementController.toggleUserStatus);
router.get('/users/stats', userManagementController.getUserStats);
router.get('/user-stats', userManagementController.getUserStats); // Keep for backward compatibility

// Product Management Routes
router.get('/products', productManagementController.getAllProducts);
router.get('/products/:id', productManagementController.getProductById);
router.post('/products', upload.array('images', 5), productManagementController.createProduct);
router.put('/products/:id', upload.array('images', 5), productManagementController.updateProduct);
router.delete('/products/:id', productManagementController.deleteProduct);
router.put('/products/:id/stock', productManagementController.updateStock);
router.get('/product-stats', productManagementController.getProductStats);

// Category Routes
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategory);
router.post('/categories', upload.single('image'), categoryController.createCategory);
router.put('/categories/:id', upload.single('image'), categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Order Management Routes
router.get('/orders', orderManagementController.getAllOrders);
router.get('/orders/:id', orderManagementController.getOrderById);
router.put('/orders/:id/status', orderManagementController.updateOrderStatus);
router.get('/order-stats', orderManagementController.getOrderStats);
router.get('/export-orders', orderManagementController.exportOrders);

// Notification Routes
router.get('/notifications', notificationController.getUserNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.put('/notifications/read-all', notificationController.markAllAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);

// Activity Logs Routes
router.get('/activity-logs', notificationController.getActivityLogs);
router.get('/error-logs', notificationController.getErrorLogs);

module.exports = router;