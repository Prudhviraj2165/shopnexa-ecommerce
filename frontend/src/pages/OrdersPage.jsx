import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}),
          },
        };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/myorders`, config);
        setOrders(data);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      <div className="container" style={{ maxWidth: '800px', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button onClick={() => navigate('/profile')} style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '50%', 
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>My Orders</h1>
        </div>

        {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Package size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>No orders yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>When you place an order, it will appear here.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>Start Shopping</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div key={order._id} className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => navigate(`/order/${order._id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ORDER ID</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>#{order._id.slice(-8).toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>DATE</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {order.orderItems.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    ))}
                    {order.orderItems.length > 3 && (
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>
                    {order.orderItems[0].name} {order.orderItems.length > 1 ? `& ${order.orderItems.length - 1} more` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {order.isDelivered ? (
                      <span style={{ color: '#1db954', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                        <CheckCircle size={14} /> Delivered
                      </span>
                    ) : (
                      <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                        <Clock size={14} /> Processing
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{order.totalPrice}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
