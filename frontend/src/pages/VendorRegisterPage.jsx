import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Store, MapPin, Phone, Tag, Clock, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';

const CATEGORIES = ['Grocery', 'Dairy', 'Bakery', 'Fruits & Vegetables', 'Meat & Fish', 'Beverages', 'Snacks', 'Personal Care'];

const VendorRegisterPage = () => {
  const navigate = useNavigate();
  const { userInfo, updateUserInfo } = useAuth();
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    phone: '',
    category: 'Grocery',
    deliveryTime: '10-20 mins',
    minimumOrder: 0,
    logo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.city) {
      setError('Store name and city are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const config = { 
        headers: { 
          ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}) 
        } 
      };
      const { data: store } = await axios.post(`${import.meta.env.VITE_API_URL}/stores`, form, config);

      // Update userInfo in context/localStorage with vendor status
      const updatedUser = { ...userInfo, isVendor: true, storeId: store._id };
      updateUserInfo(updatedUser);

      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Standalone Vendor Portal Nav */}
      <div style={{ background: '#0b1a11', padding: '10px 0', borderBottom: '1px solid rgba(29,185,84,0.2)', marginBottom: '0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#1db954', borderRadius: '8px', padding: '6px', display: 'flex' }}>
              <ShoppingBag size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
              Shop<span style={{ color: '#1db954' }}>nexa</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.75rem', marginLeft: '6px' }}>Vendor Portal</span>
            </span>
          </div>
          <button onClick={() => navigate('/vendor/login')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
            ← Back to Vendor Login
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px 80px' }}>
      <button onClick={() => navigate('/vendor/login')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '28px' }}>
        <ArrowLeft size={18} /> Back to Vendor Login
      </button>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1db954 0%, #0d9448 100%)', borderRadius: '20px', padding: '32px', marginBottom: '32px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '12px', display: 'flex' }}>
            <Store size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Register Your Store</h1>
            <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '0.95rem' }}>Join Shopnexa as a vendor and start selling!</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
          {['✅ Free to join', '⚡ Real-time orders', '📊 Vendor dashboard', '🚀 Reach local customers'].map(f => (
            <span key={f} style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="glass-card" style={{ borderRadius: '20px', padding: '32px' }}>
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #fecaca', fontWeight: 600 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Store Name */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>
                <Store size={14} color="var(--primary-color)" /> Store Name *
              </label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Raju's Fresh Mart" required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '1rem', boxSizing: 'border-box' }} />
            </div>

            {/* City */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>
                <MapPin size={14} color="var(--primary-color)" /> City *
              </label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Hyderabad" required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '1rem', boxSizing: 'border-box' }} />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>
                <Phone size={14} color="var(--primary-color)" /> Phone
              </label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9876543210"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '1rem', boxSizing: 'border-box' }} />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>
                <Tag size={14} color="var(--primary-color)" /> Category
              </label>
              <select name="category" value={form.category} onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '1rem', boxSizing: 'border-box' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Delivery Time */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>
                <Clock size={14} color="var(--primary-color)" /> Delivery Time
              </label>
              <input name="deliveryTime" value={form.deliveryTime} onChange={handleChange} placeholder="10-20 mins"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '1rem', boxSizing: 'border-box' }} />
            </div>

            {/* Address */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>
                <MapPin size={14} color="var(--primary-color)" /> Full Address
              </label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Street, locality, city..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '1rem', boxSizing: 'border-box' }} />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>Store Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                placeholder="Tell customers about your store, specialty products, etc."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>

            {/* Logo URL */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>Store Logo URL (optional)</label>
              <input name="logo" value={form.logo} onChange={handleChange} placeholder="https://..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '1rem', boxSizing: 'border-box' }} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ marginTop: '28px', width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--primary-color)', color: '#fff', fontSize: '1.05rem', fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <ShoppingBag size={20} />}
            {loading ? 'Creating your store...' : 'Launch My Store 🚀'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
