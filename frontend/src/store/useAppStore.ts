import { create } from 'zustand';
import { UserRole } from '@/lib/types';

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: 'VENDOR',
  setRole: (role) => set({ role }),
}));
