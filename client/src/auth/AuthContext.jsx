import { createContext, useContext, useState, useEffect } from 'react';
import authApi from './authApi';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      const urlToken = new URLSearchParams(window.location.search).get('token');
      if (urlToken) {
        localStorage.setItem('token', urlToken);
        window.history.replaceState({}, '', '/dashboard');
      }
      if (token || urlToken) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch { localStorage.removeItem('token'); }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const { user, token } = await authApi.login(email, password);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const register = async (email, password, name) => {
    const { user, token } = await authApi.register(email, password, name);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (userData) => setUser(userData);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}