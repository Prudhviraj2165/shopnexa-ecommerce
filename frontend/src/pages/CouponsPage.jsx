import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, Copy, CheckCircle, ShoppingCart } from 'lucide-react';

const CouponsPage = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState('');

  const coupons = [
    { code: 'SAVE10', description: '10% off on your order', detail: 'Valid on all categories, min order ₹99', tag: '10% OFF' },
    { code: 'FRESH20', description: '₹20 flat off', detail: 'Valid on all grocery items, no minimum', tag: '₹20 OFF' },
    { code: 'NEWUSER', description: '15% off for new users', detail: 'First order only, min order ₹149', tag: '15% OFF' },
    { code: 'GROCERY5', description: '5% extra off on groceries', detail: 'Valid on daily essentials', tag: '5% OFF' },
  ];

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      <div className="container" style={{ maxWidth: '600px', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <button onClick={() => navigate('/profile')} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>My Coupons</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px', marginLeft: '56px' }}>
          Copy a code and paste it in cart to save instantly
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {coupons.map((coupon, index) => (
            <div key={index} className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden', borderLeft: '4px solid var(--primary-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ background: 'rgba(29,185,84,0.1)', color: 'var(--primary-color)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>
                      {coupon.code}
                    </div>
                    <div style={{ background: '#fef3c7', color: '#d97706', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {coupon.tag}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 4px 0' }}>{coupon.description}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{coupon.detail}</p>
                </div>
                <button onClick={() => copyCode(coupon.code)} style={{ background: copied === coupon.code ? 'var(--primary-color)' : 'transparent', border: '1px dashed var(--primary-color)', color: copied === coupon.code ? '#fff' : 'var(--primary-color)', cursor: 'pointer', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, transition: 'all 0.2s', marginLeft: '12px' }}>
                  {copied === coupon.code ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
              <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.04 }}>
                <Ticket size={90} />
              </div>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                <CheckCircle size={13} /> Valid · Use in cart at checkout
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/cart')} className="btn btn-primary btn-block" style={{ marginTop: '24px', padding: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '12px' }}>
          <ShoppingCart size={18} /> Go to Cart & Use Coupon
        </button>
      </div>
    </div>
  );
};

export default CouponsPage;

