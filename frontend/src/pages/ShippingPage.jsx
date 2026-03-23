import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, LocateFixed, RefreshCcw, CheckCircle, Trash2, Edit2, Plus, Home, Briefcase, ArrowRight, Shield } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingPage = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('allAddresses');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedId, setSelectedId] = useState(() => {
    const saved = localStorage.getItem('selectedAddressId');
    return saved ? Number(saved) : null;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [label, setLabel] = useState('Home');
  const [isLocating, setIsLocating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('allAddresses', JSON.stringify(addresses));
  }, [addresses]);

  const resetForm = () => {
    setAddress(''); setCity(''); setPostalCode(''); setLabel('Home');
    setEditingId(null); setIsAdding(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const newAddr = { id: editingId || Date.now(), address, city, postalCode, label, country: 'India' };
    if (editingId) {
      setAddresses(addresses.map(a => a.id === editingId ? newAddr : a));
    } else {
      setAddresses(prev => [...prev, newAddr]);
      setSelectedId(newAddr.id);
      localStorage.setItem('selectedAddressId', newAddr.id);
    }
    localStorage.setItem('shippingAddress', JSON.stringify(newAddr));
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); resetForm(); }, 1200);
  };

  const deleteAddress = (id) => {
    if (window.confirm('Delete this address?')) {
      setAddresses(addresses.filter(a => a.id !== id));
      if (selectedId === id) { setSelectedId(null); localStorage.removeItem('selectedAddressId'); }
    }
  };

  const editAddress = (addr) => {
    setEditingId(addr.id); setAddress(addr.address);
    setCity(addr.city); setPostalCode(addr.postalCode);
    setLabel(addr.label); setIsAdding(true);
  };

  const selectAddress = (addr) => {
    setSelectedId(addr.id);
    localStorage.setItem('selectedAddressId', addr.id);
    localStorage.setItem('shippingAddress', JSON.stringify(addr));
  };

  const continueHandler = () => {
    if (selectedId) navigate('/payment');
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${p.coords.latitude}&lon=${p.coords.longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.address) {
            const a = data.address;
            setAddress(a.building ? `${a.building}, ${a.road || ''}` : (a.road || a.suburb || ''));
            setCity(a.city || a.town || a.state_district || '');
            setPostalCode(a.postcode || '');
          }
        } finally { setIsLocating(false); }
      },
      () => { setIsLocating(false); },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      <CheckoutSteps step1 step2 />

      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => isAdding ? resetForm() : navigate('/cart')} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          {isAdding ? (editingId ? 'Edit Address' : 'Add New Address') : 'Select Delivery Address'}
        </h1>
      </div>

      <div className="container" style={{ maxWidth: '600px', padding: '20px 16px' }}>
        {!isAdding ? (
          <>
            {addresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <MapPin size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p style={{ marginBottom: '16px' }}>No addresses saved yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {addresses.map(addr => (
                  <div key={addr.id} onClick={() => selectAddress(addr)}
                    style={{ background: 'var(--card-bg)', border: `2px solid ${selectedId === addr.id ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: '16px', padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <div style={{ background: selectedId === addr.id ? 'rgba(29,185,84,0.1)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', color: selectedId === addr.id ? 'var(--primary-color)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                      {addr.label === 'Home' ? <Home size={22} /> : addr.label === 'Work' ? <Briefcase size={22} /> : <MapPin size={22} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: selectedId === addr.id ? 'var(--primary-color)' : 'var(--text-color)' }}>{addr.label}</h3>
                        {selectedId === addr.id && <CheckCircle size={18} color="var(--primary-color)" />}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        {addr.address}, {addr.city}<br />{addr.postalCode}, {addr.country}
                      </p>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '14px' }}>
                        <button onClick={(e) => { e.stopPropagation(); editAddress(addr); }}
                          style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Edit2 size={14} /> EDIT
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteAddress(addr.id); }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Trash2 size={14} /> DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setIsAdding(true)}
              style={{ width: '100%', padding: '18px', borderRadius: '16px', border: '2px dashed var(--primary-color)', background: 'rgba(29,185,84,0.05)', color: 'var(--primary-color)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}>
              <Plus size={20} /> Add New Address
            </button>

            {selectedId && (
              <button onClick={continueHandler} className="btn btn-primary btn-block"
                style={{ padding: '16px', fontWeight: 800, fontSize: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Deliver Here <ArrowRight size={18} />
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Shield size={14} /> Your address is encrypted and secure
            </div>
          </>
        ) : (
          <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
            {showSuccess && (
              <div style={{ background: '#10b981', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                <CheckCircle size={18} /> Address saved!
              </div>
            )}
            <button type="button" onClick={locateMe} disabled={isLocating}
              style={{ width: '100%', background: 'rgba(29,185,84,0.1)', color: 'var(--primary-color)', border: '1px solid rgba(29,185,84,0.3)', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
              {isLocating ? <RefreshCcw size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <LocateFixed size={20} />}
              {isLocating ? 'Fetching Location...' : 'Use Current Location (GPS)'}
            </button>
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label>Save As</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Home', 'Work', 'Other'].map(l => (
                    <button key={l} type="button" onClick={() => setLabel(l)}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid', borderColor: label === l ? 'var(--primary-color)' : 'var(--border-color)', background: label === l ? 'rgba(29,185,84,0.1)' : 'transparent', color: label === l ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input className="form-control" placeholder="House No, Building, Street" value={address} onChange={e => setAddress(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input className="form-control" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input className="form-control" placeholder="6-digit PIN" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '10px', padding: '16px', borderRadius: '12px', fontWeight: 700 }}>
                {editingId ? 'Update Address' : 'Save & Continue'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingPage;
