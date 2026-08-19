import { mockJobs } from '@/lib/mock-data';

export async function getAdminData() {
  return Promise.resolve({ items: mockJobs });
}
