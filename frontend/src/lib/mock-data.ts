import { DashboardStat, Job } from '@/lib/types';

export const mockJobs: Job[] = [
  { id: 'J-1001', status: 'ASSIGNED', vendorName: 'Maya Hassan', address: 'Downtown, LA', etaMinutes: 18, payout: 42 },
  { id: 'J-1002', status: 'PENDING', vendorName: 'Noah Lee', address: 'Silver Lake, LA', etaMinutes: 35, payout: 27 },
];

export const vendorStats: DashboardStat[] = [
  { label: 'Total Spent', value: '$1,245' },
  { label: 'Items Recycled', value: '328' },
  { label: 'CO₂ Saved', value: '412 kg' },
];

export const courierStats: DashboardStat[] = [
  { label: "Today's Earnings", value: '$128' },
  { label: 'Completion Rate', value: '98.2%' },
  { label: 'Average Rating', value: '4.9' },
];

export const adminStats: DashboardStat[] = [
  { label: 'Revenue (Month)', value: '$84,212' },
  { label: 'Completed Jobs', value: '5,421' },
  { label: 'Active Couriers', value: '188' },
];
