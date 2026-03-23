import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('wishlistItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((x) => x._id === product._id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((x) => x._id !== id));
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.find((x) => x._id === product._id);
    if (exists) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (id) => {
    return !!wishlistItems.find((x) => x._id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
