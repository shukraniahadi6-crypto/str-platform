'use client';

import { useQuery } from '@tanstack/react-query';
import { vendorStats } from '@/lib/mock-data';

export function useGreenImpact() {
  return useQuery({ queryKey: ['useGreenImpact'], queryFn: async () => vendorStats });
}
