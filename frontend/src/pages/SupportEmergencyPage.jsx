import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, PhoneCall, ShieldAlert } from 'lucide-react';

const SupportEmergencyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', position: 'sticky', top: 0, zIndex: 50, background: '#fef2f2' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#b91c1c' }}>Safety Emergency</h1>
      </div>

      <div className="container" style={{ maxWidth: '600px', padding: '24px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertTriangle size={40} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b91c1c', marginBottom: '8px' }}>Are you in immediate danger?</h2>
          <p style={{ fontSize: '0.95rem', color: '#7f1d1d', margin: 0, lineHeight: 1.5 }}>If you or someone else is in immediate physical danger, please contact your local emergency services (112) immediately.</p>
        </div>

        <div style={{ background: '#fff', border: '2px solid #ef4444', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '32px', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.15)' }}>
          <ShieldAlert size={32} color="#ef4444" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px 0', color: '#111827' }}>Nexa Safety Response</h3>
          <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: '0 0 24px 0' }}>For urgent safety issues related to a delivery, our specialized crisis team is standing by 24/7.</p>
          
          <a href="tel:1-800-SAFE-NEXA" style={{ display: 'block', textDecoration: 'none' }}>
            <button style={{ width: '100%', padding: '18px', borderRadius: '12px', background: '#ef4444', color: '#fff', fontSize: '1.1rem', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <PhoneCall size={22} fill="currentColor" /> CALL 1-800-SAFE-NEXA
            </button>
          </a>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-color)' }}>What qualifies as a safety emergency?</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            <li>Accidents or injuries during delivery</li>
            <li>Harassment or completely inappropriate behavior</li>
            <li>Suspicious or dangerous activity</li>
            <li>Severe food safety concerns (e.g., contamination)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupportEmergencyPage;
