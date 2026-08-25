import { addMinutes, subDays } from 'date-fns';
import { AppNotification, Badge, Course, EarningsEntry, EarningsSummary, Job, Offer, Payout, User } from '@/lib/types';

const pickupCoordinates = { latitude: 29.7604, longitude: -95.3698 };
const dropoffCoordinates = { latitude: 29.7499, longitude: -95.3584 };

export const mockBadges: Badge[] = [
  { id: 'badge-1', name: 'Eco Pro', description: 'Completed 100 sustainable hauls', earnedAt: new Date().toISOString(), color: '#0B6E4F' },
  { id: 'badge-2', name: '5-Star Courier', description: 'Maintained a 4.9+ rating', earnedAt: subDays(new Date(), 12).toISOString(), color: '#1F8EF1' },
];

export const mockUser: User = {
  id: 'user-1',
  firstName: 'Avery',
  lastName: 'Jordan',
  email: 'courier@str.app',
  phone: '555-203-0199',
  rating: 4.9,
  totalJobs: 184,
  verificationStatus: 'verified',
  online: true,
  walletBalance: 286.75,
  badges: mockBadges,
  vehicle: {
    type: 'pickup',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    plateNumber: 'STR-204',
    capacityLabel: '2 tons',
  },
};

export const mockOffers: Offer[] = [
  {
    id: 'offer-1',
    jobId: 'job-1',
    status: 'pending',
    price: 58,
    expiresAt: addMinutes(new Date(), 30).toISOString(),
    distanceMiles: 4.1,
    estimatedDurationMinutes: 36,
    pickupAddress: { line1: '1820 Rusk St', city: 'Houston', state: 'TX', postalCode: '77003', coordinates: pickupCoordinates },
    dropoffAddress: { line1: '1001 Commerce St', city: 'Houston', state: 'TX', postalCode: '77002', coordinates: dropoffCoordinates },
    customerName: 'Pat Morgan',
    itemSummary: 'Appliances + cardboard',
    notes: 'Use rear gate access code 4820.',
  },
  {
    id: 'offer-2',
    jobId: 'job-2',
    status: 'pending',
    price: 92,
    expiresAt: addMinutes(new Date(), 25).toISOString(),
    distanceMiles: 7.4,
    estimatedDurationMinutes: 54,
    pickupAddress: { line1: '301 Main St', city: 'Houston', state: 'TX', postalCode: '77002', coordinates: { latitude: 29.758, longitude: -95.362 } },
    dropoffAddress: { line1: '512 Greenway Plaza', city: 'Houston', state: 'TX', postalCode: '77046', coordinates: { latitude: 29.7312, longitude: -95.4324 } },
    customerName: 'Reed Stewart',
    itemSummary: 'Furniture haul-away',
  },
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    offerId: 'offer-1',
    status: 'accepted',
    title: 'Downtown appliance pickup',
    payout: 58,
    distanceMiles: 4.1,
    etaMinutes: 18,
    pickupAddress: { line1: '1820 Rusk St', city: 'Houston', state: 'TX', postalCode: '77003', coordinates: pickupCoordinates },
    dropoffAddress: { line1: '1001 Commerce St', city: 'Houston', state: 'TX', postalCode: '77002', coordinates: dropoffCoordinates },
    customerName: 'Pat Morgan',
    customerPhone: '555-0144',
    createdAt: subDays(new Date(), 1).toISOString(),
    scheduledAt: new Date().toISOString(),
    items: [
      { id: 'item-1', title: 'Washer', quantity: 1, recyclableCategory: 'Appliance', notes: 'Needs dolly' },
      { id: 'item-2', title: 'Cardboard boxes', quantity: 6, recyclableCategory: 'Paper' },
    ],
    notes: 'Customer prefers text updates.',
    route: [pickupCoordinates, dropoffCoordinates],
    trackingHistory: [],
    photos: [],
  },
  {
    id: 'job-3',
    status: 'completed',
    title: 'West Loop office cleanout',
    payout: 138,
    distanceMiles: 10.4,
    etaMinutes: 0,
    pickupAddress: { line1: '1200 Post Oak Blvd', city: 'Houston', state: 'TX', postalCode: '77056', coordinates: { latitude: 29.7478, longitude: -95.4623 } },
    dropoffAddress: { line1: '6900 Hornwood Dr', city: 'Houston', state: 'TX', postalCode: '77074', coordinates: { latitude: 29.7031, longitude: -95.5144 } },
    customerName: 'Harper Lee',
    createdAt: subDays(new Date(), 3).toISOString(),
    startedAt: subDays(new Date(), 3).toISOString(),
    completedAt: subDays(new Date(), 3).toISOString(),
    items: [{ id: 'item-3', title: 'Metal shelving', quantity: 4, recyclableCategory: 'Metal' }],
    route: [{ latitude: 29.7478, longitude: -95.4623 }, { latitude: 29.7031, longitude: -95.5144 }],
    trackingHistory: [],
    photos: [],
  },
];

