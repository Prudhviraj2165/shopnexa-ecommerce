const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, updateOrderStatus);

module.exports = router;
