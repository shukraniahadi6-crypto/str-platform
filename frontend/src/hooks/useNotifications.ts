'use client';

import { useQuery } from '@tanstack/react-query';
import { vendorStats } from '@/lib/mock-data';

export function useNotifications() {
  return useQuery({ queryKey: ['useNotifications'], queryFn: async () => vendorStats });
}
