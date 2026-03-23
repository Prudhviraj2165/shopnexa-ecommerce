import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems } = useWishlist();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1300px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingTop: '20px' }}>
          <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            My Wishlist {wishlistItems.length > 0 && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>({wishlistItems.length} items)</span>}
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Heart size={64} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.4 }} />
            <h2 style={{ marginBottom: '8px' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Save items you love to find them quickly later.</p>
            <Link to="/" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 700 }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="swiggy-web-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', alignItems: 'stretch' }}>
            {wishlistItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
