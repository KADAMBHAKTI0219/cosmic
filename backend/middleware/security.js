const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// More strict rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after an hour'
  }
});

// Security middleware setup
const setupSecurity = (app) => {
  // Set security HTTP headers
  app.use(helmet());
  
  // Enable CORS
  app.use(cors());
  
  // Prevent XSS attacks
  app.use(xss());
  
  // Prevent HTTP Parameter Pollution
  app.use(hpp());
  
  // Apply rate limiting to all requests
  app.use('/api', apiLimiter);
  
  // Apply stricter rate limiting to auth routes
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/forgot-password', authLimiter);
  app.use('/api/admin/login', authLimiter);
  
  return app;
};

module.exports = { setupSecurity };