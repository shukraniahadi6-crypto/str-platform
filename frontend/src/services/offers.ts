import { mockJobs } from '@/lib/mock-data';

export async function getOffersData() {
  return Promise.resolve({ items: mockJobs });
}
