import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('bk_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('bk_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) localStorage.setItem('bk_token', token);
    else localStorage.removeItem('bk_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('bk_user', JSON.stringify(user));
    else localStorage.removeItem('bk_user');
  }, [user]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(username, password);
      setToken(res.accessToken);
      setUser(res.user);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid username or password');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, password, businessName) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register(username, password, businessName);
      setToken(res.accessToken);
      setUser(res.user);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create account');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout, isAuthed: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
