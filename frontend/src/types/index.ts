export type Role = 'customer' | 'courier' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  phone?: string
  avatar?: string
}

export interface Job {
  id: string
  title: string
  address: string
  status: 'pending' | 'bidding' | 'accepted' | 'in_transit' | 'completed' | 'cancelled'
  customerId: string
  courierId?: string
  price: number
  createdAt: string
  ecoPoints: number
}

export interface Courier {
  id: string
  userId: string
  vehicleType: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  rating: number
  completedJobs: number
}

export interface NotificationItem {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  createdAt: string
  read: boolean
}

export interface EarningsSnapshot {
  week: string
  total: number
  payoutsPending: number
}
