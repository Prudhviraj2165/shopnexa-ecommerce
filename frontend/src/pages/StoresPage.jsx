import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, Search, Filter, Store, Star } from 'lucide-react';
import Loader from '../components/Loader';

const StoresPage = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/stores`);
        setStores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1db954 0%, #0d9448 100%)', padding: '40px 0', marginBottom: '32px', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px', color: '#fff' }}>
            <Store size={32} />
            <h1 style={{ margin: 0, fontWeight: 900, fontSize: '2rem' }}>Local Stores Near You</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: '0 0 24px', fontSize: '1.05rem' }}>Shop fresh from verified local vendors in your city</p>

          {/* Search */}
          <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search stores, city, or category..."
              style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '14px', border: 'none', fontSize: '1rem', boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            />
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? <Loader /> : error ? (
          <div style={{ color: '#ef4444', textAlign: 'center', padding: '40px' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Store size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>No stores found. Try a different search!</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontWeight: 900 }}>{filtered.length} Store{filtered.length !== 1 ? 's' : ''} Available</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filtered.map(store => (
                <div key={store._id} className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}
                  onClick={() => navigate(`/store/${store._id}`)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ position: 'relative' }}>
                    <img src={store.logo} alt={store.name}
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.src = `https://placehold.co/280x160/1db954/fff?text=${encodeURIComponent(store.name.slice(0, 8))}`; }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span style={{ background: store.isOpen ? '#1db954' : '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {store.isOpen ? '● OPEN' : '● CLOSED'}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {store.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 6px', fontWeight: 900, fontSize: '1.1rem' }}>{store.name}</h3>
                    <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {store.description || `${store.category} store`}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} color="var(--primary-color)" />{store.city}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} color="var(--primary-color)" />{store.deliveryTime}</span>
                      {store.minimumOrder > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Min ₹{store.minimumOrder}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoresPage;
