import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.patch(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
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

export default api;




