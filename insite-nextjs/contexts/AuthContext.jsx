'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const AUTH_DEFAULT = {
  user: null, isLoading: false, isAuthenticated: false,
  login: async () => {}, logout: () => {},
  hasPermission: () => false, authFetch: fetch,
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context ?? AUTH_DEFAULT
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore user + validate token with server
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.user);
        } else {
          // Token invalid or expired — clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      } catch {
        // Network error — restore from storage so app doesn't break offline
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Invalid email or password.');
    }

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    const roleHierarchy = { author: 1, editor: 2, admin: 3 };
    return (roleHierarchy[user.role] || 0) >= (roleHierarchy[requiredRole] || 0);
  };

  // Authenticated fetch helper — attaches JWT automatically
  // If body is FormData, does NOT set Content-Type (browser sets it with boundary)
  const authFetch = (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    const isFormData = options.body instanceof FormData;
    return fetch(url, {
      ...options,
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    hasPermission,
    authFetch,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
