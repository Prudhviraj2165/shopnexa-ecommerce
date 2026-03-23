import { useState, useEffect, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Store, Package, ShoppingBag, TrendingUp, Plus, Edit2,
  Trash2, CheckCircle, XCircle, Clock, ArrowLeft, Loader2, IndianRupee, Eye
} from 'lucide-react';

const STATUS_COLORS = {
  'Placed': '#f59e0b', 'Packed': '#3b82f6', 'Shipped': '#8b5cf6',
  'Delivered': '#10b981', 'Cancelled': '#ef4444',
};

const VendorDashboardPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [tab, setTab] = useState('products');
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', countInStock: '', category: '', brand: '', unit: '1 unit', image: '', description: 'Fresh quality product' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (!userInfo) { 
      navigate('/login'); 
    } else if (!userInfo.isVendor) {
      navigate('/profile'); // or '/', customers shouldn't be here
    } else {
      fetchData();
    }
  }, [userInfo, navigate]);

  const fetchData = async () => {
    setLoading(true);
    const config = { 
      headers: { 
        ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}) 
      } 
    };
    try {
      const [storeRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/stores/mine`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/stores/mine/orders`, config),
      ]);
      setStore(storeRes.data.store);
      setProducts(storeRes.data.products);
      setOrders(ordersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    const config = { 
      headers: { 
        ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}) 
      } 
    };
    try {
      if (editProduct) {
        // Update existing
        const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/products/${editProduct._id}`, formData, config);
        setProducts(prev => prev.map(p => p._id === data._id ? data : p));
        setEditProduct(null);
      } else {
        // Create new — link to vendor's store
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/products`, { ...formData, storeId: store._id }, config);
        setProducts(prev => [...prev, data]);
        setShowAddForm(false);
      }
      setFormData({ name: '', price: '', countInStock: '', category: '', brand: '', unit: '1 unit', image: '', description: 'Fresh quality product' });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const config = { 
      headers: { 
        ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}) 
      } 
    };
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, config);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const startEdit = (p) => {
    setEditProduct(p);
    setFormData({ name: p.name, price: p.price, countInStock: p.countInStock, category: p.category, brand: p.brand, unit: p.unit, image: p.image, description: p.description });
    setShowAddForm(true);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const totalOrders = orders.length;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 size={40} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (error && !store) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>
      <button onClick={() => navigate('/vendor/register')} style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 28px', cursor: 'pointer', fontWeight: 700 }}>
        Register Your Store
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Standalone Vendor Portal Nav */}
      <div style={{ background: '#0b1a11', padding: '10px 0', borderBottom: '1px solid rgba(29,185,84,0.2)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#1db954', borderRadius: '8px', padding: '6px', display: 'flex' }}>
              <ShoppingBag size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
              Shop<span style={{ color: '#1db954' }}>nexa</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.75rem', marginLeft: '6px' }}>Vendor Portal</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/stores')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 14px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
              View Storefront
            </button>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
              ← Consumer App
            </button>
          </div>
        </div>
      </div>

      {/* Premium Merchant Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0b1a11 0%, #050a07 100%)', 
        padding: '40px 16px 100px', 
        color: '#fff', 
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={24} color="#1db954" />
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>{store?.name || 'Merchant Center'}</h1>
            </div>
            <p style={{ opacity: 0.6, fontSize: '1rem', margin: 0, fontWeight: 500 }}>Management portal for your Shopnexa storefront</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Current Balance</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1db954' }}>₹{totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-45px' }}>
        {/* Analytics Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Total Revenue', val: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp />, color: '#1db954' },
            { label: 'Pending Orders', val: orders.filter(o => ['Placed', 'Packed', 'Shipped'].includes(o.status)).length, icon: <Clock />, color: '#f59e0b' },
            { label: 'Total Inventory', val: products.length, icon: <Package />, color: '#3b82f6' },
            { label: 'Platform Rating', val: '4.8 ⭐', icon: <TrendingUp />, color: '#8b5cf6' }
          ].map((s, i) => (
            <div key={i} className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ background: `${s.color}20`, padding: '12px', borderRadius: '15px', color: s.color }}>
                  {cloneElement(s.icon, { size: 22 })}
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>{s.val}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--card-bg)', borderRadius: '14px', padding: '6px', marginBottom: '24px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
          {[{ id: 'products', label: 'Products', icon: <Package size={16} /> },
            { id: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
            { id: 'earnings', label: 'Earnings', icon: <IndianRupee size={16} /> }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s',
                background: tab === t.id ? 'var(--primary-color)' : 'transparent',
                color: tab === t.id ? '#fff' : 'var(--text-muted)' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontWeight: 900 }}>Your Products</h2>
              <button onClick={() => { setEditProduct(null); setFormData({ name: '', price: '', countInStock: '', category: '', brand: '', unit: '1 unit', image: '', description: 'Fresh quality product' }); setShowAddForm(true); }}
                style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <Plus size={18} /> Add Product
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="glass-card" style={{ borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '2px solid var(--primary-color)' }}>
                <h3 style={{ margin: '0 0 20px', fontWeight: 900 }}>{editProduct ? 'Edit Product' : 'New Product'}</h3>
                <form onSubmit={handleSaveProduct}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { name: 'name', placeholder: 'Product name', label: 'Name *', span: true },
                      { name: 'image', placeholder: 'Image URL (https://...)', label: 'Image URL', span: true },
                      { name: 'price', placeholder: '0', label: 'Price (₹) *', type: 'number' },
                      { name: 'countInStock', placeholder: '0', label: 'Stock *', type: 'number' },
                      { name: 'category', placeholder: 'e.g. Dairy', label: 'Category' },
                      { name: 'brand', placeholder: 'e.g. Amul', label: 'Brand' },
                      { name: 'unit', placeholder: '1 kg', label: 'Unit' },
                    ].map(f => (
                      <div key={f.name} style={{ gridColumn: f.span ? '1/-1' : undefined }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>{f.label}</label>
                        <input name={f.name} type={f.type || 'text'} value={formData[f.name]} onChange={e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))} placeholder={f.placeholder} required={f.label.includes('*')}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button type="submit" disabled={saving} style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 28px', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}
                      {editProduct ? 'Update' : 'Create Product'}
                    </button>
                    <button type="button" onClick={() => { setShowAddForm(false); setEditProduct(null); }} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '11px 20px', cursor: 'pointer', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {products.length === 0
              ? <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}><Package size={48} style={{ opacity: 0.3, marginBottom: '12px' }} /><p>No products yet. Add your first product!</p></div>
              : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {products.map(p => (
                    <div key={p._id} className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.src = `https://placehold.co/220x140/1a1d26/94a3b8?text=${encodeURIComponent(p.name.slice(0, 6))}`; }} />
                      <div style={{ padding: '14px', flex: 1 }}>
                        <div style={{ fontWeight: 800, marginBottom: '4px' }}>{p.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '10px' }}>{p.category} • {p.unit}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 900, color: 'var(--primary-color)' }}>₹{p.price}</span>
                          <span style={{ fontSize: '0.8rem', color: p.countInStock > 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>Stock: {p.countInStock}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', borderTop: '1px solid var(--border-color)' }}>
                        <button onClick={() => startEdit(p)} style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(p._id)} style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', borderLeft: '1px solid var(--border-color)', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ margin: '0 0 20px', fontWeight: 900 }}>Incoming Orders</h2>
            {orders.length === 0
              ? <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}><ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '12px' }} /><p>No orders yet!</p></div>
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.map(order => (
                    <div key={order._id} className="glass-card" style={{ borderRadius: '16px', padding: '18px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 800, marginBottom: '4px' }}>Order #{order._id.slice(-6).toUpperCase()}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.user?.name} • {new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{order.orderItems?.length} item(s)</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>₹{order.totalPrice?.toFixed(0)}</span>
                        <span style={{ background: `${STATUS_COLORS[order.status] || '#94a3b8'}1a`, color: STATUS_COLORS[order.status] || '#94a3b8', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
                          {order.status || 'Placed'}
                        </span>
                        <button onClick={() => navigate(`/order/${order._id}`)} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '7px 14px', cursor: 'pointer', color: 'var(--text-color)', fontWeight: 700, fontSize: '0.85rem' }}>
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* EARNINGS TAB */}
        {tab === 'earnings' && (
          <div>
            <h2 style={{ margin: '0 0 20px', fontWeight: 900 }}>Earnings Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              {[
                { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(0)}`, sub: 'All time', color: '#1db954' },
                { label: 'Total Orders', value: totalOrders, sub: 'Completed + pending', color: '#3b82f6' },
                { label: 'Avg. Order Value', value: totalOrders > 0 ? `₹${(totalRevenue / totalOrders).toFixed(0)}` : '₹0', sub: 'Per order', color: '#f59e0b' },
                { label: 'Products Listed', value: products.length, sub: 'Active listings', color: '#8b5cf6' },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ borderRadius: '18px', padding: '24px', borderTop: `4px solid ${s.color}` }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders for Earnings */}
            <h3 style={{ fontWeight: 900, marginBottom: '16px' }}>Recent Transactions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orders.slice(0, 10).map(o => (
                <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>#{o._id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--primary-color)' }}>+₹{o.totalPrice?.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboardPage;
