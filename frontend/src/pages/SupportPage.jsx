import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, RefreshCcw, CheckCircle2, ChevronRight, HelpCircle, MessageSquare } from 'lucide-react';
import React from 'react';
import axios from 'axios';
import SupportChat from '../components/SupportChat';

const SupportPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (userInfo?.token) {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/myorders`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          setOrders(data);
        } catch (err) {
          console.error('Error fetching orders for support:', err);
        }
      }
    };
    fetchOrders();
  }, [userInfo]);

  const allFaqs = [
    { q: 'Nexa Elite FAQs', a: 'Nexa Elite is our premium membership program offering free delivery on all orders above ₹199 and exclusive discounts.', route: '/support/nexa-elite' },
    { q: 'General issues', a: 'For any issues with the app, payments, or your account, please contact our 24/7 chat support.', route: '/support/general-issues' },
    { q: 'Report Safety Emergency', a: 'Please call our emergency helpline at 1-800-SAFE-NEXA for immediate assistance with any safety concerns.', route: '/support/emergency' },
    { q: 'Report Feedback', a: 'We value your feedback. Please share your thoughts on how we can improve your shopping experience.', route: '/support/feedback' }
  ];

  const vendorFaqs = [
    { q: 'Partner Onboarding', a: 'To partner with us, register your store through the merchant portal and upload the required documents.' },
    { q: 'Vendor Support', a: 'Vendors can reach out to our dedicated merchant relations team through the dashboard help section.' },
    { q: 'Payout Cycles', a: 'Payouts are processed weekly every Monday for the previous week\'s completed orders.' }
  ];

  const faqs = userInfo?.isVendor ? [...allFaqs, ...vendorFaqs] : allFaqs;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px', borderBottom: '1px solid var(--border-color)', top: 0, zIndex: 50, background: 'var(--bg-color)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Help & Support</h1>
      </div>

      <div className="container" style={{ maxWidth: '600px', padding: '20px 16px' }}>
        
        {/* Active Refund Card */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-color)' }}>You have 0 active refund</h3>
            <button 
              onClick={() => navigate('/orders')}
              style={{ background: 'transparent', border: 'none', color: '#fc8019', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', cursor: 'pointer', letterSpacing: '0.5px' }}
            >
              VIEW MY REFUNDS <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <RefreshCcw size={28} color="var(--text-muted)" strokeWidth={1.5} />
          </div>
        </div>

        {/* Recent Order Section */}
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '12px' }}>RECENT ORDER</p>
        
        <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-color)' }}>Fresh Bananas & Bread</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>Shopnexa Instamart</p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>₹139</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
              Delivered <CheckCircle2 size={14} fill="#10b981" color="white" />
            </div>
          </div>
          
          <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0 -20px 16px', opacity: 0.5 }}></div>
          
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', margin: '0 0 4px 0' }}>Fresh Bananas (500g) x1, Wheat Bread (400g) x1</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Mar 20, 2026, 07:27 PM</p>
          </div>
        </div>

        <div 
          onClick={() => setShowChat(true)}
          className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(29,185,84,0.1)', padding: '8px', borderRadius: '10px' }}>
              <MessageSquare size={20} color="var(--primary-color)" />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Issues with Previous Orders</span>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* FAQ Section */}
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '12px' }}>HELP WITH OTHER QUERIES</p>
        
        <div className="glass-card" style={{ padding: 0 }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ borderBottom: index === faqs.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '18px 20px',
                  cursor: 'pointer'
                }}
                className="hover-bg-light"
                onClick={() => faq.route ? navigate(faq.route) : setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{faq.q}</span>
                <ChevronRight size={18} color="var(--text-muted)" style={{ transform: (!faq.route && expandedIndex === index) ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
              </div>
              {!faq.route && expandedIndex === index && (
                <div className="animate-fade-in" style={{ padding: '0 20px 18px', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {showChat && (
        <SupportChat 
          onClose={() => setShowChat(false)} 
          userInfo={userInfo} 
          recentOrders={orders} 
        />
      )}
    </div>
  );
};

export default SupportPage;
