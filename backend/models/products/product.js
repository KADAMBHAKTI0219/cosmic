const mongoose = require('mongoose');

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0.01, 'Price must be greater than 0']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        // Simple URL validation
        return /^(http|https):\/\/[^ "]+$/.test(v) || v === '';
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }],
  isOutOfStock: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster search
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ price: 1 });

// Update the updatedAt field before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-set isOutOfStock based on stock level
  this.isOutOfStock = this.stock <= 0;
  
  next();
});

// Also update isOutOfStock when updating via findOneAndUpdate
ProductSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // If stock is being updated, check if we need to update isOutOfStock
  if (update.stock !== undefined) {
    update.isOutOfStock = update.stock <= 0;
  }
  
  // Always update the updatedAt field
  this.set({ updatedAt: Date.now() });
  
  next();
});

module.exports = mongoose.model('Product', ProductSchema);