import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : { line1: 'Set Location', line2: '' };
  });
  const [status, setStatus] = useState('idle');

  const parseNominatim = (addr) => {
    const area =
      addr.suburb || addr.neighbourhood || addr.quarter ||
      addr.city_district || addr.district ||
      addr.town || addr.village || addr.county || '';
    const city = addr.city || addr.town || addr.state_district || addr.state || '';
    const pincode = addr.postcode || '';
    return {
      line1: area || city || 'Your Location',
      line2: area && city && area !== city ? `${city}${pincode ? ' ' + pincode : ''}` : pincode,
    };
  };

  const ipFallback = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      const newLoc = { line1: data.city || data.region || 'Your Location', line2: data.postal || '' };
      setLocation(newLoc);
      localStorage.setItem('userLocation', JSON.stringify(newLoc));
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const detectLocation = () => {
    setStatus('loading');
    if (!navigator.geolocation) { ipFallback(); return; }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'en-US,en' } }
          );
          const data = await res.json();
          const newLoc = parseNominatim(data.address || {});
          setLocation(newLoc);
          localStorage.setItem('userLocation', JSON.stringify(newLoc));
          setStatus('done');
        } catch { ipFallback(); }
      },
      () => { ipFallback(); },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const setManualLocation = (addr) => {
    const newLoc = {
      line1: addr.label || addr.city || 'Home',
      line2: `${addr.address}, ${addr.city} ${addr.postalCode}`
    };
    setLocation(newLoc);
    localStorage.setItem('userLocation', JSON.stringify(newLoc));
    setStatus('done');
  };

  // Initial detection if no location is set
  useEffect(() => {
    if (location.line1 === 'Set Location' || location.line1 === 'Detecting...') {
      detectLocation();
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, status, detectLocation, setManualLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
