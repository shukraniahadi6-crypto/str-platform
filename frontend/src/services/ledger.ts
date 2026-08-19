import { mockJobs } from '@/lib/mock-data';

export async function getLedgerData() {
  return Promise.resolve({ items: mockJobs });
}
