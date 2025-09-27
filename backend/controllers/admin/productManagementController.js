const Product = require('../../models/products/product');
const Category = require('../../models/category/category');
const { logError } = require('../notifications/notificationController');

// Get all products with filtering and pagination
exports.getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Filter by status if provided
    if (status) {
      if (status === 'in_stock') {
        query.stock = { $gt: 0 };
      } else if (status === 'out_of_stock') {
        query.stock = 0;
      } else if (status === 'low_stock') {
        query.stock = { $gt: 0, $lte: 10 };
      }
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Set up sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const options = {
      sort,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      populate: 'category'
    };
    
    const products = await Product.find(query, null, options);
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id).populate('category');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      stock, 
      category,
      images,
      specifications,
      isActive
    } = req.body;
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      images: images || [],
      specifications: specifications || {},
      isActive: isActive !== undefined ? isActive : true
    });
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      stock, 
      category,
      images,
      specifications,
      isActive
    } = req.body;
    
    // Check if category exists if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (category) updateData.category = category;
    if (images) updateData.images = images;
    if (specifications) updateData.specifications = specifications;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update product stock
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (stock === undefined) {
      return res.status(400).json({ success: false, message: 'Stock value is required' });
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product stock updated successfully',
      data: product
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get product statistics
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const inactiveProducts = await Product.countDocuments({ isActive: false });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });
    
    // Get products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          _id: 0,
          category: '$category.name',
          count: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        outOfStockProducts,
        lowStockProducts,
        productsByCategory
      }
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};