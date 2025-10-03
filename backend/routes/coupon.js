const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    applyCoupon,
    getCouponStats
} = require('../controllers/coupon/couponController');

// Public routes
router.post('/validate', validateCoupon);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getAllCoupons)
    .post(createCoupon);

router.route('/:id')
    .get(getCoupon)
    .put(updateCoupon)
    .delete(deleteCoupon);

router.post('/apply', applyCoupon);
router.get('/stats', getCouponStats);

module.exports = router;