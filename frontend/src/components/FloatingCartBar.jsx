import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ChevronRight } from 'lucide-react';

const FloatingCartBar = () => {
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenPaths = ['/cart', '/shipping', '/payment', '/placeorder', '/login', '/register', '/order/'];
  if (cartItems.length === 0 || hiddenPaths.some(p => location.pathname.startsWith(p))) {
    return null;
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <>
      <style>{`
        @keyframes slideUpFade {
          from { transform: translate(-50%, 40px); opacity: 0; pointer-events: none; }
          to { transform: translate(-50%, 0); opacity: 1; pointer-events: auto; }
        }
      `}</style>
      <div 
        onClick={() => navigate('/cart')}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '600px',
          background: 'linear-gradient(135deg, #1db954, #159a44)',
          borderRadius: '16px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff',
          boxShadow: '0 10px 30px rgba(29, 185, 84, 0.4)',
          zIndex: 9999,
          cursor: 'pointer',
          animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <ShoppingBag size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>{totalItems} item{totalItems > 1 ? 's' : ''}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9, marginTop: '2px' }}>₹{totalPrice}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, fontSize: '1.05rem' }}>
          View Cart <ChevronRight size={20} strokeWidth={3} />
        </div>
      </div>
    </>
  );
};

export default FloatingCartBar;
