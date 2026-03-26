import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight,
  Beef,
  Candy,
  ChevronDown,
  Clock3,
  Flame,
  GlassWater,
  LayoutGrid,
  Leaf,
  MapPin,
  Milk,
  Moon,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Store,
  Sun,
  Waves,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import LocationModal from '../components/LocationModal';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const socketBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
const socket = io(socketBaseUrl, { autoConnect: true });

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const categoryMap = {
  All: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Grocery', 'Grocery & Kitchen', 'Snacks', 'Beverages', 'Frozen', 'Personal Care', 'Household', 'Breakfast', 'Instant Food', 'Meat', 'Fish', 'Seafood', 'Pet Care'],
  'Fruits & Vegetables': ['Fruits', 'Vegetables'],
  'Dairy & Bread': ['Dairy', 'Bakery'],
  'Snacks & Munchies': ['Snacks'],
  'Cold Drinks & Juices': ['Beverages'],
  'Breakfast & Instant Food': ['Breakfast', 'Instant Food'],
  'Meat & Fish': ['Meat', 'Fish', 'Seafood'],
  'Pet Care': ['Pet Care'],
  'Grocery & Kitchen': ['Grocery', 'Grocery & Kitchen'],
  'Personal Care': ['Personal Care'],
  'Household Needs': ['Household'],
  Frozen: ['Frozen'],
};

const categoryChips = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Fruits & Vegetables', icon: Leaf },
  { name: 'Dairy & Bread', icon: Milk },
  { name: 'Snacks & Munchies', icon: Candy },
  { name: 'Cold Drinks & Juices', icon: GlassWater },
  { name: 'Breakfast & Instant Food', icon: Flame },
  { name: 'Meat & Fish', icon: Beef },
  { name: 'Pet Care', icon: Sparkles },
  { name: 'Grocery & Kitchen', icon: ShoppingBag },
  { name: 'Personal Care', icon: Waves },
  { name: 'Household Needs', icon: Sparkles },
  { name: 'Frozen', icon: Snowflake },
];

