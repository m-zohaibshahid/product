'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, tokenStorage } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = tokenStorage.get();
      if (!token) {
        console.log('No token found, user not authenticated');
        setUser(null);
        setLoading(false);
        return;
      }

      console.log('Refreshing user with token');
      const response = await authApi.getMe();
      console.log('User refresh response:', response);
      
      if (response && response.user) {
        setUser(response.user);
      } else {
        throw new Error('Invalid user data in response');
      }
    } catch (error: any) {
      console.error('Failed to refresh user:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setUser(null);
      tokenStorage.remove();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      console.log('Attempting login with:', { username: credentials.username });
      const response = await authApi.login(credentials);
      console.log('Login response:', response);
      
      if (!response || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      // Ensure token is set
      if (response.access_token) {
        tokenStorage.set(response.access_token);
        console.log('Token stored successfully');
      }
      
      setUser(response.user);
      console.log('User state updated:', response.user);
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      // Register the user (don't auto-login - user will be redirected to login page)
      await authApi.register(data);
      // Don't auto-login - let user login manually after registration
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

