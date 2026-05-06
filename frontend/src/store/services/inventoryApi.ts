import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logApiError, logApiRequest, logApiSuccess } from '@/lib/apiLogger';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';
const rawBaseQuery = fetchBaseQuery({ baseUrl });

const baseQueryWithLogging: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const request = typeof args === 'string' ? { url: args } : args;
  const method = request.method || 'GET';
  const url = `${baseUrl}${request.url || ''}`;
  const startedAt = Date.now();

  logApiRequest(method, url, {
    params: request.params,
    body: request.body,
    endpoint: api.endpoint,
  });

  const result = await rawBaseQuery(args, api, extraOptions);
  const duration = Date.now() - startedAt;

  if (result.error) {
    logApiError(method, url, duration, result.error);
  } else {
    const status = result.meta?.response?.status || 200;
    logApiSuccess(method, url, status, duration, {
      endpoint: api.endpoint,
    });
  }

  return result;
};

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: baseQueryWithLogging,
  tagTypes: [
    'InventoryDashboard',
    'InventoryAlerts',
    'Movements',
    'Products',
    'Variants',
    'StockReport',
    'ArchivedVariants',
    'KhataCustomers',
    'KhataTransactions',
    'KhataDashboard',
    'KhataHistory',
    'Returns',
  ],
  endpoints: (builder) => ({
    getDashboard: builder.query<Record<string, unknown>, void>({
      query: () => ({ url: '/inventory/dashboard', params: { lowThreshold: 5 } }),
      transformResponse: (response: { data?: Record<string, unknown> }) => response?.data ?? {},
      providesTags: ['InventoryDashboard'],
    }),
    getMovementsSummary: builder.query<Record<string, unknown>, void>({
      query: () => ({ url: '/inventory/movements/summary' }),
      transformResponse: (response: { data?: Record<string, unknown> }) => response?.data ?? {},
      providesTags: ['Movements'],
    }),
    getAlerts: builder.query<{ critical: Record<string, unknown>[]; warning: Record<string, unknown>[] }, void>({
      query: () => ({
        url: '/inventory/alerts',
        params: { criticalThreshold: 3, warningThreshold: 8 },
      }),
      transformResponse: (response: { data?: { critical?: Record<string, unknown>[]; warning?: Record<string, unknown>[] } }) => ({
        critical: response?.data?.critical ?? [],
        warning: response?.data?.warning ?? [],
      }),
      providesTags: ['InventoryAlerts'],
    }),
    getVariants: builder.query<Record<string, unknown>[], void>({
      query: () => ({
        url: '/variants',
        params: { page: 1, limit: 100, sortBy: 'createdAt', sortOrder: 'DESC' },
      }),
      transformResponse: (response: { data?: Record<string, unknown>[] }) => response?.data ?? [],
      providesTags: ['Variants'],
    }),
    getProducts: builder.query<Record<string, unknown>[], void>({
      query: () => ({
        url: '/products',
        params: { page: 1, limit: 100 },
      }),
      transformResponse: (response: { data?: Record<string, unknown>[] } | Record<string, unknown>) => {
        const r = response as any;
        return r?.data?.data ?? r?.data ?? [];
      },
      providesTags: ['Products'],
    }),
    getStockReport: builder.query<Record<string, unknown>[], void>({
      query: () => ({
        url: '/stock/report',
        params: { page: 1, limit: 50, sortBy: 'createdAt', sortOrder: 'DESC' },
      }),
      transformResponse: (response: { data?: Record<string, unknown>[] }) => response?.data ?? [],
      providesTags: ['StockReport'],
    }),
    getArchivedVariants: builder.query<Record<string, unknown>[], void>({
      query: () => ({ url: '/variants/archived' }),
      transformResponse: (response: { data?: Record<string, unknown>[] }) => response?.data ?? [],
      providesTags: ['ArchivedVariants'],
    }),
    createProduct: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/products', method: 'POST', body: payload }),
      invalidatesTags: ['Products'],
    }),
    createVariant: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/variants', method: 'POST', body: payload }),
      invalidatesTags: ['Variants', 'StockReport', 'InventoryDashboard', 'InventoryAlerts'],
    }),
    uploadVariantPhoto: builder.mutation<
      Record<string, unknown>,
      { id: number; imageUrl: string }
    >({
      query: ({ id, imageUrl }) => ({
        url: `/variants/${id}/upload-photo`,
        method: 'POST',
        body: { imageUrl },
      }),
      invalidatesTags: ['Variants'],
    }),
    updateVariantColor: builder.mutation<
      Record<string, unknown>,
      { id: number; color: string; image_url?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/variants/${id}/color`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Variants'],
    }),
    archiveVariant: builder.mutation<Record<string, unknown>, number>({
      query: (id) => ({ url: `/variants/${id}/archive`, method: 'PATCH' }),
      invalidatesTags: ['Variants', 'ArchivedVariants', 'InventoryAlerts', 'InventoryDashboard'],
    }),
    restoreVariant: builder.mutation<Record<string, unknown>, number>({
      query: (id) => ({ url: `/variants/${id}/restore`, method: 'PATCH' }),
      invalidatesTags: ['Variants', 'ArchivedVariants', 'InventoryAlerts', 'InventoryDashboard'],
    }),
    processSale: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/selling/process', method: 'POST', body: payload }),
      invalidatesTags: ['StockReport', 'Variants', 'InventoryDashboard', 'InventoryAlerts', 'Movements'],
    }),
    getReturns: builder.query<Record<string, unknown>[], Record<string, unknown> | void>({
      query: (params) => ({ url: '/selling/returns', params: params ?? { page: 1, limit: 50 } }),
      transformResponse: (response: { data?: Record<string, unknown>[] }) => response?.data ?? [],
      providesTags: ['Returns'],
    }),
    processReturn: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/selling/returns/process', method: 'POST', body: payload }),
      invalidatesTags: ['Returns', 'Variants', 'StockReport', 'InventoryDashboard', 'KhataDashboard', 'KhataTransactions'],
    }),
    validateReturn: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/selling/returns/validate', method: 'POST', body: payload }),
    }),
    getKhataDashboard: builder.query<Record<string, unknown>, { days?: number } | void>({
      query: (params) => ({ url: '/leadger/dashboard', params: params ?? { days: 30 } }),
      providesTags: ['KhataDashboard'],
    }),
    getKhataCustomers: builder.query<Record<string, unknown>[], Record<string, unknown> | void>({
      query: (params) => ({ url: '/leadger/customers', params: params ?? { page: 1, limit: 50 } }),
      transformResponse: (response: { data?: Record<string, unknown>[] }) => response?.data ?? [],
      providesTags: ['KhataCustomers'],
    }),
    getKhataCustomerDetail: builder.query<Record<string, unknown>, string>({
      query: (id) => ({ url: `/leadger/customers/${id}/detail` }),
      providesTags: (_r, _e, id) => [{ type: 'KhataCustomers', id }, { type: 'KhataHistory', id }],
    }),
    getKhataHistory: builder.query<Record<string, unknown>[], string>({
      query: (id) => ({ url: `/leadger/history/${id}` }),
      transformResponse: (response: Record<string, unknown>[] | { data?: Record<string, unknown>[] }) => {
        if (Array.isArray(response)) return response;
        return (response as { data?: Record<string, unknown>[] })?.data ?? [];
      },
      providesTags: (_r, _e, id) => [{ type: 'KhataHistory', id }],
    }),
    getKhataTransactions: builder.query<Record<string, unknown>[], Record<string, unknown> | void>({
      query: (params) => ({ url: '/leadger/transactions', params: params ?? { page: 1, limit: 50 } }),
      transformResponse: (response: { data?: Record<string, unknown>[] }) => response?.data ?? [],
      providesTags: ['KhataTransactions'],
    }),
    createKhataCustomer: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/leadger/customers', method: 'POST', body: payload }),
      invalidatesTags: ['KhataCustomers', 'KhataDashboard', 'KhataTransactions'],
    }),
    recordKhataPayment: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/leadger/payment', method: 'POST', body: payload }),
      invalidatesTags: ['KhataCustomers', 'KhataDashboard', 'KhataTransactions', 'KhataHistory'],
    }),
    recordKhataAdjustment: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/leadger/adjustment', method: 'POST', body: payload }),
      invalidatesTags: ['KhataCustomers', 'KhataDashboard', 'KhataTransactions', 'KhataHistory'],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetMovementsSummaryQuery,
  useGetAlertsQuery,
  useGetVariantsQuery,
  useGetProductsQuery,
  useGetStockReportQuery,
  useGetArchivedVariantsQuery,
  useCreateProductMutation,
  useCreateVariantMutation,
  useUploadVariantPhotoMutation,
  useUpdateVariantColorMutation,
  useArchiveVariantMutation,
  useRestoreVariantMutation,
  useProcessSaleMutation,
  useGetReturnsQuery,
  useProcessReturnMutation,
  useValidateReturnMutation,
  useGetKhataDashboardQuery,
  useGetKhataCustomersQuery,
  useGetKhataCustomerDetailQuery,
  useGetKhataHistoryQuery,
  useGetKhataTransactionsQuery,
  useCreateKhataCustomerMutation,
  useRecordKhataPaymentMutation,
  useRecordKhataAdjustmentMutation,
} = inventoryApi;
