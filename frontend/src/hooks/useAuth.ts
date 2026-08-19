'use client';

import { useAppStore } from '@/store/useAppStore';

export function useAuth() {
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  return { role, setRole, isAuthenticated: true };
}
