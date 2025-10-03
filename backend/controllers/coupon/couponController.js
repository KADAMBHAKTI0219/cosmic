const Coupon = require('../../models/coupon/coupon');

// Create a new coupon
exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json({
            success: true,
            count: coupons.length,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single coupon
exports.getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a coupon
exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
            data: coupon
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Validate a coupon
exports.validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        
        if (!code || !orderAmount) {
            return res.status(400).json({
                success: false,
                message: 'Please provide coupon code and order amount'
            });
        }
        
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }
        
        // Check if coupon is valid
        const validationResult = coupon.isValid(orderAmount);
        
        if (!validationResult.valid) {
            return res.status(400).json({
                success: false,
                message: validationResult.message
            });
        }
        
        // Calculate discount
        const discount = coupon.calculateDiscount(orderAmount);
        
        res.status(200).json({
            success: true,
            message: 'Coupon is valid',
            data: {
                coupon,
                discount,
                finalAmount: orderAmount - discount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Apply a coupon (increment usedCount)
exports.applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Please provide coupon code'
            });
        }
        
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }
        
        // Increment used count
        coupon.usedCount += 1;
        await coupon.save();
        
        res.status(200).json({
            success: true,
            message: 'Coupon applied successfully',
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get coupon usage statistics
exports.getCouponStats = async (req, res) => {
    try {
        const stats = await Coupon.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalUsed: { $sum: '$usedCount' }
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};