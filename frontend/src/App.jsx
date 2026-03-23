import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCartBar from './components/FloatingCartBar';
import { useCart } from './context/CartContext';

function App() {
  const location = useLocation();
  const { cartItems } = useCart();
  
  const isHome = location.pathname === '/';
  const hiddenPaths = ['/cart', '/shipping', '/payment', '/placeorder', '/login', '/register', '/order/'];
  const isFloatingBarVisible = cartItems.length > 0 && !hiddenPaths.some(p => location.pathname.startsWith(p));

  const basePaddingBottom = isHome ? 0 : 40;
  const bottomPadding = isFloatingBarVisible ? basePaddingBottom + 90 : basePaddingBottom;

  return (
    <>
      <Header />
      <main style={isHome ? { padding: `0 0 ${bottomPadding}px` } : { padding: `64px 0 ${bottomPadding}px` }} className={isHome ? '' : 'container'}>
        <Outlet />
      </main>
      <FloatingCartBar />
      <Footer />
    </>
  );
}

export default App;
