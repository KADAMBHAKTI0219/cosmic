const express = require('express');
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlist/wishlistController');
const { protect } = require('../middleware/auth');

// All wishlist routes require authentication
router.use(protect);

// Add product to wishlist
router.post('/', addToWishlist);

// Remove product from wishlist
router.delete('/:productId', removeFromWishlist);

// Get user's wishlist
router.get('/', getWishlist);

module.exports = router;