/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Axios base URL setup
  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Token validation + user load
  useEffect(() => {
    const loadUser = () => {
      if (token) {
        try {
          const decoded = jwtDecode<User>(token);
          // Token expire check
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setUser(decoded);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } catch (err) {
          console.error('Invalid token:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { access_token } = res.data;

      localStorage.setItem('token', access_token);
      setToken(access_token);

      const decoded = jwtDecode<User>(access_token);
      setUser(decoded);

      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(message);
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};