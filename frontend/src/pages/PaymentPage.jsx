import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Wallet, CreditCard, Truck, ArrowRight, Shield } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice >= 499 ? 0 : 40;
  const totalPrice = itemsPrice + shippingPrice;

  const METHODS = [
    { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: <Smartphone size={22} />, desc: 'Pay instantly via any UPI app' },
    { id: 'COD', label: 'Cash on Delivery', icon: <Truck size={22} />, desc: 'Pay when your order arrives' },
    { id: 'Card', label: 'Credit / Debit Card', icon: <CreditCard size={22} />, desc: 'Visa, Mastercard, RuPay' },
    { 
      id: 'Wallet', 
      label: 'Nexa Wallet', 
      icon: <Wallet size={22} />, 
      desc: userInfo ? `Balance: ₹${userInfo.walletBalance?.toFixed(2) || 0} ${userInfo.walletBalance < totalPrice ? '(Insufficient)' : ''}` : 'Pay from your Shopnexa balance',
      disabled: userInfo && userInfo.walletBalance < totalPrice
    },
  ];

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      <CheckoutSteps step1 step2 step3 />

      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => navigate('/shipping')} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Payment Method</h1>
      </div>

      <div className="container" style={{ maxWidth: '540px', padding: '28px 16px' }}>
        <form onSubmit={submitHandler}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
            {METHODS.map(m => (
              <label key={m.id} onClick={() => !m.disabled && setPaymentMethod(m.id)}
                style={{ opacity: m.disabled ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', borderRadius: '16px', border: `2px solid ${paymentMethod === m.id ? 'var(--primary-color)' : 'var(--border-color)'}`, background: paymentMethod === m.id ? 'rgba(29,185,84,0.06)' : 'var(--card-bg)', cursor: m.disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                <div style={{ color: paymentMethod === m.id ? 'var(--primary-color)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
                  {m.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: paymentMethod === m.id ? 'var(--primary-color)' : 'var(--text-color)' }}>{m.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{m.desc}</div>
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === m.id ? 'var(--primary-color)' : 'var(--border-color)'}`, background: paymentMethod === m.id ? 'var(--primary-color)' : 'transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {paymentMethod === m.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                </div>
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-primary btn-block"
            style={{ padding: '16px', fontWeight: 800, fontSize: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Review Order <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Shield size={14} /> 100% Secure & Encrypted Payment
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
