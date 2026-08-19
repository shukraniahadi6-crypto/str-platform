import { mockJobs } from '@/lib/mock-data';

export async function getAcademyData() {
  return Promise.resolve({ items: mockJobs });
}
