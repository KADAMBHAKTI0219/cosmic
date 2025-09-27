const User = require('../../models/auth/auth');
const Admin = require('../../models/admin/admin');
const jwt = require('jsonwebtoken');

// Generate JWT Token for User
const generateUserToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate JWT Token for Admin
const generateAdminToken = (admin) => {
  return jwt.sign(
    { _id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// @desc    Login user or admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if login is for admin
    if (isAdmin) {
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
      const token = generateAdminToken(admin);

      // Update last login
      admin.lastLogin = Date.now();
      await admin.save();

      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        },
        token
      });
    } else {
      // Regular user login
      // Check for user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Your account is inactive. Please contact support.'
        });
      }
      
      // Check if email is verified
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: 'Your email is not verified. Please verify your email before logging in.'
        });
      }

      // Generate token
      const token = generateUserToken(user._id);

      // Set cookie options
      const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
      };

      // Add secure flag in production
      if (process.env.NODE_ENV === 'production') {
        options.secure = true;
      }

      // Send response with cookie
      return res.status(200)
        .cookie('token', token, options)
        .json({
          success: true,
          token,
          user: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role
          }
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};