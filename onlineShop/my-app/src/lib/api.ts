import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenStorage = {
  get: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('customer_token');
    }
    return null;
  },
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customer_token', token);
    }
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customer_token');
    }
  },
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.remove();
    }
    return Promise.reject(error);
  }
);

// Products API (Public - No auth required)
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  getImages: (id: number) => api.get(`/products/${id}/images`),
};

// Variants API (Public)
export const variantsApi = {
  getAll: () => api.get('/variants'),
  getByProduct: (productId: number) => api.get(`/variants/product/${productId}`),
};

// Colors API (Public)
export const colorsApi = {
  getAll: () => api.get('/colors'),
};

// Sizes API (Public)
export const sizesApi = {
  getAll: () => api.get('/sizes'),
};

// Stock API (Public)
export const stockApi = {
  getByVariant: (variantId: number) => api.get(`/stock/variant/${variantId}`),
};

// Customer API
export const customersApi = {
  register: async (data: any) => {
    const response = await api.post('/customers/register', data);
    return response.data;
  },
  login: async (data: any) => {
    const response = await api.post('/customers/login', data);
    if (response.data && response.data.access_token) {
      tokenStorage.set(response.data.access_token);
    }
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/customers/me');
    return response.data;
  },
  logout: () => {
    tokenStorage.remove();
  },
};

// Orders API
export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  confirm: (orderId: number, data: any) => api.post(`/orders/${orderId}/confirm`, data),
  processPayment: (orderId: number, data: any) => api.post(`/orders/${orderId}/payment`, data),
  getById: (id: number) => api.get(`/orders/${id}`),
  getByCustomer: (customerId: number) => api.get(`/orders/customer/${customerId}`),
};

// Locations API
export const locationsApi = {
  getAll: () => api.get('/locations'),
};

export default api;


