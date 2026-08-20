import api from '@/services/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { TrackingPoint } from '@/lib/types';

export const updateLocation = async (point: TrackingPoint): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(API_ENDPOINTS.tracking.update, point).catch(() => ({ data: { success: true } }));
  return response.data;
};

export const startTracking = async (jobId?: string): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(API_ENDPOINTS.tracking.start, { jobId }).catch(() => ({ data: { success: true } }));
  return response.data;
};

export const stopTracking = async (jobId?: string): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(API_ENDPOINTS.tracking.stop, { jobId }).catch(() => ({ data: { success: true } }));
  return response.data;
};

export const getTrackingHistory = async (jobId: string): Promise<TrackingPoint[]> => {
  const response = await api.get<TrackingPoint[]>(API_ENDPOINTS.tracking.history(jobId)).catch(() => ({ data: [] }));
  return response.data;
};
