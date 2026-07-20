import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, users } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('akashgarments_user');
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)); } catch { localStorage.removeItem('akashgarments_user'); }
    }
  }, []);

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password.' };
    if (user.status === 'Inactive') return { success: false, error: 'Account is inactive. Contact administrator.' };
    setCurrentUser(user);
    localStorage.setItem('akashgarments_user', JSON.stringify(user));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('akashgarments_user');
  };

  const hasRole = (roles: UserRole[]) => {
    return currentUser ? roles.includes(currentUser.role) : false;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
