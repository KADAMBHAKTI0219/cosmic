const Order = require('../../models/orders/order');
const { logError } = require('../notifications/notificationController');

// Get all orders with filtering and pagination
exports.getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate
    } = req.query;
    
    const query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Search by order ID or customer name/email
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Set up sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const options = {
      sort,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      populate: 'user'
    };
    
    const orders = await Order.find(query, null, options);
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: orders,
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

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id).populate('user').populate('items.product');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      { 
        status,
        statusHistory: { 
          $push: { 
            status, 
            timestamp: Date.now(),
            updatedBy: req.user._id
          } 
        }
      },
      { new: true }
    ).populate('user');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Here you would trigger a notification to the user about order status change
    // notificationController.createNotification({...})
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    // Count orders by status
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Get monthly orders and revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orderCount: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        ordersByStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        totalRevenue,
        monthlyStats
      }
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Export orders data (CSV format)
exports.exportOrders = async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate, status } = req.query;
    
    const query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    if (format === 'csv') {
      // Generate CSV data
      let csvData = 'Order ID,Customer,Email,Date,Status,Items,Total Amount\n';
      
      orders.forEach(order => {
        const itemsText = order.items.map(item => 
          `${item.quantity}x ${item.productName}`
        ).join('; ');
        
        csvData += `${order.orderId},${order.user ? order.user.name : 'N/A'},${order.user ? order.user.email : 'N/A'},${order.createdAt.toISOString().split('T')[0]},${order.status},${itemsText},${order.totalAmount}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=orders-${Date.now()}.csv`);
      return res.status(200).send(csvData);
    } else {
      // Default JSON response
      return res.status(200).json({
        success: true,
        data: orders
      });
    }
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};