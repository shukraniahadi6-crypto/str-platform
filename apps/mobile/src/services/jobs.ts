import api from '@/services/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { mockJobs } from '@/lib/mockData';
import { Job, JobStatus } from '@/lib/types';

export const getActiveJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>(API_ENDPOINTS.jobs.active).catch(() => ({ data: mockJobs.filter((job) => job.status !== 'completed' && job.status !== 'cancelled') }));
  return response.data;
};

export const getCompletedJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>(API_ENDPOINTS.jobs.completed).catch(() => ({ data: mockJobs.filter((job) => job.status === 'completed') }));
  return response.data;
};

export const getJobDetail = async (jobId: string): Promise<Job> => {
  const response = await api.get<Job>(API_ENDPOINTS.jobs.detail(jobId)).catch(() => ({ data: mockJobs.find((job) => job.id === jobId) ?? mockJobs[0] }));
  return response.data;
};

export const startJob = async (jobId: string): Promise<Job> => {
  const response = await api.post<Job>(API_ENDPOINTS.jobs.start(jobId)).catch(async () => {
    const job = await getJobDetail(jobId);
    return { data: { ...job, status: 'en_route', startedAt: new Date().toISOString() } };
  });
  return response.data;
};

export const completeJob = async (jobId: string): Promise<Job> => {
  const response = await api.post<Job>(API_ENDPOINTS.jobs.complete(jobId)).catch(async () => {
    const job = await getJobDetail(jobId);
    return { data: { ...job, status: 'completed', completedAt: new Date().toISOString() } };
  });
  return response.data;
};

export const updateJobStatus = async (jobId: string, status: JobStatus): Promise<Job> => {
  const response = await api.patch<Job>(API_ENDPOINTS.jobs.status(jobId), { status }).catch(async () => {
    const job = await getJobDetail(jobId);
    return { data: { ...job, status } };
  });
  return response.data;
};
