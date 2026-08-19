export type UserRole = 'VENDOR' | 'COURIER' | 'ADMIN';

export interface Job {
  id: string;
  status: 'PENDING' | 'ASSIGNED' | 'PICKUP' | 'TRANSIT' | 'COMPLETED';
  vendorName: string;
  address: string;
  etaMinutes: number;
  payout?: number;
}

export interface DashboardStat {
  label: string;
  value: string;
}
