const express = require('express');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const {
  getAllOrdersAdmin,
  updateOrderStatus,
} = require('../controllers/adminOrderController');

const router = express.Router();

router.use(protect, adminOnly);

// 🔹 GET ALL ORDERS
router.get('/all-orders', getAllOrdersAdmin);

// 🔹 UPDATE ORDER STATUS
router.put('/:id/status', updateOrderStatus);

module.exports = router;
