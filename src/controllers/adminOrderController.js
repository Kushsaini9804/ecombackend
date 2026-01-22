const Order = require('../models/Order');

const ALLOWED_STATUSES = [
  'pending',
  'approved',
  'shipped',
  'delivered',
  'cancelled',
];

/// 🔹 GET ALL ORDERS (ADMIN)
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'title image price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/// 🔹 UPDATE ORDER STATUS (ADMIN)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // ✅ Validate status
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: 'Invalid order status',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ✅ Optional: Prevent backward status change
    if (order.status === 'delivered') {
      return res.status(400).json({
        message: 'Delivered order cannot be changed',
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

module.exports = {
  getAllOrdersAdmin,
  updateOrderStatus,
};
