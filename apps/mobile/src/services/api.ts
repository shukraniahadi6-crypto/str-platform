import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '@/config/env';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/lib/constants';
import { AuthPayload } from '@/lib/types';

let refreshPromise: Promise<AuthPayload> | null = null;

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000,
});

const refreshTokens = async (): Promise<AuthPayload> => {
  const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.refreshToken);
  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }

  const response = await axios.post<AuthPayload>(`${ENV.API_URL}${API_ENDPOINTS.auth.refresh}`, { refreshToken });
  await SecureStore.setItemAsync(STORAGE_KEYS.authToken, response.data.accessToken);
  await SecureStore.setItemAsync(STORAGE_KEYS.refreshToken, response.data.refreshToken);
  return response.data;
};

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync(STORAGE_KEYS.authToken);
  if (token) {
    config.headers.Authorization = `******;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null;
      });
      const payload = await refreshPromise;
      originalRequest.headers.Authorization = `******;
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default api;
