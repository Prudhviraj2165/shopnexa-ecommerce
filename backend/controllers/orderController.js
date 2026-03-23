const Order = require('../models/orderModel');
const User = require('../models/userModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    deliveryInstruction,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // If Wallet payment, check and deduct balance
    let isPaid = false;
    let paidAt = null;
    
    if (paymentMethod === 'Wallet') {
      const user = await User.findById(req.user._id);
      if (user.walletBalance < totalPrice) {
        res.status(400);
        throw new Error('Insufficient Wallet Balance');
      }
      user.walletBalance -= totalPrice;
      await user.save();
      isPaid = true;
      paidAt = Date.now();
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      deliveryInstruction,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status;
    const updatedOrder = await order.save();

    // Emit socket event to the specific order room
    req.app.get('socketio').to(req.params.id).emit('orderStatusUpdated', updatedOrder.status);

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

module.exports = { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, updateOrderStatus };
