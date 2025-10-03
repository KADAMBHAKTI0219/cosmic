const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    adjustInventory,
    getInventoryLogs,
    getInventoryLog,
    getInventorySummary
} = require('../controllers/inventory/inventoryController');

// All inventory routes are protected for admin only
router.use(protect);
router.use(authorize('admin'));

router.post('/adjust', adjustInventory);
router.get('/logs', getInventoryLogs);
router.get('/logs/:id', getInventoryLog);
router.get('/summary', getInventorySummary);

module.exports = router;