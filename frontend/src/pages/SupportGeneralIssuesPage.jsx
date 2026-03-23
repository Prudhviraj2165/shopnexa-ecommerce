import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, MessageSquare, CreditCard, User, Box } from 'lucide-react';

const SupportGeneralIssuesPage = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const categories = [
    {
      icon: <Box size={22} color="#1db954" />,
      title: 'Order Status & Tracking',
      desc: 'Where is my order, delays, and tracking issues',
      color: 'rgba(29, 185, 84, 0.1)'
    },
    {
      icon: <CreditCard size={22} color="#f59e0b" />,
      title: 'Payment & Refunds',
      desc: 'Failed transactions, refund status, payment methods',
      color: 'rgba(245, 158, 11, 0.1)'
    },
    {
      icon: <User size={22} color="#3b82f6" />,
      title: 'Account Settings',
      desc: 'Profile updates, login issues, password reset',
      color: 'rgba(59, 130, 246, 0.1)'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-color)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>General Issues</h1>
      </div>

      <div className="container" style={{ maxWidth: '600px', padding: '24px 16px' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
          Select the category that best matches your issue to find quick solutions or get connected to the right support agent.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {categories.map((cat, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: cat.color, padding: '12px', borderRadius: '12px' }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-color)' }}>{cat.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{cat.desc}</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <MessageSquare size={32} color="var(--primary-color)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-color)' }}>Still need help?</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>Our support team is available 24/7 to assist you.</p>
          <button style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'var(--text-color)', color: 'var(--bg-color)', fontSize: '0.95rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            START LIVE CHAT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportGeneralIssuesPage;
