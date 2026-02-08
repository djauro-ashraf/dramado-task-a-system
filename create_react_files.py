import os

files = {
    'client/src/app/axios.js': '''import axios from 'axios';
const api = axios.create({ baseURL: '/api', timeout: 10000 });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
}, error => Promise.reject(error));
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});
export default api;''',

    'client/src/app/router.jsx': '''import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';

export default function AppRouter() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">🎭 Loading...</div>;
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/auth/callback" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}''',

    'client/src/auth/AuthContext.jsx': '''import { createContext, useContext, useState, useEffect } from 'react';
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
}''',

    'client/src/auth/ProtectedRoute.jsx': '''import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}''',

    'client/src/auth/authApi.js': '''import axios from '../app/axios';

export default {
  register: async (email, password, name) => {
    const { data } = await axios.post('/auth/register', { email, password, name });
    return data.data;
  },
  login: async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });
    return data.data;
  },
  getCurrentUser: async () => {
    const { data } = await axios.get('/auth/me');
    return data.data.user;
  }
};'''
}

for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)

print("Core auth files created")
