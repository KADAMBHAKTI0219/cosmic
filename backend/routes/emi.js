const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const emiController = require('../controllers/emi/emiController');

// Admin routes (protected)
router.post('/', protect, authorize('admin'), emiController.createEMI);
router.put('/:id', protect, authorize('admin'), emiController.updateEMI);
router.delete('/:id', protect, authorize('admin'), emiController.deleteEMI);
router.get('/', protect, authorize('admin'), emiController.getEMIs);

// Public routes
router.get('/product/:productId', emiController.getProductEMIs);
router.get('/:id', emiController.getEMI);

module.exports = router;