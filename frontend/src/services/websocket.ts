import { mockJobs } from '@/lib/mock-data';

export async function getWebsocketData() {
  return Promise.resolve({ items: mockJobs });
}
