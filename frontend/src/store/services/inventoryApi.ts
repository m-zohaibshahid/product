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
  endpoints: (builder) => ({
    getDashboard: builder.query<Record<string, unknown>, void>({
      query: () => ({ url: '/inventory/dashboard', params: { lowThreshold: 5 } }),
      transformResponse: (response: { data?: Record<string, unknown> }) => response?.data ?? {},
    }),
    getMovementsSummary: builder.query<Record<string, unknown>, void>({
      query: () => ({ url: '/inventory/movements/summary' }),
      transformResponse: (response: { data?: Record<string, unknown> }) => response?.data ?? {},
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
    }),
    getVariants: builder.query<Record<string, unknown>[], void>({
      query: () => ({
        url: '/variants',
        params: { page: 1, limit: 100, sortBy: 'createdAt', sortOrder: 'DESC' },
      }),
      transformResponse: (response: { data?: Record<string, unknown>[] }) => response?.data ?? [],
    }),
    getProducts: builder.query<Record<string, unknown>[], void>({
      query: () => ({
        url: '/products',
        params: { page: 1, limit: 200 },
      }),
      transformResponse: (response: { data?: Record<string, unknown>[] } | Record<string, unknown>) => {
        const r = response as any;
        return r?.data?.data ?? r?.data ?? [];
      },
    }),
    getStockReport: builder.query<Record<string, unknown>[], void>({
      query: () => ({
        url: '/stock/report',
        params: { page: 1, limit: 50, sortBy: 'createdAt', sortOrder: 'DESC' },
      }),
      transformResponse: (response: { data?: Record<string, unknown>[] }) => response?.data ?? [],
    }),
    getArchivedVariants: builder.query<Record<string, unknown>[], void>({
      query: () => ({ url: '/variants/archived' }),
      transformResponse: (response: { data?: Record<string, unknown>[] }) => response?.data ?? [],
    }),
    createProduct: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/products', method: 'POST', body: payload }),
    }),
    createVariant: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (payload) => ({ url: '/variants', method: 'POST', body: payload }),
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
    }),
    archiveVariant: builder.mutation<Record<string, unknown>, number>({
      query: (id) => ({ url: `/variants/${id}/archive`, method: 'PATCH' }),
    }),
    restoreVariant: builder.mutation<Record<string, unknown>, number>({
      query: (id) => ({ url: `/variants/${id}/restore`, method: 'PATCH' }),
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
} = inventoryApi;
