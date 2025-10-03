const InventoryLog = require('../../models/inventory/inventoryLog');
const Product = require('../../models/products/product');

// Adjust inventory for a product
exports.adjustInventory = async (req, res) => {
    try {
        const { productId, change, reason, notes } = req.body;
        
        if (!productId || change === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and change amount are required'
            });
        }
        
        // Find the product
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Check if adjustment would result in negative stock
        const newStockQty = product.stockQty + change;
        if (newStockQty < 0) {
            return res.status(400).json({
                success: false,
                message: 'Adjustment would result in negative stock'
            });
        }
        
        // Create inventory log entry
        const inventoryLog = await InventoryLog.create({
            productId,
            change,
            reason: reason || 'manual',
            adminId: req.user.id,
            notes
        });
        
        // Update product stock
        product.stockQty = newStockQty;
        await product.save();
        
        res.status(201).json({
            success: true,
            message: 'Inventory adjusted successfully',
            data: {
                inventoryLog,
                newStockQty
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get inventory logs
exports.getInventoryLogs = async (req, res) => {
    try {
        const { productId, reason, startDate, endDate, page = 1, limit = 10 } = req.query;
        
        // Build query
        const query = {};
        
        if (productId) {
            query.productId = productId;
        }
        
        if (reason) {
            query.reason = reason;
        }
        
        if (startDate || endDate) {
            query.createdAt = {};
            
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }
        
        // Pagination
        const skip = (page - 1) * limit;
        
        // Execute query
        const logs = await InventoryLog.find(query)
            .populate('productId', 'title sku')
            .populate('adminId', 'name')
            .populate('orderId', 'orderId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Get total count
        const total = await InventoryLog.countDocuments(query);
        
        res.status(200).json({
            success: true,
            count: logs.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get inventory log by ID
exports.getInventoryLog = async (req, res) => {
    try {
        const log = await InventoryLog.findById(req.params.id)
            .populate('productId', 'title sku')
            .populate('adminId', 'name')
            .populate('orderId', 'orderId');
        
        if (!log) {
            return res.status(404).json({
                success: false,
                message: 'Inventory log not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: log
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get inventory summary
exports.getInventorySummary = async (req, res) => {
    try {
        // Get products with low stock (less than 10)
        const lowStockProducts = await Product.find({ stockQty: { $lt: 10 } })
            .select('title sku stockQty')
            .sort({ stockQty: 1 });
        
        // Get total products count
        const totalProducts = await Product.countDocuments();
        
        // Get out of stock products count
        const outOfStockProducts = await Product.countDocuments({ stockQty: 0 });
        
        // Get recent inventory changes
        const recentChanges = await InventoryLog.find()
            .populate('productId', 'title sku')
            .populate('adminId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                outOfStockProducts,
                lowStockCount: lowStockProducts.length,
                lowStockProducts,
                recentChanges
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Handle inventory change for order
exports.handleOrderInventory = async (orderId, items, action) => {
    try {
        const multiplier = action === 'decrement' ? -1 : 1;
        
        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }
            
            const change = item.qty * multiplier;
            
            // Check if decrement would result in negative stock
            if (action === 'decrement' && product.stockQty < item.qty) {
                throw new Error(`Insufficient stock for product: ${product.title}`);
            }
            
            // Create inventory log
            await InventoryLog.create({
                productId: item.productId,
                change: change * -1, // Negative for decrement, positive for increment
                reason: action === 'decrement' ? 'order' : 'return',
                orderId
            });
            
            // Update product stock
            product.stockQty += change;
            await product.save();
        }
        
        return true;
    } catch (error) {
        throw error;
    }
};