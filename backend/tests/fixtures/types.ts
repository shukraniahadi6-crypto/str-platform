// Shared type definitions for test fixtures.
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'vendor' | 'courier' | 'admin';
  name: string;
  emailVerified: boolean;
  createdAt: Date;
}

export interface Job {
  id: string;
  vendorId: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  pricePence: number;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  items: string[];
  hazardLevel: 0 | 1 | 2 | 3;
  createdAt: Date;
}

export interface Offer {
  id: string;
  jobId: string;
  courierId: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

export interface LedgerEntry {
  id: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  description: string;
  createdAt: Date;
}
