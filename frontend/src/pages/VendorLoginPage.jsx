import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Store, Mail, Lock, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';

const VendorLoginPage = () => {
  const navigate = useNavigate();
  const { updateUserInfo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, { email, password });
      if (!data.isVendor && !data.isAdmin) {
        setError('This account is not registered as a vendor. Please register your store first.');
        setLoading(false);
        return;
      }
      updateUserInfo(data);
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #0b1a11 0%, #0d2a1a 50%, #0b1a11 100%)' }}>

      {/* Left Panel — Branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', color: '#fff', minWidth: '320px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}>
          <div style={{ background: '#1db954', borderRadius: '14px', padding: '12px', display: 'flex', boxShadow: '0 8px 24px rgba(29,185,84,0.4)' }}>
            <ShoppingBag size={28} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-1px' }}>Shop<span style={{ color: '#1db954' }}>nexa</span></span>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>Vendor Portal</div>
          </div>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 18px' }}>
          Manage your<br /><span style={{ color: '#1db954' }}>local store</span><br />with ease
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '40px', maxWidth: '380px' }}>
          Real-time inventory updates, order tracking, and local customer reach — all in one dashboard.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {['⚡ Real-time order notifications', '📦 Manage products & stock live', '📊 Track earnings & analytics', '🗺️ Reach customers in your city'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontWeight: 600 }}>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{ flex: '0 0 440px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(29,185,84,0.12)', color: '#1db954', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '16px', border: '1px solid rgba(29,185,84,0.2)' }}>
              <Store size={14} /> Vendor Sign In
            </div>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.8rem', margin: 0 }}>Welcome back</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Sign in to your vendor account</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Mail size={13} /> Email Address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Lock size={13} /> Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }} />
            </div>

            <button type="submit" disabled={loading}
              style={{ marginTop: '8px', padding: '15px', borderRadius: '12px', background: '#1db954', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}>
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={18} />}
              {loading ? 'Signing in...' : 'Access Vendor Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            Don't have a vendor account?{' '}
            <Link to="/vendor/register" style={{ color: '#1db954', fontWeight: 700, textDecoration: 'none' }}>Register your store →</Link>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Back to Customer Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default VendorLoginPage;
