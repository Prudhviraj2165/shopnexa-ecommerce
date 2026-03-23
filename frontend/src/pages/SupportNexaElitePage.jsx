import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

const SupportNexaElitePage = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-color)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Nexa Elite FAQs</h1>
      </div>

      <div className="container" style={{ maxWidth: '600px', padding: '24px 16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '20px', padding: '30px', textAlign: 'center', marginBottom: '32px', border: '1px solid #334155', boxShadow: '0 12px 24px rgba(0,0,0,0.2)' }}>
          <Crown size={48} color="#fbbf24" style={{ marginBottom: '16px' }} />
          <h2 style={{ color: '#f8fafc', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '0.5px' }}>NEXA ELITE</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 auto', maxWidth: '80%' }}>The ultimate premium membership for the smartest shoppers.</p>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-color)' }}>Membership Benefits</h3>
        
        <div className="glass-card" style={{ padding: '20px', marginBottom: '16px', display: 'flex', gap: '16px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
            <TrendingUp size={24} color="#3b82f6" />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-color)' }}>Free Unlimited Delivery</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>Enjoy zero delivery fees on all orders above ₹199. No questions asked, ever.</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', marginBottom: '16px', display: 'flex', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
            <ShieldCheck size={24} color="#10b981" />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-color)' }}>Priority Customer Support</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>Skip the queue. Connect instantly with our most senior support specialists 24/7.</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', gap: '16px' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
            <CheckCircle2 size={24} color="#ec4899" />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-color)' }}>Exclusive Member Discounts</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>Access hidden deals and get early access to major sales events before anyone else.</p>
          </div>
        </div>

        <button style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)', color: '#fff', fontSize: '1rem', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)' }}>
          UPGRADE TO ELITE
        </button>
      </div>
    </div>
  );
};

export default SupportNexaElitePage;
