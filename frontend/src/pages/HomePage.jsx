import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, User as UserIcon, ShoppingBag, Zap, Sun, Moon, Clock, SlidersHorizontal, ChevronDown, Store, LayoutDashboard, LogOut, Package } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import Loader from '../components/Loader';
import Message from '../components/Message';
import LocationModal from '../components/LocationModal';
import { useLocation } from '../context/LocationContext';

const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''));

import { useRef } from 'react';
const HomePage = () => {
  const { theme, toggleTheme } = useTheme();
  const { userInfo, logout } = useAuth();
  const { addToCart, cartItems, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { location, status: locationStatus, detectLocation, setManualLocation } = useLocation();
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Sort and Filter state
  const [sortBy, setSortBy] = useState('relevance');
  const [filterInStock, setFilterInStock] = useState(false);
  const [filterDiscount, setFilterDiscount] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, storeRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/products`),
          axios.get(`${import.meta.env.VITE_API_URL}/stores`)
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

    // Load saved addresses
    const saved = localStorage.getItem('allAddresses');
    if (saved) setSavedAddresses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    socket.on('productUpdate', (updatedProduct) => {
      setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    });
    socket.on('productCreated', (newProduct) => {
      setProducts(prev => [newProduct, ...prev]);
    });
    return () => {
      socket.off('productUpdate');
      socket.off('productCreated');
    };
  }, []);

  const handleGetLocation = () => {
    setLocationLoading(true);
    detectLocation();
  };

  useEffect(() => {
    if (locationStatus === 'done' || locationStatus === 'error') {
      setLocationLoading(false);
      if (locationStatus === 'done') setShowLocationModal(false);
    }
  }, [locationStatus]);

  const handleSelectAddress = (addr) => {
    setManualLocation(addr);
    setShowLocationModal(false);
  };

  const categoryMap = {
    'All': ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Grocery', 'Grocery & Kitchen', 'Snacks', 'Beverages', 'Frozen', 'Personal Care', 'Household', 'Breakfast', 'Instant Food'],
    'Fruits & Vegetables': ['Fruits', 'Vegetables'],
    'Dairy & Bread': ['Dairy', 'Bakery'],
    'Snacks & Munchies': ['Snacks'],
    'Cold Drinks & Juices': ['Beverages'],
    'Grocery & Kitchen': ['Grocery', 'Grocery & Kitchen'],
    'Personal Care': ['Personal Care'],
    'Household Needs': ['Household'],
    'Breakfast & Instant Food': ['Breakfast', 'Instant Food'],
    'Meat & Fish': ['Meat', 'Fish'],
    'Pet Care': ['Pet Care']
  };

  const sections = [
    {
      title: 'Fresh items',
      icon: '🥬',
      categories: ['Fruits', 'Vegetables', 'Dairy', 'Bakery']
    },
    {
      title: 'Grocery & Kitchen',
      icon: '🥣',
      categories: ['Grocery', 'Grocery & Kitchen']
    },
    {
      title: 'Snacks & Drinks',
      icon: '🥤',
      categories: ['Snacks', 'Beverages', 'Frozen']
    },
    {
      title: 'Personal Care',
      icon: '🧴',
      categories: ['Personal Care']
    },
    {
      title: 'Household essentials',
      icon: '🧼',
      categories: ['Household']
    },
    {
      title: 'Breakfast & Instant Food',
      icon: '🍳',
      categories: ['Breakfast', 'Instant Food']
    }
  ];

  const filteredSections = sections.map(section => {
    // Determine which categories in this section match the selected category
    const activeCategories = section.categories.filter(cat =>
      categoryMap[selectedCategory].includes(cat)
    );

    let items = products.filter(p =>
      activeCategories.includes(p.category) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Apply Filters
    if (filterInStock) items = items.filter(p => p.countInStock > 0);
    if (filterDiscount) items = items.filter(p => p.originalPrice && p.originalPrice > p.price);

    // Apply Sorting
    if (sortBy === 'price_asc') items.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') items.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') items.sort((a, b) => b.rating - a.rating);

    return {
      ...section,
      items
    };
  }).filter(section => section.items.length > 0);

  // --- Matching Stores (New Sensible Discovery) ---
  const matchingStores = searchTerm ? stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // --- Explore More Section (All products not in listed sections) ---
  const displayedProductIds = new Set(filteredSections.flatMap(s => s.items.map(i => i._id)));
  const remainingProducts = products.filter(p => !displayedProductIds.has(p._id) && 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.brand.toLowerCase().includes(searchTerm.toLowerCase())));
  
  if (remainingProducts.length > 0) {
    filteredSections.push({
      title: 'Explore More',
      icon: '✨',
      items: remainingProducts
    });
  }

  const categories = [
    { name: 'All', icon: '✨' },
    { 
      name: 'Fruits & Vegetables', 
      icon: '🍎', 
      categories: ['Vegetables', 'Fruits'] 
    },
    { 
      name: 'Dairy & Bread', 
      icon: '🥛', 
      categories: ['Dairy', 'Bakery'] 
    },
    { 
      name: 'Snacks & Munchies', 
      icon: '🥨', 
      categories: ['Snacks'] 
    },
    { 
      name: 'Cold Drinks & Juices', 
      icon: '🥤', 
      categories: ['Beverages'] 
    },
    { 
      name: 'Breakfast & Instant Food', 
      icon: '🍳', 
      categories: ['Breakfast', 'Instant Food'] 
    },
    { 
      name: 'Meat & Fish', 
      icon: '🍗', 
      categories: ['Meat', 'Seafood'] 
    },
    { 
      name: 'Pet Care', 
      icon: '🐶', 
      categories: ['Pet Care'] 
    },
    { 
      name: 'Grocery & Kitchen', 
      icon: '🧂', 
      categories: ['Grocery', 'Grocery & Kitchen'] 
    },
    { 
      name: 'Personal Care', 
      icon: '🧼', 
      categories: ['Personal Care'] 
    },
    { 
      name: 'Household Needs', 
      icon: '🧹', 
      categories: ['Household'] 
    },
    { 
      name: 'Frozen', 
      icon: '🍦', 
      categories: ['Frozen'] 
    }
  ];

  const getQty = (id) => cartItems.find(x => x._id === id)?.qty || 0;

  // Location-based store sorting logic
  const locString = ((location?.line1 || '') + " " + (location?.line2 || '')).toLowerCase();
  const localStores = [...stores].sort((a, b) => {
    const aCityMatch = (a.city && locString.includes(a.city.toLowerCase())) ? 1 : 0;
    const bCityMatch = (b.city && locString.includes(b.city.toLowerCase())) ? 1 : 0;
    if (aCityMatch !== bCityMatch) return bCityMatch - aCityMatch;
    
    const aAddr = a.address ? a.address.split(',')[0].toLowerCase().trim() : '';
    const bAddr = b.address ? b.address.split(',')[0].toLowerCase().trim() : '';
    const aAddrMatch = (aAddr && locString.includes(aAddr)) ? 1 : 0;
    const bAddrMatch = (bAddr && locString.includes(bAddr)) ? 1 : 0;
    if (aAddrMatch !== bAddrMatch) return bAddrMatch - aAddrMatch;
    
    return (b.rating || 0) - (a.rating || 0);
  });

  return (
    <div className={`swiggy-web animate-fade-in ${theme === 'dark' ? 'dark-mode-override' : ''}`} style={{ paddingBottom: '100px' }}>

      {/* 1. Shopnexa Web Header (Refined Premium) */}
      <header className="swiggy-web-header">
        <div className="swiggy-logo-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ background: '#1db954', borderRadius: '10px', padding: '8px', boxShadow: '0 4px 12px rgba(29,185,84,0.3)' }}>
              <ShoppingBag size={28} color="#fff" />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1db954', letterSpacing: '-1.5px' }}>Shop<span style={{ color: theme === 'dark' ? '#fff' : '#101217' }}>nexa</span></span>
          </div>

          <div
            className="swiggy-location-web-new"
            onClick={() => setShowLocationModal(true)}
          >
            <div className="loc-icon-box">
              <MapPin size={22} color="#1db954" strokeWidth={3} />
            </div>
            <div className="loc-text-content">
              <span className="loc-label">Deliver to</span>
              <div className="loc-main">
                <span className="loc-city">{locationLoading ? 'Detecting...' : (location.line1 || 'Add your location')}</span>
                <span className="loc-arrow">▾</span>
              </div>
              <span className="loc-subtext">{location.line2 || 'To see items in your area'}</span>
            </div>
          </div>
        </div>

        <div className="swiggy-search-web" style={{ height: '52px', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder='Search for "Grocery, Milk, Eggs..."'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: '1.05rem' }}
          />
          <Search size={22} color="#686b78" />
        </div>

        <div className="swiggy-nav-right">
          {/* Theme Toggle */}
          <div
            className="swiggy-nav-item"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ padding: '8px', borderRadius: '50%', background: theme === 'dark' ? '#1a1d26' : '#f0f2f5' }}
          >
            {theme === 'dark' ? <Sun size={24} color="#1db954" /> : <Moon size={24} color="#1db954" />}
          </div>


          <div className="swiggy-nav-item" style={{ position: 'relative' }}>
            <div 
              onClick={() => navigate(userInfo ? '/profile' : '/login')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <UserIcon size={24} color={theme === 'dark' ? '#fff' : '#282c3f'} />
              <span style={{ color: theme === 'dark' ? '#fff' : '#282c3f' }}>
                {userInfo ? userInfo.name.split(' ')[0] : 'Sign In'}
              </span>
            </div>
          </div>

          <div
            className="swiggy-cart-btn-web"
            onClick={() => navigate('/cart')}
            style={{
              cursor: 'pointer',
              background: '#1db954',
              color: '#fff',
              position: 'relative'
            }}
          >
            <ShoppingBag size={20} color="#fff" />
            <span>{cartItems.length > 0 ? `₹${cartItems.reduce((acc, i) => acc + (i.price * i.qty), 0)}` : 'My Cart'}</span>
            {cartItems.length > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ff3d00', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem' }}>
                {cartItems.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. Sub-Category Ribbon (Instamart Style) */}
      <div className="sub-cat-ribbon-wrap">
        <div className="sub-cat-ribbon" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          {categories.map(cat => (
            <div
              key={cat.name}
              className={`sub-cat-item ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span className="sub-cat-icon">{cat.icon}</span>
              <span className="sub-cat-label">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Deals Banner */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { bg: 'linear-gradient(135deg,#1db954 0%,#17a549 100%)', emoji: '🏷️', title: 'Use code SAVE10', sub: '10% off on your first order' },
            { bg: 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)', emoji: '🚚', title: 'Free Delivery', sub: 'On orders above ₹499' },
            { bg: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', emoji: '🎁', title: 'New Arrivals', sub: 'Fresh stock added daily' },
            { bg: 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)', emoji: '⚡', title: '10-min Express', sub: 'Ultra-fast grocery delivery' },
          ].map((b, i) => (
            <div key={i} onClick={() => i === 0 && navigate('/coupons')} style={{ background: b.bg, borderRadius: '16px', padding: '18px 22px', minWidth: '220px', flex: '1 0 220px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', maxWidth: '280px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <span style={{ fontSize: '2rem' }}>{b.emoji}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: '#fff' }}>{b.title}</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Popular Stores Carousel (Sensible Stores Discovery) */}
      {!searchTerm && selectedCategory === 'All' && stores.length > 0 && (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: 900, margin: 0, fontSize: '1.4rem' }}>Popular Stores Near You</h2>
            <span onClick={() => navigate('/stores')} style={{ color: '#1db954', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>View All →</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
            {localStores.slice(0, 10).map(s => (
              <div 
                key={s._id} 
                onClick={() => navigate(`/store/${s._id}`)}
                style={{ flex: '0 0 140px', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', background: 'var(--card-bg)' }}>
                  <img src={s.logo} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={e => { e.currentTarget.src = `https://placehold.co/140x140/1db954/fff?text=${encodeURIComponent(s.name.slice(0, 1))}`; }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.deliveryTime}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3.5. Sort & Filter Bar */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowSortMenu(!showSortMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            <SlidersHorizontal size={14} /> 
            Sort by: {sortBy === 'relevance' ? 'Relevance' : sortBy === 'price_asc' ? 'Price: Low to High' : sortBy === 'price_desc' ? 'Price: High to Low' : 'Rating'} 
            <ChevronDown size={14} />
          </button>
          
          {showSortMenu && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '180px', overflow: 'hidden' }}>
              {[
                { value: 'relevance', label: 'Relevance' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'rating', label: 'Rating' }
              ].map(opt => (
                <div 
                  key={opt.value} 
                  onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                  style={{ padding: '10px 16px', fontSize: '0.85rem', cursor: 'pointer', background: sortBy === opt.value ? 'rgba(29,185,84,0.1)' : 'transparent', color: sortBy === opt.value ? 'var(--primary-color)' : 'var(--text-color)', fontWeight: sortBy === opt.value ? 700 : 500 }}
                  onMouseEnter={e => e.currentTarget.style.background = sortBy === opt.value ? 'rgba(29,185,84,0.1)' : 'var(--bg-color)'}
                  onMouseLeave={e => e.currentTarget.style.background = sortBy === opt.value ? 'rgba(29,185,84,0.1)' : 'transparent'}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => setFilterInStock(!filterInStock)}
          style={{ padding: '8px 14px', borderRadius: '20px', border: `1px solid ${filterInStock ? 'var(--primary-color)' : 'var(--border-color)'}`, background: filterInStock ? 'rgba(29,185,84,0.1)' : 'var(--card-bg)', color: filterInStock ? 'var(--primary-color)' : 'var(--text-color)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
          In Stock Only
        </button>

        <button 
          onClick={() => setFilterDiscount(!filterDiscount)}
          style={{ padding: '8px 14px', borderRadius: '20px', border: `1px solid ${filterDiscount ? '#f59e0b' : 'var(--border-color)'}`, background: filterDiscount ? 'rgba(245,158,11,0.1)' : 'var(--card-bg)', color: filterDiscount ? '#f59e0b' : 'var(--text-color)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
          Offers
        </button>
      </div>

      {/* 4. Web Style Categorized Content */}
      <div className="swiggy-web-content" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
          <>
            {/* Matching Stores Section (Sensible Discovery) */}
            {searchTerm && matchingStores.length > 0 && (
              <div style={{ marginBottom: '40px', padding: '24px', background: 'rgba(29,185,84,0.05)', borderRadius: '24px', border: '1px solid rgba(29,185,84,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Store size={22} color="var(--primary-color)" />
                    <h2 style={{ fontWeight: 900, margin: 0, fontSize: '1.3rem' }}>Matching Stores</h2>
                  </div>
                  <span onClick={() => navigate('/stores')} style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>See all stores</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
                  {matchingStores.map(s => (
                    <div key={s._id} onClick={() => navigate(`/store/${s._id}`)} style={{ flex: '0 0 280px', cursor: 'pointer', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '16px' }} 
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
                          <img src={s.logo} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { e.currentTarget.src = `https://placehold.co/60x60/1db954/fff?text=${encodeURIComponent(s.name.slice(0, 1))}`; }} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.deliveryTime} • ₹{s.minOrder || 0} min</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {filteredSections.map(section => (
            <div key={section.title} className="swiggy-web-section">
              <h2 className="swiggy-web-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {section.icon} {section.title}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#1db954', cursor: 'pointer' }}>View all ▾</span>
              </h2>
              <div className="swiggy-web-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', alignItems: 'stretch' }}>
                {section.items.slice(0, 8).map(p => (
                  <div key={p._id} className="swiggy-web-card">
                    <div className="swiggy-badge-top">
                      <div className="delivery-badge">
                        <Clock size={12} fill="currentColor" /> 10 mins
                      </div>
                    </div>

                    <div className="swiggy-web-img-box" onClick={() => navigate(`/product/${p._id}`)}>
                      <img src={p.image} alt={p.name} />
                    </div>

                    <div className="swiggy-web-info" onClick={() => navigate(`/product/${p._id}`)}>
                      <span className="swiggy-web-label">{p.name}</span>
                      <div style={{ fontSize: '0.8rem', color: '#686b78', marginBottom: 'auto' }}>{p.brand || 'Fresh Produce'} • {p.unit || '1 unit'}</div>

                      <div className="swiggy-web-price-box">
                        <div className="swiggy-price-val">₹{p.price}</div>

                        {getQty(p._id) === 0 ? (
                          <button className="swiggy-add-btn" onClick={(e) => { e.stopPropagation(); addToCart({ ...p, qty: 1 }); }}>ADD</button>
                        ) : (
                          <div className="qty-stepper" onClick={(e) => e.stopPropagation()} style={{ transform: 'scale(0.85)', background: '#fff' }}>
                            <button onClick={() => removeFromCart(p._id)} style={{ background: 'transparent', color: '#1db954' }}>−</button>
                            <span style={{ color: '#1db954' }}>{getQty(p._id)}</span>
                            <button onClick={() => addToCart({ ...p, qty: getQty(p._id) + 1 })} style={{ background: 'transparent', color: '#1db954' }}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ))}
          </>
        )}
      </div>

      {/* 3. Sticky Promo Footer (Cleaned) */}
      <div className="swiggy-sticky-footer" style={{
        borderTop: `1px solid ${theme === 'dark' ? '#2d334a' : '#e2f2f0'}`,
        background: theme === 'dark' ? '#0b0e14' : '#f1fffb',
        padding: '16px 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1db954', padding: '10px 24px', borderRadius: '30px', color: '#fff', fontWeight: 800 }}>
          <Zap size={18} fill="#fff" />
          <span>FREE DELIVERY on orders above ₹149</span>
          <span style={{ opacity: 0.8, fontSize: '0.8rem', marginLeft: 'auto' }}>Limited Time Only</span>
        </div>
      </div>

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
