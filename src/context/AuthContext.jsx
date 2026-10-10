import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('retrievo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('retrievo_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('retrievo_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Auth token expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('retrievo_token', token);
      localStorage.setItem('retrievo_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      const { token, user: newUser } = res.data;
      if (token) {
        localStorage.setItem('retrievo_token', token);
        localStorage.setItem('retrievo_user', JSON.stringify(newUser));
        setUser(newUser);
      }
      return { success: true, user: newUser, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore logout errors
    } finally {
      localStorage.removeItem('retrievo_token');
      localStorage.removeItem('retrievo_user');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      const updatedUser = res.data.user || res.data;
      setUser(updatedUser);
      localStorage.setItem('retrievo_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
