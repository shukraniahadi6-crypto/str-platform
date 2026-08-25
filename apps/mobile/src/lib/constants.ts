import { JobStatus, OfferStatus } from '@/lib/types';

export const STORAGE_KEYS = {
  authToken: 'str.auth.token',
  refreshToken: 'str.auth.refresh-token',
  biometricEmail: 'str.auth.biometric-email',
  lastKnownLocation: 'str.location.last-known',
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verifyPhone: '/auth/verify-phone',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    uploadDocument: '/auth/upload-document',
  },
  jobs: {
    active: '/jobs/active',
    completed: '/jobs/completed',
    detail: (jobId: string) => `/jobs/${jobId}`,
    start: (jobId: string) => `/jobs/${jobId}/start`,
    complete: (jobId: string) => `/jobs/${jobId}/complete`,
    status: (jobId: string) => `/jobs/${jobId}/status`,
  },
  offers: {
    pending: '/offers/pending',
    history: '/offers/history',
    accept: (offerId: string) => `/offers/${offerId}/accept`,
    decline: (offerId: string) => `/offers/${offerId}/decline`,
  },
  tracking: {
    start: '/tracking/start',
    stop: '/tracking/stop',
    update: '/tracking/location',
    history: (jobId: string) => `/tracking/${jobId}`,
  },
  earnings: {
    summary: '/earnings/summary',
    breakdown: '/earnings/breakdown',
    cashout: '/earnings/instant-cashout',
    payouts: '/earnings/payouts',
  },
};

export const COLORS = {
  primary: '#0B6E4F',
  primaryDark: '#08563E',
  secondary: '#1F8EF1',
  accent: '#F0B429',
  success: '#2D9D78',
  warning: '#F59E0B',
  danger: '#DC2626',
  info: '#2563EB',
  background: '#F7FAF8',
  surface: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  border: '#DCE3EA',
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  en_route: 'En Route',
  arrived: 'Arrived',
  loading: 'Loading',
  in_transit: 'In Transit',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
};

export const OFFER_RESPONSE_WINDOW_SECONDS = 30;
export const LOCATION_UPDATE_INTERVAL_MS = 15000;
export const LOCATION_UPDATE_DISTANCE_METERS = 25;
