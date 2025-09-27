const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category/categoryController');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin only routes
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;