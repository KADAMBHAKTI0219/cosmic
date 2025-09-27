const Review = require('../../models/review/review');
const Product = require('../../models/products/product');
const Order = require('../../models/orders/order');

/**
 * Add a new review for a product
 */
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Verify user has purchased the product
    const hasPurchased = await Order.findOne({
      userId,
      'items.productId': productId,
      orderStatus: 'delivered'
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products you have purchased'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      if (comment) existingReview.comment = comment;
      
      await existingReview.save();
      
      // Update product average rating
      await updateProductAverageRating(productId);
      
      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: existingReview
      });
    }

    // Create new review
    const review = new Review({
      productId,
      userId,
      rating,
      comment
    });

    await review.save();
    
    // Update product average rating
    await updateProductAverageRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

/**
 * Get all reviews for a product
 */
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find reviews
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'userId',
        select: 'firstName lastName'
      });
    
    // Count total reviews for pagination
    const totalReviews = await Review.countDocuments({ productId });
    
    res.status(200).json({
      success: true,
      data: {
        reviews,
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        currentPage: parseInt(page),
        totalReviews
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Delete a review
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find review
    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is authorized to delete (owner or admin)
    if (review.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    // Delete review
    await Review.findByIdAndDelete(id);
    
    // Update product average rating
    await updateProductAverageRating(review.productId);
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

/**
 * Helper function to update product average rating
 */
const updateProductAverageRating = async (productId) => {
  const reviews = await Review.find({ productId });
  
  if (reviews.length === 0) {
    // No reviews, reset rating to 0
    await Product.findByIdAndUpdate(productId, { 
      averageRating: 0,
      reviewCount: 0
    });
    return;
  }
  
  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  // Update product
  await Product.findByIdAndUpdate(productId, { 
    averageRating: parseFloat(averageRating.toFixed(1)),
    reviewCount: reviews.length
  });
};