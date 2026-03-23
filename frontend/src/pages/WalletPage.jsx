import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Wallet, Plus, ChevronRight, History, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const WalletPage = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAuth();
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);
  
  const balance = userInfo?.walletBalance || 0;

  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addMoneyHandler = async (e) => {
    e.preventDefault();
    if (amount <= 0) return;
    setLoading(true);
    try {
      const config = { 
        headers: { 
          ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}) 
        } 
      };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/wallet`, { amount }, config);
      
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      setSuccess(data.message);
      setShowAddMoney(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock transactions
  const transactions = [
    { id: 1, type: 'Added to Wallet', amount: amount || 500, date: 'Just now', status: 'Credited' },
    { id: 2, type: 'Order Payment', amount: -249, date: '22 Mar, 2024', status: 'Debited' },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      <div className="container" style={{ maxWidth: '600px', padding: '20px 16px' }}>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Nexa Wallet</h1>
        </div>

        {/* Balance Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1db954 0%, #15803d 100%)', 
          borderRadius: '24px', 
          padding: '30px', 
          color: 'white', 
          marginBottom: '28px',
          boxShadow: '0 12px 24px rgba(29, 185, 84, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', opacity: 0.9 }}>Current Balance</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>₹{balance.toFixed(2)}</h2>
            
            {!showAddMoney ? (
              <button 
                onClick={() => setShowAddMoney(true)}
                style={{ 
                  marginTop: '24px', background: 'white', color: '#1db954', border: 'none', 
                  padding: '12px 24px', borderRadius: '12px', fontWeight: 700, 
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
                }}
              >
                <Plus size={20} /> Add Money
              </button>
            ) : (
              <form onSubmit={addMoneyHandler} style={{ marginTop: '20px', background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 600 }}>Amount to add:</span>
                  <X size={20} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setShowAddMoney(false)} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#333' }}>₹</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      style={{ width: '100%', padding: '12px 12px 12px 28px', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                      min="1"
                      required
                      autoFocus
                    />
                  </div>
                  <button type="submit" disabled={loading} style={{ background: '#111', color: 'white', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                    {loading ? <Loader size={20} color="white" /> : 'Confirm'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {[100, 500, 1000].map(val => (
                    <span 
                      key={val} 
                      onClick={() => setAmount(val)}
                      style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      +₹{val}
                    </span>
                  ))}
                </div>
              </form>
            )}
          </div>
          <Wallet size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, color: 'white' }} />
        </div>

        {/* Alerts */}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">{success}</Message>}

        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: '20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(29, 185, 84, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#1db954' }}>
              <History size={24} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>History</span>
          </div>
          <div style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#3b82f6' }}>
              <Info size={24} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Security</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Recent Transactions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map(t => (
            <div key={t.id} className="profile-list-item" style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: 0 }}>
              <div className="text-box">
                <div style={{ fontWeight: 600 }}>{t.type}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: t.amount > 0 ? '#1db954' : 'var(--text)' }}>
                  {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
