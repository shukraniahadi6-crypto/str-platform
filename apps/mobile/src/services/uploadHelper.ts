import api from '@/services/api';
import { PhotoEvidence } from '@/lib/types';

export const apiUploadPhoto = async (uri: string, onProgress?: (progress: number) => void, metadata?: Partial<PhotoEvidence>): Promise<string> => {
  const formData = new FormData();
  formData.append('file', { uri, name: `${metadata?.type ?? 'photo'}-${Date.now()}.jpg`, type: 'image/jpeg' } as never);
  formData.append('capturedAt', metadata?.capturedAt ?? new Date().toISOString());
  if (metadata?.location) {
    formData.append('latitude', String(metadata.location.latitude));
    formData.append('longitude', String(metadata.location.longitude));
  }

  const response = await api.post<{ url: string }>('/uploads/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!event.total || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    },
  }).catch(() => ({ data: { url: uri } }));

  return response.data.url;
};
