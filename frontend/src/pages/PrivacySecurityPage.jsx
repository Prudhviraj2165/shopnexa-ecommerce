import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Bell, Smartphone, UserX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PrivacySecurityPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      <div className="container" style={{ maxWidth: '600px', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Privacy & Security</h1>
        </div>

        <div className="glass-card" style={{ padding: 0, marginBottom: '24px' }}>
          <div className="profile-list-item">
            <div className="icon-box"><Lock size={20} strokeWidth={1.5}/></div>
            <div className="text-box">
              <div style={{ fontWeight: 600 }}>Two-Step Verification</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add an extra layer of security to your account.</div>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Off</div>
          </div>
          <div className="profile-list-item">
            <div className="icon-box"><Smartphone size={20} strokeWidth={1.5}/></div>
            <div className="text-box">
              <div style={{ fontWeight: 600 }}>Logged-in Devices</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage and logout from other devices.</div>
            </div>
          </div>
          <div className="profile-list-item">
            <div className="icon-box"><Eye size={20} strokeWidth={1.5}/></div>
            <div className="text-box">
              <div style={{ fontWeight: 600 }}>Personal Data</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Download or request deletion of your data.</div>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '32px 0 16px 0', color: 'var(--text-muted)' }}>PREFERENCES</h3>
        
        <div className="glass-card" style={{ padding: 0 }}>
          <div className="profile-list-item">
            <div className="icon-box"><Bell size={20} strokeWidth={1.5}/></div>
            <div className="text-box">Marketing Communications</div>
            <div style={{ 
              width: '40px', 
              height: '20px', 
              background: '#1db954', 
              borderRadius: '10px', 
              position: 'relative' 
            }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                background: 'white', 
                borderRadius: '50%', 
                position: 'absolute', 
                right: '2px', 
                top: '2px' 
              }}></div>
            </div>
          </div>
          <div className="profile-list-item" onClick={logout} style={{ borderBottom: 'none' }}>
            <div className="icon-box" style={{ color: 'var(--danger)' }}><UserX size={20} strokeWidth={1.5}/></div>
            <div className="text-box" style={{ color: 'var(--danger)', fontWeight: 600 }}>Deactivate Account</div>
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Shield size={48} color="var(--border-color)" style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Your security is our priority. Shopnexa uses industry-standard encryption to protect your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
