import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const cartItem = cartItems.find(x => x._id === product._id);
  const qty = cartItem ? cartItem.qty : 0;
  const isSaved = isInWishlist(product._id);

  const handleAdd = () => addToCart({ ...product, qty: qty + 1 });
  const handleRemove = () => {
    if (qty === 1) removeFromCart(product._id);
    else addToCart({ ...product, qty: qty - 1 });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div className="product-img-wrap" style={{ position: 'relative' }}>
        <Link to={`/product/${product._id}`} style={{ display: 'block' }}>
          {discount && <div className="discount-badge">{discount}% OFF</div>}
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => { e.currentTarget.src = `https://placehold.co/400x400/1a1d26/94a3b8?text=${encodeURIComponent(product.name.split(' ')[0])}`; }}
            style={{ width: '100%', display: 'block' }}
          />
        </Link>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--card-bg)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Heart size={16} fill={isSaved ? '#ef4444' : 'transparent'} color={isSaved ? '#ef4444' : 'var(--text-color)'} />
        </button>
        {/* Delivery badge */}
        <div style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
          <span className="delivery-badge">⚡ 10 mins</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.brand}
        </span>
        <Link to={`/product/${product._id}`}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3 }}>{product.name}</p>
        </Link>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {product.unit || '1 unit'}
        </span>

        {/* Price row + stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-color)' }}>
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Quantity stepper or Add button */}
          {qty === 0 ? (
            <button
              className="btn btn-primary"
              style={{ padding: '6px 18px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}
              onClick={handleAdd}
              disabled={product.countInStock === 0}
            >
              {product.countInStock === 0 ? 'Out' : '+ Add'}
            </button>
          ) : (
            <div className="qty-stepper">
              <button onClick={handleRemove}>−</button>
              <span>{qty}</span>
              <button onClick={handleAdd} disabled={qty >= product.countInStock}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
