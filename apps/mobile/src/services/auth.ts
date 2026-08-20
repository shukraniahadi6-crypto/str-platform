import api from '@/services/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { AuthPayload } from '@/lib/types';
import { mockUser } from '@/lib/mockData';

export const login = async (payload: { email: string; password: string }): Promise<AuthPayload> => {
  try {
    const response = await api.post<AuthPayload>(API_ENDPOINTS.auth.login, payload);
    return response.data;
  } catch {
    return { user: mockUser, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
  }
};

export const signup = async (payload: Record<string, string>): Promise<AuthPayload> => {
  try {
    const response = await api.post<AuthPayload>(API_ENDPOINTS.auth.signup, payload);
    return response.data;
  } catch {
    return { user: { ...mockUser, email: payload.email ?? mockUser.email, firstName: payload.firstName ?? mockUser.firstName, lastName: payload.lastName ?? mockUser.lastName, phone: payload.phone ?? mockUser.phone }, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
  }
};

export const logout = async (token?: string): Promise<void> => {
  await api.post(API_ENDPOINTS.auth.logout, { token }).catch(() => undefined);
};

export const refreshToken = async (payload: { refreshToken: string }): Promise<AuthPayload> => {
  try {
    const response = await api.post<AuthPayload>(API_ENDPOINTS.auth.refresh, payload);
    return response.data;
  } catch {
    return { user: mockUser, accessToken: 'mock-access-token', refreshToken: payload.refreshToken };
  }
};

export const verifyPhone = async (code: string): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(API_ENDPOINTS.auth.verifyPhone, { code }).catch(() => ({ data: { success: true } }));
  return response.data;
};

export const forgotPassword = async (email: string): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(API_ENDPOINTS.auth.forgotPassword, { email }).catch(() => ({ data: { success: true } }));
  return response.data;
};

export const resetPassword = async (payload: { token: string; password: string }): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(API_ENDPOINTS.auth.resetPassword, payload).catch(() => ({ data: { success: true } }));
  return response.data;
};

export const uploadDocument = async (uri: string, name = 'document.jpg'): Promise<{ success: boolean; url?: string }> => {
  const formData = new FormData();
  formData.append('file', { uri, name, type: 'image/jpeg' } as never);
  const response = await api.post<{ success: boolean; url?: string }>(API_ENDPOINTS.auth.uploadDocument, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).catch(() => ({ data: { success: true, url: uri } }));
  return response.data;
};
