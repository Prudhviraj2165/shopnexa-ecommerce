import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Truck, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const shopLinks = [
  { label: 'Fresh produce', path: '/' },
  { label: 'Top stores', path: '/stores' },
  { label: 'Coupons', path: '/coupons' },
  { label: 'Wishlist', path: '/wishlist' },
];

const companyLinks = [
  { label: 'Support', path: '/support' },
  { label: 'Privacy & security', path: '/privacy' },
  { label: 'Orders', path: '/orders' },
  { label: 'Profile', path: '/profile' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { userInfo } = useAuth();

  const merchantLinks = userInfo?.isVendor
    ? [
        { label: 'Vendor dashboard', path: '/vendor/dashboard' },
        { label: 'Edit profile', path: '/profile/edit' },
        { label: 'Merchant support', path: '/support' },
      ]
    : [
        { label: 'Become a vendor', path: '/vendor/register' },
        { label: 'Vendor login', path: '/vendor/login' },
      ];

  const promises = [
    { icon: Truck, text: 'Reliable quick-delivery flow' },
    { icon: Sparkles, text: 'Cleaner shopping experience' },
    { icon: ShieldCheck, text: 'Secure checkout and accounts' },
    { icon: Wallet, text: 'Simple offers and wallet tracking' },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__hero">
          <div>
            <span className="site-footer__eyebrow">Shop smarter</span>
            <h2>Shopnexa keeps groceries fast, simple, and polished.</h2>
          </div>
          <Link className="site-footer__cta" to="/stores">
            Explore stores
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <div className="site-footer__logo">
              <span>
                <ShoppingBag size={18} />
              </span>
              <strong>Shopnexa</strong>
            </div>
            <p>
              Your everyday grocery app with faster discovery, cleaner product browsing, and a smoother checkout feel.
            </p>
          </div>

          <div>
            <h3>Shop</h3>
            <div className="site-footer__links">
              {shopLinks.map((link) => (
                <Link key={link.label} to={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3>Company</h3>
            <div className="site-footer__links">
              {companyLinks.map((link) => (
                <Link key={link.label} to={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3>Merchants</h3>
            <div className="site-footer__links">
              {merchantLinks.map((link) => (
                <Link key={link.label} to={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="site-footer__promise-grid">
          {promises.map((promise) => (
            <div className="site-footer__promise" key={promise.text}>
              <span>
                <promise.icon size={16} />
              </span>
              <p>{promise.text}</p>
            </div>
          ))}
        </div>

        <div className="site-footer__bottom">
          <p>Copyright {currentYear} Shopnexa. All rights reserved.</p>
          <p>Designed for daily essentials and better storefront clarity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
