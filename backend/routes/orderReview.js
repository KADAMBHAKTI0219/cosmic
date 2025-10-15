const express = require('express');
const router = express.Router();
const orderReviewController = require('../controllers/orders/orderReviewController');
const { protect, authorize } = require('../middleware/auth');

// Customer routes
router.post('/review', protect, orderReviewController.sendOrderForReview);
router.post('/:id/confirm', protect, orderReviewController.confirmOrder);
router.post('/:id/cancel-request', protect, orderReviewController.cancelOrderRequest);

// Public routes for customer confirmation via email
router.post('/customer-confirm/:orderId/:token', orderReviewController.confirmOrderByCustomer);
router.post('/customer-cancel/:orderId/:token', orderReviewController.cancelOrderByCustomer);
router.get('/confirm/:id/:token', orderReviewController.confirmOrder); // Added GET route for direct link access

// Admin routes
router.put('/:id/set-shipping', protect, authorize('admin'), orderReviewController.setShippingAndFinalPrice);

module.exports = router;