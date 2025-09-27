const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin'],
    default: 'admin'
  },
  permissions: {
    users: { type: Boolean, default: false },
    products: { type: Boolean, default: false },
    categories: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  const admin = this;
  if (admin.isModified('password')) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
  next();
});

// Generate JWT token
adminSchema.methods.generateAuthToken = function() {
  const admin = this;
  const token = jwt.sign(
    { _id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return token;
};

// Compare password for login
adminSchema.methods.comparePassword = async function(password) {
  const admin = this;
  return await bcrypt.compare(password, admin.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;