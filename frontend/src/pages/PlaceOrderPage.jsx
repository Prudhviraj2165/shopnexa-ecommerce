import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { ArrowLeft, MapPin, CreditCard, Shield, ChevronRight } from 'lucide-react';

const PAYMENT_ICONS = { UPI: '📱', COD: '🚚', Card: '💳', Wallet: '👛' };

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useAuth();
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);
  const [loading, setLoading] = useState(false);

  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
  const paymentMethod = JSON.parse(localStorage.getItem('paymentMethod')) || 'UPI';
  const deliveryInstruction = localStorage.getItem('deliveryInstruction') || '';

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice >= 499 ? 0 : 40;
  const totalPrice = (itemsPrice + shippingPrice).toFixed(2);
  const totalSavings = cartItems.reduce((acc, item) => acc + (item.originalPrice ? (item.originalPrice - item.price) * item.qty : 0), 0);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        { orderItems: cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice: 0, totalPrice, deliveryInstruction },
        config
      );
      clearCart();
      localStorage.removeItem('deliveryInstruction');
      navigate(`/order-success/${data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      <CheckoutSteps step1 step2 step3 step4 />

      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => navigate('/payment')} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Review & Place Order</h1>
      </div>

      <div className="container" style={{ maxWidth: '900px', padding: '20px 16px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Left Column */}
          <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Delivery Address */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem' }}>
                  <MapPin size={18} color="var(--primary-color)" /> Delivery Address
                </div>
                <button onClick={() => navigate('/shipping')} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Change <ChevronRight size={14} />
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {shippingAddress.label && <strong style={{ color: 'var(--text-color)' }}>{shippingAddress.label} — </strong>}
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>

            {/* Payment Method */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem' }}>
                  <CreditCard size={18} color="var(--primary-color)" /> Payment Method
                </div>
                <button onClick={() => navigate('/payment')} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Change <ChevronRight size={14} />
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {PAYMENT_ICONS[paymentMethod]} {paymentMethod === 'UPI' ? 'UPI / GPay / PhonePe' : paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod === 'Card' ? 'Credit / Debit Card' : 'Nexa Wallet'}
              </p>
            </div>

            {/* Order Items */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Order Items ({cartItems.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {cartItems.map((item, i) => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: i < cartItems.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = `https://placehold.co/56x56/1a1d26/94a3b8?text=${item.name.slice(0,2)}`; }} />
                    <Link to={`/product/${item._id}`} style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</Link>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.qty} × ₹{item.price}</div>
                    <div style={{ fontWeight: 700 }}>₹{(item.qty * item.price).toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div style={{ flex: '1 1 280px', position: 'sticky', top: '80px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                Price Details
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Price ({cartItems.reduce((a, i) => a + i.qty, 0)} items)</span>
                  <span>₹{itemsPrice.toFixed(0)}</span>
                </div>
                {totalSavings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Discount</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>−₹{totalSavings.toFixed(0)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                  <span style={{ color: shippingPrice === 0 ? 'var(--primary-color)' : 'inherit', fontWeight: 600 }}>
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '14px', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Total Amount</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              {totalSavings > 0 && (
                <div style={{ background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                  🎉 You save ₹{totalSavings.toFixed(0)} on this order!
                </div>
              )}

              <button
                className="btn btn-primary btn-block"
                style={{ padding: '16px', fontWeight: 800, fontSize: '1rem', borderRadius: '12px' }}
                disabled={cartItems.length === 0 || loading}
                onClick={placeOrderHandler}
              >
                {loading ? 'Placing Order...' : `Place Order · ₹${totalPrice}`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <Shield size={12} /> Safe & Secure · 100% Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
