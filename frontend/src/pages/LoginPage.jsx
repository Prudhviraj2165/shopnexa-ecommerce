import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Mail, Lock, Loader2, ArrowRight, Store } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { search } = useLocation();
  const { login, userInfo } = useAuth();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', fontFamily: 'Inter, sans-serif' }}>

      {/* Left - Branding */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', color: '#fff', minWidth: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{ background: '#1db954', borderRadius: '14px', padding: '12px', display: 'flex', boxShadow: '0 4px 20px rgba(29,185,84,0.4)' }}>
            <ShoppingBag size={28} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-1px' }}>Shop<span style={{ color: '#1db954' }}>nexa</span></span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 16px' }}>
          Fresh groceries,<br /><span style={{ color: '#1db954' }}>lightning fast</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '36px', maxWidth: '340px' }}>
          Shop from local stores in your city. Get fresh fruits, veggies, dairy, and more delivered in minutes!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['🥛 Fresh Dairy & Milk', '🥦 Fruits & Vegetables', '⚡ Delivery in 10 mins', '🏪 From local kirana stores'].map(f => (
            <div key={f} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', fontWeight: 600 }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Right - Login Form */}
      <div style={{ flex: '0 0 460px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: 'var(--bg-color)' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(29,185,84,0.1)', color: 'var(--primary-color)', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.82rem', marginBottom: '16px', border: '1px solid rgba(29,185,84,0.2)' }}>
              🛒 Customer Login
            </div>
            <h2 style={{ fontWeight: 900, fontSize: '1.8rem', margin: '0 0 6px', color: 'var(--text-color)' }}>Welcome back!</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Sign in to continue shopping</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600, fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Mail size={13} /> Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Lock size={13} /> Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={loading}
              style={{ padding: '15px', borderRadius: '12px', background: '#1db954', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: loading ? 0.7 : 1 }}>
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={18} />}
              {loading ? 'Signing in...' : 'Sign In & Shop Now'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 700, textDecoration: 'none' }}>Create an account →</Link>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            Are you a store owner?
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <Link to="/vendor/login"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '13px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem', transition: 'all 0.2s' }}>
            <Store size={18} color="#1db954" />
            Vendor / Store Admin Login →
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;
