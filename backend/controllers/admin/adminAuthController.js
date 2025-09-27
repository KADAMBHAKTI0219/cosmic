/**
 * Admin Authentication Controller
 * Handles admin registration, login, profile management, and password changes
 */

const Admin = require('../../models/admin/admin');
const { logError } = require('../notifications/notificationController');

/**
 * Register a new admin (only super_admin can do this)
 * @route POST /api/admin/register
 * @access Private - Super Admin only
 */
exports.createAdmin = async (req, res) => {
  try {
    // Check if requester is super_admin
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only super admins can create new admin accounts' 
      });
    }

    const { name, email, password, role, permissions } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin already exists with this email' });
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password,
      role: role || 'admin',
      permissions: permissions || {}
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Admin login
 * @route POST /api/admin/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = admin.generateAuthToken();

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      },
      token
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get admin profile
 * @route GET /api/admin/profile
 * @access Private - Admin only
 */
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Update admin profile
 * @route PUT /api/admin/profile
 * @access Private - Admin only
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Find admin and update
    const admin = await Admin.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: admin
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Change admin password
 * @route PUT /api/admin/change-password
 * @access Private - Admin only
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide current password and new password' 
      });
    }

    // Find admin
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Check current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};