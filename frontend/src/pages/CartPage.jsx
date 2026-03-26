import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Shield, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const COUPONS = {
  SAVE10: { type: 'percent', value: 10, label: '10% off applied!' },
  FRESH20: { type: 'flat', value: 20, label: 'Rs. 20 off applied!' },
  NEWUSER: { type: 'percent', value: 15, label: '15% off for new users!' },
  GROCERY5: { type: 'percent', value: 5, label: '5% extra off!' },
};

const deliveryOptions = [
  { id: 'leave_door', icon: 'Door', label: 'Leave at door' },
  { id: 'no_bell', icon: 'Bell', label: "Don't ring bell" },
  { id: 'guard', icon: 'Guard', label: 'Leave with guard' },
  { id: 'call', icon: 'Call', label: 'Call on arrival' },
];

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(0)}`;

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { userInfo } = useAuth();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [deliveryInstruction, setDeliveryInstruction] = useState(localStorage.getItem('deliveryInstruction') || '');

  const itemsPrice = cartItems.reduce((total, item) => total + item.qty * item.price, 0);
  const shippingPrice = itemsPrice >= 499 ? 0 : 40;
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round((itemsPrice * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;
  const totalPrice = Math.max(0, itemsPrice + shippingPrice - couponDiscount);

  const checkoutHandler = () => {
    localStorage.setItem('deliveryInstruction', deliveryInstruction);
    if (userInfo) navigate('/shipping');
    else navigate('/login?redirect=/shipping');
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Invalid coupon code. Try SAVE10, FRESH20, or NEWUSER.');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  return (
    <div className="cart-page animate-fade-in">
      <div className="cart-page__header">
        <button className="product-back" onClick={() => navigate(-1)} type="button">
          <ArrowLeft size={16} />
          Back
        </button>
        <div>
          <h1>My cart</h1>
          <p>{totalQty > 0 ? `${totalQty} items ready for checkout` : 'No items added yet'}</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <section className="cart-empty-state">
          <span>
            <ShoppingBag size={42} />
          </span>
          <h2>Your cart is empty</h2>
          <p>Add a few essentials and come back to checkout.</p>
          <Link className="add-button add-button--wide" to="/">
            Start shopping
          </Link>
        </section>
      ) : (
        <div className="cart-layout">
          <div className="cart-main">
            <div className="cart-banner">
              <Truck size={18} />
              <span>
                {shippingPrice === 0
                  ? 'Free delivery unlocked for this order.'
                  : `${formatCurrency(499 - itemsPrice)} more for free delivery.`}
              </span>
            </div>

            <section className="cart-items-card">
              {cartItems.map((item) => (
                <article className="cart-item" key={item._id}>
                  <Link className="cart-item__image" to={`/product/${item._id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(event) => {
                        event.currentTarget.src = `https://placehold.co/96x96/0f172a/e2e8f0?text=${encodeURIComponent(item.name.slice(0, 2))}`;
                      }}
                    />
                  </Link>

                  <div className="cart-item__body">
                    <Link className="cart-item__title" to={`/product/${item._id}`}>
                      {item.name}
                    </Link>
                    <p>{item.unit || '1 unit pack'}</p>
                    <strong>{formatCurrency(item.qty * item.price)}</strong>
                  </div>

                  <div className="cart-item__actions">
                    <div className="qty-stepper qty-stepper--light">
                      <button
                        onClick={() => {
                          if (item.qty === 1) removeFromCart(item._id);
                          else addToCart({ ...item, qty: item.qty - 1 });
                        }}
                        type="button"
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => addToCart({ ...item, qty: item.qty + 1 })} disabled={item.qty >= item.countInStock} type="button">
                        +
                      </button>
                    </div>

                    <button className="cart-remove" onClick={() => removeFromCart(item._id)} type="button">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <section className="surface-panel surface-panel--compact">
              <div className="section-row">
                <div>
                  <span className="section-kicker">Delivery note</span>
                  <h2>Delivery instructions</h2>
                </div>
              </div>

              <div className="delivery-option-grid">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`delivery-option ${deliveryInstruction === option.id ? 'is-active' : ''}`}
                    onClick={() => setDeliveryInstruction(deliveryInstruction === option.id ? '' : option.id)}
                    type="button"
                  >
                    <strong>{option.label}</strong>
                    <span>{deliveryInstruction === option.id ? 'Selected for this order' : 'Tap to add'}</span>
                  </button>
                ))}
              </div>

              {deliveryInstruction && (
                <p className="delivery-confirm">
                  <CheckCircle size={14} />
                  Delivery instruction added.
                </p>
              )}
            </section>
          </div>

          <aside className="cart-summary-card">
            <div className="cart-summary-card__top">
              <span className="section-kicker">Bill summary</span>
              <h2>Price details</h2>
            </div>

            <div className="cart-summary-list">
              <div>
                <span>Items total</span>
                <strong>{formatCurrency(itemsPrice)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{shippingPrice === 0 ? 'FREE' : formatCurrency(shippingPrice)}</strong>
              </div>
              {couponDiscount > 0 && (
                <div>
                  <span>Coupon ({appliedCoupon.code})</span>
                  <strong className="cart-summary-list__discount">- {formatCurrency(couponDiscount)}</strong>
                </div>
              )}
            </div>

            <div className="cart-total-row">
              <span>Total amount</span>
              <strong>{formatCurrency(totalPrice)}</strong>
            </div>

            <div className="coupon-box">
              {appliedCoupon ? (
                <div className="coupon-success">
                  <div>
                    <CheckCircle size={16} />
                    <span>{appliedCoupon.label}</span>
                  </div>
                  <button onClick={removeCoupon} type="button">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-entry">
                    <div>
                      <Tag size={16} />
                      <input
                        placeholder="Coupon code"
                        value={couponInput}
                        onChange={(event) => setCouponInput(event.target.value)}
                        onKeyDown={(event) => event.key === 'Enter' && applyCoupon()}
                      />
                    </div>
                    <button onClick={applyCoupon} type="button">
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="coupon-error">{couponError}</p>}
                  <p className="coupon-note">Try SAVE10 • FRESH20 • NEWUSER</p>
                </>
              )}
            </div>

            <button className="add-button add-button--wide" onClick={checkoutHandler} type="button">
              Proceed to checkout
              <ArrowRight size={16} />
            </button>

            <div className="secure-note">
              <Shield size={14} />
              Safe and secure payments
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;
