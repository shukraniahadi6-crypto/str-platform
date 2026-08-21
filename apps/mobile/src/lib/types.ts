export type JobStatus = 'pending' | 'accepted' | 'en_route' | 'arrived' | 'loading' | 'in_transit' | 'completed' | 'cancelled';
export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type NotificationType = 'offer' | 'job' | 'earnings' | 'system' | 'academy';
export type VehicleType = 'pickup' | 'van' | 'trailer' | 'box-truck';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  coordinates: Coordinates;
}

export interface Vehicle {
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  capacityLabel: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  rating: number;
  totalJobs: number;
  verificationStatus: VerificationStatus;
  online: boolean;
  vehicle: Vehicle;
  walletBalance: number;
  badges: Badge[];
}

export interface JobItem {
  id: string;
  title: string;
  quantity: number;
  weightLabel?: string;
  notes?: string;
  recyclableCategory: string;
}

export interface TrackingPoint extends Coordinates {
  id: string;
  timestamp: string;
  speed?: number;
  heading?: number;
  accuracy?: number;
}

export interface PhotoEvidence {
  id: string;
  uri: string;
  type: 'before' | 'after' | 'document';
  capturedAt: string;
  location?: Coordinates;
  uploaded?: boolean;
}

export interface Offer {
  id: string;
  jobId: string;
  status: OfferStatus;
  price: number;
  expiresAt: string;
  distanceMiles: number;
  estimatedDurationMinutes: number;
  pickupAddress: Address;
  dropoffAddress: Address;
  customerName: string;
  itemSummary: string;
  notes?: string;
}

export interface Job {
  id: string;
  offerId?: string;
  status: JobStatus;
  title: string;
  payout: number;
  distanceMiles: number;
  etaMinutes: number;
  pickupAddress: Address;
  dropoffAddress: Address;
  customerName: string;
  customerPhone?: string;
  createdAt: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  items: JobItem[];
  notes?: string;
  route: Coordinates[];
  trackingHistory: TrackingPoint[];
  photos: PhotoEvidence[];
}

export interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  pendingPayout: number;
  completedJobs: number;
  averagePerJob: number;
}

export interface EarningsEntry {
  id: string;
  date: string;
  label: string;
  gross: number;
  tips: number;
  fees: number;
  net: number;
}

export interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  method: 'instant' | 'standard';
  requestedAt: string;
  completedAt?: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  data?: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  completionRate: number;
  lessons: CourseLesson[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  color: string;
}

export interface Geofence {
  id: string;
  center: Coordinates;
  radiusMeters: number;
  label: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload extends AuthTokens {
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email?: string; token?: string } | undefined;
  AuthVerification: { phone?: string; email?: string } | undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  AvailableJobs: undefined;
  Map: undefined;
  OfferPingModal: { offerId?: string } | undefined;
};

export type JobsStackParamList = {
  ActiveJobs: undefined;
  JobDetail: { jobId: string };
  Navigation: { jobId: string };
  PhotoCapture: { jobId: string; type: 'before' | 'after' };
  JobCompletion: { jobId: string };
};

export type EarningsStackParamList = {
  EarningsMain: undefined;
  EarningsDetail: undefined;
  InstantCashout: undefined;
  PayoutHistory: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Verification: undefined;
  Settings: undefined;
  Account: undefined;
};

export type AppDrawerParamList = {
  Tabs: undefined;
  Courses: undefined;
  CourseDetail: { courseId: string };
  Quiz: { courseId: string };
  Badges: undefined;
  Notifications: undefined;
  NotificationDetail: { notificationId: string };
  Settings: undefined;
  Account: undefined;
};
