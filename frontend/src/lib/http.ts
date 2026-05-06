import axios from 'axios';
import { logApiError, logApiRequest, logApiSuccess } from './apiLogger';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500',
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const method = config.method || 'GET';
  const url = `${config.baseURL || ''}${config.url || ''}`;
  (config as typeof config & { metadata?: { startTime: number } }).metadata = {
    startTime: Date.now(),
  };
  logApiRequest(method, url, {
    params: config.params,
    data: config.data,
  });
  return config;
});

http.interceptors.response.use(
  (response) => {
    const method = response.config.method || 'GET';
    const url = `${response.config.baseURL || ''}${response.config.url || ''}`;
    const start = (response.config as typeof response.config & { metadata?: { startTime: number } }).metadata?.startTime || Date.now();
    logApiSuccess(method, url, response.status, Date.now() - start, response.data);
    return response;
  },
  (error) => {
    const method = error?.config?.method || 'GET';
    const url = `${error?.config?.baseURL || ''}${error?.config?.url || ''}`;
    const start = (error?.config as { metadata?: { startTime: number } } | undefined)?.metadata?.startTime || Date.now();
    logApiError(method, url, Date.now() - start, {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    return Promise.reject(error);
  },
);
