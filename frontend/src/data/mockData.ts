import type { Courier, EarningsSnapshot, Job, NotificationItem, User } from '../types'

export const mockUsers: User[] = [
  { id: 'u1', name: 'Sara Green', email: 'sara@example.com', role: 'customer' },
  { id: 'u2', name: 'David Clean', email: 'david@example.com', role: 'courier' },
  { id: 'u3', name: 'Admin Ops', email: 'admin@example.com', role: 'admin' },
]

export const mockJobs: Job[] = [
  {
    id: 'j1',
    title: 'Household pickup',
    address: '12 Green St',
    status: 'in_transit',
    customerId: 'u1',
    courierId: 'u2',
    price: 18,
    createdAt: new Date().toISOString(),
    ecoPoints: 24,
  },
  {
    id: 'j2',
    title: 'Office recycling',
    address: '88 City Ave',
    status: 'bidding',
    customerId: 'u1',
    price: 36,
    createdAt: new Date().toISOString(),
    ecoPoints: 41,
  },
]

export const mockCouriers: Courier[] = [
  {
    id: 'c1',
    userId: 'u2',
    vehicleType: 'Van',
    verificationStatus: 'verified',
    rating: 4.8,
    completedJobs: 122,
  },
]

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    message: 'Courier assigned to your pickup request.',
    type: 'success',
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: 'n2',
    message: 'Weekly payout is scheduled for Friday.',
    type: 'info',
    createdAt: new Date().toISOString(),
    read: true,
  },
]

export const mockEarnings: EarningsSnapshot = {
  week: '2026-W33',
  total: 420,
  payoutsPending: 95,
}
