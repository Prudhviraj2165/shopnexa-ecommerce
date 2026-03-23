const Store = require('../models/storeModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Register / create a store (user becomes vendor)
// @route   POST /api/stores
// @access  Private
const registerStore = async (req, res) => {
  const { name, description, logo, city, address, phone, category, deliveryTime, minimumOrder } = req.body;

  // Check if user already has a store
  const existingStore = await Store.findOne({ owner: req.user._id });
  if (existingStore) {
    res.status(400);
    throw new Error('You already have a registered store');
  }

  const store = await Store.create({
    name,
    owner: req.user._id,
    description: description || '',
    logo: logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80',
    city,
    address: address || '',
    phone: phone || '',
    category: category || 'Grocery',
    deliveryTime: deliveryTime || '10-20 mins',
    minimumOrder: minimumOrder || 0,
  });

  // Mark user as vendor and link their store
  await User.findByIdAndUpdate(req.user._id, {
    isVendor: true,
    storeId: store._id,
  });

  // Real-time: notify admin
  const io = req.app.get('socketio');
  io.emit('newStore', store);

  res.status(201).json(store);
};

// @desc    Get all stores (public)
// @route   GET /api/stores
// @access  Public
const getStores = async (req, res) => {
  const city = req.query.city;
  const filter = city ? { city: { $regex: city, $options: 'i' }, isApproved: true } : { isApproved: true };
  const stores = await Store.find(filter).populate('owner', 'name email');
  res.json(stores);
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Public
const getStoreById = async (req, res) => {
  const store = await Store.findById(req.params.id).populate('owner', 'name email');
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }
  const products = await Product.find({ store: store._id });
  res.json({ store, products });
};

// @desc    Update store (vendor only)
// @route   PUT /api/stores/:id
// @access  Private/Vendor
const updateStore = async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }
  if (store.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this store');
  }

  const { name, description, logo, city, address, phone, category, deliveryTime, minimumOrder, isOpen } = req.body;
  store.name = name || store.name;
  store.description = description !== undefined ? description : store.description;
  store.logo = logo || store.logo;
  store.city = city || store.city;
  store.address = address !== undefined ? address : store.address;
  store.phone = phone !== undefined ? phone : store.phone;
  store.category = category || store.category;
  store.deliveryTime = deliveryTime || store.deliveryTime;
  store.minimumOrder = minimumOrder !== undefined ? minimumOrder : store.minimumOrder;
  store.isOpen = isOpen !== undefined ? isOpen : store.isOpen;

  const updated = await store.save();

  const io = req.app.get('socketio');
  io.emit('storeUpdated', updated);

  res.json(updated);
};

// @desc    Get vendor's own store info
// @route   GET /api/stores/mine
// @access  Private/Vendor
const getMyStore = async (req, res) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('No store found for this user');
  }
  const products = await Product.find({ store: store._id });
  res.json({ store, products });
};

// @desc    Get orders for vendor's store products
// @route   GET /api/stores/mine/orders
// @access  Private/Vendor
const getVendorOrders = async (req, res) => {
  const Order = require('../models/orderModel');
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('No store found');
  }
  // Get products that belong to this store
  const storeProducts = await Product.find({ store: store._id }).select('_id');
  const storeProductIds = storeProducts.map(p => p._id.toString());

  // Find orders that contain any of these products
  const allOrders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
  const vendorOrders = allOrders.filter(order =>
    order.orderItems.some(item => storeProductIds.includes(item.product?.toString()))
  );

  res.json(vendorOrders);
};

module.exports = { registerStore, getStores, getStoreById, updateStore, getMyStore, getVendorOrders };
