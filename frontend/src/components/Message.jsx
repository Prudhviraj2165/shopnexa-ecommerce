const Message = ({ variant = 'info', children }) => {
  const getStyle = () => {
    switch (variant) {
      case 'danger': return { background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' };
      case 'success': return { background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)' };
      case 'warning': return { background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid var(--warning)' };
      default: return { background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' };
    }
  };

  return (
    <div style={{
      padding: '12px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      ...getStyle()
    }}>
      {children}
    </div>
  );
};

export default Message;
