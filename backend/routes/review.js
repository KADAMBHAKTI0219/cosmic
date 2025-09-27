const express = require('express');
const router = express.Router();
const { addReview, getProductReviews, deleteReview } = require('../controllers/review/reviewController');
const { protect } = require('../middleware/auth');

// Add review - requires authentication
router.post('/', protect, addReview);

// Get all reviews for a product - public
router.get('/:productId', getProductReviews);

// Delete review - requires authentication
router.delete('/:id', protect, deleteReview);

module.exports = router;