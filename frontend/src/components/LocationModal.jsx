import { useState, useEffect } from 'react';
import { X, Search, Navigation, Home, Briefcase, Users, MapPin, Plus, CheckCircle, Loader } from 'lucide-react';

const LABELS = ['Home', 'Work', 'College', 'Other'];

const getIcon = (label) => {
  switch (label) {
    case 'Home':    return <Home size={20} color="#007aff" />;
    case 'Work':    return <Briefcase size={20} color="#007aff" />;
    case 'College': return <Users size={20} color="#007aff" />;
    default:        return <MapPin size={20} color="#007aff" />;
  }
};

const LocationModal = ({ isOpen, onClose, onShareLocation, addresses, onSelectAddress, theme }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ label: 'Home', address: '', city: '', postalCode: '' });
  const [saved, setSaved] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=5`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.address || !form.city) return;
    const newAddr = { id: Date.now(), ...form, country: 'India' };

    // Persist to localStorage
    const existing = JSON.parse(localStorage.getItem('allAddresses') || '[]');
    const updated = [...existing, newAddr];
    localStorage.setItem('allAddresses', JSON.stringify(updated));
    localStorage.setItem('shippingAddress', JSON.stringify(newAddr));
    localStorage.setItem('selectedAddressId', String(newAddr.id));

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowAddForm(false);
      setForm({ label: 'Home', address: '', city: '', postalCode: '' });
      onSelectAddress(newAddr);
    }, 1000);
  };

  const handleSelectSearchResult = (result) => {
    const parts = result.display_name.split(', ');
    const cityArea = parts.length > 1 ? parts[0] + ', ' + parts[1] : parts[0];
    const newAddr = {
      id: Date.now(),
      label: 'Other',
      address: result.display_name,
      city: cityArea,
      postalCode: '',
      country: 'India'
    };
    onSelectAddress(newAddr);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className={`modal-overlay ${theme === 'dark' ? 'dark-modal' : ''}`} onClick={onClose}>
      <div className="location-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>

        <div className="modal-header-content">
          <div className="modal-text-side">
            <h1>Share location to find the closest Shopnexa store</h1>
            <div className="modal-actions-grid" style={{ position: 'relative' }}>
              <div className="modal-search-box">
                <input 
                  type="text" 
                  placeholder="Search for an area or address" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching ? <Loader size={20} color="#94a3b8" className="animate-spin" /> : <Search size={20} color="#94a3b8" />}
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div style={{ position: 'absolute', top: '56px', left: 0, right: 0, background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 100, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                  {searchResults.map((res, i) => (
                    <div 
                      key={res.place_id} 
                      onClick={() => handleSelectSearchResult(res)}
                      style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: i < searchResults.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <MapPin size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-color)' }}>{res.display_name.split(',')[0]}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.display_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button className="share-location-btn" onClick={onShareLocation}>
                <Navigation size={20} fill="#fff" />
                <span>Share location</span>
              </button>
            </div>
          </div>
          <div className="modal-map-illustration">
            <div className="map-circle">
              <div className="map-pin-pulse">
                <MapPin size={40} color="#007aff" fill="#007aff" />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-separator"><span>OR</span></div>

        <div className="saved-addresses-section">
          <div className="saved-header">
            <h2>Select from saved address</h2>
            <button className="see-all-btn" onClick={() => setShowAddForm(v => !v)}>
              {showAddForm ? 'Cancel' : '+ Add new'}
            </button>
          </div>

          {/* Inline Add Form */}
          {showAddForm && (
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              {/* Label tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {LABELS.map(l => (
                  <button key={l} onClick={() => setForm(f => ({ ...f, label: l }))} style={{
                    padding: '6px 14px', borderRadius: '20px', border: '1px solid',
                    borderColor: form.label === l ? '#007aff' : '#d4d5d9',
                    background: form.label === l ? '#007aff' : '#fff',
                    color: form.label === l ? '#fff' : '#282c3f',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                  }}>
                    {getIcon(l)} {l}
                  </button>
                ))}
              </div>

              <input placeholder="Street address *" value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d4d5d9', marginBottom: '10px', fontSize: '0.9rem', boxSizing: 'border-box' }} />

              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="City *" value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #d4d5d9', fontSize: '0.9rem' }} />
                <input placeholder="PIN code" value={form.postalCode}
                  onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                  style={{ width: '120px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d4d5d9', fontSize: '0.9rem' }} />
              </div>

              <button onClick={handleSave} style={{
                marginTop: '12px', width: '100%', padding: '12px', borderRadius: '8px',
                background: saved ? '#1db954' : '#007aff', color: '#fff', border: 'none',
                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                {saved ? <><CheckCircle size={16} /> Address Saved!</> : <><Plus size={16} /> Save & Deliver Here</>}
              </button>
            </div>
          )}

          <div className="address-list">
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <div key={addr.id} className="address-item" onClick={() => onSelectAddress(addr)}>
                  <div className="address-icon-box">{getIcon(addr.label)}</div>
                  <div className="address-info">
                    <h3>{addr.label || 'Saved Address'}</h3>
                    <p>{addr.address}, {addr.city} {addr.postalCode}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                No saved addresses. Click <strong>+ Add new</strong> to add one.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
