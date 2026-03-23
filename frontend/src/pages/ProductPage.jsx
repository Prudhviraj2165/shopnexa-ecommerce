import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Star, Truck, ShieldCheck, RotateCcw, Clock, ChevronRight, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={14} fill={s <= Math.round(rating) ? '#f59e0b' : 'none'} color={s <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} />
    ))}
  </div>
);

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [added, setAdded] = useState(false);
  
  // Reviews state
  const { userInfo } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct(data);
        // fetch related products (same category)
        const all = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
        setRelated(all.data.filter(p => p._id !== id && p.category === data.category).slice(0, 6));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const cartQty = cartItems.find(x => x._id === id)?.qty || 0;
  const mrp = product.originalPrice || Math.round(product.price * 1.2);
  const discount = Math.round(((mrp - product.price) / mrp) * 100);
  const deliveryDate = new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  const handleAddToCart = () => {
    addToCart({ ...product, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment) return;
    setReviewLoading(true);
    try {
      const config = { 
        headers: { 
          ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}) 
        } 
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/products/${id}/reviews`, { rating, comment }, config);
      setReviewSuccess(true);
      setRating(0);
      setComment('');
      // Refresh product
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
      setProduct(data);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message);
      setTimeout(() => setReviewError(''), 3000);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Top nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', marginBottom: '8px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Home <ChevronRight size={12} /> {product.category} <ChevronRight size={12} /> {product.name}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* IMAGE */}
        <div style={{ flex: '1 1 380px', position: 'sticky', top: '80px' }}>
          <div className="glass-card" style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px', borderRadius: '20px' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', borderRadius: '12px' }}
              onError={(e) => { e.currentTarget.src = `https://placehold.co/400x400/1a1d26/94a3b8?text=${encodeURIComponent((product.name || 'Product').slice(0, 8))}`; }}
            />
          </div>
          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {[
              { icon: <Truck size={14} />, text: 'Free Delivery above ₹499' },
              { icon: <ShieldCheck size={14} />, text: '100% Authentic' },
              { icon: <RotateCcw size={14} />, text: '7-day return' },
            ].map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 6px', background: 'var(--card-bg)', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <span style={{ color: 'var(--primary-color)' }}>{b.icon}</span> {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div style={{ flex: '2 1 380px' }}>
          {/* Category pill */}
          <span style={{ background: 'rgba(29,185,84,0.1)', color: 'var(--primary-color)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
            {product.category}
          </span>

          <h1 style={{ fontSize: '1.7rem', fontWeight: 900, margin: '12px 0 6px', lineHeight: 1.2 }}>{product.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>{product.brand} · {product.unit || '1 unit'}</p>

          {/* Rating */}
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ background: product.rating >= 4 ? '#1db954' : product.rating >= 3 ? '#f59e0b' : '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {product.rating?.toFixed(1)} <Star size={12} fill="#fff" color="#fff" />
              </div>
              <StarRating rating={product.rating} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({product.numReviews} ratings)</span>
            </div>
          )}

          {/* Price block */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-color)' }}>₹{product.price}</span>
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{mrp}</span>
              <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                {discount}% OFF
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>Inclusive of all taxes</p>
          </div>

          {/* Delivery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: 'rgba(29,185,84,0.06)', border: '1px solid rgba(29,185,84,0.2)', borderRadius: '12px', marginBottom: '20px' }}>
            <Truck size={18} color="var(--primary-color)" />
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-color)', fontSize: '0.9rem' }}>Earliest delivery by </span>
              <span style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.9rem' }}>{deliveryDate}</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.8rem' }}>
              <Clock size={12} /> 10 mins express
            </div>
          </div>

          {/* Stock badge */}
          {product.countInStock > 0 && product.countInStock <= 10 && (
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', marginBottom: '14px' }}>
              ⚠️ Only {product.countInStock} left in stock — order soon!
            </div>
          )}

          {/* Qty + Add to Cart */}
          {product.countInStock > 0 ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--primary-color)', borderRadius: '12px', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '44px', height: '48px', background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '1.4rem', cursor: 'pointer', fontWeight: 800 }}>−</button>
                <span style={{ padding: '0 16px', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-color)' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))} style={{ width: '44px', height: '48px', background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '1.4rem', cursor: 'pointer', fontWeight: 800 }}>+</button>
              </div>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px', fontWeight: 800, fontSize: '1rem', borderRadius: '12px', transition: 'all 0.2s', background: added ? '#16a34a' : 'var(--primary-color)' }}
                onClick={handleAddToCart}
              >
                {added ? '✓ Added to Cart!' : `Add to Cart · ₹${(product.price * qty).toFixed(0)}`}
              </button>
            </div>
          ) : (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '14px', borderRadius: '12px', fontWeight: 700, textAlign: 'center', marginBottom: '20px' }}>
              Out of Stock
            </div>
          )}

          {/* Description */}
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '20px' }}>{product.description}</p>

          {/* Expandable details */}
          <button
            onClick={() => setShowDetails(d => !d)}
            style={{ width: '100%', padding: '14px 16px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, color: 'var(--text-color)', marginBottom: showDetails ? '0' : '0' }}
          >
            Product Details
            <ChevronDown size={18} style={{ transform: showDetails ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>
          {showDetails && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '16px' }}>
              {[
                ['Brand', product.brand],
                ['Category', product.category],
                ['Unit', product.unit || '1 unit'],
                ['Stock', `${product.countInStock} units available`],
                ['Country of Origin', 'India'],
                ['Shelf Life', '6 months from manufacture'],
                ['Storage', 'Store in a cool, dry place'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{k}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '48px', maxWidth: '1300px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Customer Reviews</h2>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          {/* Write Review */}
          <div style={{ flex: '1 1 300px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Write a Review</h3>
            {reviewError && <Message variant="danger">{reviewError}</Message>}
            {reviewSuccess && <Message variant="success">Review submitted successfully!</Message>}
            {userInfo ? (
              <form onSubmit={submitReviewHandler}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={28} onClick={() => setRating(s)} fill={s <= rating ? '#f59e0b' : 'none'} color={s <= rating ? '#f59e0b' : 'var(--border-color)'} style={{ cursor: 'pointer', transition: '0.2s' }} />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>Comment</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} rows="4" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '0.9rem', resize: 'vertical' }} placeholder="What did you like or dislike?" required></textarea>
                </div>
                <button type="submit" disabled={reviewLoading} className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 700 }}>
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Required to <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>log in</a> to write a review.</p>
            )}
          </div>

          {/* Review List */}
          <div style={{ flex: '2 1 400px' }}>
            {product.reviews && product.reviews.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {product.reviews && product.reviews.map(review => (
                  <div key={review._id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: '0.95rem' }}>{review.name}</p>
                        <StarRating rating={review.rating} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{review.createdAt.substring(0, 10)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: 1.5 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Customers Also Bought</h2>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
            {related.map(p => (
              <div key={p._id} onClick={() => navigate(`/product/${p._id}`)}
                style={{ minWidth: '160px', maxWidth: '160px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '12px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '110px', objectFit: 'contain', marginBottom: '10px' }}
                  onError={e => { e.currentTarget.src = `https://placehold.co/160x110/1a1d26/94a3b8?text=${p.name.slice(0,4)}`; }} />
                <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                <p style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.9rem' }}>₹{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
