import { mockJobs } from '@/lib/mock-data';

export async function getJobsData() {
  return Promise.resolve({ items: mockJobs });
}
