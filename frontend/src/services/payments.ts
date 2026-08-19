import { mockJobs } from '@/lib/mock-data';

export async function getPaymentsData() {
  return Promise.resolve({ items: mockJobs });
}
