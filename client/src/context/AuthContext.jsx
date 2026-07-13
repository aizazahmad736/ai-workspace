import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const localUser = localStorage.getItem('userInfo');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const signup = async (name, email, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const updateProfile = async (name, password) => {
    setError(null);
    try {
      const { data } = await api.put('/auth/profile', { name, password });
      const updatedUser = { ...user, name: data.name };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const upgradePlan = async (plan) => {
    setError(null);
    try {
      const { data } = await api.put('/auth/upgrade', { plan });
      const updatedUser = { ...user, plan: data.plan, aiUsageLimit: data.aiUsageLimit };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Subscription change failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Function to refresh user usage metric after AI operations
  const refreshUsage = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      const updatedUser = { ...user, aiUsageCount: data.aiUsageCount };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to sync user usage', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateProfile, upgradePlan, refreshUsage }}>
      {children}
    </AuthContext.Provider>
  );
};
