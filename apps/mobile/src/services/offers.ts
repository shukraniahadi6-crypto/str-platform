import api from '@/services/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { mockOffers } from '@/lib/mockData';
import { Offer } from '@/lib/types';

export const getPendingOffers = async (): Promise<Offer[]> => {
  const response = await api.get<Offer[]>(API_ENDPOINTS.offers.pending).catch(() => ({ data: mockOffers.filter((offer) => offer.status === 'pending') }));
  return response.data;
};

export const acceptOffer = async (offerId: string): Promise<Offer> => {
  const response = await api.post<Offer>(API_ENDPOINTS.offers.accept(offerId)).catch(() => ({ data: { ...(mockOffers.find((offer) => offer.id === offerId) ?? mockOffers[0]), status: 'accepted' } }));
  return response.data;
};

export const declineOffer = async (offerId: string): Promise<Offer> => {
  const response = await api.post<Offer>(API_ENDPOINTS.offers.decline(offerId)).catch(() => ({ data: { ...(mockOffers.find((offer) => offer.id === offerId) ?? mockOffers[0]), status: 'declined' } }));
  return response.data;
};

export const getOfferHistory = async (): Promise<Offer[]> => {
  const response = await api.get<Offer[]>(API_ENDPOINTS.offers.history).catch(() => ({ data: mockOffers.map((offer, index) => ({ ...offer, status: index === 0 ? 'accepted' : 'declined' })) }));
  return response.data;
};
