import type { Job } from './types';

export const jobFixtures = {
  pendingJob: {
    id: 'job-1',
    vendorId: 'user-vendor-1',
    status: 'pending',
    pricePence: 2500,
    pickupLat: 51.5074,
    pickupLng: -0.1278,
    dropoffLat: 51.515,
    dropoffLng: -0.12,
    items: ['cardboard boxes', 'old furniture'],
    hazardLevel: 0,
    createdAt: new Date('2024-03-01'),
  } as Job,

  assignedJob: {
    id: 'job-2',
    vendorId: 'user-vendor-1',
    status: 'assigned',
    pricePence: 3200,
    pickupLat: 51.51,
    pickupLng: -0.13,
    dropoffLat: 51.52,
    dropoffLng: -0.11,
    items: ['paint tins', 'broken electronics'],
    hazardLevel: 1,
    createdAt: new Date('2024-03-02'),
  } as Job,

  completedJob: {
    id: 'job-3',
    vendorId: 'user-vendor-1',
    status: 'completed',
    pricePence: 1800,
    pickupLat: 51.505,
    pickupLng: -0.09,
    dropoffLat: 51.508,
    dropoffLng: -0.095,
    items: ['mixed waste'],
    hazardLevel: 0,
    createdAt: new Date('2024-03-03'),
  } as Job,

  hazardousJob: {
    id: 'job-4',
    vendorId: 'user-vendor-1',
    status: 'pending',
    pricePence: 5000,
    pickupLat: 51.49,
    pickupLng: -0.14,
    dropoffLat: 51.495,
    dropoffLng: -0.135,
    items: ['asbestos tiles', 'chemical drums'],
    hazardLevel: 3,
    createdAt: new Date('2024-03-04'),
  } as Job,
};
