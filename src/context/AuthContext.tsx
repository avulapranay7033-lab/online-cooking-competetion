import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, Chef, Audience, UserRole } from '@/types';

interface AuthContextType {
  auth: AuthState;
  login: (role: UserRole, userId: string) => void;
  logout: () => void;
  getCurrentUser: () => Chef | Audience | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : { isLoggedIn: false, role: null, userId: null };
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const login = (role: UserRole, userId: string) => {
    setAuth({ isLoggedIn: true, role, userId });
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, role: null, userId: null });
  };

  const getCurrentUser = (): Chef | Audience | null => {
    if (!auth.isLoggedIn || !auth.userId) return null;
    
    if (auth.role === 'chef') {
      const chefs: Chef[] = JSON.parse(localStorage.getItem('chefs') || '[]');
      return chefs.find(c => c.id === auth.userId) || null;
    }
    
    if (auth.role === 'audience') {
      const audiences: Audience[] = JSON.parse(localStorage.getItem('audiences') || '[]');
      return audiences.find(a => a.id === auth.userId) || null;
    }
    
    return null;
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
