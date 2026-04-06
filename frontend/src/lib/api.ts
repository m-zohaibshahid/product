import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Roles API
export const rolesApi = {
  getAll: async () => {
    const response = await api.get('/roles');
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
};
