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
  { title: 'Fresh picks for today', icon: Leaf, categories: ['Fruits', 'Vegetables', 'Dairy', 'Bakery'] },
  { title: 'Kitchen staples', icon: ShoppingBag, categories: ['Grocery', 'Grocery & Kitchen'] },
  { title: 'Snacks and drinks', icon: Candy, categories: ['Snacks', 'Beverages', 'Frozen'] },
  { title: 'Personal care', icon: Sparkles, categories: ['Personal Care'] },
  { title: 'Household essentials', icon: Waves, categories: ['Household'] },
  { title: 'Breakfast and instant food', icon: Flame, categories: ['Breakfast', 'Instant Food'] },
];

const dealCards = [
  {
    title: 'Save 10% on your first basket',
    subtitle: 'Apply SAVE10 at checkout and stock up smarter.',
    tag: 'New user offer',
    accent: 'green',
    action: '/coupons',
  },
  {
    title: 'Free delivery above Rs. 499',
    subtitle: 'Plan a weekly restock and skip the delivery fee.',
    tag: 'Limited period',
    accent: 'gold',
  },
  {
    title: 'Fresh arrivals every morning',
    subtitle: 'Seasonal produce and essentials updated daily.',
    tag: 'Just added',
    accent: 'blue',
  },
];