const sections = [
  { title: 'Fresh vegetables', icon: Leaf, categories: ['Vegetables'] },
  { title: 'Fresh fruits', icon: Leaf, categories: ['Fruits'] },
  { title: 'Dairy, bread & eggs', icon: Milk, categories: ['Dairy', 'Bakery'] },
  { title: 'Snacks & munchies', icon: Candy, categories: ['Snacks'] },
  { title: 'Cold drinks & juices', icon: GlassWater, categories: ['Beverages'] },
  { title: 'Sweet cravings', icon: Sparkles, categories: ['Frozen'] },
  { title: 'Breakfast & instant food', icon: Flame, categories: ['Breakfast', 'Instant Food'] },
  { title: 'Kitchen staples', icon: ShoppingBag, categories: ['Grocery', 'Grocery & Kitchen'] },
  { title: 'Personal care', icon: Waves, categories: ['Personal Care'] },
  { title: 'Household essentials', icon: Sparkles, categories: ['Household'] }
];

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(0)}`;

const HomePage = () => {
  const { theme } = useTheme();
  const { userInfo } = useAuth();
  const { addToCart, cartItems, removeFromCart } = useCart();
  const { location, status: locationStatus, detectLocation, setManualLocation } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterInStock, setFilterInStock] = useState(false);
  const [filterDiscount, setFilterDiscount] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, storeRes] = await Promise.all([
          axios.get(`${apiBaseUrl}/products`),
          axios.get(`${apiBaseUrl}/stores`),
        ]);
        setProducts(prodRes.data);
        setStores(storeRes.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const saved = localStorage.getItem('allAddresses');
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    socket.on('productUpdate', (updatedProduct) => {
      setProducts((prev) => prev.map((product) => (product._id === updatedProduct._id ? updatedProduct : product)));
    });
    socket.on('productCreated', (newProduct) => {
      setProducts((prev) => [newProduct, ...prev]);
    });

    return () => {
      socket.off('productUpdate');
      socket.off('productCreated');
    };
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get('keyword') || '');
  }, [searchParams]);

  useEffect(() => {
    if (locationStatus === 'done' || locationStatus === 'error') {
      setLocationLoading(false);
      if (locationStatus === 'done') {
        setShowLocationModal(false);
      }
    }
  }, [locationStatus]);

  const handleGetLocation = () => {
    setLocationLoading(true);
    detectLocation();
  };

  const handleSelectAddress = (address) => {
    setManualLocation(address);
    setShowLocationModal(false);
  };

  const getQty = (id) => cartItems.find((item) => item._id === id)?.qty || 0;

  const locString = `${location?.line1 || ''} ${location?.line2 || ''}`.toLowerCase();

  const matchingStores = useMemo(() => {
    if (!searchTerm) return [];
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, stores]);

  const filteredSections = useMemo(() => {
    const visibleSections = sections
      .map((section) => {
        const activeCategories = section.categories.filter((category) => categoryMap[selectedCategory].includes(category));

        let items = products.filter(
          (product) =>
            activeCategories.includes(product.category) &&
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (filterInStock) items = items.filter((product) => product.countInStock > 0);
        if (filterDiscount) items = items.filter((product) => product.originalPrice && product.originalPrice > product.price);

        if (sortBy === 'price_asc') items = [...items].sort((a, b) => a.price - b.price);
        else if (sortBy === 'price_desc') items = [...items].sort((a, b) => b.price - a.price);
        else if (sortBy === 'rating') items = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));

        return { ...section, items };
      })
      .filter((section) => section.items.length > 0);

    const displayedProductIds = new Set(visibleSections.flatMap((section) => section.items.map((item) => item._id)));
    const remainingProducts = products.filter(
      (product) =>
        !displayedProductIds.has(product._id) &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (remainingProducts.length > 0) {
      visibleSections.push({
        title: 'Explore more',
        icon: Sparkles,
        items: remainingProducts,
      });
    }

    return visibleSections;
  }, [filterDiscount, filterInStock, products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className={`instamart-page-root ${theme === 'dark' ? 'dark-mode-override' : ''}`}>
      
      {/* INSTAMART SIDEBAR (Desktop) */}
      <aside className="instamart-sidebar">
        <div className="sidebar-menu">
          {categoryChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.name}
                className={`sidebar-menu-item ${selectedCategory === chip.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(chip.name)}
                type="button"
              >
                <Icon size={18} />
                <span>{chip.name}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MOBILE TOP RIBBON (Visible only if sidebar hidden via media query) */}
      <div className="sub-cat-ribbon" style={{ display: 'none' /* handled mostly by full layout but available if needed */ }}>
        {categoryChips.map((chip) => {
          const Icon = chip.icon;
          return (
            <div
              key={chip.name}
              className={`sub-cat-item ${selectedCategory === chip.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(chip.name)}
            >
              <div className="sub-cat-icon"><Icon size={20} /></div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>{chip.name.split(' ')[0]}</span>
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="instamart-main">
        {loading ? (
          <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}><Loader /></div>
        ) : error ? (
          <div style={{ padding: '40px' }}><Message variant="danger">{error}</Message></div>
        ) : (
          <>
            {/* Search Results Grid if searching */}
            {searchTerm && (
              <section style={{ padding: '24px 40px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>Search Results for &quot;{searchTerm}&quot;</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                  {filteredSections.flatMap(s => s.items).map((product) => {
                    const qty = getQty(product._id);
                    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

                    return (
                      <div className="insta-product-card" key={product._id}>
                        {hasDiscount && (
                          <span className="insta-time-pill" style={{ background: '#e53e3e', color: '#fff' }}>
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                          </span>
                        )}
                        {!hasDiscount && (
                           <span className="insta-time-pill"><Clock3 size={10} /> 10 MINS</span>
                        )}
                        
                        <div className="insta-product-img" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                          <img src={product.image} alt={product.name} />
                        </div>

                        <div className="insta-product-title" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                          {product.name}
                        </div>
                        <div className="insta-product-weight">{product.unit || '1 unit pack'}</div>

                        <div className="insta-price-row">
                          <div className="insta-price">
                            <span className="insta-price-current">{formatCurrency(product.price)}</span>
                            {hasDiscount && <span className="insta-price-old">{formatCurrency(product.originalPrice)}</span>}
                          </div>

                          {qty === 0 ? (
                            <button
                              className="insta-add-btn"
                              onClick={() => addToCart({ ...product, qty: 1 })}
                              disabled={product.countInStock === 0}
                            >
                              {product.countInStock === 0 ? 'Out' : 'Add'}
                            </button>
                          ) : (
                            <div className="insta-stepper">
                              <button onClick={() => removeFromCart(product._id)}>-</button>
                              <span>{qty}</span>
                              <button onClick={() => addToCart({ ...product, qty: qty + 1 })} disabled={qty >= product.countInStock}>+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Normal Horizontal Categorized Carousels */}
            {!searchTerm && filteredSections.map((section) => (
              <section className="insta-carousel-section" key={section.title}>
                <div className="insta-carousel-header">
                  <h2 className="insta-carousel-title">{section.title}</h2>
                  <button className="text-link" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--swiggy-orange)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    See All
                  </button>
                </div>
                
                <div className="insta-carousel-track">
                  {section.items.map((product) => {
                    const qty = getQty(product._id);
                    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

                    return (
                      <div className="insta-product-card" key={product._id}>
                        {hasDiscount && (
                          <span className="insta-time-pill" style={{ background: '#e53e3e', color: '#fff' }}>
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                        {!hasDiscount && (
                          <span className="insta-time-pill"><Clock3 size={10} /> 10 MINS</span>
                        )}

                        <div className="insta-product-img" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                          <img src={product.image} alt={product.name} />
                        </div>

                        <div className="insta-product-title" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                          {product.name}
                        </div>
                        <div className="insta-product-weight">{product.unit || '1 unit'}</div>

                        <div className="insta-price-row">
                          <div className="insta-price">
                            <span className="insta-price-current">{formatCurrency(product.price)}</span>
                            {hasDiscount && <span className="insta-price-old">{formatCurrency(product.originalPrice)}</span>}
                          </div>

                          {qty === 0 ? (
                            <button
                              className="insta-add-btn"
                              onClick={() => addToCart({ ...product, qty: 1 })}
                              disabled={product.countInStock === 0}
                            >
                              {product.countInStock === 0 ? 'Out' : 'ADD'}
                            </button>
                          ) : (
                            <div className="insta-stepper">
                              <button onClick={() => removeFromCart(product._id)}>-</button>
                              <span>{qty}</span>
                              <button onClick={() => addToCart({ ...product, qty: qty + 1 })} disabled={qty >= product.countInStock}>+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </>
        )}
      </main>

      {/* Global Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onShareLocation={handleGetLocation}
        addresses={savedAddresses}
        onSelectAddress={handleSelectAddress}
        theme={theme}
      />
    </div>
  );
};

export default HomePage;
