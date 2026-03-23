import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, MapPin, CreditCard, Package, Truck, Home, CheckCircle, Clock, RotateCcw, MessageSquare } from 'lucide-react';
import Loader from '../components/Loader';

const STATUS_MAP = { 'Placed': 0, 'Packed': 1, 'Shipped': 2, 'Delivered': 3 };

const PAYMENT_LABELS = { UPI: 'UPI / GPay', COD: 'Cash on Delivery', Card: 'Credit / Debit Card', Wallet: 'Nexa Wallet' };
const PAYMENT_ICONS = { UPI: '📱', COD: '🚚', Card: '💳', Wallet: '👛' };

const INSTRUCTION_LABELS = {
  leave_door: 'Leave at door',
  no_bell: 'Don\'t ring bell',
  guard: 'Leave with guard',
  call: 'Call upon arrival',
};

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: <Package size={18} /> },
  { key: 'packed', label: 'Packed', icon: <Package size={18} /> },
  { key: 'shipped', label: 'Shipped', icon: <Truck size={18} /> },
  { key: 'delivered', label: 'Delivered', icon: <Home size={18} /> },
];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { addToCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
          headers: { 
            ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {})
          }
        });
        setOrder(data);
        setActiveStep(STATUS_MAP[data.status] || 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    if (userInfo && id) fetch(); else navigate('/login');
  }, [id, userInfo, navigate]);

  useEffect(() => {
    if (!id) return;
    const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''));
    
    socket.emit('joinOrderRoom', id);
    
    socket.on('orderStatusUpdated', (newStatus) => {
      setActiveStep(STATUS_MAP[newStatus]);
      let toastMsg = '';
      if (newStatus === 'Packed') toastMsg = 'Your order is being packed 📦';
      if (newStatus === 'Shipped') toastMsg = 'Your order has been shipped 🚚';
      if (newStatus === 'Delivered') toastMsg = 'Your order has been delivered 🏠';
      
      setToast(toastMsg);
      setTimeout(() => setToast(''), 4000);
    });

    return () => socket.disconnect();
  }, [id]);

  const reorder = () => {
    order.orderItems.forEach(item => addToCart({ ...item, qty: item.qty }));
    navigate('/cart');
  };

  if (loading) return <Loader />;
  if (!order) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Order not found.</div>;

  const stage = activeStep + 1;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0 24px' }}>
        <button onClick={() => navigate('/orders')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
          <ArrowLeft size={18} /> My Orders
        </button>
        <span style={{ color: 'var(--text-muted)' }}>›</span>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{order._id.slice(-10).toUpperCase()}</span>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Left */}
        <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Order Status Timeline */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Order Status</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {STATUS_STEPS.map((step, i) => (
                <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: i < stage ? 'var(--primary-color)' : i === stage - 1 ? 'var(--primary-color)' : 'var(--card-bg)',
                      border: `2px solid ${i < stage ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: i < stage ? '#fff' : 'var(--text-muted)',
                      transition: 'all 0.3s'
                    }}>
                      {i < stage ? <CheckCircle size={18} /> : step.icon}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: i < stage ? 'var(--primary-color)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {step.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ flex: 1, height: '2px', background: i < stage - 1 ? 'var(--primary-color)' : 'var(--border-color)', margin: '0 4px', marginBottom: '22px' }} />
                  )}
                </div>
              ))}
            </div>

            {!order.isDelivered && (
              <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(29,185,84,0.06)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <Clock size={14} color="var(--primary-color)" />
                <span>Estimated delivery: <strong>{new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</strong></span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>Items ({order.orderItems.length})</h3>
              <button onClick={reorder} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                <RotateCcw size={14} /> Reorder
              </button>
            </div>
            {order.orderItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: i < order.orderItems.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                  onError={e => { e.currentTarget.src = `https://placehold.co/56x56/1a1d26/94a3b8?text=${item.name.slice(0,2)}`; }} />
                <Link to={`/product/${item.product || item._id}`} style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</Link>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>×{item.qty}</div>
                <div style={{ fontWeight: 800 }}>₹{(item.qty * item.price).toFixed(0)}</div>
              </div>
            ))}
          </div>

          {/* Delivery + Payment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: 800 }}>
                <MapPin size={16} color="var(--primary-color)" /> Delivery Address
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {order.shippingAddress?.label && <strong style={{ color: 'var(--text-color)' }}>{order.shippingAddress.label}<br /></strong>}
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country}
              </p>
              {order.deliveryInstruction && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <MessageSquare size={14} color="var(--primary-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 700, display: 'block', marginBottom: '2px', color: 'var(--text-color)' }}>Instruction</span>
                    <span style={{ color: 'var(--text-muted)' }}>{INSTRUCTION_LABELS[order.deliveryInstruction] || order.deliveryInstruction}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: 800 }}>
                <CreditCard size={16} color="var(--primary-color)" /> Payment
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>
                {PAYMENT_ICONS[order.paymentMethod] || '💳'} {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
              </p>
              <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: order.isPaid ? 'var(--primary-color)' : '#f59e0b', fontWeight: 600 }}>
                {order.isPaid ? '✓ Payment Received' : 'Pay on delivery'}
              </p>
            </div>
          </div>
        </div>

        {/* Right — Price Summary */}
        <div style={{ flex: '1 1 260px', position: 'sticky', top: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: 800, marginBottom: '20px', fontSize: '1.1rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items ({order.orderItems.reduce((a, i) => a + i.qty, 0)})</span>
                <span>₹{order.itemsPrice?.toFixed(0) || order.totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                <span style={{ color: order.shippingPrice == 0 ? 'var(--primary-color)' : 'inherit' }}>
                  {order.shippingPrice == 0 ? 'FREE' : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                <span>Total</span>
                <span>₹{parseFloat(order.totalPrice).toFixed(0)}</span>
              </div>
            </div>
            <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-color)', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Order ID: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>#{order._id.slice(-12).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--card-bg)', border: '1px solid var(--border-color)',
          padding: '12px 24px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '10px', zIndex: 9999,
          animation: 'slideUpFade 0.3s ease forwards', fontWeight: 700, color: 'var(--text-color)'
        }}>
          <span className="pulse-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1db954', boxShadow: '0 0 0 0 rgba(29,185,84, 0.7)' }}></span>
          {toast}
        </div>
      )}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); boxShadow: 0 0 0 0 rgba(29,185,84, 0.7); }
          70% { transform: scale(1); boxShadow: 0 0 0 10px rgba(29,185,84, 0); }
          100% { transform: scale(0.95); boxShadow: 0 0 0 0 rgba(29,185,84, 0); }
        }
        .pulse-dot { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
};

export default OrderDetailPage;
