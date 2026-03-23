const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Product = require('./models/productModel');

dotenv.config();

const products = [
  {
    name: 'Amul Gold Full Cream Milk',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    brand: 'Amul',
    category: 'Dairy',
    description: 'Full cream fresh milk, pasteurised and homogenised. Rich in protein and calcium.',
    price: 32, originalPrice: 36, unit: '500 ml', rating: 4.5, numReviews: 120, countInStock: 50,
  },
  {
    name: 'Tropicana Orange Juice',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=80',
    brand: 'Tropicana',
    category: 'Beverages',
    description: '100% pure squeezed orange juice with no added sugar.',
    price: 99, originalPrice: 120, unit: '1 L', rating: 4.3, numReviews: 85, countInStock: 30,
  },
  {
    name: 'Fresh Bananas',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    brand: 'Farm Fresh',
    category: 'Fruits',
    description: 'Naturally ripened, sweet Robusta bananas sourced from certified farms.',
    price: 49, originalPrice: 60, unit: '500 g (6–8 pcs)', rating: 4.6, numReviews: 200, countInStock: 100,
  },
  {
    name: 'Britannia Bourbon Biscuits',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=400&q=80',
    brand: 'Britannia',
    category: 'Snacks',
    description: 'Crispy chocolate cream biscuits, perfect for evening tea.',
    price: 30, originalPrice: 35, unit: '150 g', rating: 4.4, numReviews: 310, countInStock: 80,
  },
  {
    name: 'Amul Butter',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
    brand: 'Amul',
    category: 'Dairy',
    description: 'Pasteurised butter made from fresh cream. Rich, creamy taste.',
    price: 55, originalPrice: 60, unit: '100 g', rating: 4.7, numReviews: 450, countInStock: 60,
  },
  {
    name: 'Wheat Bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    brand: 'Modern Bakehouse',
    category: 'Bakery',
    description: 'Soft whole wheat sandwich bread baked fresh daily.',
    price: 45, originalPrice: 52, unit: '400 g (18 slices)', rating: 4.2, numReviews: 140, countInStock: 40,
  },
  {
    name: "Lay's Classic Salted Chips",
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
    brand: "Lay's",
    category: 'Snacks',
    description: 'Light and crispy potato chips with just the right amount of salt.',
    price: 30, originalPrice: 35, unit: '90 g', rating: 4.5, numReviews: 520, countInStock: 70,
  },
  {
    name: 'Dove Body Wash',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80',
    brand: 'Dove',
    category: 'Personal Care',
    description: 'Gentle, moisturising body wash with quarter moisturising cream. Leaves skin soft.',
    price: 195, originalPrice: 225, unit: '500 ml', rating: 4.6, numReviews: 190, countInStock: 35,
  },
  {
    name: 'Fresh Cherry Tomatoes',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    brand: 'Farm Fresh',
    category: 'Fruits',
    description: 'Juicy, sweet cherry tomatoes. Perfect for salads and snacking.',
    price: 60, originalPrice: 75, unit: '250 g', rating: 4.4, numReviews: 95, countInStock: 45,
  },
  {
    name: 'Tetley Green Tea',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
    brand: 'Tetley',
    category: 'Beverages',
    description: '25 green tea bags with antioxidant-rich natural ingredients.',
    price: 135, originalPrice: 155, unit: '25 bags', rating: 4.3, numReviews: 230, countInStock: 55,
  },
  {
    name: 'Vim Dishwash Liquid',
    image: 'https://images.unsplash.com/photo-1585232351009-aa87e03c89fd?auto=format&fit=crop&w=400&q=80',
    brand: 'Vim',
    category: 'Household',
    description: 'Tough on grease, gentle on hands. Lemon fragrance.',
    price: 79, originalPrice: 90, unit: '500 ml', rating: 4.1, numReviews: 175, countInStock: 60,
  },
  {
    name: 'McCain Smiles Frozen Potato',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad675?auto=format&fit=crop&w=400&q=80',
    brand: 'McCain',
    category: 'Frozen',
    description: 'Smile-shaped crispy potato snacks. Ready in minutes.',
    price: 130, originalPrice: 150, unit: '419 g', rating: 4.5, numReviews: 160, countInStock: 25,
  },
  {
    name: 'India Gate Basmati Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    brand: 'India Gate',
    category: 'Grocery & Kitchen',
    description: 'Premium basmati rice, extra long grain with distinct aroma.',
    price: 499, originalPrice: 550, unit: '5 kg', rating: 4.8, numReviews: 850, countInStock: 25,
  },
  {
    name: 'Fortune Sun Lite Oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbacf84c?auto=format&fit=crop&w=400&q=80',
    brand: 'Fortune',
    category: 'Grocery & Kitchen',
    description: 'Refined sunflower oil, healthy and light for everyday cooking.',
    price: 145, originalPrice: 160, unit: '1 L', rating: 4.4, numReviews: 240, countInStock: 40,
  },
  {
    name: 'Tata Salt',
    image: 'https://images.unsplash.com/photo-1626271168010-6b16c46c1d6e?auto=format&fit=crop&w=400&q=80',
    brand: 'Tata',
    category: 'Grocery & Kitchen',
    description: 'Vacuum evaporated iodised salt, the taste of India.',
    price: 28, originalPrice: 30, unit: '1 kg', rating: 4.9, numReviews: 1200, countInStock: 100,
  },
  {
    name: 'Maggi 2-Minute Noodles',
    image: 'https://images.unsplash.com/photo-1612927335773-979326884017?auto=format&fit=crop&w=400&q=80',
    brand: 'Maggi',
    category: 'Snacks',
    description: 'The classic instant noodles with masala tastemaker.',
    price: 14, originalPrice: 15, unit: '70 g', rating: 4.7, numReviews: 2500, countInStock: 200,
  },
  {
    name: 'Coca-Cola Zero Sugar',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=400&q=80',
    brand: 'Coca-Cola',
    category: 'Beverages',
    description: 'Zero calorie, zero sugar refreshing drink.',
    price: 40, originalPrice: 45, unit: '250 ml', rating: 4.5, numReviews: 150, countInStock: 60,
  },
  {
    name: 'Ariel Matic Detergent',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=400&q=80',
    brand: 'Ariel',
    category: 'Household',
    description: 'Advanced cleaning for top load washing machines.',
    price: 210, originalPrice: 250, unit: '1 kg', rating: 4.6, numReviews: 180, countInStock: 30,
  },
  {
    name: 'Dove Cream Bar Soap',
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&w=400&q=80',
    brand: 'Dove',
    category: 'Personal Care',
    description: 'Moisturising cream bar for soft, smooth skin.',
    price: 155, originalPrice: 180, unit: '3 x 125 g', rating: 4.8, numReviews: 420, countInStock: 55,
  },
  {
    name: 'Colgate MaxFresh Toothpaste',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80',
    brand: 'Colgate',
    category: 'Personal Care',
    description: 'Freshness crystals for an intense burst of freshness.',
    price: 95, originalPrice: 110, unit: '150 g', rating: 4.5, numReviews: 120, countInStock: 100,
  },
  {
    name: 'Nescafe Classic Coffee',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
    brand: 'Nescafe',
    category: 'Beverages',
    description: '100% pure instant coffee with a rich taste and aroma.',
    price: 320, originalPrice: 350, unit: '50 g', rating: 4.7, numReviews: 600, countInStock: 45,
  },
  {
    name: 'Red Label Tea',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637536?auto=format&fit=crop&w=400&q=80',
    brand: 'Brooke Bond',
    category: 'Beverages',
    description: 'High quality tea leaves for a perfect cup of chai.',
    price: 180, originalPrice: 200, unit: '500 g', rating: 4.6, numReviews: 280, countInStock: 90,
  },
  {
    name: 'Everest Garam Masala',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    brand: 'Everest',
    category: 'Grocery & Kitchen',
    description: 'A perfect blend of spices for rich flavour.',
    price: 75, originalPrice: 85, unit: '100 g', rating: 4.9, numReviews: 500, countInStock: 150,
  },
  {
    name: 'Catch Turmeric Powder',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80',
    brand: 'Catch',
    category: 'Grocery & Kitchen',
    description: 'Pure and authentic turmeric powder for natural colour.',
    price: 32, originalPrice: 38, unit: '200 g', rating: 4.7, numReviews: 180, countInStock: 200,
  },
  {
    name: "Kellogg's Corn Flakes",
    image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=400&q=80',
    brand: "Kellogg's",
    category: 'Breakfast',
    description: 'Golden crunchy corn flakes, enriched with 8 vitamins.',
    price: 185, originalPrice: 210, unit: '475 g', rating: 4.5, numReviews: 340, countInStock: 40,
  },
  {
    name: 'Kissan Tomato Ketchup',
    image: 'https://images.unsplash.com/photo-1472476443507-c7dcb2062d56?auto=format&fit=crop&w=400&q=80',
    brand: 'Kissan',
    category: 'Grocery & Kitchen',
    description: 'Made from 100% real juicy tomatoes.',
    price: 130, originalPrice: 150, unit: '950 g', rating: 4.6, numReviews: 890, countInStock: 75,
  },
  {
    name: 'Harpic Toilet Cleaner',
    image: 'https://images.unsplash.com/photo-1584622781564-1d9876a1df84?auto=format&fit=crop&w=400&q=80',
    brand: 'Harpic',
    category: 'Household',
    description: 'Kill 99.9% germs and removes tough stains.',
    price: 95, originalPrice: 105, unit: '500 ml', rating: 4.8, numReviews: 1500, countInStock: 120,
  },
  {
    name: 'Fresh Onions',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80',
    brand: 'Farm Fresh',
    category: 'Vegetables',
    description: 'Premium red onions, handpicked from farms.',
    price: 35, originalPrice: 45, unit: '1 kg', rating: 4.4, numReviews: 600, countInStock: 300,
  },
  {
    name: 'Fresh Potatoes',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad675?auto=format&fit=crop&w=400&q=80',
    brand: 'Farm Fresh',
    category: 'Vegetables',
    description: 'Freshly harvested earthy potatoes.',
    price: 25, originalPrice: 35, unit: '1 kg', rating: 4.5, numReviews: 450, countInStock: 400,
  },
  {
    name: 'Fresh Tomatoes',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    brand: 'Farm Fresh',
    category: 'Vegetables',
    description: 'Juicy and red ripened tomatoes.',
    price: 40, originalPrice: 50, unit: '1 kg', rating: 4.3, numReviews: 320, countInStock: 250,
  },
  {
    name: 'Cadbury Dairy Milk Silk',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80',
    brand: 'Cadbury',
    category: 'Snacks',
    description: 'The smoothest, creamiest chocolate experience.',
    price: 160, originalPrice: 175, unit: '150 g', rating: 4.9, numReviews: 1200, countInStock: 80,
  },
  {
    name: 'Kwality Walls Choco Brownie',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80',
    brand: 'Kwality Walls',
    category: 'Frozen',
    description: 'Rich chocolate ice cream with brownie chunks.',
    price: 250, originalPrice: 280, unit: '700 ml', rating: 4.7, numReviews: 180, countInStock: 20,
  },
  {
    name: 'Fresh Chicken Breast',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80',
    brand: 'Fresh Meat Co',
    category: 'Meat',
    description: 'Skinless, boneless chicken breast, tender and fresh.',
    price: 280, originalPrice: 320, unit: '500 g', rating: 4.8, numReviews: 120, countInStock: 15,
  },
  {
    name: 'Pedigree Adult Dog Food',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80',
    brand: 'Pedigree',
    category: 'Pet Care',
    description: 'Complete and balanced nutrition for adult dogs.',
    price: 650, originalPrice: 720, unit: '3 kg', rating: 4.7, numReviews: 450, countInStock: 25,
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    await User.deleteMany();
    await Product.deleteMany();
    await User.syncIndexes();
    console.log('Cleared existing data and synced indexes.');

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopnexa.com',
      password: 'admin123456',
      isAdmin: true,
    });
    console.log('Admin user created: admin@shopnexa.com / admin123456');

    const sampleProducts = products.map(p => ({ ...p, user: adminUser._id }));
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} grocery products!`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
