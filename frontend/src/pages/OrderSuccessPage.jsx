import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Package, Truck, Home, ArrowRight, Zap } from 'lucide-react';

const STATUS_MAP = { 'Placed': 0, 'Packed': 1, 'Shipped': 2, 'Delivered': 3 };

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  
  const [activeStep, setActiveStep] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { 
          headers: { 
            ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}) 
          } 
        };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, config);
        setOrder(data);
        setActiveStep(STATUS_MAP[data.status] || 0);
      } catch (err) {
        console.error(err);
      }
    };
    if (id && userInfo) fetchOrder();
  }, [id, userInfo]);

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

  // Admin Mock Function
  const advanceStatus = async () => {
    try {
      const nextStatus = Object.keys(STATUS_MAP).find(k => STATUS_MAP[k] === activeStep + 1);
      if (!nextStatus) return;
      const config = { 
        headers: { 
          ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}) 
        } 
      };
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}/status`, { status: nextStatus }, config);
    } catch(err) { console.error(err); }
  };

  const estimatedDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="animate-fade-in" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>

        {/* Success Icon */}
        <div style={{ width: '90px', height: '90px', background: 'rgba(29,185,84,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'fadeIn 0.4s ease' }}>
          <CheckCircle size={48} color="var(--primary-color)" strokeWidth={1.5} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Order Placed! 🎉</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.95rem' }}>
          Your groceries are being packed and will be delivered by <strong style={{ color: 'var(--text-color)' }}>{estimatedDate}</strong>.
        </p>

        {/* Order ID Card */}
        <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            Order ID
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            #{id?.slice(-12).toUpperCase()}
          </div>
        </div>

        {/* Tracking Steps */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '2px', background: 'rgba(29,185,84,0.2)', zIndex: 0 }} />
            {[
              { icon: <CheckCircle size={22} />, label: 'Confirmed', done: activeStep >= 0 },
              { icon: <Package size={22} />, label: 'Packing', done: activeStep >= 1 },
              { icon: <Truck size={22} />, label: 'On the Way', done: activeStep >= 2 },
              { icon: <Home size={22} />, label: 'Delivered', done: activeStep >= 3 },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step.done ? 'var(--primary-color)' : 'var(--card-bg)', border: `2px solid ${step.done ? 'var(--primary-color)' : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.done ? 'white' : 'var(--text-muted)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  {step.icon}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: step.done ? 'var(--primary-color)' : 'var(--text-muted)', transition: 'color 0.4s' }}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items Preview */}
        {order && order.orderItems && (
          <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {order.orderItems.length} items · ₹{order.totalPrice}
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {order.orderItems.slice(0, 5).map((item, i) => (
                <img key={i} src={item.image} alt={item.name} title={item.name}
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = `https://placehold.co/48x48/1a1d26/94a3b8?text=${item.name.slice(0,2)}`; }} />
              ))}
              {order.orderItems.length > 5 && (
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                  +{order.orderItems.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => navigate('/orders')} className="btn btn-primary"
            style={{ padding: '14px', fontWeight: 700, fontSize: '0.95rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Track Order <ArrowRight size={18} />
          </button>
          
          {/* Admin Dev Button */}
          {activeStep < 3 && (
            <button onClick={advanceStatus} style={{ 
              padding: '12px', background: 'rgba(29, 185, 84, 0.1)', color: 'var(--primary-color)', 
              border: '1px dashed var(--primary-color)', borderRadius: '12px', fontWeight: 700, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
            }}>
              <Zap size={16} /> Admin Demo: Advance Order Status
            </button>
          )}

          <Link to="/" className="btn btn-outline"
            style={{ padding: '14px', fontWeight: 700, fontSize: '0.95rem', borderRadius: '12px', textAlign: 'center' }}>
            Continue Shopping
          </Link>
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

export default OrderSuccessPage;
