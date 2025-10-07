const Category = require('../../models/category/category');
const Product = require('../../models/products/product');
const path = require('path');

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, status, image } = req.body;
    
    // Get image file path if uploaded
    let imagePath = image;
    if (req.file) {
      const uploadUrl = process.env.UPLOAD_URL || 'http://localhost:5000';
      imagePath = `${uploadUrl}/uploads/categories/${req.file.filename}`;
    }

    // Create category with validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      status,
      image: imagePath
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all categories with optional search and pagination
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    // Add search functionality if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Count total documents for pagination
    const total = await Category.countDocuments(query);
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find categories
    const categories = await Category.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/category/:id
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res) => {
  try {
    console.log('Searching for category with slug:', req.params.slug);
    
    // Direct search by slug (assuming slug is stored in the database)
    let category = await Category.findOne({ slug: req.params.slug });
    
    // If not found by slug, try by name (case insensitive)
    if (!category) {
      // Try direct match with name
      category = await Category.findOne({
        name: { $regex: new RegExp('^' + req.params.slug + '$', 'i') }
      });
      
      // If still not found, try converting slug to name format
      if (!category) {
        const nameFromSlug = req.params.slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        category = await Category.findOne({
          name: { $regex: new RegExp('^' + nameFromSlug + '$', 'i') }
        });
      }
    }
    
    if (!category) {
      console.log('Category not found for slug:', req.params.slug);
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    console.log('Found category:', category);
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    // Find category
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Prepare update data
    const updateData = {
      name: name.trim(),
      description: description ? description.trim() : category.description,
      status: status || category.status,
      updatedAt: Date.now()
    };
    
    // Handle image if uploaded
    if (req.file) {
      const uploadUrl = process.env.UPLOAD_URL || 'http://localhost:5000';
      updateData.image = `${uploadUrl}/uploads/categories/${req.file.filename}`;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }
    
    // Update category
    category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    // Check if category has linked products
    const productsCount = await Product.countDocuments({ categoryId: req.params.id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productsCount} linked products`
      });
    }
    
    // Find and delete category
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};