const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const products = await Product.find({ ...keyword, ...category });
  res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const storeId = req.body.storeId || null;
  const product = new Product({
    name: req.body.name || 'New Product',
    price: req.body.price || 0,
    user: req.user._id,
    image: req.body.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
    brand: req.body.brand || 'Local',
    category: req.body.category || 'Fruits',
    countInStock: req.body.countInStock || 10,
    numReviews: 0,
    description: req.body.description || 'Fresh quality product',
    unit: req.body.unit || '1 unit',
    store: storeId,
  });

  const createdProduct = await product.save();
  
  // Real-time: Emit new product
  const io = req.app.get('socketio');
  io.emit('productCreated', createdProduct);

  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

    const updatedProduct = await product.save();

    // Real-time: Alert clients about update
    const io = req.app.get('socketio');
    io.emit('productUpdate', updatedProduct);

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    
    // Real-time: Alert clients about deletion
    const io = req.app.get('socketio');
    io.emit('productDeleted', req.params.id);

    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };
