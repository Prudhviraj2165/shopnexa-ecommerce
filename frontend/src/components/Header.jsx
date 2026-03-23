import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, User as UserIcon, Sun, Moon, MapPin, Search, Loader2, Heart, TrendingUp, Clock, Store, LayoutDashboard, LogOut, Package } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocation } from '../context/LocationContext';
import LocationModal from './LocationModal';

/* ── Header ─────────────────────────────────────────────────────── */
const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { userInfo, logout } = useAuth();
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

  // HIDE Header on Home Page and on full-screen portal pages
  const hideOn = ['/', '/login', '/register', '/vendor/login', '/vendor/register', '/vendor/dashboard'];
  if (hideOn.includes(routerLocation.pathname) || routerLocation.pathname.startsWith('/vendor/')) return null;

  return (
    <header
      className={`glass ${theme === 'dark' ? 'dark-mode-override' : ''}`}
      style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 0', minHeight: '72px', boxSizing: 'border-box', borderBottom: '1px solid var(--border-color)' }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
          <div style={{ background: 'var(--primary-color)', borderRadius: '10px', padding: '6px', boxShadow: '0 4px 12px rgba(29,185,84,0.3)', display: 'flex' }}>
            <ShoppingBag size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary-color)', letterSpacing: '-1px' }}>
            Shop<span style={{ color: 'var(--text-color)' }}>nexa</span>
          </span>
        </div>

        {/* ── Location selector ── */}
        <div
          className="swiggy-location-web-new"
          onClick={() => setShowLocationModal(true)}
          title="Click to change your location"
          style={{ padding: '6px 14px', margin: 0 }}
        >
          <div className="loc-icon-box">
            {status === 'loading' 
              ? <Loader2 size={22} color="#1db954" style={{ animation: 'spin 1s linear infinite' }} />
              : <MapPin size={22} color="#1db954" strokeWidth={3} />
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

        {/* Search */}
        <div ref={searchRef} style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <div className="search-bar" style={{ width: '100%', margin: 0, boxSizing: 'border-box' }}>
            <Search size={17} color="var(--text-muted)" />
            <input
              type="text"
              placeholder='Search for "eggs", "milk", "bread"...'
              onKeyDown={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
            />
          </div>

          {/* Trending Searches Dropdown */}
          {isSearchFocused && (
            <div className="trending-dropdown" style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
              background: 'var(--card-bg)', border: '1px solid var(--border-color)',
              borderRadius: '16px', padding: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              zIndex: 100, animation: 'fadeIn 0.2s ease'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <TrendingUp size={14} /> Trending Near You
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Amul Milk', 'Maggi', 'Eggs', 'Bread', 'Onion', 'Lays'].map((term) => (
                    <span key={term} 
                      onClick={() => { setIsSearchFocused(false); navigate(`/?keyword=${term}`); }}
                      style={{ 
                        background: 'rgba(29, 185, 84, 0.08)', color: 'var(--primary-color)', 
                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', 
                        fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(29, 185, 84, 0.2)'
                      }}>
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <Clock size={14} /> Recent Searches
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {['Paneer', 'Coca Cola', 'Apples'].map((term) => (
                    <div key={term}
                      onClick={() => { setIsSearchFocused(false); navigate(`/?keyword=${term}`); }}
                      style={{
                        padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
                        display: 'flex', alignItems: 'center', gap: '10px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Search size={14} color="var(--text-muted)" /> {term}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right nav */}
        <nav style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
          {/* Theme */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              background: 'var(--card-bg)', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '7px 10px', cursor: 'pointer',
              color: 'var(--text-color)', display: 'flex', alignItems: 'center',
              transition: 'all 0.2s',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>


          {/* Wishlist */}
          <Link
            to="/wishlist"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '10px',
              border: '1px solid var(--border-color)', background: 'var(--card-bg)',
              fontWeight: 600, fontSize: '0.9rem', position: 'relative',
            }}
          >
            <Heart size={18} color="var(--text-color)" /> Wishlist
            {wishlistItems.length > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: '#e53e3e', color: '#fff', borderRadius: '50%',
                width: '19px', height: '19px', fontSize: '0.7rem',
                fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '10px',
              background: 'var(--primary-color)', color: '#fff',
              fontWeight: 600, fontSize: '0.9rem', position: 'relative',
            }}
          >
            <ShoppingCart size={18} /> Cart
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: '#e53e3e', color: '#fff', borderRadius: '50%',
                width: '19px', height: '19px', fontSize: '0.7rem',
                fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* User */}
          {userInfo ? (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => navigate('/profile')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '10px',
                  border: '1px solid var(--border-color)', background: 'var(--card-bg)',
                  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                <UserIcon size={17} /> {userInfo.name.split(' ')[0]}
              </div>
            </div>
          ) : (
            <Link to="/login" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '10px',
              border: '1px solid var(--border-color)', background: 'var(--card-bg)',
              fontWeight: 600, fontSize: '0.9rem',
            }}>
              <UserIcon size={17} /> Sign In
            </Link>
          )}
        </nav>
      </div>

      {/* Spin keyframe for loader icon */}
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