export const mockEarningsSummary: EarningsSummary = {
  today: 142.5,
  week: 812.2,
  month: 3244.7,
  pendingPayout: 286.75,
  completedJobs: 22,
  averagePerJob: 69.12,
};

export const mockEarningsBreakdown: EarningsEntry[] = [
  { id: 'earn-1', date: new Date().toISOString(), label: 'Tue', gross: 175, tips: 20, fees: 18, net: 177 },
  { id: 'earn-2', date: subDays(new Date(), 1).toISOString(), label: 'Mon', gross: 142, tips: 12, fees: 16, net: 138 },
  { id: 'earn-3', date: subDays(new Date(), 2).toISOString(), label: 'Sun', gross: 210, tips: 26, fees: 22, net: 214 },
];

export const mockPayouts: Payout[] = [
  { id: 'payout-1', amount: 286.75, status: 'pending', method: 'instant', requestedAt: new Date().toISOString() },
  { id: 'payout-2', amount: 412.18, status: 'paid', method: 'standard', requestedAt: subDays(new Date(), 7).toISOString(), completedAt: subDays(new Date(), 5).toISOString() },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Safe appliance handling',
    category: 'Operations',
    description: 'Best practices for lifting, team communication, and site documentation.',
    level: 'beginner',
    durationMinutes: 35,
    completionRate: 72,
    lessons: [
      { id: 'lesson-1', title: 'Pre-trip inspection', durationMinutes: 6, completed: true },
      { id: 'lesson-2', title: 'Lifting techniques', durationMinutes: 11, completed: false },
      { id: 'lesson-3', title: 'Photo proof standards', durationMinutes: 8, completed: false },
    ],
  },
  {
    id: 'course-2',
    title: 'Customer experience fundamentals',
    category: 'Service',
    description: 'Improve communication, punctuality, and ratings with practical scripts.',
    level: 'intermediate',
    durationMinutes: 28,
    completionRate: 48,
    lessons: [
      { id: 'lesson-4', title: 'Arrival check-ins', durationMinutes: 9, completed: false },
      { id: 'lesson-5', title: 'Handling delays', durationMinutes: 7, completed: false },
    ],
  },
];

export const mockNotifications: AppNotification[] = [
  { id: 'note-1', type: 'offer', title: 'New haul offer', body: 'A time-sensitive downtown pickup is waiting for you.', createdAt: new Date().toISOString(), read: false, data: { jobId: 'job-1' } },
  { id: 'note-2', type: 'earnings', title: 'Payout initiated', body: 'Your instant cashout is on the way.', createdAt: subDays(new Date(), 1).toISOString(), read: true },
  { id: 'note-3', type: 'academy', title: 'New training available', body: 'Complete the safe appliance handling course this week.', createdAt: subDays(new Date(), 2).toISOString(), read: true },
];
