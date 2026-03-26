import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ChevronDown, ChevronRight, Clock3, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StarRating = ({ rating }) => (
  <div className="rating-stars">
    {[1, 2, 3, 4, 5].map((value) => (
      <Star
        key={value}
        size={14}
        fill={value <= Math.round(rating) ? '#f59e0b' : 'none'}
        color={value <= Math.round(rating) ? '#f59e0b' : '#cbd5e1'}
      />
    ))}
  </div>
);

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(0)}`;

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { userInfo } = useAuth();

  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${apiBaseUrl}/products/${id}`);
        setProduct(data);
        const all = await axios.get(`${apiBaseUrl}/products`);
        setRelated(all.data.filter((item) => item._id !== id && item.category === data.category).slice(0, 6));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const cartQty = cartItems.find((item) => item._id === id)?.qty || 0;
  const mrp = product.originalPrice || Math.round((product.price || 0) * 1.2);
  const discount = mrp > 0 ? Math.round(((mrp - (product.price || 0)) / mrp) * 100) : 0;
  const deliveryDate = new Date(Date.now() + 86400000).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const trustBadges = [
    { icon: Truck, text: 'Free delivery over Rs. 499' },
    { icon: ShieldCheck, text: 'Authenticity guaranteed' },
    { icon: RotateCcw, text: 'Easy replacement support' },
  ];

  const detailRows = [
    ['Brand', product.brand],
    ['Category', product.category],
    ['Unit', product.unit || '1 unit'],
    ['Stock', `${product.countInStock || 0} units available`],
    ['Country of origin', 'India'],
    ['Storage', 'Store in a cool, dry place'],
  ];

  const handleAddToCart = () => {
    addToCart({ ...product, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const submitReviewHandler = async (event) => {
    event.preventDefault();
    if (rating === 0 || !comment) return;
    setReviewLoading(true);
    try {
      const config = {
        headers: {
          ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}),
        },
      };
      await axios.post(`${apiBaseUrl}/products/${id}/reviews`, { rating, comment }, config);
      setReviewSuccess(true);
      setRating(0);
      setComment('');
      const { data } = await axios.get(`${apiBaseUrl}/products/${id}`);
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
    <div className="product-page animate-fade-in">
      <div className="product-breadcrumb">
        <button className="product-back" onClick={() => navigate(-1)} type="button">
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="product-breadcrumb__trail">
          <span>Home</span>
          <ChevronRight size={12} />
          <span>{product.category}</span>
          <ChevronRight size={12} />
          <span>{product.name}</span>
        </div>
      </div>

      <section className="product-hero">
        <div className="product-gallery-card">
          <div className="product-gallery-card__image">
            {discount > 0 && <span className="product-gallery-card__badge">{discount}% off</span>}
            <img
              src={product.image}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.src = `https://placehold.co/500x500/0f172a/e2e8f0?text=${encodeURIComponent((product.name || 'Item').slice(0, 8))}`;
              }}
            />
          </div>

          <div className="product-trust-grid">
            {trustBadges.map((badge) => (
              <div className="product-trust-card" key={badge.text}>
                <span>
                  <badge.icon size={16} />
                </span>
                <p>{badge.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="product-info-card">
          <span className="product-category-pill">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-subhead">
            {product.brand} • {product.unit || '1 unit'} • In cart: {cartQty}
          </p>

          {product.rating > 0 && (
            <div className="product-rating-row">
              <span className="product-rating-badge">
                {product.rating?.toFixed(1)}
                <Star size={12} fill="#fff" color="#fff" />
              </span>
              <StarRating rating={product.rating} />
              <small>{product.numReviews} ratings</small>
            </div>
          )}

          <div className="product-price-card">
            <div>
              <strong>{formatCurrency(product.price)}</strong>
              <div className="product-price-card__sub">
                <span>{formatCurrency(mrp)}</span>
                {discount > 0 && <em>{discount}% off</em>}
              </div>
            </div>
            <p>Inclusive of all taxes</p>
          </div>

          <div className="product-delivery-banner">
            <div>
              <strong>Earliest delivery by {deliveryDate}</strong>
              <span>Fast handling from your nearest available store.</span>
            </div>
            <span className="delivery-pill">
              <Clock3 size={12} />
              10 min
            </span>
          </div>

          {product.countInStock > 0 && product.countInStock <= 10 && (
            <p className="product-stock-warning">Only {product.countInStock} left in stock. Order soon.</p>
          )}

          {product.countInStock > 0 ? (
            <div className="product-purchase-row">
              <div className="qty-stepper qty-stepper--light qty-stepper--large">
                <button onClick={() => setQty((current) => Math.max(1, current - 1))} type="button">
                  -
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((current) => Math.min(product.countInStock, current + 1))} type="button">
                  +
                </button>
              </div>

              <button className="add-button add-button--wide" onClick={handleAddToCart} type="button">
                {added ? 'Added to cart' : `Add to cart • ${formatCurrency(product.price * qty)}`}
              </button>
            </div>
          ) : (
            <div className="product-out-of-stock">Out of stock</div>
          )}

          <div className="product-description-card">
            <h3>About this item</h3>
            <p>{product.description}</p>
          </div>

          <button className="product-details-toggle" onClick={() => setShowDetails((current) => !current)} type="button">
            <span>Product details</span>
            <ChevronDown size={18} style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
          </button>

          {showDetails && (
            <div className="product-details-panel">
              {detailRows.map(([label, value]) => (
                <div className="product-details-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="product-section-grid">
        <div className="review-card">
          <h2>Write a review</h2>
          {reviewError && <Message variant="danger">{reviewError}</Message>}
          {reviewSuccess && <Message variant="success">Review submitted successfully.</Message>}

          {userInfo ? (
            <form className="review-form" onSubmit={submitReviewHandler}>
              <div>
                <label>Rating</label>
                <div className="review-stars-input">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      size={28}
                      onClick={() => setRating(value)}
                      fill={value <= rating ? '#f59e0b' : 'none'}
                      color={value <= rating ? '#f59e0b' : 'var(--border-color)'}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label>Comment</label>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows="4"
                  placeholder="Tell other shoppers what stood out."
                  required
                />
              </div>

              <button className="add-button add-button--wide" disabled={reviewLoading} type="submit">
                {reviewLoading ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          ) : (
            <p className="review-login-note">
              Please <a href="/login">log in</a> to write a review.
            </p>
          )}
        </div>

        <div className="review-list-card">
          <h2>Customer reviews</h2>
          {product.reviews?.length ? (
            <div className="review-list">
              {product.reviews.map((review) => (
                <article className="review-item" key={review._id}>
                  <div className="review-item__top">
                    <div>
                      <strong>{review.name}</strong>
                      <StarRating rating={review.rating} />
                    </div>
                    <span>{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-review-state">No reviews yet. Be the first to review this product.</div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="surface-panel surface-panel--compact">
          <div className="section-row">
            <div>
              <span className="section-kicker">More like this</span>
              <h2>Customers also bought</h2>
            </div>
          </div>

          <div className="spotlight-row">
            {related.map((item) => (
              <button className="spotlight-card" key={item._id} onClick={() => navigate(`/product/${item._id}`)} type="button">
                <div className="spotlight-card__image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.src = `https://placehold.co/160x160/0f172a/e2e8f0?text=${encodeURIComponent(item.name.slice(0, 4))}`;
                    }}
                  />
                </div>
                <div className="spotlight-card__body">
                  <strong>{item.name}</strong>
                  <span>{formatCurrency(item.price)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
