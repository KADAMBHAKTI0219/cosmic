const User = require('../../models/auth/auth');
const Product = require('../../models/products/product');
const Order = require('../../models/orders/order');
const { logError } = require('../notifications/notificationController');

// Get combined dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // User Stats
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    
    // Calculate new users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    // Calculate user growth percentage
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const usersLastMonth = await User.countDocuments({ 
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
    });
    
    const userGrowth = usersLastMonth > 0 
      ? Math.round(((newUsers - usersLastMonth) / usersLastMonth) * 100) 
      : 100;
    
    // Product Stats
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ stock: { $gt: 0 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });
    
    // Calculate new products in the last 30 days
    const newProducts = await Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    // Calculate product growth percentage
    const productsLastMonth = await Product.countDocuments({ 
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
    });
    
    const productGrowth = productsLastMonth > 0 
      ? Math.round(((newProducts - productsLastMonth) / productsLastMonth) * 100) 
      : 100;
    
    // Order Stats
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    // Calculate new orders in the last 30 days
    const newOrders = await Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    // Calculate order growth percentage
    const ordersLastMonth = await Order.countDocuments({ 
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
    });
    
    const orderGrowth = ordersLastMonth > 0 
      ? Math.round(((newOrders - ordersLastMonth) / ordersLastMonth) * 100) 
      : 100;
    
    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Calculate revenue in the last 30 days
    const revenueThisMonth = await Order.aggregate([
      { 
        $match: { 
          status: { $in: ['delivered', 'shipped', 'processing'] },
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const thisMonthRevenue = revenueThisMonth.length > 0 ? revenueThisMonth[0].totalRevenue : 0;
    
    // Calculate revenue in the previous 30 days
    const revenueLastMonth = await Order.aggregate([
      { 
        $match: { 
          status: { $in: ['delivered', 'shipped', 'processing'] },
          createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        } 
      },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const lastMonthRevenue = revenueLastMonth.length > 0 ? revenueLastMonth[0].totalRevenue : 0;
    
    // Calculate revenue growth percentage
    const revenueGrowth = lastMonthRevenue > 0 
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) 
      : 100;
    
    // Get monthly sales data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ['delivered', 'shipped', 'processing'] }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
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
    
    // Format the monthly sales data for charts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlySales = monthlySales.map(item => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      count: item.count,
      revenue: item.revenue
    }));
    
    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          revenue: 1,
          name: { $arrayElemAt: ['$productInfo.name', 0] },
          image: { $arrayElemAt: ['$productInfo.images', 0] }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        userStats: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          newUsers,
          growth: `${userGrowth}%`
        },
        productStats: {
          totalProducts,
          inStockProducts,
          outOfStockProducts,
          lowStockProducts,
          newProducts,
          growth: `${productGrowth}%`
        },
        orderStats: {
          totalOrders,
          pendingOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          newOrders,
          growth: `${orderGrowth}%`,
          totalRevenue,
          thisMonthRevenue,
          lastMonthRevenue,
          revenueGrowth: `${revenueGrowth}%`
        },
        chartData: {
          monthlySales: formattedMonthlySales,
          topSellingProducts
        }
      }
    });
  } catch (error) {
    await logError(error, req);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};