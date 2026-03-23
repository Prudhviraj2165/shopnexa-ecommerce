import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Store, User, Mail, Lock, Loader2, ArrowRight, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const [role, setRole] = useState('customer'); // 'customer' | 'vendor'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { register, userInfo } = useAuth();

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      // After registration, route based on role
      if (role === 'vendor') {
        navigate('/vendor/register'); // go set up their store
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>

      {/* Left - Branding changes based on role */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', color: '#fff', minWidth: '280px',
        background: role === 'vendor'
          ? 'linear-gradient(135deg, #0b1a11 0%, #0d2a1a 50%, #0b1a11 100%)'
          : 'linear-gradient(135deg, #1a1c2c 0%, #252850 50%, #1a1c2c 100%)',
        transition: 'background 0.5s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{ background: '#1db954', borderRadius: '14px', padding: '12px', display: 'flex', boxShadow: '0 4px 20px rgba(29,185,84,0.4)' }}>
            <ShoppingBag size={28} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-1px' }}>Shop<span style={{ color: '#1db954' }}>nexa</span></span>
        </div>

        {role === 'customer' ? (
          <>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 16px' }}>
              Start shopping<br /><span style={{ color: '#1db954' }}>local & fresh</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '32px', maxWidth: '340px' }}>
              Join thousands of customers getting fresh groceries from local stores — delivered in minutes.
            </p>
            {['🛒 Shop from local stores', '⚡ 10-min delivery', '💚 Fresh every day', '🎟️ Exclusive coupons & offers'].map(f => (
              <div key={f} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', fontWeight: 600, marginBottom: '10px' }}>{f}</div>
            ))}
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 16px' }}>
              Grow your<br /><span style={{ color: '#1db954' }}>local business</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '32px', maxWidth: '340px' }}>
              Register your store, add products, and start receiving orders from customers in your city — all in real time.
            </p>
            {['🏪 Free store registration', '📊 Vendor dashboard & analytics', '⚡ Real-time order alerts', '🗺️ Reach local customers instantly'].map(f => (
              <div key={f} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', fontWeight: 600, marginBottom: '10px' }}>{f}</div>
            ))}
          </>
        )}
      </div>

      {/* Right - Registration Form */}
      <div style={{ flex: '0 0 480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: 'var(--bg-color)' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <h2 style={{ fontWeight: 900, fontSize: '1.6rem', margin: '0 0 6px', color: 'var(--text-color)' }}>Create your account</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 28px', fontSize: '0.9rem' }}>Choose account type first</p>

          {/* Role Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
            <button onClick={() => setRole('customer')} type="button"
              style={{ padding: '16px', borderRadius: '14px', border: `2px solid ${role === 'customer' ? '#1db954' : 'var(--border-color)'}`, background: role === 'customer' ? 'rgba(29,185,84,0.08)' : 'var(--card-bg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s', position: 'relative' }}>
              {role === 'customer' && <CheckCircle size={16} color="#1db954" style={{ position: 'absolute', top: '10px', right: '10px' }} />}
              <User size={24} color={role === 'customer' ? '#1db954' : 'var(--text-muted)'} />
              <span style={{ fontWeight: 800, fontSize: '0.88rem', color: role === 'customer' ? 'var(--primary-color)' : 'var(--text-muted)' }}>Customer</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Shop & order groceries</span>
            </button>
            <button onClick={() => setRole('vendor')} type="button"
              style={{ padding: '16px', borderRadius: '14px', border: `2px solid ${role === 'vendor' ? '#1db954' : 'var(--border-color)'}`, background: role === 'vendor' ? 'rgba(29,185,84,0.08)' : 'var(--card-bg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s', position: 'relative' }}>
              {role === 'vendor' && <CheckCircle size={16} color="#1db954" style={{ position: 'absolute', top: '10px', right: '10px' }} />}
              <Store size={24} color={role === 'vendor' ? '#1db954' : 'var(--text-muted)'} />
              <span style={{ fontWeight: 800, fontSize: '0.88rem', color: role === 'vendor' ? 'var(--primary-color)' : 'var(--text-muted)' }}>Store Owner</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Sell on Shopnexa</span>
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600, fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Full Name', icon: <User size={13} />, val: name, set: setName, type: 'text', placeholder: 'Your full name' },
              { label: 'Email', icon: <Mail size={13} />, val: email, set: setEmail, type: 'email', placeholder: 'your@email.com' },
              { label: 'Password', icon: <Lock size={13} />, val: password, set: setPassword, type: 'password', placeholder: '••••••••' },
              { label: 'Confirm Password', icon: <Lock size={13} />, val: confirmPassword, set: setConfirmPassword, type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '7px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {f.icon} {f.label}
                </label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} required
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
            ))}

            <button type="submit" disabled={loading}
              style={{ marginTop: '6px', padding: '15px', borderRadius: '12px', background: '#1db954', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: loading ? 0.7 : 1 }}>
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={18} />}
              {loading ? 'Creating account...' : role === 'vendor' ? 'Register & Set Up Store →' : 'Create Account & Shop →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to={role === 'vendor' ? '/vendor/login' : '/login'} style={{ color: 'var(--primary-color)', fontWeight: 700, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RegisterPage;
