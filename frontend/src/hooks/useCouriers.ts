'use client';

import { useQuery } from '@tanstack/react-query';
import { courierStats } from '@/lib/mock-data';

export function useCouriers() {
  return useQuery({ queryKey: ['useCouriers'], queryFn: async () => courierStats });
}
