import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquareHeart, Send } from 'lucide-react';

const SupportFeedbackPage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      setSubmitted(true);
      setTimeout(() => navigate('/support'), 3000);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-color)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>App Feedback</h1>
      </div>

      <div className="container" style={{ maxWidth: '600px', padding: '24px 16px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ background: 'rgba(29, 185, 84, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <MessageSquareHeart size={40} color="#1db954" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '8px' }}>Thank you!</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Your feedback has been successfully submitted. We review every comment to make Nexa better for everyone.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '8px' }}>How can we improve?</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>We are constantly building and refining. Let us know what features you want or what isn't working for you.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '12px' }}>
                Your Message
              </label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you love, what you hate, or what you're missing..."
                style={{ width: '100%', minHeight: '150px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical', marginBottom: '20px', outline: 'none' }}
                required
              />
              <button 
                type="submit" 
                style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--primary-color)', color: '#fff', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: feedback.trim() ? 1 : 0.6 }}
                disabled={!feedback.trim()}
              >
                <Send size={18} /> SUBMIT FEEDBACK
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportFeedbackPage;
