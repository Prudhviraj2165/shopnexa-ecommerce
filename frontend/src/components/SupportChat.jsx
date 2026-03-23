import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, CheckCircle2, ChevronRight, Package, AlertCircle } from 'lucide-react';

const SupportChat = ({ onClose, userInfo, recentOrders = [] }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: `Hi ${userInfo?.name.split(' ')[0] || 'there'}! 👋 I'm your Shopnexa Support Assistant. How can I help you today?` }
  ]);
  const [step, setStep] = useState('choice'); // choice, select_order, select_issue, confirming
  const [selectedOrder, setSelectedOrder] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text, type = 'bot', delay = 600) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), type, text }]);
    }, delay);
  };

  const handleChoice = (choice) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: choice }]);
    
    if (choice === 'I have an issue with an order') {
      setStep('select_order');
      addMessage('Sure, I can help with that. Which order are you having trouble with?');
    } else {
      setStep('other');
      addMessage('Okay! Please tell me more about your query.');
    }
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: `Order #${order._id.slice(-6)}: ${order.orderItems[0].name}...` }]);
    setStep('select_issue');
    addMessage(`I see. What's the issue with this order for ₹${order.totalPrice}?`);
  };

  const handleIssueSelect = (issue) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: issue }]);
    setStep('confirming');
    addMessage('I\'m sorry to hear that. I\'ve raised a high-priority ticket (#SNX-' + Math.floor(1000 + Math.random() * 9000) + ') for our team.');
    addMessage('A support agent will contact you within 15 minutes. Is there anything else?', 'bot', 1200);
  };

  return (
    <div className="animate-slide-up" style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '380px', height: '600px',
      maxHeight: '85vh', display: 'flex', flexDirection: 'column', zIndex: 3000,
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)', borderRadius: '24px', overflow: 'hidden',
      border: '1px solid var(--border-color)', background: 'var(--bg-color)',
      backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)'
    }}>
      {/* Background layer for extra opaqueness */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-color)', opacity: 0.85, zIndex: -1 }}></div>

      {/* Header */}
      <div style={{ padding: '20px', background: 'var(--primary-color)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Nexa Support</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></span> Online
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'transparent' }}>
        {messages.map(m => (
          <div key={m.id} style={{
            alignSelf: m.type === 'bot' ? 'flex-start' : 'flex-end',
            maxWidth: '85%', padding: '12px 16px', borderRadius: m.type === 'bot' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
            backgroundColor: m.type === 'bot' ? 'var(--card-bg)' : 'var(--primary-color)',
            background: m.type === 'bot' ? 'var(--card-bg)' : 'var(--primary-color)',
            border: '1px solid var(--border-color)',
            color: m.type === 'bot' ? 'var(--text-color)' : '#fff',
            fontSize: '0.9rem', lineHeight: 1.5, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            position: 'relative', zIndex: 1
          }}>
            {m.text}
          </div>
        ))}

        {/* Dynamic Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
          {step === 'choice' && (
            ['I have an issue with an order', 'Check refund status', 'Other queries'].map(c => (
              <button key={c} onClick={() => handleChoice(c)} style={{
                padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--primary-color)',
                background: 'transparent', color: 'var(--primary-color)', fontSize: '0.85rem',
                fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
              }} onMouseEnter={e => { e.target.style.background = 'var(--primary-color)'; e.target.style.color = '#fff'; }}
                 onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--primary-color)'; }}>
                {c}
              </button>
            ))
          )}

          {step === 'select_order' && recentOrders.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentOrders.slice(0, 3).map(o => (
                <div key={o._id} onClick={() => handleOrderSelect(o)} style={{
                  padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                  background: 'var(--bg-color)', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center'
                }}>
                  <div style={{ background: 'rgba(29,185,84,0.1)', padding: '8px', borderRadius: '8px' }}>
                    <Package size={18} color="var(--primary-color)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Order #{o._id.slice(-6)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.orderItems.length} items • ₹{o.totalPrice}</div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}

          {step === 'select_issue' && (
            ['Items missing', 'Wrong items received', 'Quality issues', 'Packaged damaged'].map(iss => (
              <button key={iss} onClick={() => handleIssueSelect(iss)} style={{
                padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)',
                background: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '0.85rem',
                fontWeight: 600, cursor: 'pointer', textAlign: 'left'
              }}>
                {iss}
              </button>
            ))
          )}
          
          {step === 'confirming' && (
            <button onClick={() => setStep('choice')} style={{
              padding: '10px 16px', borderRadius: '12px', background: 'var(--primary-color)',
              color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'
            }}>
              Start New Query
            </button>
          )}
        </div>
      </div>

      {/* Footer input (simulated) */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(5px)' }}>
        <input type="text" placeholder="Type a message..." disabled style={{
          flex: 1, padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)',
          background: 'var(--bg-color)', fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.6
        }} />
        <button disabled style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-color)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default SupportChat;
