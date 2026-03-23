import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Truck, Shield, Tag, CheckCircle, X } from 'lucide-react';
import Message from '../components/Message';

const COUPONS = {
  SAVE10:   { type: 'percent', value: 10, label: '10% off applied!' },
  FRESH20:  { type: 'flat',    value: 20, label: '₹20 off applied!' },
  NEWUSER:  { type: 'percent', value: 15, label: '15% off for new users!' },
  GROCERY5: { type: 'percent', value: 5,  label: '5% extra off!' },
};

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { userInfo } = useAuth();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  
  const [deliveryInstruction, setDeliveryInstruction] = useState(localStorage.getItem('deliveryInstruction') || '');

  const checkoutHandler = () => {
    localStorage.setItem('deliveryInstruction', deliveryInstruction);
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try SAVE10, FRESH20, or NEWUSER.');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = itemsPrice >= 499 ? 0 : 40;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(itemsPrice * appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const totalPrice = Math.max(0, itemsPrice + shippingPrice - couponDiscount);
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            My Cart {totalQty > 0 && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>({totalQty} items)</span>}
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <ShoppingBag size={64} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.4 }} />
            <h2 style={{ marginBottom: '8px' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Add some groceries to get started!</p>
            <Link to="/" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 700 }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Items List */}
            <div style={{ flex: '2 1 500px' }}>
              {/* Free Delivery Banner */}
              {shippingPrice > 0 && (
                <div style={{ background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                  <Truck size={18} />
                  Add ₹{499 - itemsPrice} more for FREE delivery!
                </div>
              )}
              {shippingPrice === 0 && (
                <div style={{ background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.25)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                  <Truck size={18} /> 🎉 You get FREE delivery on this order!
                </div>
              )}

              <div className="glass-card" style={{ padding: 0 }}>
                {cartItems.map((item, i) => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: i < cartItems.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <Link to={`/product/${item._id}`}>
                      <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', background: 'var(--card-bg)' }}
                        onError={(e) => { e.currentTarget.src = `https://placehold.co/70x70/1a1d26/94a3b8?text=${item.name.slice(0,2)}`; }} />
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/product/${item._id}`}><p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{item.name}</p></Link>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.unit || '1 unit'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="qty-stepper">
                        <button onClick={() => { if (item.qty === 1) removeFromCart(item._id); else addToCart({ ...item, qty: item.qty - 1 }); }}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => addToCart({ ...item, qty: item.qty + 1 })} disabled={item.qty >= item.countInStock}>+</button>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '1rem', minWidth: '60px', textAlign: 'right' }}>₹{(item.qty * item.price).toFixed(0)}</span>
                      <button onClick={() => removeFromCart(item._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Instructions */}
              <div className="glass-card" style={{ padding: '20px', marginTop: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-color)' }}>Delivery Instructions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  {[
                    { id: 'leave_door', icon: '🚪', label: 'Leave at door' },
                    { id: 'no_bell', icon: '🔕', label: 'Don\'t ring bell' },
                    { id: 'guard', icon: '👮', label: 'Leave with guard' },
                    { id: 'call', icon: '📞', label: 'Call upon arrival' },
                  ].map(inst => (
                    <div 
                      key={inst.id}
                      onClick={() => setDeliveryInstruction(deliveryInstruction === inst.id ? '' : inst.id)}
                      style={{
                        padding: '12px', borderRadius: '12px', border: `2px solid ${deliveryInstruction === inst.id ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        background: deliveryInstruction === inst.id ? 'rgba(29, 185, 84, 0.05)' : 'var(--bg-color)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center',
                        transition: 'all 0.2s',
                        position: 'relative',
                      }}
                    >
                      {deliveryInstruction === inst.id && (
                        <CheckCircle size={16} color="var(--primary-color)" style={{ position: 'absolute', top: '8px', right: '8px' }} fill="#fff" />
                      )}
                      <span style={{ fontSize: '1.5rem' }}>{inst.icon}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-color)' }}>{inst.label}</span>
                    </div>
                  ))}
                </div>
                {deliveryInstruction && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '12px', marginBottom: 0 }}>
                    <CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Instruction added to delivery!
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ flex: '1 1 280px', position: 'sticky', top: '80px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Price Details</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Price ({totalQty} items)</span>
                    <span style={{ fontWeight: 600 }}>₹{itemsPrice.toFixed(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Delivery Charges</span>
                    <span style={{ fontWeight: 600, color: shippingPrice === 0 ? 'var(--primary-color)' : 'inherit' }}>
                      {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Coupon ({appliedCoupon.code})</span>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>−₹{couponDiscount}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total Amount</span>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{totalPrice.toFixed(0)}</span>
                  </div>
                </div>

                {/* Coupon Box */}
                <div style={{ marginBottom: '16px' }}>
                  {appliedCoupon ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.25)', borderRadius: '10px' }}>
                      <CheckCircle size={16} color="var(--primary-color)" />
                      <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>{appliedCoupon.label}</span>
                      <button onClick={removeCoupon} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', background: 'var(--bg-color)' }}>
                          <Tag size={15} color="var(--text-muted)" />
                          <input
                            placeholder="Coupon code"
                            value={couponInput}
                            onChange={e => setCouponInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'var(--text-color)', width: '100%', fontWeight: 600 }}
                          />
                        </div>
                        <button onClick={applyCoupon} style={{ padding: '10px 14px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0 }}>
                          Apply
                        </button>
                      </div>
                      {couponError && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px', fontWeight: 600 }}>{couponError}</p>}
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>Try: SAVE10 · FRESH20 · NEWUSER</p>
                    </>
                  )}
                </div>

                {couponDiscount > 0 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary-color)', marginBottom: '16px', fontWeight: 600 }}>
                    🎉 You save ₹{couponDiscount} with this coupon!
                  </p>
                )}

                <button
                  className="btn btn-primary btn-block"
                  style={{ padding: '16px', fontSize: '1rem', fontWeight: 800, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Shield size={14} />
                  Safe and Secure Payments
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
