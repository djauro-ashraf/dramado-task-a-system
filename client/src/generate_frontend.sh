#!/bin/bash

# Create axios config
cat > app/axios.js << 'EOF'
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
EOF

# Create router
cat > app/router.jsx << 'EOF'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">🎭 Loading the drama...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/auth/callback" element={<Navigate to="/dashboard" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
EOF

# Create AuthContext
cat > auth/AuthContext.jsx << 'EOF'
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../app/axios';
import authApi from './authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');

      if (urlToken) {
        localStorage.setItem('token', urlToken);
        window.history.replaceState({}, '', '/dashboard');
      }

      if (token || urlToken) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const { user, token } = await authApi.login(email, password);
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const register = async (email, password, name) => {
    const { user, token } = await authApi.register(email, password, name);
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
EOF

# Create ProtectedRoute
cat > auth/ProtectedRoute.jsx << 'EOF'
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">🎭 Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}
EOF

# Create authApi
cat > auth/authApi.js << 'EOF'
import axios from '../app/axios';

const authApi = {
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
  },

  logout: async () => {
    await axios.post('/auth/logout');
  }
};

export default authApi;
EOF

echo "Frontend structure files created!"
