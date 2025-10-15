const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders/orderController');
const orderReviewController = require('../controllers/orders/orderReviewController');
const { protect, authorize } = require('../middleware/auth');

// All order routes require authentication
router.use(protect);

// Customer routes
router.post('/', orderController.placeOrder);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

// Admin routes for order review
router.put('/:id/shipping-price', authorize('admin'), orderReviewController.setShippingAndFinalPrice);

module.exports = router;