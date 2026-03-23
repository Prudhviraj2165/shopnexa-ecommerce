import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, { email, password }, config);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users`, { name, email, password }, config);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  const updateUserInfo = (data) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, register, logout, setUserInfo, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
