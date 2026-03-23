import { useAuth } from '../context/AuthContext';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const categories = ['Fruits & Veggies', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Bakery', 'Frozen Foods'];
  const help = ['About Us', 'Careers', 'Blog', 'Contact Us', 'Privacy Policy', 'Terms'];
  
  const { userInfo } = useAuth();

  const merchants = userInfo?.isVendor ? [
    { name: 'Store Admin Dashboard', path: '/vendor/dashboard' },
    { name: 'Vendor Profile', path: '/profile/edit' },
    { name: 'Merchant Support', path: '/support' }
  ] : [
    { name: 'Become a Vendor', path: '/vendor/register' },
    { name: 'Vendor Login', path: '/vendor/login' }
  ];

  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', marginTop: '40px', paddingTop: '32px', paddingBottom: '20px' }}>
      <div className="container">
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '28px' }}>

          {/* Brand column */}
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '10px' }}>
              🛒 Shopnexa
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, maxWidth: '220px' }}>
              Your go-to app for ultra-fast grocery delivery. Fresh, fast, and always at your door.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a href="#" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem', fontWeight: 600 }}>
                📱 App Store
              </a>
              <a href="#" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem', fontWeight: 600 }}>
                🤖 Play Store
              </a>
            </div>
          </div>

          {/* Categories */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '14px' }}>Shop</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(c => (
                <li key={c}><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color = 'var(--primary-color)'}
                  onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
                >{c}</a></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '14px' }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {help.map(h => (
                <li key={h}><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}>{h}</a></li>
              ))}
            </ul>
          </div>

          {/* Merchants */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '14px' }}>Merchants</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {merchants.map(m => (
                <li key={m.name}>
                  <a href={m.path} style={{ color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}
                    onMouseOver={e => e.target.style.color = 'var(--primary-color)'}
                    onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
                  >{m.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery promise */}
          <div style={{ flex: '1 1 200px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '14px' }}>Why Shopnexa?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: '⚡', text: '10-minute delivery' },
                { icon: '🛡️', text: '100% fresh guarantee' },
                { icon: '💳', text: 'Secure payments' },
                { icon: '🔄', text: 'Easy returns' },
              ].map(i => (
                <div key={i.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <span>{i.icon}</span> {i.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>© {currentYear} Shopnexa. All rights reserved.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Made with ❤️ for fast grocery lovers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
