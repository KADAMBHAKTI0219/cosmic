const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { setupSecurity } = require('./middleware/security');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize main app
const app = express();

// Initialize uploads server
const uploadsApp = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));

// Apply security middleware
setupSecurity(app);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/emis', require('./routes/emi'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/coupons', require('./routes/coupon'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/reports', require('./routes/reports'));

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Configure uploads server
uploadsApp.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));
uploadsApp.use('/uploads', express.static(path.join(__dirname, 'uploads')));

uploadsApp.get('/', (req, res) => {
  res.send('Uploads server is running...');
});

// Start main server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Main server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Start uploads server
const UPLOAD_PORT = process.env.UPLOAD_PORT || 3001;
uploadsApp.listen(UPLOAD_PORT, () => {
  console.log(`Uploads server running on port ${UPLOAD_PORT}`);
});