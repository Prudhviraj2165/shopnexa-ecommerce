import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Settings, Navigation, MapPin, 
  CreditCard, Wallet, Layers, Ticket, 
  FileText, Briefcase, GraduationCap, 
  Heart, Shield, Sparkles, ChevronRight, LogOut, Store
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  if (!userInfo) return null;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      
      {/* Unique Blue/Violet Gradient Header */}
      <div className="profile-header">
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
          <button onClick={() => navigate('/')} style={{ 
            background: 'rgba(255, 255, 255, 0.15)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)', 
            borderRadius: '50%', 
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ArrowLeft size={22} />
          </button>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
             <button onClick={() => navigate('/support')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              Support
            </button>
            <button 
              onClick={() => navigate('/profile/edit')}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <Settings size={22} />
            </button>
          </div>
        </div>
        
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
              {userInfo?.name}
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
              {userInfo?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-20px', maxWidth: '600px', padding: '0 16px', position: 'relative', zIndex: 20 }}>
        
        {/* Nexa Elite Banner */}
        <div style={{ background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="#fbbf24" fill="#fbbf24" />
              <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px' }}>NEXA ELITE</span>
              <span style={{ background: '#3b82f6', color: 'white', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>PRO ACTIVE</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Free delivery on all orders over ₹499</p>
          </div>
          <ChevronRight size={20} color="#64748b" />
        </div>

        {/* Action Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div className="profile-action-card" onClick={() => navigate('/shipping')}>
            <MapPin size={26} strokeWidth={1.5} color="#4f46e5" />
            <span>Delivery<br/>Addresses</span>
          </div>
          <div className="profile-action-card" onClick={() => navigate('/wallet')}>
            <Wallet size={26} strokeWidth={1.5} color="#10b981" />
            <span>Nexa<br/>Wallet</span>
          </div>
          <div className="profile-action-card" onClick={() => navigate('/orders')}>
            <Layers size={26} strokeWidth={1.5} color="#f59e0b" />
            <span>My<br/>Orders</span>
          </div>
          <div className="profile-action-card" onClick={() => navigate('/coupons')}>
            <Ticket size={26} strokeWidth={1.5} color="#ec4899" />
            <span>Claim<br/>Coupons</span>
          </div>
          <div className="profile-action-card" onClick={() => navigate('/wishlist')}>
            <Heart size={26} strokeWidth={1.5} color="#ef4444" />
            <span>Saved<br/>Items</span>
          </div>
          <div className="profile-action-card" onClick={() => navigate('/stores')}>
            <Store size={26} strokeWidth={1.5} color="#1db954" />
            <span>Local<br/>Stores</span>
          </div>
        </div>

        {/* Unique List Menu */}
        <div className="glass-card" style={{ padding: 0 }}>
          <div className="profile-list-item" onClick={() => navigate('/wallet')}>
            <div className="icon-box"><CreditCard size={20} strokeWidth={1.5}/></div>
            <div className="text-box">Saved Payment Methods</div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
          <div className="profile-list-item" onClick={() => navigate('/orders')}>
            <div className="icon-box"><FileText size={20} strokeWidth={1.5}/></div>
            <div className="text-box">Transaction Statements</div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
          <div className="profile-list-item" onClick={() => navigate('/orders')}>
            <div className="icon-box"><Navigation size={20} strokeWidth={1.5}/></div>
            <div className="text-box">Track Live Order</div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
          <div className="profile-list-item">
            <div className="icon-box"><Heart size={20} strokeWidth={1.5}/></div>
            <div className="text-box">Grocery Wishlist</div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
          <div className="profile-list-item">
            <div className="icon-box"><Briefcase size={20} strokeWidth={1.5}/></div>
            <div className="text-box">Business Billing Settings</div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
          <div className="profile-list-item" onClick={() => navigate('/privacy')}>
            <div className="icon-box"><Shield size={20} strokeWidth={1.5}/></div>
            <div className="text-box">Privacy & Security</div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
          <div className="profile-list-item" onClick={logout} style={{ borderBottom: 'none' }}>
            <div className="icon-box" style={{ color: 'var(--danger)' }}><LogOut size={20} strokeWidth={1.5}/></div>
            <div className="text-box" style={{ color: 'var(--danger)', fontWeight: 600 }}>Log Out Safely</div>
          </div>
        </div>

      </div>

      {/* Floating Action Pill */}
      <button className="btn-floating-pill" onClick={() => navigate('/orders')}>
        VIEW ALL PAST ORDERS
      </button>

    </div>
  );
};

export default ProfilePage;
