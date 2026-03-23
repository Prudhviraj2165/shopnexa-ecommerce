const mongoose = require('mongoose');

const storeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    description: { type: String, default: '' },
    logo: { type: String, default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80' },
    city: { type: String, required: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    category: { type: String, default: 'Grocery' }, // Grocery, Bakery, Dairy, etc.
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true }, // auto-approve for now
    isOpen: { type: Boolean, default: true },
    deliveryTime: { type: String, default: '10-20 mins' },
    minimumOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
