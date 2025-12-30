'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { customersApi } from '@/lib/api';
import type { Customer } from '@/types';
import { tokenStorage } from '@/lib/api';

interface CustomerAuthContextType {
  customer: Customer | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  refreshCustomer: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCustomer = async () => {
    try {
      const token = tokenStorage.get();
      if (!token) {
        setCustomer(null);
        setLoading(false);
        return;
      }

      const response = await customersApi.getMe();
      if (response && response.customer) {
        setCustomer(response.customer);
      } else {
        setCustomer(null);
        tokenStorage.remove();
      }
    } catch (error) {
      console.error('Error refreshing customer:', error);
      setCustomer(null);
      tokenStorage.remove();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCustomer();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await customersApi.login({ email, password });
      if (response && response.customer) {
        setCustomer(response.customer);
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await customersApi.register(data);
      return response;
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    customersApi.logout();
    setCustomer(null);
  };

  const value: CustomerAuthContextType = {
    customer,
    loading,
    isAuthenticated: !!customer,
    login,
    register,
    logout,
    refreshCustomer,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}

