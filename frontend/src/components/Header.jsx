import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Sun, Moon, MapPin, Search, Loader2, Heart, TrendingUp, Clock, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocation } from '../context/LocationContext';
import LocationModal from './LocationModal';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { userInfo } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { location, status, detectLocation, setManualLocation } = useLocation();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setIsSearchFocused(false);
      navigate(`/?keyword=${e.target.value.trim()}`);
    }
  };

  const hideOn = ['/login', '/register', '/vendor/login', '/vendor/register', '/vendor/dashboard'];
  if (hideOn.includes(routerLocation.pathname) || routerLocation.pathname.startsWith('/vendor/')) return null;

  return (
    <header className={`swiggy-web-header ${theme === 'dark' ? 'dark-mode-override' : ''}`}>
      <div className="swiggy-logo-section">
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ background: 'var(--swiggy-orange)', borderRadius: '10px', padding: '6px', display: 'flex' }}>
            <ShoppingBag size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--swiggy-orange)', letterSpacing: '-1px' }}>
            Shop<span style={{ color: 'var(--text-color)' }}>nexa</span>
          </span>
        </div>

        {/* LOCATION SELECTOR (Instamart style) */}
        <div
          className="swiggy-location-web-new"
          onClick={() => setShowLocationModal(true)}
        >
          <div className="loc-icon-box">
            {status === 'loading' 
              ? <Loader2 size={24} color="var(--swiggy-orange)" style={{ animation: 'spin 1s linear infinite' }} />
              : <MapPin size={24} color="var(--swiggy-orange)" strokeWidth={2.5} />
            }
          </div>
          <div className="loc-text-content">
            <span className="loc-label">Deliver to</span>
            <div className="loc-main">
              <span className="loc-city">{status === 'loading' ? 'Detecting...' : (location.line1 || 'Add your location')}</span>
              <span className="loc-arrow">▾</span>
            </div>
            <span className="loc-subtext">{location.line2 || 'To see items in your area'}</span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR (Center) */}
      <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '600px', margin: '0 20px' }}>
        <div className="swiggy-search-web">
          <input
            type="text"
            placeholder="Search for 'milk', 'bread', 'eggs'..."
            onKeyDown={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
          />
          <Search size={20} color="var(--swiggy-text-secondary)" />
        </div>

        {/* Trending Searches Dropdown */}
        {isSearchFocused && (
          <div className="trending-dropdown" style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
            background: 'var(--card-bg)', border: '1px solid var(--border-color)',
            borderRadius: '16px', padding: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            zIndex: 1000, animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                <TrendingUp size={16} /> Popular Searches
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Amul Milk', 'Maggi', 'Eggs', 'Whole Wheat Bread', 'Onion', 'Lays'].map((term) => (
                  <span key={term} 
                    onClick={() => { setIsSearchFocused(false); navigate(`/?keyword=${term}`); }}
                    style={{ 
                      background: 'rgba(29, 185, 84, 0.08)', color: 'var(--swiggy-orange)', 
                      padding: '8px 16px', borderRadius: '24px', fontSize: '0.85rem', 
                      fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(29, 185, 84, 0.2)', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--swiggy-orange)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(29, 185, 84, 0.08)'; e.currentTarget.style.color = 'var(--swiggy-orange)'; }}
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                <Clock size={16} /> Recent Searches
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['Paneer', 'Coca Cola', 'Apples'].map((term) => (
                  <div key={term}
                    onClick={() => { setIsSearchFocused(false); navigate(`/?keyword=${term}`); }}
                    style={{
                      padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: 'var(--text-color)', transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Search size={16} color="var(--text-muted)" /> {term}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT NAVIGATION (Instamart style) */}
      <div className="swiggy-nav-right">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-color)', display: 'flex', alignItems: 'center',
          }}
        >
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* Wishlist */}
        <Link to="/wishlist" className="swiggy-nav-item" style={{ position: 'relative' }}>
          <Heart size={22} />
          {wishlistItems.length > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px', background: '#e53e3e', color: '#fff', 
              borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', fontWeight: 800, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--card-bg)'
            }}>
              {wishlistItems.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="swiggy-cart-btn-web" style={{ position: 'relative' }}>
          <ShoppingBag size={20} /> Cart
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px', background: 'var(--swiggy-orange)', color: '#fff', 
              borderRadius: '50%', width: '22px', height: '22px', fontSize: '0.75rem', fontWeight: 800, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--card-bg)'
            }}>
              {totalItems}
            </span>
          )}
        </Link>

        {/* Profile */}
        {userInfo ? (
          <div className="swiggy-nav-item" onClick={() => navigate('/profile')}>
            <UserIcon size={22} />
            {userInfo.name.split(' ')[0]}
          </div>
        ) : (
          <div className="swiggy-nav-item" onClick={() => navigate('/login')}>
            <UserIcon size={22} />
            Sign In
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      {showLocationModal && (
        <LocationModal
          onClose={() => setShowLocationModal(false)}
          onDetect={detectLocation}
          onSelect={(addr) => {
            setManualLocation(addr);
            setShowLocationModal(false);
          }}
          loading={status === 'loading'}
          savedAddresses={(() => {
            try { return JSON.parse(localStorage.getItem('allAddresses')) || []; }
            catch(e) { return []; }
          })()}
        />
      )}
    </header>
  );
};

export default Header;