const serviceHighlights = [
  '10-minute grocery delivery',
  'Live stock visibility',
  'Daily fresh restocks',
];

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(0)}`;

const HomePage = () => {
  const { theme, toggleTheme } = useTheme();
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

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      setSearchParams({ keyword: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  const getQty = (id) => cartItems.find((item) => item._id === id)?.qty || 0;

  const locString = `${location?.line1 || ''} ${location?.line2 || ''}`.toLowerCase();

  const localStores = useMemo(
    () =>
      [...stores].sort((a, b) => {
        const aCityMatch = a.city && locString.includes(a.city.toLowerCase()) ? 1 : 0;
        const bCityMatch = b.city && locString.includes(b.city.toLowerCase()) ? 1 : 0;
        if (aCityMatch !== bCityMatch) return bCityMatch - aCityMatch;

        const aAddr = a.address ? a.address.split(',')[0].toLowerCase().trim() : '';
        const bAddr = b.address ? b.address.split(',')[0].toLowerCase().trim() : '';
        const aAddrMatch = aAddr && locString.includes(aAddr) ? 1 : 0;
        const bAddrMatch = bAddr && locString.includes(bAddr) ? 1 : 0;
        if (aAddrMatch !== bAddrMatch) return bAddrMatch - aAddrMatch;

        return (b.rating || 0) - (a.rating || 0);
      }),
    [locString, stores]
  );

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

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const heroTitle = searchTerm ? `Results for "${searchTerm}"` : 'Groceries that feel premium, delivered fast.';
  const heroSubtitle = searchTerm
    ? 'Browse matching products and nearby stores with cleaner filters and quicker add-to-cart actions.'
    : 'A polished home for everyday essentials, fresh produce, pantry restocks, and quick treats.';
  const quickCategoryCards = categoryChips.slice(1, 9);
  const spotlightProducts = products.slice(0, 6);

  return (
    <div className={`home-shell ${theme === 'dark' ? 'dark-mode-override' : ''}`}>
      <section className="home-hero">
        <div className="home-hero__backdrop" />
        <div className="home-hero__inner">
          <header className="home-topbar">
            <button className="brand-lockup" onClick={() => navigate('/')} type="button">
              <span className="brand-lockup__icon">
                <ShoppingBag size={26} />
              </span>
              <span className="brand-lockup__text">
                Shop<span>nexa</span>
              </span>
            </button>

            <button className="topbar-location" onClick={() => setShowLocationModal(true)} type="button">
              <span className="topbar-location__icon">
                <MapPin size={18} />
              </span>
              <span className="topbar-location__text">
                <strong>{locationLoading ? 'Detecting your area...' : location.line1 || 'Choose delivery location'}</strong>
                <small>{location.line2 || 'See nearby stores and delivery estimates'}</small>
              </span>
            </button>

            <div className="topbar-actions">
              <button className="icon-toggle" onClick={toggleTheme} type="button" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="account-pill" onClick={() => navigate(userInfo ? '/profile' : '/login')} type="button">
                {userInfo ? userInfo.name.split(' ')[0] : 'Sign In'}
              </button>
              <button className="cart-pill" onClick={() => navigate('/cart')} type="button">
                <ShoppingBag size={18} />
                <span>{cartCount > 0 ? formatCurrency(cartTotal) : 'My Cart'}</span>
                {cartCount > 0 && <strong>{cartCount}</strong>}
              </button>
            </div>
          </header>

          <div className="home-service-strip">
            {serviceHighlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="home-hero__content">
            <div className="home-hero__copy">
              <span className="hero-kicker">
                <Sparkles size={16} />
                Refined grocery storefront
              </span>
              <h1>{heroTitle}</h1>
              <p>{heroSubtitle}</p>

              <div className="hero-search">
                <Search size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder="Search milk, bread, fruits, snacks..."
                />
              </div>

              <div className="hero-stats">
                <div className="hero-stat">
                  <strong>{products.length || '0'}</strong>
                  <span>Products live now</span>
                </div>
                <div className="hero-stat">
                  <strong>{stores.length || '0'}</strong>
                  <span>Stores around you</span>
                </div>
                <div className="hero-stat">
                  <strong>10 min</strong>
                  <span>Average fast delivery</span>
                </div>
              </div>
            </div>

            <aside className="hero-panel">
              <span className="hero-panel__eyebrow">Today&apos;s experience</span>
              <h2>Closer to a real instant-delivery app home.</h2>
              <div className="hero-panel__promo">
                <strong>Free delivery on first order</strong>
                <span>Use SAVE10 and unlock a cleaner onboarding offer block.</span>
              </div>
              <div className="hero-panel__mini-grid">
                {quickCategoryCards.slice(0, 4).map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={chip.name}
                      className="hero-mini-category"
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
          </div>
        </div>
      </section>

      <div className="home-content">
        {!searchTerm && (
          <section className="surface-panel quick-explore-panel">
            <div className="section-row">
              <div>
                <span className="section-kicker">Browse fast</span>
                <h2>Popular aisles</h2>
              </div>
            </div>

            <div className="quick-explore-grid">
              {quickCategoryCards.map((chip) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.name}
                    className="quick-explore-card"
                    onClick={() => setSelectedCategory(chip.name)}
                    type="button"
                  >
                    <span className="quick-explore-card__icon">
                      <Icon size={20} />
                    </span>
                    <strong>{chip.name}</strong>
                    <small>Fresh picks and quick essentials</small>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="deal-strip">
          {dealCards.map((deal) => (
            <button
              key={deal.title}
              className={`deal-card deal-card--${deal.accent}`}
              onClick={() => deal.action && navigate(deal.action)}
              type="button"
            >
              <span>{deal.tag}</span>
              <strong>{deal.title}</strong>
              <p>{deal.subtitle}</p>
              <ArrowRight size={18} />
            </button>
          ))}
        </section>

        {!searchTerm && spotlightProducts.length > 0 && (
          <section className="surface-panel surface-panel--compact">
            <div className="section-row">
              <div>
                <span className="section-kicker">Quick add</span>
                <h2>Trending essentials</h2>
              </div>
            </div>

            <div className="spotlight-row">
              {spotlightProducts.map((product) => (
                <button
                  key={product._id}
                  className="spotlight-card"
                  onClick={() => navigate(`/product/${product._id}`)}
                  type="button"
                >
                  <div className="spotlight-card__image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="spotlight-card__body">
                    <strong>{product.name}</strong>
                    <span>{formatCurrency(product.price)}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {!searchTerm && selectedCategory === 'All' && localStores.length > 0 && (
          <section className="surface-panel">
            <div className="section-row">
              <div>
                <span className="section-kicker">Nearby favourites</span>
                <h2>Popular stores around you</h2>
              </div>
              <button className="text-link" onClick={() => navigate('/stores')} type="button">
                View all
              </button>
            </div>

            <div className="store-carousel">
              {localStores.slice(0, 8).map((store) => (
                <button
                  key={store._id}
                  className="store-card"
                  onClick={() => navigate(`/store/${store._id}`)}
                  type="button"
                >
                  <div className="store-card__image">
                    <img
                      src={store.logo}
                      alt={store.name}
                      onError={(event) => {
                        event.currentTarget.src = `https://placehold.co/160x160/1db954/ffffff?text=${encodeURIComponent(store.name.slice(0, 1))}`;
                      }}
                    />
                  </div>
                  <div className="store-card__body">
                    <strong>{store.name}</strong>
                    <span>{store.deliveryTime || 'Fast delivery'}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="controls-bar">
          <div className="category-ribbon">
            {categoryChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.name}
                  className={`category-chip ${selectedCategory === chip.name ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(chip.name)}
                  type="button"
                >
                  <Icon size={16} />
                  <span>{chip.name}</span>
                </button>
              );
            })}
          </div>

          <div className="filter-row">
            <div className="sort-dropdown">
              <button className="filter-pill" onClick={() => setShowSortMenu((prev) => !prev)} type="button">
                <SlidersHorizontal size={16} />
                <span>{sortOptions.find((option) => option.value === sortBy)?.label}</span>
                <ChevronDown size={16} />
              </button>

              {showSortMenu && (
                <div className="sort-menu">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`sort-menu__item ${sortBy === option.value ? 'is-active' : ''}`}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className={`filter-pill ${filterInStock ? 'is-active' : ''}`}
              onClick={() => setFilterInStock((prev) => !prev)}
              type="button"
            >
              In stock only
            </button>
            <button
              className={`filter-pill ${filterDiscount ? 'is-accent' : ''}`}
              onClick={() => setFilterDiscount((prev) => !prev)}
              type="button"
            >
              Offers
            </button>
          </div>
        </section>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            {searchTerm && matchingStores.length > 0 && (
              <section className="surface-panel surface-panel--highlight">
                <div className="section-row">
                  <div>
                    <span className="section-kicker">Store matches</span>
                    <h2>Stores relevant to your search</h2>
                  </div>
                  <button className="text-link" onClick={() => navigate('/stores')} type="button">
                    Explore stores
                  </button>
                </div>

                <div className="matching-store-grid">
                  {matchingStores.map((store) => (
                    <button
                      key={store._id}
                      className="matching-store-card"
                      onClick={() => navigate(`/store/${store._id}`)}
                      type="button"
                    >
                      <div className="matching-store-card__icon">
                        <Store size={20} />
                      </div>
                      <div className="matching-store-card__body">
                        <strong>{store.name}</strong>
                        <span>{store.description || store.deliveryTime || 'Open for fast delivery'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {filteredSections.map((section) => {
              const SectionIcon = section.icon;

              return (
                <section key={section.title} className="product-section">
                  <div className="section-row">
                    <div>
                      <span className="section-kicker">Curated section</span>
                      <h2>
                        <SectionIcon size={20} />
                        {section.title}
                      </h2>
                    </div>
                    <button className="text-link" onClick={() => setSelectedCategory('All')} type="button">
                      Browse more
                    </button>
                  </div>

                  <div className="product-grid">
                    {section.items.slice(0, 8).map((product) => {
                      const qty = getQty(product._id);
                      const hasDiscount = product.originalPrice && product.originalPrice > product.price;

                      return (
                        <article className="product-tile" key={product._id}>
                          <button className="product-tile__image" onClick={() => navigate(`/product/${product._id}`)} type="button">
                            {hasDiscount && (
                              <span className="product-tile__badge">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                              </span>
                            )}
                            <img src={product.image} alt={product.name} />
                          </button>

                          <div className="product-tile__body">
                            <div className="product-tile__meta">
                              <span className="delivery-pill">
                                <Clock3 size={12} />
                                10 min
                              </span>
                              <span>{product.brand || 'Fresh selection'}</span>
                            </div>

                            <button className="product-tile__title" onClick={() => navigate(`/product/${product._id}`)} type="button">
                              {product.name}
                            </button>

                            <p className="product-tile__unit">{product.unit || '1 unit pack'}</p>

                            <div className="product-tile__footer">
                              <div className="product-tile__price">
                                <strong>{formatCurrency(product.price)}</strong>
                                {hasDiscount && <span>{formatCurrency(product.originalPrice)}</span>}
                              </div>

                              {qty === 0 ? (
                                <button
                                  className="add-button"
                                  onClick={() => addToCart({ ...product, qty: 1 })}
                                  type="button"
                                  disabled={product.countInStock === 0}
                                >
                                  {product.countInStock === 0 ? 'Out of stock' : 'Add'}
                                </button>
                              ) : (
                                <div className="qty-stepper qty-stepper--light">
                                  <button onClick={() => removeFromCart(product._id)} type="button">
                                    -
                                  </button>
                                  <span>{qty}</span>
                                  <button
                                    onClick={() => addToCart({ ...product, qty: qty + 1 })}
                                    type="button"
                                    disabled={qty >= product.countInStock}
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </>
        )}

        <section className="bottom-banner">
          <div>
            <span className="section-kicker">Delivery promise</span>
            <h2>Free delivery on orders above Rs. 149</h2>
          </div>
          <p>Built to feel cleaner, easier to scan, and faster to shop from any screen size.</p>
        </section>
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
