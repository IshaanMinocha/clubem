'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState } from '@/app/types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'clubem_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthState;
        setAuthState(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist auth state to localStorage
  useEffect(() => {
    if (!isLoading) {
      if (authState.isAuthenticated && authState.user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [authState, isLoading]);

  const login = (username: string, password: string, role: UserRole): boolean => {
    // UI-only mock authentication
    // In production, this would validate against a backend
    if (username && password) {
      const mockUser: User = {
        id: role === 'admin' ? '1' : '2',
        name: role === 'admin' ? 'Admin User' : 'Sarah Johnson',
        email: username.includes('@') ? username : `${username}@clubem.com`,
        role: role,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

