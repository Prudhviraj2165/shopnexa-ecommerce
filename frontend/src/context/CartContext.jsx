import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === item._id);
      let newItems;
      if (existItem) {
        newItems = prevItems.map((x) => (x._id === existItem._id ? item : x));
      } else {
        newItems = [...prevItems, item];
      }
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((x) => x._id !== id);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
