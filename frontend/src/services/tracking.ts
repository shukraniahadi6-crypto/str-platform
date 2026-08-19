import { mockJobs } from '@/lib/mock-data';

export async function getTrackingData() {
  return Promise.resolve({ items: mockJobs });
}
