const mongoose = require('mongoose');

// Category Schema
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    validate: {
      validator: function(v) {
        // Simple URL validation
        return /^(http|https):\/\/[^ "]+$/.test(v) || v === '';
      },
      message: props => `${props.value} is not a valid URL!`
    }
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

// Create index for faster search
CategorySchema.index({ name: 'text' });

// Update the updatedAt field before saving
CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Category', CategorySchema);