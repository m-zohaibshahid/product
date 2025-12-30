import axios from 'axios';
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse, Role } from '@/types';

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
      return localStorage.getItem('access_token');
    }
    return null;
  },
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
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
      // Unauthorized - clear token and redirect to login
      tokenStorage.remove();
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        // Don't redirect if already on login or register pages (public routes)
        if (!pathname.includes('/login') && !pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('API: Login request data:', data);
      console.log('API: Making login request to:', `${API_URL}/auth/login`);
      const response = await api.post<LoginResponse>('/auth/login', data);
      console.log('API: Login response received:', response.data);
      
      if (response.data && response.data.access_token) {
        tokenStorage.set(response.data.access_token);
        console.log('API: Token stored in localStorage');
      } else {
        console.warn('API: No access_token in response');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('API: Login error:', error);
      if (error.response) {
        // Server responded with error
        console.error('API: Error response:', error.response.data);
        throw error;
      } else if (error.request) {
        // Request made but no response
        console.error('API: No response received. Check if backend is running on', API_URL);
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        console.error('API: Error setting up request:', error.message);
        throw error;
      }
    }
  },
  
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: () => {
    tokenStorage.remove();
  },
};

// Roles API
export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>('/roles');
    return response.data;
  },
};

// Products API
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.patch(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  uploadImages: (id: number, formData: FormData) => 
    api.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getImages: (id: number) => api.get(`/products/${id}/images`),
};

// Variants API
export const variantsApi = {
  getAll: () => api.get('/variants'),
  getById: (id: number) => api.get(`/variants/${id}`),
  create: (data: any) => api.post('/variants', data),
  update: (id: number, data: any) => api.patch(`/variants/${id}`, data),
  delete: (id: number) => api.delete(`/variants/${id}`),
  getByProduct: (productId: number) => api.get(`/variants/product/${productId}`),
};

// Brands API
export const brandsApi = {
  getAll: () => api.get('/brands'),
  getById: (id: number) => api.get(`/brands/${id}`),
  create: (data: any) => api.post('/brands', data),
  update: (id: number, data: any) => api.patch(`/brands/${id}`, data),
  delete: (id: number) => api.delete(`/brands/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Suppliers API
export const suppliersApi = {
  getAll: () => api.get('/suppliers'),
  getById: (id: number) => api.get(`/suppliers/${id}`),
  create: (data: any) => api.post('/suppliers', data),
  update: (id: number, data: any) => api.patch(`/suppliers/${id}`, data),
  delete: (id: number) => api.delete(`/suppliers/${id}`),
};

// Stock API
export const stockApi = {
  getAll: () => api.get('/stock'),
  getByLocation: (locationId: number) => api.get(`/stock/location/${locationId}`),
  getByVariant: (variantId: number) => api.get(`/stock/variant/${variantId}`),
  update: (locationId: number, variantId: number, data: any) =>
    api.patch(`/stock/${locationId}/${variantId}`, data),
};

// Purchase Orders API
export const purchaseOrdersApi = {
  getAll: () => api.get('/purchase-orders'),
  getById: (id: number) => api.get(`/purchase-orders/${id}`),
  create: (data: any) => api.post('/purchase-orders', data),
  update: (id: number, data: any) => api.patch(`/purchase-orders/${id}`, data),
  receiveGoods: (id: number, data: any) => api.post(`/purchase-orders/${id}/receive`, data),
};

// Sales API
export const salesApi = {
  getAll: () => api.get('/sales'),
  getById: (id: number) => api.get(`/sales/${id}`),
  create: (data: any) => api.post('/sales', data),
  update: (id: number, data: any) => api.patch(`/sales/${id}`, data),
  addPayment: (saleId: number, data: any) => api.post(`/sales/${saleId}/payments`, data),
};

// Images API
export const imagesApi = {
  upload: (formData: FormData) => api.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getByEntity: (entityType: string, entityId: number) =>
    api.get(`/images/${entityType}/${entityId}`),
  delete: (id: number) => api.delete(`/images/${id}`),
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
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
  getByCustomer: (customerId: number) => api.get(`/orders/customer/${customerId}`),
  cancel: (id: number) => api.patch(`/orders/${id}/cancel`),
};

// Locations API (for checkout)
export const locationsApi = {
  getAll: () => api.get('/locations'),
  getById: (id: number) => api.get(`/locations/${id}`),
};

export default api;




