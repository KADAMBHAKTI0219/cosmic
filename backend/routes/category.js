const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory
} = require('../controllers/category/categoryController');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

module.exports = router;