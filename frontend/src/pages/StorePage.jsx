import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, Phone, Star, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const StorePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, removeFromCart } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await axios.get(`${import.meta.env.VITE_API_URL}/stores/${id}`);
        setData(res);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const getQty = (pid) => cartItems.find(c => c._id === pid)?.qty || 0;

  if (loading) return <Loader />;
  if (error) return <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{error}</div>;

  const { store, products } = data;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Store Banner */}
      <div style={{ position: 'relative', height: '240px', overflow: 'hidden', marginBottom: '0' }}>
        <img src={store.logo} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.currentTarget.src = `https://placehold.co/1200x240/1db954/fff?text=${encodeURIComponent(store.name)}`; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
        <button onClick={() => navigate('/stores')} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Store Info */}
      <div className="container">
        <div className="glass-card" style={{ borderRadius: '20px', padding: '24px', marginTop: '-40px', position: 'relative', zIndex: 10, marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h1 style={{ margin: 0, fontWeight: 900, fontSize: '1.6rem' }}>{store.name}</h1>
                <span style={{ background: store.isOpen ? '#dcfce7' : '#fee2e2', color: store.isOpen ? '#16a34a' : '#dc2626', padding: '4px 12px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem' }}>
                  {store.isOpen ? '● Open Now' : '● Closed'}
                </span>
              </div>
              <p style={{ margin: '0 0 14px', color: 'var(--text-muted)' }}>{store.description || `Your local ${store.category} store`}</p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} color="var(--primary-color)" />{store.address || store.city}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={15} color="var(--primary-color)" />{store.deliveryTime}</span>
                {store.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={15} color="var(--primary-color)" />{store.phone}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <span style={{ background: 'rgba(29,185,84,0.1)', color: 'var(--primary-color)', padding: '6px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
                {store.category}
              </span>
              {store.minimumOrder > 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Min order: ₹{store.minimumOrder}</span>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 style={{ fontWeight: 900, marginBottom: '20px' }}>
          Products from {store.name} ({products.length})
        </h2>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>This store hasn't added products yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {products.map(p => {
              const qty = getQty(p._id);
              return (
                <div key={p._id} className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate(`/product/${p._id}`)}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.src = `https://placehold.co/200x150/1a1d26/94a3b8?text=${encodeURIComponent(p.name.slice(0, 6))}`; }} />
                    {p.countInStock === 0 && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '2px', cursor: 'pointer' }} onClick={() => navigate(`/product/${p._id}`)}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{p.unit}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontWeight: 900, fontSize: '1.05rem' }}>₹{p.price}</span>
                      {p.countInStock > 0 && (
                        qty === 0 ? (
                          <button onClick={() => addToCart({ ...p, qty: 1 })}
                            style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' }}>
                            ADD
                          </button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-color)', borderRadius: '8px', padding: '4px 8px' }}>
                            <button onClick={() => removeFromCart(p._id)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 900, lineHeight: 1, padding: '2px 4px' }}>−</button>
                            <span style={{ color: '#fff', fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                            <button onClick={() => addToCart({ ...p, qty: qty + 1 })} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 900, lineHeight: 1, padding: '2px 4px' }}>+</button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
