import api from '@/services/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { mockEarningsBreakdown, mockEarningsSummary, mockPayouts } from '@/lib/mockData';
import { EarningsEntry, EarningsSummary, Payout } from '@/lib/types';

export const getEarningsSummary = async (): Promise<EarningsSummary> => {
  const response = await api.get<EarningsSummary>(API_ENDPOINTS.earnings.summary).catch(() => ({ data: mockEarningsSummary }));
  return response.data;
};

export const getEarningsBreakdown = async (): Promise<EarningsEntry[]> => {
  const response = await api.get<EarningsEntry[]>(API_ENDPOINTS.earnings.breakdown).catch(() => ({ data: mockEarningsBreakdown }));
  return response.data;
};

export const requestInstantCashout = async (amount: number): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(API_ENDPOINTS.earnings.cashout, { amount }).catch(() => ({ data: { success: true } }));
  return response.data;
};

export const getPayoutHistory = async (): Promise<Payout[]> => {
  const response = await api.get<Payout[]>(API_ENDPOINTS.earnings.payouts).catch(() => ({ data: mockPayouts }));
  return response.data;
};
