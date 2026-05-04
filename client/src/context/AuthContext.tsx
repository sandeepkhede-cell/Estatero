import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

interface AuthContextValue {
  user:     AuthUser | null;
  loading:  boolean;
  login:    (payload: LoginPayload)    => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout:   () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    authService.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const persist = (token: string, u: AuthUser) => {
    localStorage.setItem('token', token);
    setUser(u);
  };

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    persist(res.token, res.user);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authService.register(payload);
    persist(res.token, res.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
