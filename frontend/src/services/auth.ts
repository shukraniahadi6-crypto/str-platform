import { mockJobs } from '@/lib/mock-data';

export async function getAuthData() {
  return Promise.resolve({ items: mockJobs });
}
