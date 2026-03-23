const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview } = require('../controllers/productController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, vendor, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id')
  .get(getProductById)
  .put(protect, vendor, updateProduct)
  .delete(protect, vendor, deleteProduct);

module.exports = router;
