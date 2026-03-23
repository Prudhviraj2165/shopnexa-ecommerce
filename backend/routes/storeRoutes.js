const express = require('express');
const router = express.Router();
const {
  registerStore,
  getStores,
  getStoreById,
  updateStore,
  getMyStore,
  getVendorOrders,
} = require('../controllers/storeController');
const { protect, vendor } = require('../middleware/authMiddleware');

router.route('/')
  .get(getStores)
  .post(protect, registerStore);

router.get('/mine', protect, vendor, getMyStore);
router.get('/mine/orders', protect, vendor, getVendorOrders);

router.route('/:id')
  .get(getStoreById)
  .put(protect, vendor, updateStore);

module.exports = router;
