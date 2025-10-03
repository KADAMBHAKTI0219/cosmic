const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getOrdersReport,
    getInventoryReport,
    getCustomersReport,
    getCouponsReport,
    getNewsletterReport
} = require('../controllers/reports/reportsController');

// All reports routes are protected for admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/orders', getOrdersReport);
router.get('/inventory', getInventoryReport);
router.get('/customers', getCustomersReport);
router.get('/coupons', getCouponsReport);
router.get('/newsletter', getNewsletterReport);

module.exports = router;