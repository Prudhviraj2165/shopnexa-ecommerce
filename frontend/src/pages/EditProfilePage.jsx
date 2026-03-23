import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo, updateUserInfo } = useAuth();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}),
          },
        };

        const { data } = await axios.put(
          `${import.meta.env.VITE_API_URL}/users/profile`,
          { id: userInfo?._id, name, email, password },
          config
        );

        // Update AuthContext and LocalStorage
        updateUserInfo(data);
        setSuccess(true);
        setMessage(null);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setMessage(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }
  };

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Edit Profile</h1>
        </div>

        {message && <Message variant="danger">{message}</Message>}
        {success && <Message variant="success">Profile Updated Successfully!</Message>}

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ShieldCheck size={18} color="#1db954" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Security Update</span>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  placeholder="Leave blank to keep current"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '16px', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Save size={20} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
